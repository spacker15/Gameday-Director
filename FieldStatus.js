
"use client"

import {useState} from "react"
import {data} from "../data/sampleData"

import FieldStatus from "../components/modules/FieldStatus"
import RefBoard from "../components/modules/RefBoard"
import IncidentBoard from "../components/modules/IncidentBoard"
import WeatherPanel from "../components/modules/WeatherPanel"

export default function Page(){

const [state,setState]=useState(data)

return(
<div>

<header>

<h1>LeagueOps Live v17 – Game Day Command Center</h1>

<div>
Date
<input
type="date"
value={state.date}
onChange={e=>setState({...state,date:e.target.value})}
/>
</div>

</header>

<div className="dashboard">

<div className="panel">

<h2>Live Field Status Board</h2>

<FieldStatus
fields={state.fields}
games={state.games}
/>

</div>

<div className="ops-grid">

<RefBoard refs={state.refs}/>

<WeatherPanel weather={state.weather}/>

<IncidentBoard incidents={state.incidents}/>

</div>

</div>

</div>
)
}
