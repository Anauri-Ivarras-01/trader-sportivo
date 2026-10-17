import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, CalendarDays, LineChart, Star, Settings, Search, Menu, X, Activity } from "lucide-react";
import { DemoBanner } from "./ts-ui";
import { dateKey } from "@/lib/demo-data";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/analises", label: "Análises", icon: LineChart },
  { to: "/favoritos", label: "Favoritos", icon: Star },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [today, setToday] = useState("");
  const navigate = useNavigate();
  useEffect(() => setToday(dateKey(new Date())), []);
  useEffect(() => setOpen(false), [path]);

  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 border-r bg-card p-4 transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Activity className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-extrabold tracking-wider">TRADER SPORT</p>
            <p className="text-xs text-highlight">Football Analytics</p>
          </div>
          <button className="ml-auto md:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive(n.to) ? "bg-primary/15 font-semibold text-highlight" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-background/70 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
          <div className="hidden sm:block md:hidden">
            <p className="text-sm font-extrabold tracking-wider">TRADER SPORT</p>
          </div>
          <form
            className="relative ml-auto w-full max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/", search: { q: q || undefined } });
            }}
          >
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar equipe..."
              className="w-full rounded-lg border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </form>
          <input
            type="date"
            aria-label="Escolher data"
            value={today}
            onChange={(e) => {
              setToday(e.target.value);
              navigate({ to: "/", search: { date: e.target.value } });
            }}
            className="hidden rounded-lg border bg-card px-2 py-2 text-sm text-foreground [color-scheme:dark] sm:block"
          />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 md:p-6">
          <DemoBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
