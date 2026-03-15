
export default function FieldStatus({fields,games}){

function findGame(id){
return games.find(g=>g.field===id)
}

return(
<div className="fields">
{fields.map(f=>{

const g=findGame(f.id)

return(
<div key={f.id} className="field-card">

<strong>{f.name}</strong>

{g?(
<>
<div>{g.team1} vs {g.team2}</div>
<div>{g.time}</div>
<div className={"status "+g.status.toLowerCase()}>{g.status}</div>
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
