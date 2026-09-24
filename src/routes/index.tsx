import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TÂN NGUYÊN NIÊN — The New Era of Mankind" },
      {
        name: "description",
        content:
          "Năm 3101. Astra thức tỉnh, Trùng tộc xâm lăng, Aegis đứng giữa. Khám phá thế giới Tân Nguyên Niên.",
      },
      { property: "og:title", content: "TÂN NGUYÊN NIÊN — The New Era of Mankind" },
      {
        property: "og:description",
        content: "Năm 3101. Astra, Trùng tộc và Aegis — nơi câu chuyện của những người sống sót bắt đầu.",
      },
    ],
  }),
  component: Index,
});

const sections = [
  {
    to: "/the-gioi",
    code: "01",
    title: "THẾ GIỚI",
    desc: "Tìm hiểu về thời đại, Aegis, Astra và Trùng tộc.",
  },
  {
    to: "/astra",
    code: "02",
    title: "HỒ SƠ ASTRA",
    desc: "Danh sách những nhân vật đang tồn tại trong Tân Nguyên Niên.",
  },
  {
    to: "/trung-toc",
    code: "03",
    title: "TRÙNG TỘC",
    desc: "Cơ sở dữ liệu về chủng loài đang đe dọa nền văn minh nhân loại.",
  },
  {
    to: "/luu-tru",
    code: "04",
    title: "LƯU TRỮ",
    desc: "Những sự kiện, chiến dịch và hồ sơ đặc biệt được ghi nhận trong thế giới.",
  },
] as const;

function Index() {
  return (
    <div>
      <section className="grid-field border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
          <p className="label-mono">AEGIS ARCHIVE / ACCESS GRANTED</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-8xl">
            TÂN NGUYÊN
            <br />
            NIÊN
          </h1>
          <p className="label-mono mt-5 text-ice">THE NEW ERA OF MANKIND</p>

          <div className="mt-12 max-w-2xl border-l border-border pl-6 text-sm leading-7 text-muted-foreground md:text-base">
            <p className="font-display tracking-[0.14em] text-foreground">NĂM 3101.</p>
            <p className="mt-4">Nhân loại đã bước qua giới hạn của một giống loài.</p>
            <p className="mt-4">
              Những người thức tỉnh năng lực được gọi là Astra. Những kẻ đến từ bên ngoài được gọi là
              Trùng tộc.
            </p>
            <p className="mt-4">
              Giữa vô số thuộc địa trải dài qua các vì sao, chiến tranh đã trở thành một phần của đời
              sống.
            </p>
            <p className="mt-4">Và đây là nơi câu chuyện của những người sống sót bắt đầu.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group bg-background p-8 transition-colors hover:bg-card md:p-10"
            >
              <span className="label-mono">{s.code}</span>
              <h2 className="mt-4 font-display text-2xl text-foreground transition-colors group-hover:text-ice md:text-3xl">
                {s.title}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{s.desc}</p>
              <span className="label-mono mt-8 inline-block text-ice opacity-0 transition-opacity group-hover:opacity-100">
                TRUY CẬP →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
