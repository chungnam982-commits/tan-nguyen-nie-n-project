import { useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import JSZip from "jszip";
import { supabase } from "@/integrations/supabase/client";
import { astras } from "@/data/astra";
import { portraitsQueryKey } from "@/lib/portraits";

type Entry = { astra_id: string; state: "custom" | "removed"; file?: string; image_url?: string };

function extFromMime(m: string) {
  return m.includes("png") ? "png" : m.includes("webp") ? "webp" : "jpg";
}

export function PortraitBackup() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function exportZip() {
    setBusy(true);
    setMsg(null);
    try {
      const { data, error } = await supabase
        .from("character_portraits")
        .select("astra_id, image_url, removed");
      if (error) throw error;
      const zip = new JSZip();
      const entries: Entry[] = [];
      for (const row of data ?? []) {
        if (row.removed) {
          entries.push({ astra_id: row.astra_id, state: "removed" });
        } else if (row.image_url?.startsWith("data:")) {
          const [head, b64] = row.image_url.split(",");
          const file = `images/${row.astra_id}.${extFromMime(head)}`;
          zip.file(file, b64, { base64: true });
          entries.push({ astra_id: row.astra_id, state: "custom", file });
        } else if (row.image_url) {
          entries.push({ astra_id: row.astra_id, state: "custom", image_url: row.image_url });
        }
      }
      zip.file(
        "manifest.json",
        JSON.stringify({ app: "tan-nguyen-nien", version: 1, exported_at: new Date().toISOString(), entries }, null, 2),
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `tan-nguyen-nien-portraits-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      setMsg({ ok: true, text: `Đã xuất ${entries.length} mục tùy chỉnh.` });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Xuất thất bại." });
    } finally {
      setBusy(false);
    }
  }

  async function importZip(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!confirm("Khôi phục sẽ thay thế toàn bộ ảnh đại diện hiện tại bằng dữ liệu trong gói ZIP. Tiếp tục?")) return;
    setBusy(true);
    setMsg(null);
    try {
      const zip = await JSZip.loadAsync(f);
      const mf = zip.file("manifest.json");
      if (!mf) throw new Error("Gói ZIP không hợp lệ: thiếu manifest.json.");
      const manifest = JSON.parse(await mf.async("string")) as { entries?: Entry[] };
      const valid = new Set(astras.map((a) => a.id));
      const rows = [];
      for (const en of manifest.entries ?? []) {
        if (!valid.has(en.astra_id)) continue;
        if (en.state === "removed") {
          rows.push({ astra_id: en.astra_id, image_url: null, removed: true });
          continue;
        }
        let url = en.image_url ?? null;
        if (en.file) {
          const img = zip.file(en.file);
          if (!img) throw new Error(`Thiếu tệp ${en.file} trong gói.`);
          const ext = en.file.split(".").pop() ?? "jpg";
          const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
          url = `data:${mime};base64,${await img.async("base64")}`;
        }
        if (url) rows.push({ astra_id: en.astra_id, image_url: url, removed: false });
      }
      const keep = rows.map((r) => r.astra_id);
      const del = supabase.from("character_portraits").delete();
      const { error: dErr } = keep.length
        ? await del.not("astra_id", "in", `(${keep.map((k) => `"${k}"`).join(",")})`)
        : await del.neq("astra_id", "");
      if (dErr) throw dErr;
      if (rows.length) {
        const now = new Date().toISOString();
        const { error } = await supabase
          .from("character_portraits")
          .upsert(rows.map((r) => ({ ...r, updated_at: now })));
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: portraitsQueryKey });
      setMsg({ ok: true, text: `Đã khôi phục ${rows.length} mục từ gói ZIP.` });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Nhập thất bại." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-12 hairline p-6">
      <p className="label-mono">SAO LƯU / KHÔI PHỤC</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Xuất toàn bộ ảnh đại diện tùy chỉnh thành gói ZIP, hoặc nhập gói ZIP để khôi phục.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={exportZip} disabled={busy} className="label-mono hairline px-3 py-2 hover:text-ice disabled:opacity-40">
          XUẤT ZIP
        </button>
        <label className={`label-mono hairline px-3 py-2 hover:text-ice ${busy ? "pointer-events-none opacity-40" : "cursor-pointer"}`}>
          NHẬP ZIP
          <input type="file" accept=".zip,application/zip" className="hidden" onChange={importZip} />
        </label>
        {busy && <span className="label-mono self-center">ĐANG XỬ LÝ…</span>}
      </div>
      {msg && <p className={`mt-3 text-sm ${msg.ok ? "text-ice" : "text-hive"}`}>{msg.text}</p>}
    </div>
  );
}
