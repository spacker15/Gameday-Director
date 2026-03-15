
export default function FieldBoard({games}){

return(
<div className="grid">
{[1,2,3,4,5,6].map(f=>{

const game=games.find(g=>g.field===f)

return(
<div key={f} className="card">

<strong>Field {f}</strong>

{game?(
<>
<div>{game.team1} vs {game.team2}</div>
<div>{game.time}</div>
</>
):(
<div>No Game</div>
)}

</div>
)

})}
</div>
)
}
