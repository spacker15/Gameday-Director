
export default function FieldBoard({games}){

return(
<div className="fields">

{[1,2,3,4,5,6].map(f=>{

const g=games.find(x=>x.field===f)

return(
<div key={f} className="field">

<strong>Field {f}</strong>

{g?(
<>
<div>{g.team1} vs {g.team2}</div>
<div>{g.time}</div>
<div className={"status "+g.status}>{g.status}</div>
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
