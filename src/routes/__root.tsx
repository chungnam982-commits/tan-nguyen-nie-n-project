import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const nav = [
  { to: "/", label: "TRANG CHỦ" },
  { to: "/the-gioi", label: "THẾ GIỚI" },
  { to: "/astra", label: "HỒ SƠ ASTRA" },
  { to: "/trung-toc", label: "TRÙNG TỘC" },
  { to: "/luu-tru", label: "LƯU TRỮ" },
] as const;

function SiteChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="scanlines min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between sm:px-6 sm:py-4">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 font-display text-xs tracking-[0.24em] text-foreground sm:gap-3 sm:text-sm sm:tracking-[0.34em]"
          >
            <img
              src="/favicon.png"
              alt=""
              width={36}
              height={36}
              className="h-7 w-7 shrink-0 sm:h-9 sm:w-9"
            />
            <span className="truncate">TÂN NGUYÊN NIÊN</span>
          </Link>
          <nav className="hidden items-center gap-x-6 md:flex">
            {nav.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="label-mono transition-colors hover:text-ice"
                activeProps={{ className: "label-mono text-ice" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <Link to="/ho-so" className="label-mono hidden hover:text-ice md:inline">
              TRUY CẬP
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="hairline flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span className="block h-px w-4 bg-foreground" />
              <span className="block h-px w-4 bg-foreground" />
              <span className="block h-px w-4 bg-foreground" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-background px-4 py-2 md:hidden">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.to} className="border-b border-border/60 last:border-b-0">
                  <Link
                    to={item.to}
                    className="label-mono block py-3.5 text-foreground transition-colors hover:text-ice"
                    activeProps={{ className: "label-mono block py-3.5 text-ice" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-1">
                <Link
                  to="/ho-so"
                  className="label-mono block py-3.5 transition-colors hover:text-ice"
                >
                  TRUY CẬP
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-24 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-8">
          <span className="label-mono">AEGIS — HUMAN DEFENSE NETWORK</span>
          <span className="label-mono">ARCHIVE BUILD 3101.04</span>
        </div>
      </footer>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-mono">SIGNAL LOST</p>
        <h1 className="mt-4 font-display text-6xl text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Hồ sơ này không tồn tại hoặc đã bị niêm phong.
        </p>
        <Link
          to="/"
          className="label-mono corner-frame mt-8 inline-block hairline px-5 py-3 text-foreground hover:text-ice"
        >
          VỀ TRANG CHỦ
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-mono text-hive">SYSTEM FAULT</p>
        <h1 className="mt-4 font-display text-2xl text-foreground">Kết nối thất bại</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Không thể truy xuất dữ liệu từ máy chủ Aegis.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="label-mono hairline px-5 py-3 text-foreground hover:text-ice"
          >
            THỬ LẠI
          </button>
          <a href="/" className="label-mono hairline px-5 py-3 text-foreground hover:text-ice">
            TRANG CHỦ
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TÂN NGUYÊN NIÊN — The New Era of Mankind" },
      {
        name: "description",
        content:
          "Cơ sở dữ liệu thế giới Tân Nguyên Niên: Aegis, Astra và Trùng tộc trong năm 3101.",
      },
      { property: "og:title", content: "TÂN NGUYÊN NIÊN" },
      { property: "og:description", content: "Năm 3101 — kỷ nguyên của Astra và Trùng tộc." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteChrome>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </SiteChrome>
    </QueryClientProvider>
  );
}
