import { createFileRoute } from "@tanstack/react-router";
import { getMatch } from "@/lib/demo-data";
import { useHistory, HISTORY_LIMIT } from "@/lib/storage";
import { MatchCard, EmptyState, PageTitle } from "@/components/ts-ui";

export const Route = createFileRoute("/analises")({
  head: () => ({
    meta: [
      { title: "Análises — Trader Sport" },
      { name: "description", content: "Histórico das últimas partidas consultadas." },
      { property: "og:title", content: "Análises — Trader Sport" },
      { property: "og:description", content: "Histórico das últimas partidas consultadas." },
    ],
  }),
  component: Analyses,
});

function Analyses() {
  const { history, clear } = useHistory();
  const items = history.map(getMatch).filter((m): m is NonNullable<typeof m> => !!m);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <PageTitle title="Análises" sub={`Últimas ${HISTORY_LIMIT} partidas consultadas`} />
        {items.length > 0 && <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">Limpar histórico</button>}
      </div>
      {items.length === 0 ? (
        <EmptyState title="Nenhuma análise consultada" text='Abra uma partida pelo botão "Ver análise".' />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((m) => <MatchCard key={m.id} m={m} />)}</div>
      )}
    </div>
  );
}
