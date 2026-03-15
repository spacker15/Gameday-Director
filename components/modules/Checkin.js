
export default function Checkin({game,teams,setState,state}){

const roster=[...(teams[game.team1]||[]),...(teams[game.team2]||[])]

function toggle(player){

const g=state.games[0]

g.checkins[player]=!g.checkins[player]

setState({...state})
}

return(
<div>

<h3>Game Check‑In</h3>

{roster.map(p=>(
<div key={p}>
<button onClick={()=>toggle(p)}>
{game.checkins[p]?"✔":"○"} {p}
</button>
</div>
))}

</div>
)
}
