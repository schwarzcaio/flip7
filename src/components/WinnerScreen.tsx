import type { RoundScores, Totals } from "../App";

interface Props {
  winner: string;
  totals: Totals;
  players: string[];
  rounds: RoundScores[];
  onReset: () => void;
}

const C = {
  bg: "#0D1B2A",
  surface: "#12243A",
  border: "#1E3A5A",
  yellow: "#F5C842",
  teal: "#00C2B2",
  red: "#E84040",
  muted: "#5A7A9A",
  text: "#E8F0FE",
  green: "#2ECC71",
};

export default function WinnerScreen({ winner, totals, players, rounds, onReset }: Props) {
  const sorted = [...players].sort((a, b) => (totals[b] || 0) - (totals[a] || 0));

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>
      {/* Winner banner */}
      <div style={{
        background: "linear-gradient(135deg, #12243A 0%, #1a3050 100%)",
        border: `2px solid ${C.yellow}`,
        borderRadius: 14,
        padding: "32px 24px",
        textAlign: "center",
        marginBottom: 24,
        boxShadow: `0 0 40px #F5C84222`,
      }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
          Campeão
        </div>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: C.yellow, letterSpacing: 2, textShadow: `0 0 30px #F5C84266`, marginBottom: 8 }}>
          {winner}
        </div>
        <div style={{ fontSize: 14, color: C.muted }}>
          {totals[winner]} pontos &nbsp;·&nbsp; {rounds.length} rodadas
        </div>
      </div>

      {/* Final leaderboard */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "16px 20px",
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
          Placar Final
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((player, i) => {
            const score = totals[player] || 0;
            const isWinner = player === winner;
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div key={player} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: isWinner ? "rgba(245,200,66,0.06)" : "transparent",
                border: `1px solid ${isWinner ? C.yellow : C.border}`,
                borderRadius: 8,
                padding: "10px 14px",
              }}>
                <span style={{ fontSize: 18, width: 28 }}>{medals[i] ?? `${i + 1}.`}</span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: isWinner ? 700 : 400, color: isWinner ? C.yellow : C.text }}>
                  {player}
                </span>
                <span style={{ fontSize: 20, fontWeight: 900, color: isWinner ? C.yellow : C.teal }}>
                  {score}
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}> pts</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Round history */}
      {rounds.length > 0 && (
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 28,
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
                        {v > 0 ? `+${v}` : v}
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

      <button
        onClick={onReset}
        style={{
          width: "100%",
          background: C.yellow,
          color: C.bg,
          border: "none",
          borderRadius: 8,
          padding: "14px",
          fontSize: 14,
          fontWeight: 900,
          cursor: "pointer",
          fontFamily: "'Courier New', monospace",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Nova Partida
      </button>
    </div>
  );
}
