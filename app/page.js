
"use client"

import {useState} from "react"
import {initialState} from "../data/sampleData"

import Tabs from "../components/Tabs"
import FieldBoard from "../components/modules/FieldBoard"
import DragBoard from "../components/modules/DragBoard"
import Assignments from "../components/modules/Assignments"
import Weather from "../components/modules/Weather"
import MapBuilder from "../components/modules/MapBuilder"
import Scheduler from "../components/modules/Scheduler"

export default function Page(){

const [state,setState]=useState(initialState)
const [active,setActive]=useState("dashboard")

const tabs=[
{key:"dashboard",label:"Dashboard"},
{key:"fields",label:"Field Board"},
{key:"drag",label:"Drag Board"},
{key:"assignments",label:"Assignments"},
{key:"weather",label:"Weather"},
{key:"map",label:"Park Builder"},
{key:"scheduler",label:"Scheduler"}
]

const gamesToday=state.games.filter(g=>g.date===state.selectedDate)

return(
<div>

<header>

<h1>LeagueOps Live v16</h1>

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

{active==="drag" && (
<DragBoard games={gamesToday}/>
)}

{active==="assignments" && (
<Assignments refs={state.refs} volunteers={state.volunteers}/>
)}

{active==="weather" && (
<Weather weather={state.weather} setWeather={(w)=>setState({...state,weather:w})}/>
)}

{active==="map" && (
<MapBuilder/>
)}

{active==="scheduler" && (
<Scheduler/>
)}

</div>
)
}
