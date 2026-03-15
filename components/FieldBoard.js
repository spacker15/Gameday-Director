
export default function FieldBoard({fields,games}){

  function findGame(field){
    return games.find(g=>g.field===field.id)
  }

  return(
    <div className="grid">
      {fields.map(field=>{
        const game=findGame(field)
        return(
          <div key={field.id} className="field-card">
            <strong>{field.name}</strong>
            {game?
            <>
            <div>{game.team1} vs {game.team2}</div>
            <div>{game.time}</div>
            <span className="badge">{game.status}</span>
            </>
            :
            <div>No Game</div>
            }
          </div>
        )
      })}
    </div>
  )
}
