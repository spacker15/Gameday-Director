
export default function Checkin({teams,game,checkins,setCheckins}){

if(!game) return <div className="panel">No Game Selected</div>

const players=[...(teams[game.team1]||[]),(teams[game.team2]||[])]

function toggle(p){

const key=p+"_"+game.time
const next={...checkins}

if(next[key]) delete next[key]
else next[key]=true

setCheckins(next)

}

return(
<div className="panel">

<h3>Player Check-In</h3>

{players.map(p=>(
<div key={p} onClick={()=>toggle(p)} style={{cursor:"pointer"}}>
{p} — {checkins[p+"_"+game.time]?"Checked In":"Tap to Check In"}
</div>
))}

</div>
)
}
