
export default function GameCard({ game }){
  return (
    <div className="game-card">
      <div className="time">{game.time} • Field {game.field}</div>
      <div className="teams">{game.team1} vs {game.team2}</div>
      <div className="small">Status: {game.status}</div>
    </div>
  );
}
