import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Trophy, LineChart, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { matches, filterMatches, dateKey, formatDate, type Filters } from "@/lib/demo-data";
import { useHistory } from "@/lib/storage";
import { MatchCard, EmptyState, PageTitle } from "@/components/ts-ui";

type DemoState = "normal" | "carregando" | "vazio" | "erro";
type Search = Filters & { estado?: DemoState };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const str = (k: string) => (typeof s[k] === "string" && s[k] ? (s[k] as string) : undefined);
    return { date: str("date"), country: str("country"), league: str("league"), team: str("team"), q: str("q"), estado: str("estado") as DemoState | undefined };
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Trader Sport" },
      { name: "description", content: "Partidas do dia, filtros e probabilidades demonstrativas." },
      { property: "og:title", content: "Dashboard — Trader Sport" },
      { property: "og:description", content: "Partidas do dia, filtros e probabilidades demonstrativas." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const { history } = useHistory();
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const t = new Date();
    setDays(Array.from({ length: 7 }, (_, i) => { const d = new Date(t); d.setDate(t.getDate() + i - 1); return d; }));
  }, []);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [search.date, search.country, search.league, search.team, search.q]);

  const set = (patch: Partial<Search>) => navigate({ search: (p: Search) => ({ ...p, ...patch }) });

  const countries = [...new Set(matches.map((m) => m.country))];
  const leagues = [...new Set(matches.filter((m) => !search.country || m.country === search.country).map((m) => m.league))];
  const teams = [...new Set(matches.filter((m) => !search.league || m.league === search.league).flatMap((m) => [m.home.name, m.away.name]))];

  const list = useMemo(() => filterMatches(matches, search), [search]);
  const grouped = useMemo(() => {
    const g: Record<string, typeof list> = {};
    list.forEach((m) => (g[m.league] ||= []).push(m));
    return g;
  }, [list]);

  const state: DemoState = search.estado ?? "normal";
  const hasFilters = search.date || search.country || search.league || search.team || search.q;

  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" sub="Visão geral das partidas (fictícias)" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={CalendarDays} label="Jogos disponíveis" value={list.length} />
        <Stat icon={Trophy} label="Campeonatos" value={Object.keys(grouped).length} />
        <Stat icon={LineChart} label="Análises consultadas" value={history.length} />
      </div>

      <div className="card-surface flex items-center gap-2 p-2">
        <button className="rounded-md p-2 hover:bg-accent" aria-label="Dias anteriores" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></button>
        <div className="flex flex-1 gap-2 overflow-x-auto">
          <DayBtn active={!search.date} onClick={() => set({ date: undefined })}>Todas</DayBtn>
          {days.map((d) => (
            <DayBtn key={dateKey(d)} active={search.date === dateKey(d)} onClick={() => set({ date: dateKey(d) })}>
              {formatDate(d)}
            </DayBtn>
          ))}
        </div>
        <button className="rounded-md p-2 hover:bg-accent" aria-label="Próximos dias" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Select label="País" value={search.country} options={countries} onChange={(v) => set({ country: v, league: undefined, team: undefined })} />
        <Select label="Campeonato" value={search.league} options={leagues} onChange={(v) => set({ league: v, team: undefined })} />
        <Select label="Equipe" value={search.team} options={teams} onChange={(v) => set({ team: v })} />
        <button
          onClick={() => navigate({ search: {} })}
          disabled={!hasFilters}
          className="flex items-center justify-center gap-2 self-end rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-accent disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" /> Limpar filtros
        </button>
      </div>
      {search.q && <p className="text-sm text-muted-foreground">Pesquisa: <b className="text-foreground">"{search.q}"</b></p>}

      {state === "erro" ? (
        <div className="card-surface border-destructive/50 p-8 text-center">
          <p className="font-semibold text-destructive">Erro ao carregar partidas (demonstração)</p>
          <button onClick={() => set({ estado: undefined })} className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Tentar novamente</button>
        </div>
      ) : state === "carregando" || loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="card-surface h-52 animate-pulse" />)}
        </div>
      ) : state === "vazio" || list.length === 0 ? (
        <EmptyState title="Nenhuma partida encontrada" text="Tente outra data ou limpe os filtros." />
      ) : (
        Object.entries(grouped).map(([league, ms]) => (
          <section key={league} className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-highlight">
              <Trophy className="h-4 w-4" /> {league} <span className="font-normal normal-case text-muted-foreground">· {ms[0].country}</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ms.map((m) => <MatchCard key={m.id} m={m} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );

  function shift(n: number) {
    setDays((ds) => ds.map((d) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; }));
  }
}

function Stat({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number }) {
  return (
    <div className="card-surface flex items-center gap-4 p-4">
      <div className="rounded-lg bg-primary/15 p-3 text-highlight"><Icon className="h-5 w-5" /></div>
      <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
    </div>
  );
}

function DayBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`shrink-0 rounded-md px-3 py-1.5 text-sm capitalize ${active ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
      {children}
    </button>
  );
}

function Select({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (v?: string) => void }) {
  return (
    <label className="text-xs text-muted-foreground">
      {label}
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} className="mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm text-foreground">
        <option value="">Todos</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
