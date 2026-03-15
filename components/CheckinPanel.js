
export default function CheckinPanel({teams,game,checkins,setCheckins}){

if(!game) return <div className="panel">No game selected</div>

const players=[...(teams[game.team1]||[]),(teams[game.team2]||[])]

function toggle(player){

const key=player+"_"+game.time
const newCheckins={...checkins}

if(newCheckins[key]){
delete newCheckins[key]
}else{
newCheckins[key]=true
}

setCheckins(newCheckins)

}

return(

<div className="panel">

<h3>Player Check-In</h3>

{players.map(p=>(

<div key={p} className="roster-row" onClick={()=>toggle(p)}>

<span>{p}</span>

<span>{checkins[p+"_"+game.time]?"Checked In":"Click to Check In"}</span>

</div>

))}

</div>

)

}
