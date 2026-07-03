import { useState } from "react";
import type { RoundScores, Totals } from "../App";
import { WINNING_SCORE } from "../App";

interface Props {
  players: string[];
  totals: Totals;
  rounds: RoundScores[];
  roundNumber: number;
  onCommit: (scores: RoundScores) => void;
  onUndo: () => void;
  onReset: () => void;
  onAddPlayer: (name: string) => void;
}

const C = {
  bg: "#0D1B2A",
  surface: "#12243A",
  surfaceAlt: "#0E1E30",
  border: "#1E3A5A",
  yellow: "#F5C842",
  teal: "#00C2B2",
  red: "#E84040",
  redDim: "#3A1010",
  muted: "#5A7A9A",
  text: "#E8F0FE",
  green: "#2ECC71",
};

function emptyScores(players: string[]) {
  return Object.fromEntries(players.map((p) => [p, ""]));
}

function emptyBust(players: string[]) {
  return Object.fromEntries(players.map((p) => [p, false]));
}

export default function GameScreen({ players, totals, rounds, roundNumber, onCommit, onUndo, onAddPlayer }: Props) {
  const [scores, setScores] = useState<Record<string, string>>(emptyScores(players));
  const [bust, setBust] = useState<Record<string, boolean>>(emptyBust(players));
  const [addInput, setAddInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);

  const toggleBust = (player: string) => {
    setBust((b) => ({ ...b, [player]: !b[player] }));
    // clear any typed score when marking bust
    setScores((s) => ({ ...s, [player]: "" }));
    setBlockError(null);
  };

  const setScore = (player: string, value: string) => {
    setScores((s) => ({ ...s, [player]: value }));
    setBlockError(null);
  };

  const handleCommit = () => {
    // Validate: every non-bust player must have a score entered
    const missing = players.filter((p) => !bust[p] && scores[p].trim() === "");
    if (missing.length > 0) {
      setBlockError(`Preencha a pontuação de: ${missing.join(", ")}`);
      return;
    }

    const parsed: RoundScores = {};
    for (const p of players) {
      if (bust[p]) {
        parsed[p] = 0;
      } else {
        const v = parseInt(scores[p], 10);
        parsed[p] = isNaN(v) ? 0 : v;
      }
    }

    onCommit(parsed);
    // reset for next round — new players may have been added, keep them
    setScores(emptyScores(players));
    setBust(emptyBust(players));
    setBlockError(null);
  };

  const handleAddPlayer = () => {
    const name = addInput.trim();
    if (!name) return;
    onAddPlayer(name);
    setAddInput("");
    setShowAdd(false);
    setScores((s) => ({ ...s, [name]: "" }));
    setBust((b) => ({ ...b, [name]: false }));
  };

  const sorted = [...players].sort((a, b) => (totals[b] || 0) - (totals[a] || 0));
  const bustCount = players.filter((p) => bust[p]).length;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      {/* Scoreboard */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "16px 20px",
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
          Placar
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((player, i) => {
            const score = totals[player] || 0;
            const pct = Math.min((score / WINNING_SCORE) * 100, 100);
            const isLeader = i === 0;
            return (
              <div key={player}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isLeader && <span style={{ color: C.yellow, fontSize: 12 }}>★</span>}
                    <span style={{ fontSize: 14, color: isLeader ? C.yellow : C.text, fontWeight: isLeader ? 700 : 400 }}>
                      {player}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: isLeader ? C.yellow : C.teal }}>{score}</span>
                    <span style={{ fontSize: 10, color: C.muted }}>/ {WINNING_SCORE}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: isLeader ? C.yellow : C.teal,
                    borderRadius: 3,
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Round input */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "16px 20px",
        marginBottom: 20,
      }}>
        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
            {players.length} &nbsp; Rodada {roundNumber} — Inserir Pontos
          </div>
          <div style={{ fontSize: 11, color: bustCount > 0 ? C.red : C.muted, letterSpacing: 1 }}>
            bust = {bustCount} pts
          </div>
        </div>

        {/* Player cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {players.map((player) => {
            const isBust = bust[player];
            return (
              <div key={player} style={{
                background: C.surfaceAlt,
                border: `1px solid ${isBust ? C.red : C.border}`,
                borderRadius: 8,
                padding: "10px 14px 12px",
                transition: "border-color 0.15s",
              }}>
                {/* Name row + BUST button */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: isBust ? C.muted : C.text,
                    textDecoration: isBust ? "line-through" : "none",
                  }}>
                    {player}
                  </span>
                  <button
                    onClick={() => toggleBust(player)}
                    style={{
                      background: isBust ? C.red : "transparent",
                      color: isBust ? "#fff" : C.red,
                      border: `1px solid ${C.red}`,
                      borderRadius: 5,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                      fontFamily: "'Courier New', monospace",
                      letterSpacing: 1.5,
                    }}
                  >
                    BUST
                  </button>
                </div>

                {/* Score input — hidden when bust */}
                {isBust ? (
                  <div style={{
                    background: C.redDim,
                    border: `1px solid ${C.red}`,
                    borderRadius: 6,
                    padding: "10px 14px",
                    color: C.red,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textAlign: "center",
                  }}>
                    BUST — 0 pts
                  </div>
                ) : (
                  <input
                    type="number"
                    value={scores[player] ?? ""}
                    onChange={(e) => setScore(player, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCommit(); }}
                    placeholder="—"
                    style={{
                      width: "100%",
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      borderRadius: 6,
                      color: C.yellow,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 18,
                      fontWeight: 700,
                      padding: "10px 14px",
                      textAlign: "center",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Add player inline */}
        {showAdd ? (
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <input
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddPlayer(); if (e.key === "Escape") setShowAdd(false); }}
              placeholder="Nome do novo jogador..."
              autoFocus
              style={{
                flex: 1,
                background: C.bg,
                border: `1px solid ${C.teal}`,
                borderRadius: 6,
                color: C.text,
                fontFamily: "'Courier New', monospace",
                fontSize: 13,
                padding: "8px 10px",
                outline: "none",
              }}
            />
            <button onClick={handleAddPlayer} style={{ background: C.teal, color: C.bg, border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Courier New', monospace" }}>OK</button>
            <button onClick={() => setShowAdd(false)} style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 12, cursor: "pointer", fontFamily: "'Courier New', monospace" }}>×</button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: "transparent",
              color: C.teal,
              border: `1px dashed ${C.teal}`,
              borderRadius: 6,
              padding: "7px 14px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: 1,
              width: "100%",
              marginTop: 14,
            }}
          >
            + Adicionar Jogador
          </button>
        )}

        {/* Validation error */}
        {blockError && (
          <div style={{
            marginTop: 12,
            padding: "8px 12px",
            background: C.redDim,
            border: `1px solid ${C.red}`,
            borderRadius: 6,
            color: C.red,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}>
            {blockError}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={handleCommit}
            style={{
              flex: 1,
              background: C.yellow,
              color: C.bg,
              border: "none",
              borderRadius: 8,
              padding: "13px",
              fontSize: 13,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Confirmar Rodada
          </button>
          <button
            onClick={onUndo}
            disabled={rounds.length === 0}
            style={{
              background: "transparent",
              color: rounds.length === 0 ? C.border : C.red,
              border: `1px solid ${rounds.length === 0 ? C.border : C.red}`,
              borderRadius: 8,
              padding: "13px 16px",
              fontSize: 12,
              fontWeight: 700,
              cursor: rounds.length === 0 ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
              letterSpacing: 1,
            }}
          >
            ↩ Desfazer
          </button>
        </div>
      </div>

      {/* Round history */}
      {rounds.length > 0 && (
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "16px 20px",
          overflowX: "auto",
        }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
            Histórico de Rodadas
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ color: C.muted, fontWeight: 600, textAlign: "left", paddingBottom: 8, paddingRight: 16, fontSize: 11 }}>#</th>
                {players.map((p) => (
                  <th key={p} style={{ color: C.muted, fontWeight: 600, textAlign: "right", paddingBottom: 8, paddingLeft: 16, fontSize: 11 }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rounds.map((round, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ color: C.muted, padding: "7px 16px 7px 0", fontSize: 11 }}>{i + 1}</td>
                  {players.map((p) => {
                    const v = round[p] ?? 0;
                    return (
                      <td key={p} style={{
                        textAlign: "right",
                        padding: "7px 0 7px 16px",
                        color: v > 0 ? C.green : v < 0 ? C.red : C.muted,
                        fontWeight: v !== 0 ? 700 : 400,
                      }}>
                        {v > 0 ? `+${v}` : v === 0 ? <span style={{ fontSize: 10, color: C.red, fontWeight: 700 }}>BUST</span> : v}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr style={{ borderTop: `2px solid ${C.yellow}` }}>
                <td style={{ color: C.yellow, padding: "8px 16px 0 0", fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>TOTAL</td>
                {players.map((p) => (
                  <td key={p} style={{ textAlign: "right", padding: "8px 0 0 16px", color: C.yellow, fontWeight: 900, fontSize: 15 }}>
                    {totals[p] || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
