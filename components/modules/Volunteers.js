
export default function Volunteers({volunteers}){

return(
<div className="panel">

<h3>Volunteer Coverage</h3>

{volunteers.map((v,i)=>(
<div key={i}>{v.name} – {v.role}</div>
))}

</div>
)
}
