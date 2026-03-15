
let state={
home:0,
away:0,
roster:[]
}

const rosterInput=document.getElementById("roster")
const grid=document.getElementById("grid")

document.getElementById("import").onclick=()=>{
state.roster=rosterInput.value.split("\n").map(r=>{
let p=r.split(",")
return{
number:p[0],
name:p[1]
}
})
renderPlayers()
}

document.getElementById("homePlus").onclick=()=>{
state.home++
document.getElementById("home").textContent=state.home
}

document.getElementById("awayPlus").onclick=()=>{
state.away++
document.getElementById("away").textContent=state.away
}

document.getElementById("generate").onclick=()=>{
document.getElementById("report").value=`Final Score: ${state.home}-${state.away}`
}

function renderPlayers(){
grid.innerHTML=""
state.roster.forEach(p=>{
let card=document.createElement("div")
card.className="card"
card.innerHTML=`#${p.number}<br>${p.name}`
grid.appendChild(card)
})
}
