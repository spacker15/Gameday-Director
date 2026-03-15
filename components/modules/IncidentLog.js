
export default function IncidentLog({incidents}){

return(
<div className="panel">

<h3>Incident Monitor</h3>

<div className="log">

{incidents.map((i,k)=>(
<div key={k}>{i.time} – {i.text}</div>
))}

</div>

</div>
)
}
