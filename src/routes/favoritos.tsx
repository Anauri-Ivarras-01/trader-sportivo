import { createFileRoute } from "@tanstack/react-router";
import { getMatch } from "@/lib/demo-data";
import { useFavorites } from "@/lib/storage";
import { MatchCard, EmptyState, PageTitle } from "@/components/ts-ui";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Trader Sport" },
      { name: "description", content: "Suas partidas favoritas salvas neste navegador." },
      { property: "og:title", content: "Favoritos — Trader Sport" },
      { property: "og:description", content: "Suas partidas favoritas salvas neste navegador." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { favs } = useFavorites();
  const items = favs.map(getMatch).filter((m): m is NonNullable<typeof m> => !!m);
  return (
    <div className="space-y-6">
      <PageTitle title="Favoritos" sub="Salvos neste navegador" />
      {items.length === 0 ? (
        <EmptyState title="Nenhum favorito ainda" text="Toque na estrela de uma partida para salvá-la aqui." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((m) => <MatchCard key={m.id} m={m} />)}</div>
      )}
    </div>
  );
}
