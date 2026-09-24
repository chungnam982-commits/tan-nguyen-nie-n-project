import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/luu-tru")({
  head: () => ({
    meta: [
      { title: "LƯU TRỮ — Tân Nguyên Niên" },
      {
        name: "description",
        content:
          "Kho lưu trữ Aegis: các sự kiện, chiến dịch và hồ sơ đặc biệt được ghi nhận trong thế giới Tân Nguyên Niên.",
      },
      { property: "og:title", content: "LƯU TRỮ — Tân Nguyên Niên" },
      {
        property: "og:description",
        content: "Sự kiện, chiến dịch và hồ sơ đặc biệt trong kho lưu trữ của Aegis.",
      },
    ],
  }),
  component: ArchivePage,
});

const entries = [
  {
    code: "REC-001",
    title: "SỰ CỐ MẤT TÍN HIỆU LYRA-9",
    status: "CLOSED",
    text: "Toàn bộ liên lạc của thuộc địa Lyra-9 bị ngắt trong 41 giờ. Đơn vị hỗ trợ chiến thuật 03 được điều động. Một số dữ liệu đã được niêm phong.",
  },
  {
    code: "REC-002",
    title: "CHIẾN DỊCH CẤP RED — VÀNH ĐAI NEREID",
    status: "CLOSED",
    text: "Ghi nhận tiếp xúc trực tiếp với cá thể Elite-class. Đệ Nhất Tiền Tuyến chịu tổn thất, mục tiêu được giữ vững.",
  },
  {
    code: "REC-003",
    title: "CƠ SỞ BỎ HOANG NEREID-6",
    status: "RESTRICTED",
    text: "Phát hiện một cá thể người còn sống giữa hàng trăm mẫu Trùng tộc đã chết. Hồ sơ chuyển giao cho BLACK ARCHIVE.",
  },
  {
    code: "REC-004",
    title: "MISSION RECORD — ĐANG CẬP NHẬT",
    status: "OPEN",
    text: "Các chiến dịch mới sẽ được ghi nhận tại đây sau mỗi sự kiện của Liên Bang.",
  },
];

function ArchivePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="label-mono">FILE 04 / ARCHIVE</p>
      <h1 className="mt-4 font-display text-4xl text-foreground md:text-6xl">LƯU TRỮ</h1>
      <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
        Những sự kiện, chiến dịch và hồ sơ đặc biệt được ghi nhận trong thế giới.
      </p>

      <div className="mt-14 space-y-px border border-border bg-border">
        {entries.map((e) => (
          <article key={e.code} className="bg-background p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="label-mono">{e.code}</span>
              <span
                className={`label-mono ${e.status === "RESTRICTED" ? "text-hive" : "text-ice"}`}
              >
                [ {e.status} ]
              </span>
            </div>
            <h2 className="mt-3 font-display text-xl text-foreground">{e.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{e.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
