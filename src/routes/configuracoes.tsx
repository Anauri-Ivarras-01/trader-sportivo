import { createFileRoute, Link } from "@tanstack/react-router";
import { useFavorites, useHistory } from "@/lib/storage";
import { PageTitle } from "@/components/ts-ui";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Trader Sport" },
      { name: "description", content: "Preferências e testes de estados do dashboard." },
      { property: "og:title", content: "Configurações — Trader Sport" },
      { property: "og:description", content: "Preferências e testes de estados do dashboard." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const fav = useFavorites();
  const hist = useHistory();
  const states = [
    { v: "carregando", l: "Carregando" },
    { v: "vazio", l: "Sem dados" },
    { v: "erro", l: "Erro" },
  ] as const;
  return (
    <div className="space-y-6">
      <PageTitle title="Configurações" />
      <div className="card-surface space-y-3 p-5">
        <h3 className="font-semibold">Testar estados do dashboard</h3>
        <p className="text-sm text-muted-foreground">Visualize como o dashboard se comporta em cada situação.</p>
        <div className="flex flex-wrap gap-2">
          {states.map((s) => (
            <Link key={s.v} to="/" search={{ estado: s.v }} className="rounded-lg border px-4 py-2 text-sm hover:border-primary hover:text-highlight">{s.l}</Link>
          ))}
        </div>
      </div>
      <div className="card-surface space-y-3 p-5">
        <h3 className="font-semibold">Dados salvos neste navegador</h3>
        <p className="text-sm text-muted-foreground">{fav.favs.length} favorito(s) · {hist.history.length} partida(s) no histórico</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={fav.clear} className="rounded-lg border px-4 py-2 text-sm hover:border-destructive hover:text-destructive">Limpar favoritos</button>
          <button onClick={hist.clear} className="rounded-lg border px-4 py-2 text-sm hover:border-destructive hover:text-destructive">Limpar histórico</button>
        </div>
      </div>
    </div>
  );
}
