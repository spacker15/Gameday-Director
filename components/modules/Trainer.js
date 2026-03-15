
export default function Trainer({medical}){
return(
<div className="panel">
<h3>Trainer / Medical</h3>
{medical.length===0 && <div>No medical incidents</div>}
</div>
)
}
