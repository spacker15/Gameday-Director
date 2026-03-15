
export default function RefCoverage({refs}){

return(
<div className="panel">

<h3>Ref Coverage</h3>

{refs.map((r,i)=>(
<div key={i}>{r.name} – {r.status}</div>
))}

</div>
)
}
