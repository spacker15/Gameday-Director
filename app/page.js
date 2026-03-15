
"use client"

import {useState} from "react"
import Tabs from "../components/Tabs"
import FieldBoard from "../components/FieldBoard"
import WeatherPanel from "../components/WeatherPanel"
import IncidentPanel from "../components/IncidentPanel"
import TrainerPanel from "../components/TrainerPanel"
import MapBuilder from "../components/MapBuilder"
import SchedulerEngine from "../components/SchedulerEngine"
import {initialState} from "../data/sampleData"

export default function Page(){

  const [state,setState]=useState(initialState)
  const [active,setActive]=useState("dashboard")

  const tabs=[
    {key:"dashboard",label:"Dashboard"},
    {key:"fields",label:"Field Status"},
    {key:"weather",label:"Weather"},
    {key:"medical",label:"Trainer"},
    {key:"incidents",label:"Incidents"},
    {key:"map",label:"Park Map"},
    {key:"engine",label:"Scheduling Engine"}
  ]

  return(
    <div>

      <header>
        <h1>LeagueOps Live v11</h1>

        <div>
          Event Date:
          <input
          type="date"
          value={state.selectedDate}
          onChange={(e)=>setState({...state,selectedDate:e.target.value})}
          />
        </div>

      </header>

      <Tabs active={active} setActive={setActive} tabs={tabs}/>

      {active==="dashboard" && (
        <div className="panel">
          <h3>Live Field Status Board</h3>
          <FieldBoard fields={state.fields} games={state.games}/>
        </div>
      )}

      {active==="fields" && (
        <FieldBoard fields={state.fields} games={state.games}/>
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

      {active==="map" && (
        <MapBuilder/>
      )}

      {active==="engine" && (
        <SchedulerEngine/>
      )}

    </div>
  )
}
