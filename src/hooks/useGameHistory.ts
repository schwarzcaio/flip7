import { useState } from "react";

export interface GameRecord {
  winner: string;
  players: string[];
  totals: Record<string, number>;
  rounds: Record<string, number>[];
}

const STORAGE_KEY = "flip7_history";

function loadHistory(): GameRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useGameHistory() {
  const [history, setHistory] = useState<GameRecord[]>(loadHistory);

  const addGame = (game: GameRecord) => {
    setHistory((prev) => {
      const next = [game, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  return { history, addGame, clearHistory };
}
