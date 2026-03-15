
export default function TrainerPanel({medical}){

  return(
    <div className="panel">
      <h3>Trainer / Medical</h3>
      {medical.length===0 && <div>No medical incidents</div>}
      {medical.map((m,idx)=>(
        <div key={idx}>
          {m.time} Field {m.field} - {m.type}
        </div>
      ))}
    </div>
  )
}
