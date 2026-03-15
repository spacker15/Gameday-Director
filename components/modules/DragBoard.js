
export default function DragBoard({games}){

return(
<div className="panel">

<h3>Drag & Drop Scheduling Board</h3>

{games.map((g,i)=>(
<div key={i} className="drag-card">
{g.team1} vs {g.team2} — {g.time}
</div>
))}

<p>(Drag/drop logic placeholder for ESPN style board)</p>

</div>
)
}
