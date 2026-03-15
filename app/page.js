
"use client"

import {useState} from "react"
import {initialState} from "../data/sampleData"

import Tabs from "../components/Tabs"
import FieldBoard from "../components/modules/FieldBoard"
import RefCoverage from "../components/modules/RefCoverage"
import Volunteers from "../components/modules/Volunteers"
import Weather from "../components/modules/Weather"
import IncidentLog from "../components/modules/IncidentLog"

export default function Page(){

const [state,setState]=useState(initialState)
const [active,setActive]=useState("dashboard")

const tabs=[
{key:"dashboard",label:"Dashboard"},
{key:"schedule",label:"Schedule"},
{key:"checkin",label:"Game Check-In"},
{key:"incidents",label:"Incidents"}
]

return(
<div>

<header>

<h1>LeagueOps Live v19 – Tournament Command Center</h1>

<div>
Event Date
<input
type="date"
value={state.date}
onChange={e=>setState({...state,date:e.target.value})}
/>
</div>

</header>

<Tabs tabs={tabs} setActive={setActive}/>

{active==="dashboard" && (

<div className="dashboard">

<div>

<h2>Live Field Status Board</h2>

<FieldBoard games={state.games}/>

</div>

<div className="sidepanel">

<RefCoverage refs={state.refs}/>

<Volunteers volunteers={state.volunteers}/>

<Weather weather={state.weather}/>

<IncidentLog incidents={state.incidents}/>

</div>

</div>

)}

</div>
)
}
