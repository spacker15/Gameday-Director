
export default function IncidentPanel({incidents}){

return(
<div className="panel">

<h3>Incident Log</h3>

{incidents.length===0 && <div>No incidents</div>}

{incidents.map((i,idx)=>(
<div key={idx}>
{i.time} Field {i.field} - {i.type}
</div>
))}

</div>
)
}
