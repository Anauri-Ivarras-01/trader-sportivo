import { Link } from "@tanstack/react-router";
import { Star, AlertTriangle } from "lucide-react";
import { type Match, type Team, type Result, matchDate, formatDate } from "@/lib/demo-data";
import { useFavorites } from "@/lib/storage";

export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-center text-xs font-bold tracking-wider text-warning">
      <AlertTriangle className="h-4 w-4 shrink-0" /> MODO DEMONSTRAÇÃO — DADOS FICTÍCIOS
    </div>
  );
}

export function Crest({ team, size = 40 }: { team: Team; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-foreground/20 text-[10px] font-extrabold text-foreground"
      style={{ width: size, height: size, background: team.color }}
      aria-label={`Escudo ilustrativo ${team.name}`}
    >
      {team.short}
    </div>
  );
}

export function ProbBar({ p }: { p: Match["probs"] }) {
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div className="bg-primary" style={{ width: `${p.home}%` }} />
        <div className="bg-draw" style={{ width: `${p.draw}%` }} />
        <div className="bg-away" style={{ width: `${p.away}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span><b className="text-highlight">{p.home}%</b> casa</span>
        <span><b className="text-foreground">{p.draw}%</b> empate</span>
        <span><b className="text-away">{p.away}%</b> fora</span>
      </div>
    </div>
  );
}

export function FormDots({ form }: { form: Result[] }) {
  const cls = { V: "bg-primary text-primary-foreground", E: "bg-draw text-primary-foreground", D: "bg-destructive text-destructive-foreground" };
  return (
    <div className="flex gap-1">
      {form.map((r, i) => (
        <span key={i} className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${cls[r]}`}>{r}</span>
      ))}
    </div>
  );
}

export function FavButton({ id }: { id: string }) {
  const { isFav, toggle } = useFavorites();
  const on = isFav(id);
  return (
    <button
      onClick={() => toggle(id)}
      aria-label={on ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className="rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-warning"
    >
      <Star className={`h-4 w-4 ${on ? "fill-warning text-warning" : ""}`} />
    </button>
  );
}

export function MatchCard({ m }: { m: Match }) {
  return (
    <div className="card-surface p-4 transition hover:border-primary/40">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(matchDate(m))} · {m.time}</span>
        <div className="flex items-center gap-1">
          <span className="rounded bg-accent px-2 py-0.5">{m.label}</span>
          <FavButton id={m.id} />
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2"><Crest team={m.home} /><span className="truncate font-semibold">{m.home.name}</span></div>
        <span className="text-xs text-muted-foreground">x</span>
        <div className="flex min-w-0 flex-row-reverse items-center gap-2 text-right"><Crest team={m.away} /><span className="truncate font-semibold">{m.away.name}</span></div>
      </div>
      <ProbBar p={m.probs} />
      <Link
        to="/partida/$id"
        params={{ id: m.id }}
        className="mt-4 block rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground transition hover:bg-highlight"
      >
        Ver análise
      </Link>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="card-surface p-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
