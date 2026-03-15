
"use client"

import {generateSchedule} from "../lib/scheduleEngine"
import {fields,times,teams} from "../data/sampleData"
import GameCard from "../components/GameCard"

const schedule=generateSchedule(teams,fields,times)

export default function Page(){

return(

<div>

<h1 style={{padding:"20px"}}>LeagueOps Live v10</h1>

<div className="board">

{fields.map(field=>{

const games=schedule.filter(g=>g.field===field)

return(

<div key={field} className="field">

<h3>{field}</h3>

{games.map((g,i)=>(
<GameCard key={i} game={g}/>
))}

</div>

)

})}

</div>

</div>

)

}
