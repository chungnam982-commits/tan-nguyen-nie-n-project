import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Đăng nhập quản trị — Tân Nguyên Niên" },
      { name: "description", content: "Cổng đăng nhập dành cho quản trị viên Aegis." },
      { property: "og:title", content: "Đăng nhập quản trị — Tân Nguyên Niên" },
      { property: "og:description", content: "Cổng đăng nhập dành cho quản trị viên Aegis." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/ho-so" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/ho-so` },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      if (data.session) navigate({ to: "/ho-so" });
      else setMsg("Kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.");
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) return setMsg(String(r.error.message ?? r.error));
    if (r.redirected) return;
    navigate({ to: "/ho-so" });
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="label-mono">AEGIS / ACCESS CONTROL</p>
      <h1 className="mt-4 font-display text-3xl text-foreground">
        {mode === "in" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
      </h1>
      <form onSubmit={submit} className="mt-10 space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="hairline w-full bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-ice"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="hairline w-full bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-ice"
        />
        <button
          disabled={busy}
          className="label-mono corner-frame hairline w-full px-5 py-3 text-foreground hover:text-ice disabled:opacity-50"
        >
          {mode === "in" ? "ĐĂNG NHẬP" : "TẠO TÀI KHOẢN"}
        </button>
      </form>
      <button
        onClick={google}
        className="label-mono hairline mt-3 w-full px-5 py-3 text-foreground hover:text-ice"
      >
        TIẾP TỤC VỚI GOOGLE
      </button>
      {msg && <p className="mt-4 text-sm text-muted-foreground">{msg}</p>}
      <button
        onClick={() => setMode(mode === "in" ? "up" : "in")}
        className="label-mono mt-8 hover:text-ice"
      >
        {mode === "in" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
}
