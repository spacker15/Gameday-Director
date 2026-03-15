
"use client"

import {useState} from "react"
import {initialState} from "../data/sampleData"

import Tabs from "../components/Tabs"
import FieldBoard from "../components/modules/FieldBoard"
import Checkin from "../components/modules/Checkin"
import Uploads from "../components/modules/Uploads"
import Incidents from "../components/modules/Incidents"

export default function Page(){

const [state,setState]=useState(initialState)
const [active,setActive]=useState("dashboard")

const tabs=[
{key:"dashboard",label:"Dashboard"},
{key:"checkin",label:"Game Check‑In"},
{key:"uploads",label:"Uploads"},
{key:"incidents",label:"Incidents"}
]

const game=state.games[0]

return(
<div>

<header>
<h1>LeagueOps Live v18</h1>

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
<div className="panel">
<h2>Live Field Status Board</h2>
<FieldBoard games={state.games}/>
</div>
)}

{active==="checkin" && (
<div className="panel">
<Checkin game={game} teams={state.teams} setState={setState} state={state}/>
</div>
)}

{active==="uploads" && (
<div className="panel">
<Uploads setState={setState} state={state}/>
</div>
)}

{active==="incidents" && (
<div className="panel">
<Incidents state={state} setState={setState}/>
</div>
)}

</div>
)
}
