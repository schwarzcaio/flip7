import { useState } from "react";
import SetupScreen from "./components/SetupScreen";
import GameScreen from "./components/GameScreen";
import WinnerScreen from "./components/WinnerScreen";
import { useGameHistory } from "./hooks/useGameHistory";

export type Screen = "setup" | "game" | "winner";
export type RoundScores = Record<string, number>;
export type Totals = Record<string, number>;

export const WINNING_SCORE = 200;

function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [players, setPlayers] = useState<string[]>([]);
  const [rounds, setRounds] = useState<RoundScores[]>([]);
  const [totals, setTotals] = useState<Totals>({});
  const [winner, setWinner] = useState<string | null>(null);
  const { history, addGame, clearHistory } = useGameHistory();

  const startGame = (names: string[]) => {
    setPlayers(names);
    setRounds([]);
    setTotals(Object.fromEntries(names.map((n) => [n, 0])));
    setWinner(null);
    setScreen("game");
  };

  const commitRound = (scores: RoundScores) => {
    const newTotals = { ...totals };
    Object.entries(scores).forEach(([p, s]) => {
      newTotals[p] = (newTotals[p] || 0) + s;
    });
    const newRounds = [...rounds, scores];
    setRounds(newRounds);
    setTotals(newTotals);
    const maxScore = Math.max(...Object.values(newTotals));
    if (maxScore >= WINNING_SCORE) {
      const w = Object.entries(newTotals).filter(([, v]) => v === maxScore)[0][0];
      setWinner(w);
      setScreen("winner");
      addGame({ winner: w, players, totals: newTotals, rounds: newRounds });
    }
  };

  const undoRound = () => {
    if (rounds.length === 0) return;
    const last = rounds[rounds.length - 1];
    const newTotals = { ...totals };
    Object.entries(last).forEach(([p, s]) => {
      newTotals[p] -= s;
    });
    setRounds((r) => r.slice(0, -1));
    setTotals(newTotals);
  };

  const addPlayer = (name: string) => {
    const n = name.trim();
    if (!n || players.includes(n)) return;
    setPlayers((p) => [...p, n]);
    setTotals((t) => ({ ...t, [n]: 0 }));
    setRounds((r) => r.map((round) => ({ ...round, [n]: 0 })));
  };

  return (
    <div style={{ fontFamily: "'Courier New', Courier, monospace", background: "#0D1B2A", minHeight: "100vh", color: "#E8F0FE" }}>
      <Header screen={screen} roundNumber={rounds.length + 1} onReset={() => setScreen("setup")} />
      {screen === "setup" && (
        <SetupScreen onStart={startGame} history={history} onClearHistory={clearHistory} />
      )}
      {screen === "game" && (
        <GameScreen
          players={players}
          totals={totals}
          rounds={rounds}
          roundNumber={rounds.length + 1}
          onCommit={commitRound}
          onUndo={undoRound}
          onReset={() => setScreen("setup")}
          onAddPlayer={addPlayer}
        />
      )}
      {screen === "winner" && (
        <WinnerScreen
          winner={winner!}
          totals={totals}
          players={players}
          rounds={rounds}
          onReset={() => setScreen("setup")}
        />
      )}
    </div>
  );
}

function Header({ screen, roundNumber, onReset }: { screen: Screen; roundNumber: number; onReset: () => void }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0a1628 0%, #12243A 100%)",
      borderBottom: "2px solid #F5C842",
      padding: "18px 24px 14px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}>
      <div style={{ fontSize: "28px", fontWeight: 900, color: "#F5C842", letterSpacing: "2px", textShadow: "0 0 20px #F5C84255" }}>
        FLIP 7
      </div>
      <div style={{ background: "#00C2B2", color: "#0D1B2A", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", letterSpacing: "1.5px" }}>
        DASHBOARD
      </div>
      {screen === "game" && (
        <>
          <div style={{ fontSize: "11px", color: "#5A7A9A", letterSpacing: "2px", textTransform: "uppercase", marginLeft: "auto" }}>
            Rodada {roundNumber} &nbsp;|&nbsp; Race to {WINNING_SCORE}
          </div>
          <button
            onClick={onReset}
            style={{
              background: "transparent",
              color: "#E84040",
              border: "1px solid #E84040",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "'Courier New', monospace",
            }}
          >
            X Reiniciar
          </button>
        </>
      )}
    </div>
  );
}

export default App;
