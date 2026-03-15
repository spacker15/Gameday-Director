
export default function Incidents({incidents}){
return(
<div className="panel">
<h3>Incidents</h3>
{incidents.length===0 && <div>No incidents</div>}
</div>
)
}
