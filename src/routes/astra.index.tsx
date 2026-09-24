import { createFileRoute, Link } from "@tanstack/react-router";
import { astras, portraits } from "@/data/astra";

export const Route = createFileRoute("/astra/")({
  head: () => ({
    meta: [
      { title: "HỒ SƠ ASTRA — Tân Nguyên Niên" },
      {
        name: "description",
        content:
          "Astra Database: danh sách hồ sơ nhân vật Astra đang phục vụ trong Aegis, kèm cấp bậc, hệ năng lực và đơn vị.",
      },
      { property: "og:title", content: "ASTRA DATABASE — Tân Nguyên Niên" },
      {
        property: "og:description",
        content: "Danh sách những nhân vật đang tồn tại trong Tân Nguyên Niên.",
      },
    ],
  }),
  component: AstraList,
});

function AstraList() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="label-mono">FILE 02 / PERSONNEL</p>
      <h1 className="mt-4 font-display text-4xl text-foreground md:text-6xl">ASTRA DATABASE</h1>
      <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
        Mỗi hồ sơ là một tài khoản đang tồn tại trong hệ thống Aegis. Chọn một hồ sơ để truy cập chi
        tiết.
      </p>

      <div className="mt-14 grid gap-px border border-border bg-border md:grid-cols-3">
        {astras.map((a) => (
          <Link
            key={a.id}
            to="/astra/$id"
            params={{ id: a.id }}
            className="group bg-background p-8 transition-colors hover:bg-card"
          >
            {portraits[a.id] && (
              <div className="mb-6 overflow-hidden border border-border">
                <img
                  src={portraits[a.id]}
                  alt={`Chân dung ${a.name}`}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover object-top grayscale transition duration-500 group-hover:grayscale-0"
                />
              </div>
            )}
            <span className="label-mono">[ {a.index} ]</span>
            <h2 className="mt-4 font-display text-xl leading-tight text-foreground transition-colors group-hover:text-ice">
              {a.name}
            </h2>
            <p className="label-mono mt-4 text-steel">
              {a.rank} / {a.ability}
            </p>
            <p className="label-mono mt-1">AEGIS — {a.unit}</p>
            <p
              className={`label-mono mt-8 ${a.status === "RESTRICTED" ? "text-hive" : "text-ice"}`}
            >
              {a.status}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
