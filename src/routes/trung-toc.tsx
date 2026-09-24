import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trung-toc")({
  head: () => ({
    meta: [
      { title: "TRÙNG TỘC — Tân Nguyên Niên" },
      {
        name: "description",
        content:
          "Cơ sở dữ liệu The Hive: nguồn gốc chưa xác định, khả năng đồng hóa và bảy cấp tiến hóa của Trùng tộc.",
      },
      { property: "og:title", content: "TRÙNG TỘC — The Hive" },
      {
        property: "og:description",
        content: "Chủng loài đang đe dọa nền văn minh nhân loại — hồ sơ tiến hóa từ Larva đến Abyssal.",
      },
    ],
  }),
  component: HivePage,
});

const stages = [
  ["LARVA", "Cá thể sơ khai, kích thước nhỏ, hoạt động theo bầy."],
  ["DRONE", "Đơn vị lao động và tấn công cơ bản."],
  ["HUNTER", "Tốc độ cao, săn mục tiêu đơn lẻ."],
  ["ELITE", "Cấu trúc giáp sinh học dày, có chiến thuật."],
  ["ALPHA", "Chỉ huy bầy, điều phối hàng trăm cá thể."],
  ["SOVEREIGN", "Dữ liệu bị hạn chế quyền truy cập."],
  ["ABYSSAL", "Dữ liệu bị hạn chế quyền truy cập."],
];

function HivePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="label-mono text-hive">FILE 03 / THREAT DATABASE</p>
      <h1 className="mt-4 font-display text-4xl text-foreground md:text-6xl">TRÙNG TỘC</h1>
      <p className="label-mono mt-4">THE HIVE</p>

      <div className="mt-12 space-y-5 text-sm leading-7 text-muted-foreground md:text-base">
        <p>Không ai biết Trùng tộc xuất hiện từ đâu.</p>
        <p>
          Chúng có khả năng hấp thụ vật chất, năng lượng và đặc tính sinh học của những sinh vật mà chúng
          tiếp xúc. Một cá thể sống sót càng lâu càng có khả năng phát triển những đặc điểm mới.
        </p>
      </div>

      <div className="mt-14 space-y-px border border-border bg-border">
        {stages.map(([code, desc], i) => {
          const restricted = i >= 5;
          return (
            <div
              key={code}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1 bg-background p-6"
            >
              <span className="label-mono w-10">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={`font-display text-lg tracking-[0.18em] ${restricted ? "text-hive" : "text-foreground"}`}
              >
                {code}
              </span>
              <span className="text-sm text-muted-foreground">{desc}</span>
            </div>
          );
        })}
      </div>

      <div className="corner-frame mt-12 hairline p-8">
        <p className="label-mono text-hive">WARNING / UNKNOWN</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Một số cá thể chưa thể xác định cấp độ sẽ được đánh dấu là{" "}
          <span className="text-hive">UNKNOWN</span>. Hồ sơ về những cấp cao hơn hiện vẫn bị hạn chế
          quyền truy cập.
        </p>
      </div>
    </div>
  );
}
