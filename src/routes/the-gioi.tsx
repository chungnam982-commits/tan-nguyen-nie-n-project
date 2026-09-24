import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/the-gioi")({
  head: () => ({
    meta: [
      { title: "THẾ GIỚI — Tân Nguyên Niên" },
      {
        name: "description",
        content:
          "Năm 3101: các thuộc địa liên hành tinh, sự thức tỉnh của Astra, sự xuất hiện của Trùng tộc và tổ chức Aegis.",
      },
      { property: "og:title", content: "THẾ GIỚI — Tân Nguyên Niên" },
      {
        property: "og:description",
        content: "Thời đại 3101, Aegis, hệ năng lực Astra và mối đe dọa từ Trùng tộc.",
      },
    ],
  }),
  component: WorldPage,
});

const abilities = [
  ["ELEMENTAL", "điều khiển những dạng vật chất và năng lượng tự nhiên."],
  ["KINETIC", "tác động lên lực, chuyển động và động năng."],
  ["BIO", "biến đổi hoặc tác động lên cơ thể sống."],
  ["PSIONIC", "tác động lên ý thức, nhận thức và tín hiệu thần kinh."],
  ["ENERGY", "tạo, hấp thụ và chuyển đổi năng lượng."],
  ["SPATIAL", "tác động lên không gian và khoảng cách."],
  ["MATERIAL", "thay đổi hoặc tái cấu trúc vật chất."],
  ["NULL", "vô hiệu hóa hoặc gây nhiễu năng lực khác."],
];

const ranks = ["E", "D", "C", "B", "A", "S", "EX"];

function WorldPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="label-mono">FILE 01 / WORLD</p>
      <h1 className="mt-4 font-display text-4xl text-foreground md:text-6xl">THẾ GIỚI</h1>

      <div className="mt-12 space-y-5 text-sm leading-7 text-muted-foreground md:text-base">
        <p>
          Năm 3101, nhân loại đã không còn bị giới hạn bởi một hành tinh duy nhất. Hàng trăm thuộc địa
          được xây dựng trên các hành tinh và vệ tinh khác nhau, kết nối với nhau bằng những tuyến vận
          tải xuyên không gian. Công nghệ sinh học, năng lượng và chỉnh sửa gene đã giúp con người vượt
          qua nhiều giới hạn vốn từng được xem là bất khả thi.
        </p>
        <p>Nhưng sự tiến bộ ấy cũng kéo theo một biến đổi không ai dự đoán được.</p>
        <p>
          Một bộ phận con người bắt đầu thức tỉnh những năng lực vượt ngoài quy luật tự nhiên. Có người
          điều khiển năng lượng, có người thao túng lực, có người tác động lên ý thức hoặc biến đổi chính
          cơ thể mình. Những cá thể này được gọi là{" "}
          <span className="text-foreground">Astra</span>.
        </p>
        <p>Không lâu sau đó, Trùng tộc xuất hiện.</p>
        <p>
          Chúng đến từ vùng không gian chưa được khám phá, sở hữu cấu trúc sinh học có khả năng thích
          nghi và tiến hóa nhanh chóng. Từ những cá thể nhỏ bé ban đầu, chúng có thể phát triển thành
          những sinh vật đủ sức phá hủy cả một thành phố. Đáng sợ hơn, Trùng tộc không ngừng thay đổi sau
          mỗi cuộc chiến.
        </p>
        <p>
          Để chống lại chúng, nhân loại thành lập <span className="text-foreground">Aegis</span>, lực
          lượng quân sự tập hợp những Astra mạnh nhất cùng các đơn vị hỗ trợ trên toàn Liên Bang.
        </p>
        <p>Từ đó, cuộc chiến giữa hai giống loài bắt đầu. Không ai biết nó sẽ kéo dài bao lâu.</p>
      </div>

      <section className="corner-frame mt-20 hairline p-8 md:p-10">
        <p className="label-mono">FILE 01-A</p>
        <h2 className="mt-3 font-display text-2xl text-foreground">AEGIS — HUMAN DEFENSE NETWORK</h2>
        <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Aegis là tổ chức quân sự và phòng vệ liên hành tinh được thành lập sau những cuộc xâm lăng
            đầu tiên của Trùng tộc.
          </p>
          <p>
            Aegis chịu trách nhiệm bảo vệ các thuộc địa, nghiên cứu Trùng tộc, đào tạo Astra và triển
            khai những chiến dịch tại các khu vực nguy hiểm.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {ranks.map((r, i) => (
            <span key={r} className="flex items-center gap-2">
              <span className="label-mono hairline px-3 py-2 text-foreground">{r}</span>
              {i < ranks.length - 1 && <span className="text-border">/</span>}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm leading-7 text-muted-foreground">
          Cấp bậc không phải thước đo tuyệt đối. Một Astra có năng lực tương khắc, chiến thuật phù hợp
          hoặc khả năng phối hợp tốt vẫn có thể đối đầu với đối thủ có cấp bậc cao hơn.
        </p>
      </section>

      <section className="mt-16">
        <p className="label-mono">FILE 01-B</p>
        <h2 className="mt-3 font-display text-2xl text-foreground">HỆ NĂNG LỰC ASTRA</h2>
        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          {abilities.map(([code, desc]) => (
            <div key={code} className="bg-background p-6">
              <p className="font-display text-sm tracking-[0.2em] text-ice">{code}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Mỗi Astra có một hồ sơ riêng được lưu trữ trong cơ sở dữ liệu của Aegis.
        </p>
      </section>
    </div>
  );
}
