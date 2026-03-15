
"use client"

import {useState} from "react"
import Tabs from "../components/Tabs"
import FieldBoard from "../components/FieldBoard"
import CheckinPanel from "../components/CheckinPanel"
import WeatherPanel from "../components/WeatherPanel"
import IncidentPanel from "../components/IncidentPanel"
import TrainerPanel from "../components/TrainerPanel"
import {initialState} from "../data/sampleData"

export default function Page(){

const [state,setState]=useState(initialState)
const [active,setActive]=useState("dashboard")
const [checkins,setCheckins]=useState({})

const tabs=[
{key:"dashboard",label:"Dashboard"},
{key:"fields",label:"Field Board"},
{key:"checkin",label:"Player Check-In"},
{key:"weather",label:"Weather"},
{key:"medical",label:"Trainer"},
{key:"incidents",label:"Incidents"}
]

const gamesToday=state.games.filter(g=>g.date===state.selectedDate)
const currentGame=gamesToday[0]

return(
<div>

<header>

<h1>LeagueOps Live v13</h1>

<div>
Event Date
<input type="date"
value={state.selectedDate}
onChange={(e)=>setState({...state,selectedDate:e.target.value})}
/>
</div>

</header>

<Tabs tabs={tabs} active={active} setActive={setActive}/>

{active==="dashboard" && (
<div className="panel">
<h3>Live Field Status Board</h3>
<FieldBoard fields={state.fields} games={gamesToday}/>
</div>
)}

{active==="fields" && (
<FieldBoard fields={state.fields} games={gamesToday}/>
)}

{active==="checkin" && (
<CheckinPanel
teams={state.teams}
game={currentGame}
checkins={checkins}
setCheckins={setCheckins}
/>
)}

{active==="weather" && (
<WeatherPanel weather={state.weather}/>
)}

{active==="medical" && (
<TrainerPanel medical={state.medical}/>
)}

{active==="incidents" && (
<IncidentPanel incidents={state.incidents}/>
)}

</div>
)

}
