import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { astras, portraits as defaults, type Astra } from "@/data/astra";
import { portraitsQueryKey, resolvePortrait, usePortraitOverrides } from "@/lib/portraits";
import { PortraitEditor } from "@/components/PortraitEditor";
import { PortraitBackup } from "@/components/PortraitBackup";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Quản trị ảnh đại diện — Tân Nguyên Niên" },
      { name: "description", content: "Khu vực quản trị ảnh đại diện hồ sơ Astra." },
      { property: "og:title", content: "Quản trị — Tân Nguyên Niên" },
      { property: "og:description", content: "Khu vực quản trị ảnh đại diện hồ sơ Astra." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = Route.useRouteContext();
  const admin = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;
      return !!data;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono">AEGIS / ADMIN CONSOLE</p>
          <h1 className="mt-4 font-display text-4xl text-foreground">QUẢN TRỊ ẢNH ĐẠI DIỆN</h1>
          <p className="label-mono mt-3">{user.email}</p>
        </div>
        <button onClick={signOut} className="label-mono hairline px-4 py-2 hover:text-ice">
          ĐĂNG XUẤT
        </button>
      </div>

      {admin.isLoading && <p className="label-mono mt-12">ĐANG XÁC THỰC…</p>}
      {admin.data === false && (
        <p className="mt-12 text-sm text-hive">
          Tài khoản này không có quyền quản trị. Chỉ quản trị viên được phép chỉnh sửa ảnh.
        </p>
      )}
      {admin.data && (
        <>
          <PortraitBackup />
          <div className="mt-12 space-y-px border border-border bg-border">
            {astras.map((a) => (
              <Row key={a.id} astra={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ astra }: { astra: Astra }) {
  const qc = useQueryClient();
  const { data: overrides } = usePortraitOverrides();
  const current = resolvePortrait(astra.id, overrides);
  const o = overrides?.[astra.id];
  const state = !o ? "MẶC ĐỊNH" : o.removed ? "ĐÃ XÓA" : "TÙY CHỈNH";
  const [src, setSrc] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function pick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErr("Vui lòng chọn tệp ảnh.");
    const r = new FileReader();
    r.onload = () => setSrc(r.result as string);
    r.readAsDataURL(f);
  }

  async function upsert(values: { image_url: string | null; removed: boolean }) {
    setErr(null);
    const { error } = await supabase
      .from("character_portraits")
      .upsert({ astra_id: astra.id, ...values, updated_at: new Date().toISOString() });
    if (error) return setErr(error.message);
    await qc.invalidateQueries({ queryKey: portraitsQueryKey });
  }

  async function restore() {
    setErr(null);
    const { error } = await supabase.from("character_portraits").delete().eq("astra_id", astra.id);
    if (error) return setErr(error.message);
    await qc.invalidateQueries({ queryKey: portraitsQueryKey });
  }

  return (
    <div className="bg-background p-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="h-32 w-24 shrink-0 overflow-hidden border border-border bg-card">
          {current ? (
            <img src={current} alt={astra.name} className="h-full w-full object-cover object-top" />
          ) : (
            <div className="label-mono flex h-full items-center justify-center text-center">
              NO IMAGE
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="label-mono">[ {astra.index} ]</p>
          <h2 className="mt-1 font-display text-xl text-foreground">{astra.name}</h2>
          <p className={`label-mono mt-2 ${state === "ĐÃ XÓA" ? "text-hive" : "text-ice"}`}>{state}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="label-mono hairline cursor-pointer px-3 py-2 hover:text-ice">
            THAY ẢNH
            <input type="file" accept="image/*" className="hidden" onChange={pick} />
          </label>
          {defaults[astra.id] && (
            <button
              onClick={() => setSrc(current ?? defaults[astra.id] ?? null)}
              className="label-mono hairline px-3 py-2 hover:text-ice"
            >
              CẮT LẠI
            </button>
          )}
          <button
            onClick={() => upsert({ image_url: null, removed: true })}
            disabled={o?.removed}
            className="label-mono hairline px-3 py-2 text-hive disabled:opacity-40"
          >
            XÓA
          </button>
          <button
            onClick={restore}
            disabled={!o}
            className="label-mono hairline px-3 py-2 hover:text-ice disabled:opacity-40"
          >
            KHÔI PHỤC MẶC ĐỊNH
          </button>
        </div>
      </div>
      {err && <p className="mt-3 text-sm text-hive">{err}</p>}
      {src && (
        <PortraitEditor
          src={src}
          onCancel={() => setSrc(null)}
          onSave={async (url) => {
            await upsert({ image_url: url, removed: false });
            setSrc(null);
          }}
        />
      )}
    </div>
  );
}
