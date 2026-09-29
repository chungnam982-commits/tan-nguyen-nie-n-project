import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

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
  return (
    <div className="scanlines min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
          <Link to="/" className="font-display text-sm tracking-[0.34em] text-foreground">
            TÂN NGUYÊN NIÊN
          </Link>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
          <Link to="/admin" className="label-mono ml-auto hover:text-ice">TRUY CẬP</Link>
        </div>
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
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
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
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
