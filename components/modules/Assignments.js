
export default function Assignments({refs,volunteers}){

return(
<div className="panel">

<h3>Referee Assignments</h3>

{refs.map((r,i)=>(
<div key={i}>{r.name}</div>
))}

<h3 style={{marginTop:"20px"}}>Volunteer Assignments</h3>

{volunteers.map((v,i)=>(
<div key={i}>{v.name} — {v.role}</div>
))}

</div>
)
}
