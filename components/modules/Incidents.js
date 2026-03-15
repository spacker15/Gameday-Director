
export default function Incidents({state,setState}){

function add(){

const text=prompt("Incident description")

if(!text)return

state.incidents.push({
time:new Date().toLocaleTimeString(),
text
})

setState({...state})
}

return(
<div>

<h3>Incident Log</h3>

<button onClick={add}>Add Incident</button>

{state.incidents.map((i,k)=>(
<div key={k}>{i.time} – {i.text}</div>
))}

</div>
)
}
