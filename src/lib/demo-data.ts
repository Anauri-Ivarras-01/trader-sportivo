// MODO DEMONSTRAÇÃO — todos os dados abaixo são fictícios.
export type Result = "V" | "E" | "D";
export type Absence = { name: string; position: string; status: "Lesionado" | "Suspenso" | "Dúvida"; note: string };
export type Team = { name: string; short: string; color: string; form: Result[]; absences: Absence[] };
export type Match = {
  id: string;
  label: string;
  country: string;
  league: string;
  dayOffset: number;
  time: string;
  home: Team;
  away: Team;
  probs: { home: number; draw: number; away: number };
  avgGoals: { home: number; away: number };
  btts: number;
  over25: number;
  likelyScore: string;
  h2h: { date: string; score: string }[];
};

export const matches: Match[] = [
  {
    id: "azul-verde",
    label: "Equilibrada",
    country: "País Demo A",
    league: "Liga Demonstração A",
    dayOffset: 0,
    time: "16:00",
    home: { name: "Time Azul", short: "AZU", color: "oklch(0.6 0.17 250)", form: ["V", "E", "D", "V", "E"], absences: [] },
    away: { name: "Time Verde", short: "VER", color: "oklch(0.65 0.17 150)", form: ["E", "V", "D", "E", "V"], absences: [] },
    probs: { home: 37, draw: 30, away: 33 },
    avgGoals: { home: 1.3, away: 1.2 },
    btts: 54,
    over25: 46,
    likelyScore: "1 x 1",
    h2h: [
      { date: "Jogo fictício 1", score: "1 x 1" },
      { date: "Jogo fictício 2", score: "2 x 1" },
      { date: "Jogo fictício 3", score: "0 x 1" },
    ],
  },
  {
    id: "aguia-estrela",
    label: "Favorito",
    country: "País Demo A",
    league: "Liga Demonstração A",
    dayOffset: 0,
    time: "19:30",
    home: { name: "Time Águia", short: "AGU", color: "oklch(0.75 0.15 80)", form: ["V", "V", "V", "E", "V"], absences: [] },
    away: { name: "Time Estrela", short: "EST", color: "oklch(0.6 0.2 25)", form: ["D", "D", "E", "D", "V"], absences: [] },
    probs: { home: 70, draw: 20, away: 10 },
    avgGoals: { home: 2.1, away: 0.7 },
    btts: 38,
    over25: 61,
    likelyScore: "2 x 0",
    h2h: [
      { date: "Jogo fictício 1", score: "3 x 0" },
      { date: "Jogo fictício 2", score: "2 x 1" },
      { date: "Jogo fictício 3", score: "1 x 1" },
    ],
  },
  {
    id: "uniao-atletico",
    label: "Desfalques",
    country: "País Demo B",
    league: "Copa Demonstração B",
    dayOffset: 1,
    time: "21:00",
    home: {
      name: "Time União", short: "UNI", color: "oklch(0.55 0.12 300)", form: ["E", "V", "D", "D", "E"],
      absences: [
        { name: "Jogador Fictício 9", position: "Atacante", status: "Lesionado", note: "Lesão muscular (demo)" },
        { name: "Jogador Fictício 4", position: "Zagueiro", status: "Suspenso", note: "3º cartão amarelo (demo)" },
      ],
    },
    away: {
      name: "Time Atlético", short: "ATL", color: "oklch(0.55 0.02 260)", form: ["V", "D", "V", "E", "D"],
      absences: [
        { name: "Jogador Fictício 10", position: "Meia", status: "Dúvida", note: "Desconforto no tornozelo (demo)" },
        { name: "Jogador Fictício 1", position: "Goleiro", status: "Lesionado", note: "Lesão na mão (demo)" },
      ],
    },
    probs: { home: 41, draw: 28, away: 31 },
    avgGoals: { home: 1.1, away: 1.4 },
    btts: 57,
    over25: 52,
    likelyScore: "1 x 1",
    h2h: [
      { date: "Jogo fictício 1", score: "0 x 2" },
      { date: "Jogo fictício 2", score: "1 x 1" },
    ],
  },
];

export const getMatch = (id: string) => matches.find((m) => m.id === id);

export function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function matchDate(m: Match, today = new Date()) {
  const d = new Date(today);
  d.setDate(d.getDate() + m.dayOffset);
  return d;
}
export function matchDateKey(m: Match) {
  return dateKey(matchDate(m));
}
export function formatDate(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export type Filters = { date?: string; country?: string; league?: string; team?: string; q?: string };
export function filterMatches(list: Match[], f: Filters) {
  const q = f.q?.trim().toLowerCase();
  return list.filter((m) => {
    if (f.date && matchDateKey(m) !== f.date) return false;
    if (f.country && m.country !== f.country) return false;
    if (f.league && m.league !== f.league) return false;
    if (f.team && m.home.name !== f.team && m.away.name !== f.team) return false;
    if (q && !m.home.name.toLowerCase().includes(q) && !m.away.name.toLowerCase().includes(q)) return false;
    return true;
  });
}
