
export default function GameCard({game}){

return(
<div className="card">
<div><b>{game.team1}</b> vs <b>{game.team2}</b></div>
<div>{game.time}</div>
<div>{game.field}</div>

<select defaultValue={game.status}>
<option>Scheduled</option>
<option>Starting</option>
<option>Live</option>
<option>Halftime</option>
<option>Final</option>
<option>Delayed</option>
</select>

</div>
)

}
