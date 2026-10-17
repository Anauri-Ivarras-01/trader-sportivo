import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { matches, matchDateKey, dateKey, formatDate } from "@/lib/demo-data";
import { PageTitle } from "@/components/ts-ui";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário — Trader Sport" },
      { name: "description", content: "Navegue pelas datas das partidas." },
      { property: "og:title", content: "Calendário — Trader Sport" },
      { property: "og:description", content: "Navegue pelas datas das partidas." },
    ],
  }),
  component: Calendar,
});

function Calendar() {
  const [days, setDays] = useState<Date[]>([]);
  useEffect(() => {
    const t = new Date();
    setDays(Array.from({ length: 14 }, (_, i) => { const d = new Date(t); d.setDate(t.getDate() + i - 3); return d; }));
  }, []);
  return (
    <div className="space-y-6">
      <PageTitle title="Calendário" sub="Clique em um dia para ver as partidas" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((d) => {
          const k = dateKey(d);
          const n = matches.filter((m) => matchDateKey(m) === k).length;
          return (
            <Link key={k} to="/" search={{ date: k }} className={`card-surface p-4 transition hover:border-primary/50 ${n ? "border-primary/40" : ""}`}>
              <p className="text-sm capitalize text-muted-foreground">{formatDate(d)}</p>
              <p className={`mt-2 text-xl font-bold ${n ? "text-highlight" : "text-muted-foreground"}`}>{n}</p>
              <p className="text-xs text-muted-foreground">{n === 1 ? "jogo" : "jogos"}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
