import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { astras } from "@/data/astra";
import { usePortrait } from "@/lib/portraits";

export const Route = createFileRoute("/astra/$id")({
  loader: ({ params }) => {
    const astra = astras.find((a) => a.id === params.id);
    if (!astra) throw notFound();
    return { astra };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Hồ sơ không khả dụng — Tân Nguyên Niên" }, { name: "robots", content: "noindex" }],
      };
    }
    const a = loaderData.astra;
    const desc = `${a.name} — ${a.rank} / ${a.ability}, đơn vị ${a.unit}. Hồ sơ Astra trong cơ sở dữ liệu Aegis.`;
    return {
      meta: [
        { title: `${a.name} — Hồ sơ Astra` },
        { name: "description", content: desc },
        { property: "og:title", content: `${a.name} — Hồ sơ Astra` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: AstraProfile,
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border py-3">
      <p className="label-mono">{label}</p>
      <p className="mt-1 font-display text-sm tracking-[0.12em] text-foreground">{value}</p>
    </div>
  );
}

function AstraProfile() {
  const { astra: a } = Route.useLoaderData();
  const filled = Math.round(a.stability / 10);
  const portrait = usePortrait(a.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Link to="/astra" className="label-mono hover:text-ice">
        ← ASTRA DATABASE
      </Link>

      <header className="mt-8 border-b border-border pb-10">
        <p className="label-mono">[ {a.index} ] PERSONNEL FILE</p>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-6xl">{a.name}</h1>
        <p className={`label-mono mt-4 ${a.status === "RESTRICTED" ? "text-hive" : "text-ice"}`}>
          STATUS: {a.status}
        </p>
      </header>

      <div className="mt-12 grid gap-12 md:grid-cols-[260px_1fr]">
        <aside>
          {portrait && (
            <div className="corner-frame hairline mb-6 overflow-hidden">
              <img
                src={portrait}
                alt={`Chân dung ${a.name}`}
                className="aspect-[3/4] w-full object-cover object-top grayscale-[20%]"
              />
            </div>
          )}
          <Field label="ASTRA ID" value={a.astraId} />
          <Field label="CALLSIGN" value={a.callsign} />
          <Field label="AGE" value={a.age} />
          <Field label="RANK" value={a.rank} />
          <Field label="ABILITY" value={a.ability} />
          <Field label="UNIT" value={a.unit} />

          <div className="mt-10">
            <p className="label-mono">CORE STABILITY</p>
            <p className="mt-2 font-mono text-sm text-ice">
              {"█".repeat(filled)}
              <span className="text-border">{"░".repeat(10 - filled)}</span> {a.stability}%
            </p>
          </div>
        </aside>

        <div className="space-y-12">
          <blockquote className="corner-frame hairline p-7 text-base italic leading-8 text-foreground">
            “{a.quote}”
          </blockquote>

          <section>
            <h2 className="label-mono">PROFILE</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              {a.profile.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="label-mono">ABILITY</h2>
            <ul className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-2">
              {a.abilities.map((ab) => (
                <li key={ab} className="bg-background px-5 py-4 text-sm text-foreground">
                  {ab}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="label-mono">PERSONAL DATA</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              <span className="text-steel">Thích:</span> {a.likes}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              <span className="text-steel">Không thích:</span> {a.dislikes}
            </p>
          </section>

          <section>
            <h2 className="label-mono">RECORD</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
              {a.record.map((r) => (
                <li key={r}>— {r}</li>
              ))}
            </ul>
            {a.sealed && <p className="mt-5 text-sm text-hive">{a.sealed}</p>}
          </section>

          <p className="label-mono hairline inline-block px-4 py-3 text-foreground">
            [ ACCESS LEVEL: {a.accessLevel} ]
          </p>
        </div>
      </div>
    </div>
  );
}
