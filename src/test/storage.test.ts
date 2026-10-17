import { describe, expect, it } from "vitest";
import { addToHistory, toggleInList } from "@/lib/storage";
import { filterMatches, matches } from "@/lib/demo-data";

describe("histórico", () => {
  it("guarda no máximo as últimas 20 partidas", () => {
    let h: string[] = [];
    for (let i = 0; i < 25; i++) h = addToHistory(h, `m${i}`);
    expect(h).toHaveLength(20);
    expect(h[0]).toBe("m24");
  });
  it("não duplica e move a partida para o topo", () => {
    expect(addToHistory(["a", "b"], "b")).toEqual(["b", "a"]);
  });
});

describe("favoritos", () => {
  it("adiciona e remove", () => {
    expect(toggleInList([], "x")).toEqual(["x"]);
    expect(toggleInList(["x"], "x")).toEqual([]);
  });
});

describe("pesquisa por equipe", () => {
  it("encontra Time Águia", () => {
    expect(filterMatches(matches, { q: "águia" }).map((m) => m.id)).toEqual(["aguia-estrela"]);
  });
});
