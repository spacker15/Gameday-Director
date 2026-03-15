
"use client"

import {useState} from "react"
import {initialState} from "../data/sampleData"

import Tabs from "../components/Tabs"
import FieldBoard from "../components/modules/FieldBoard"
import Checkin from "../components/modules/Checkin"
import Weather from "../components/modules/Weather"
import Trainer from "../components/modules/Trainer"
import Incidents from "../components/modules/Incidents"
import Scheduler from "../components/modules/Scheduler"

export default function Page(){

const [state,setState]=useState(initialState)
const [active,setActive]=useState("dashboard")
const [checkins,setCheckins]=useState({})

const tabs=[
{key:"dashboard",label:"Dashboard"},
{key:"fields",label:"Field Board"},
{key:"checkin",label:"Player Check-In"},
{key:"weather",label:"Weather"},
{key:"trainer",label:"Trainer"},
{key:"incidents",label:"Incidents"},
{key:"scheduler",label:"Scheduling Engine"}
]

const gamesToday=state.games.filter(g=>g.date===state.selectedDate)
const currentGame=gamesToday[0]

return(
<div>

<header>

<h1>LeagueOps Live v15</h1>

<div>
Event Date
<input
type="date"
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
<Checkin
teams={state.teams}
game={currentGame}
checkins={checkins}
setCheckins={setCheckins}
/>
)}

{active==="weather" && (
<Weather weather={state.weather}/>
)}

{active==="trainer" && (
<Trainer medical={state.medical}/>
)}

{active==="incidents" && (
<Incidents incidents={state.incidents}/>
)}

{active==="scheduler" && (
<Scheduler/>
)}

</div>
)

}
