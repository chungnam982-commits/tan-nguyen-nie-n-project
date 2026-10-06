import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import lucien from "@/assets/lucien.jpg.asset.json";

export const Route = createFileRoute("/_authenticated/ho-so")({
  head: () => ({
    meta: [
      { title: "Hồ sơ người chơi — Tân Nguyên Niên" },
      { name: "description", content: "Hồ sơ Astra của người chơi trong cơ sở dữ liệu Aegis." },
      { property: "og:title", content: "Hồ sơ người chơi — Tân Nguyên Niên" },
      { property: "og:description", content: "Hồ sơ Astra của người chơi trong cơ sở dữ liệu Aegis." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlayerProfile,
});

const DEFAULT_NAME = "LUCIEN ARCLIGHT";
const DEFAULT_BIO =
  "Lucien Arclight là một trong những Astra S-Class còn đang hoạt động trực tiếp tại tiền tuyến, người sống sót duy nhất của Chiến dịch Helios-Prime — thảm họa cấp BLACK. Cơ thể anh hoạt động gần giống một lò phản ứng sinh học, liên tục tích trữ năng lượng từ môi trường rồi giải phóng dưới dạng nhiệt lượng cực cao.";

const fields: [string, string][] = [
  ["ASTRA ID", "ARC-01"],
  ["CALLSIGN", "SOLARIS"],
  ["AGE", "31"],
  ["GENDER", "Nam"],
  ["HEIGHT", "191 cm"],
  ["ORIGIN", "Helios Prime"],
  ["RANK", "S-CLASS"],
  ["ABILITY", "ENERGY / ELEMENTAL"],
  ["UNIT", "AEGIS — ORBITAL STRIKE DIVISION"],
];

const sections: { title: string; body: string[] }[] = [
  {
    title: "SOLARIS",
    body: [
      "Khi kích hoạt Solaris, toàn bộ năng lượng tích trữ được giải phóng trong khoảnh khắc. Cơ thể Lucien phát sáng như một nguồn nhiệt nhân tạo, tạo ra vùng năng lượng bán kính lớn — đủ phá hủy hàng loạt Trùng tộc cấp thấp và gây tổn thương nghiêm trọng lên Elite hoặc Alpha.",
      "Nhưng càng giải phóng nhiều, nhiệt độ cơ thể càng tăng. Sau ba lần dùng Solaris ở mức tối đa, cơ thể anh mang những tổn thương không thể phục hồi hoàn toàn.",
    ],
  },
  {
    title: "COMBAT STYLE",
    body: [
      "Lucien gần như không dùng vũ khí truyền thống. Vũ khí quen thuộc nhất là trường kiếm ánh sáng DAWN, tạo thành trực tiếp từ năng lực của anh. Ở khoảng cách xa, anh biến cánh tay thành pháo năng lượng hoặc tạo hàng loạt mũi lao ánh sáng. Anh đặc biệt nguy hiểm khi chiến đấu trên quỹ đạo.",
    ],
  },
  {
    title: "PERSONALITY",
    body: [
      "Lịch thiệp, từ tốn, hiếm khi mất bình tĩnh — nhưng không biết cách rút lui. Lucien không tin vào khái niệm “hy sinh cần thiết”: một người lính chết đi còn là một người con, một người bạn, một người mà ai đó đang chờ trở về.",
    ],
  },
  {
    title: "HISTORY",
    body: [
      "Thức tỉnh năng lực ở tuổi mười bảy trong tai nạn tại nhà máy năng lượng Helios Prime. Hai năm sau lần đầu ra tiền tuyến, một Sovereign xuất hiện bên trong thuộc địa. Lucien dùng Solaris ở mức tối đa để tiêu diệt nó. Thuộc địa được cứu, nhưng 73% khu vực phía nam bị thiêu hủy và hơn 18.000 người thiệt mạng.",
    ],
  },
  {
    title: "CLASSIFIED RECORD",
    body: [
      "Theo một bản ghi âm chưa được xác thực, ngay trước khi chết, Sovereign đã nói một câu bằng ngôn ngữ không ai giải mã được. Lucien là người duy nhất nghe thấy. Khi được hỏi, anh chỉ trả lời: “Nó không gọi tôi là kẻ thù.”",
    ],
  },
];

const missions = [
  "[BLACK — HELIOS PRIME] Sovereign-class · Survival rate 12% · SUCCESS · Civilian casualties 18,742",
  "[RED — OUTER RIM 17] Alpha-class elimination · SUCCESS",
  "[RED — LYRA FRONTIER] Three Elite-class eliminated · SUCCESS",
];

function PlayerProfile() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const key = ["player-profile", user.id];

  const profile = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_profiles")
        .select("display_name, bio")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;
      const row = { user_id: user.id, display_name: DEFAULT_NAME, bio: DEFAULT_BIO };
      const { error: insErr } = await supabase.from("player_profiles").insert(row);
      if (insErr) throw insErr;
      return { display_name: row.display_name, bio: row.bio };
    },
  });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile.data) {
      setName(profile.data.display_name);
      setBio(profile.data.bio ?? "");
    }
  }, [profile.data]);

  async function save() {
    const n = name.trim();
    if (!n || n.length > 60) return setMsg("Tên phải từ 1–60 ký tự.");
    if (bio.length > 3000) return setMsg("Tiểu sử tối đa 3000 ký tự.");
    setBusy(true);
    setMsg(null);
    const { error } = await supabase
      .from("player_profiles")
      .update({ display_name: n, bio, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    setBusy(false);
    if (error) return setMsg(error.message);
    await qc.invalidateQueries({ queryKey: key });
    setEditing(false);
    setMsg("Đã lưu.");
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const displayName = profile.data?.display_name ?? DEFAULT_NAME;
  const displayBio = profile.data?.bio ?? DEFAULT_BIO;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label-mono">AEGIS / PLAYER FILE · {user.email}</p>
        <div className="flex gap-4">
          <Link to="/admin" className="label-mono hover:text-ice">QUẢN TRỊ</Link>
          <button onClick={signOut} className="label-mono hover:text-ice">ĐĂNG XUẤT</button>
        </div>
      </div>

      <header className="mt-8 border-b border-border pb-10">
        <p className="label-mono">[ ARC-01 ] PERSONNEL FILE</p>
        {editing ? (
          <input
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            className="hairline mt-4 w-full bg-transparent px-4 py-3 font-display text-3xl text-foreground outline-none focus:border-ice md:text-5xl"
          />
        ) : (
          <h1 className="mt-4 font-display text-4xl text-foreground md:text-6xl">{displayName}</h1>
        )}
        <p className="label-mono mt-4 text-ice">STATUS: ACTIVE</p>
      </header>

      <div className="mt-12 grid gap-12 md:grid-cols-[260px_1fr]">
        <aside>
          <div className="corner-frame hairline mb-6 overflow-hidden">
            <img
              src={lucien.url}
              alt={`Chân dung ${displayName}`}
              className="aspect-[3/4] w-full object-cover object-top"
            />
          </div>
          {fields.map(([l, v]) => (
            <div key={l} className="border-t border-border py-3">
              <p className="label-mono">{l}</p>
              <p className="mt-1 font-display text-sm tracking-[0.12em] text-foreground">{v}</p>
            </div>
          ))}
          <div className="mt-10">
            <p className="label-mono">CORE STABILITY</p>
            <p className="mt-2 font-mono text-sm text-ice">
              {"██████"}
              <span className="text-border">{"░░░░"}</span> 63%
            </p>
          </div>
        </aside>

        <div className="space-y-12">
          <blockquote className="corner-frame hairline p-7 text-base italic leading-8 text-foreground">
            “Ánh sáng không có nghĩa vụ phải dịu dàng.”
          </blockquote>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="label-mono">PROFILE / TIỂU SỬ</h2>
              {!editing && (
                <button onClick={() => { setEditing(true); setMsg(null); }} className="label-mono hover:text-ice">
                  SỬA TÊN & TIỂU SỬ
                </button>
              )}
            </div>
            {editing ? (
              <div className="mt-4 space-y-3">
                <textarea
                  value={bio}
                  maxLength={3000}
                  rows={8}
                  onChange={(e) => setBio(e.target.value)}
                  className="hairline w-full bg-transparent px-4 py-3 text-sm leading-7 text-foreground outline-none focus:border-ice"
                />
                <div className="flex gap-3">
                  <button disabled={busy} onClick={save} className="label-mono corner-frame hairline px-5 py-3 text-foreground hover:text-ice disabled:opacity-50">
                    LƯU
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(displayName);
                      setBio(displayBio);
                    }}
                    className="label-mono hairline px-5 py-3 hover:text-ice"
                  >
                    HỦY
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{displayBio}</p>
            )}
            {msg && <p className="mt-3 text-sm text-ice">{msg}</p>}
          </section>

          <section>
            <h2 className="label-mono">ABILITY</h2>
            <ul className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
              {["Energy Conversion", "Thermal Manipulation", "Photon Projection", "Energy Weapon", "SOLARIS — OVERDRIVE"].map((ab) => (
                <li key={ab} className="bg-background px-5 py-4 text-sm text-foreground">{ab}</li>
              ))}
            </ul>
          </section>

          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="label-mono">{s.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                {s.body.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          ))}

          <section>
            <h2 className="label-mono">PERSONAL DATA</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground"><span className="text-steel">Thích:</span> bình minh, cà phê đen, nhạc cổ điển, những chuyến bay ngoài quỹ đạo.</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground"><span className="text-steel">Không thích:</span> bệnh viện, mệnh lệnh bỏ lại dân thường, những người gọi chiến tranh là “một phép tính”.</p>
          </section>

          <section>
            <h2 className="label-mono">MISSION RECORD</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
              {missions.map((m) => <li key={m}>— {m}</li>)}
            </ul>
            <p className="mt-5 text-sm text-hive">DO NOT ACTIVATE SOLARIS ABOVE 78% OUTPUT. — “Noted.” — “He did it again.”</p>
          </section>
        </div>
      </div>
    </div>
  );
}
