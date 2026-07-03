import { useState } from "react";
import type { GameRecord } from "../hooks/useGameHistory";

interface Props {
  onStart: (names: string[]) => void;
  history: GameRecord[];
  onClearHistory: () => void;
}

const C = {
  bg: "#0D1B2A",
  surface: "#12243A",
  surfaceAlt: "#0E1E30",
  border: "#1E3A5A",
  yellow: "#F5C842",
  teal: "#00C2B2",
  red: "#E84040",
  muted: "#5A7A9A",
  text: "#E8F0FE",
};

export default function SetupScreen({ onStart, history, onClearHistory }: Props) {
  const [players, setPlayers] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addPlayer = () => {
    const name = input.trim();
    if (!name || players.includes(name)) return;
    setPlayers((p) => [...p, name]);
    setInput("");
  };

  const removePlayer = (name: string) => setPlayers((p) => p.filter((x) => x !== name));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addPlayer();
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          Nova Partida
        </div>
        <div style={{ fontSize: 15, color: C.text, opacity: 0.7 }}>
          Adicione os jogadores para começar
        </div>
      </div>

      {/* Add player */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "20px 20px 16px",
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
          Jogadores
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Nome do jogador..."
            style={{
              flex: 1,
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.text,
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              padding: "9px 12px",
              outline: "none",
            }}
          />
          <button
            onClick={addPlayer}
            style={{
              background: C.yellow,
              color: C.bg,
              border: "none",
              borderRadius: 6,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: 1,
            }}
          >
            + ADD
          </button>
        </div>

        {players.length === 0 && (
          <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "8px 0" }}>
            Nenhum jogador adicionado
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {players.map((name, i) => (
            <div key={name} style={{
              display: "flex",
              alignItems: "center",
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "8px 12px",
            }}>
              <span style={{ color: C.yellow, fontSize: 11, fontWeight: 800, width: 20 }}>
                {i + 1}.
              </span>
              <span style={{ flex: 1, fontSize: 14 }}>{name}</span>
              <button
                onClick={() => removePlayer(name)}
                style={{
                  background: "transparent",
                  color: C.muted,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  lineHeight: 1,
                  padding: "0 4px",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(players)}
        disabled={players.length < 2}
        style={{
          width: "100%",
          background: players.length >= 2 ? C.yellow : C.border,
          color: players.length >= 2 ? C.bg : C.muted,
          border: "none",
          borderRadius: 8,
          padding: "14px",
          fontSize: 14,
          fontWeight: 900,
          cursor: players.length >= 2 ? "pointer" : "not-allowed",
          fontFamily: "'Courier New', monospace",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      >
        {players.length < 2 ? `Adicione ${2 - players.length} jogador${players.length === 0 ? "es" : ""} para começar` : "Iniciar Partida"}
      </button>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>
              Histórico de Partidas
            </div>
            <button
              onClick={onClearHistory}
              style={{
                background: "transparent",
                color: C.muted,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "3px 10px",
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                letterSpacing: 1,
              }}
            >
              Limpar
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((game, i) => (
              <div key={i} style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}>
                <div style={{ background: C.yellow, color: C.bg, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 800, letterSpacing: 1, whiteSpace: "nowrap" }}>
                  WINNER
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.yellow }}>{game.winner}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {game.players.join(" · ")} &nbsp;·&nbsp; {game.rounds.length} rodadas
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.teal }}>
                  {game.totals[game.winner]}
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}> pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
