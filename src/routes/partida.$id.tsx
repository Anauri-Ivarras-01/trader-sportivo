import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { getMatch, matchDate, formatDate, type Team } from "@/lib/demo-data";
import { useHistory } from "@/lib/storage";
import { Crest, FormDots, ProbBar, FavButton } from "@/components/ts-ui";

export const Route = createFileRoute("/partida/$id")({
  loader: ({ params }) => {
    const m = getMatch(params.id);
    if (!m) throw notFound();
    return m;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.home.name} x ${loaderData.away.name} — Análise` : "Partida indisponível";
    return {
      meta: [
        { title: `${t} | Trader Sport` },
        { name: "description", content: "Análise detalhada demonstrativa da partida." },
        { property: "og:title", content: t },
        { property: "og:description", content: "Análise detalhada demonstrativa da partida." },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="card-surface p-10 text-center">
      <p className="font-semibold">Partida não encontrada</p>
      <Link to="/" className="mt-3 inline-block text-sm text-highlight">Voltar ao dashboard</Link>
    </div>
  ),
  component: Analysis,
});

function Analysis() {
  const m = Route.useLoaderData();
  const { push } = useHistory();
  useEffect(() => { push(m.id); }, [m.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
        <FavButton id={m.id} />
      </div>

      <div className="card-surface p-6">
        <p className="text-center text-xs uppercase tracking-wider text-highlight">{m.league} · {m.country}</p>
        <p className="mb-6 text-center text-sm capitalize text-muted-foreground">{formatDate(matchDate(m))} · {m.time}</p>
        <div className="flex items-center justify-around gap-4">
          <TeamHead team={m.home} label="Mandante" />
          <span className="text-2xl font-bold text-muted-foreground">x</span>
          <TeamHead team={m.away} label="Visitante" />
        </div>
        <div className="mt-6"><ProbBar p={m.probs} /></div>
        <p className="mt-2 text-center text-xs text-warning">Probabilidades apenas demonstrativas — não geradas por motor estatístico.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Média de gols" value={`${m.avgGoals.home} / ${m.avgGoals.away}`} sub="casa / fora" />
        <Metric label="Ambas marcam" value={`${m.btts}%`} />
        <Metric label="Over 2,5" value={`${m.over25}%`} sub={`Under 2,5: ${100 - m.over25}%`} />
        <Metric label="Placar provável" value={m.likelyScore} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Box title="Últimos 5 jogos">
          {[m.home, m.away].map((t) => (
            <div key={t.name} className="flex items-center justify-between py-2">
              <span className="text-sm">{t.name}</span><FormDots form={t.form} />
            </div>
          ))}
        </Box>
        <Box title="Confrontos diretos">
          {m.h2h.map((h, i) => (
            <div key={i} className="flex justify-between border-b py-2 text-sm last:border-0">
              <span className="text-muted-foreground">{h.date}</span>
              <span className="font-semibold">{m.home.short} {h.score} {m.away.short}</span>
            </div>
          ))}
        </Box>
      </div>

      <Box title="Lesionados e suspensos">
        <div className="grid gap-4 md:grid-cols-2">
          {[m.home, m.away].map((t) => (
            <div key={t.name}>
              <p className="mb-2 text-sm font-semibold">{t.name}</p>
              {t.absences.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum desfalque informado.</p>
              ) : (
                t.absences.map((a) => (
                  <div key={a.name} className="mb-2 flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
                    <div><p className="font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{a.position} · {a.note}</p></div>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${a.status === "Lesionado" ? "bg-destructive/20 text-destructive" : a.status === "Suspenso" ? "bg-warning/20 text-warning" : "bg-away/20 text-away"}`}>{a.status}</span>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </Box>

      <Box title="Como calculamos">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
          <p>
            Nesta versão, todos os números são <b className="text-foreground">fictícios e demonstrativos</b>. Na próxima etapa, o motor estatístico
            combinará forma recente, média de gols, confrontos diretos e desfalques para estimar as probabilidades.
          </p>
        </div>
      </Box>
    </div>
  );
}

function TeamHead({ team, label }: { team: Team; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Crest team={team} size={64} />
      <p className="font-bold">{team.name}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-highlight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-surface p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
