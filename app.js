
let state={
rosters:{},
schedule:[]
}

document.querySelectorAll(".tab").forEach(t=>{
t.onclick=()=>{
document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"))
document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"))
t.classList.add("active")
document.getElementById(t.dataset.tab).classList.add("active")
}
})

function renderRosters(){
let html=""
for(let team in state.rosters){
html+=`<div class="card"><h3>${team}</h3>`
state.rosters[team].forEach(p=>{
html+=`<div>${p}</div>`
})
html+="</div>"
}
document.getElementById("rosterDisplay").innerHTML=html
}

function renderSchedule(){
let html=""
state.schedule.forEach((g,i)=>{
html+=`
<div class="card" draggable="true"
ondragstart="drag(event)" data-index="${i}">
${g.time} • ${g.team1} vs ${g.team2} • Field ${g.field}
</div>`
})
document.getElementById("scheduleBoard").innerHTML=html
}

function renderCheckin(){
let html=""
state.schedule.forEach(g=>{
html+=`<div class="card"><h3>${g.team1} vs ${g.team2}</h3>`
let roster=[...(state.rosters[g.team1]||[]),...(state.rosters[g.team2]||[])]
roster.forEach(p=>{
html+=`<label><input type="checkbox">${p}</label><br>`
})
html+="</div>"
})
document.getElementById("checkinDisplay").innerHTML=html
}

document.getElementById("rosterUpload").addEventListener("change",e=>{
let file=e.target.files[0]
let reader=new FileReader()
reader.onload=function(evt){
let rows=evt.target.result.split("\n")
rows.forEach(r=>{
let [team,player]=r.split(",")
if(!state.rosters[team]) state.rosters[team]=[]
state.rosters[team].push(player)
})
renderRosters()
}
reader.readAsText(file)
})

document.getElementById("scheduleUpload").addEventListener("change",e=>{
let file=e.target.files[0]
let reader=new FileReader()
reader.onload=function(evt){
let rows=evt.target.result.split("\n")
rows.forEach(r=>{
let [time,team1,team2,field]=r.split(",")
state.schedule.push({time,team1,team2,field,status:"Scheduled"})
})
renderSchedule()
renderCheckin()
}
reader.readAsText(file)
})

document.getElementById("generateSchedule").onclick=()=>{
let teams=Object.keys(state.rosters)
let games=[]
for(let i=0;i<teams.length;i+=2){
if(teams[i+1]){
games.push({
time:"10:00 AM",
team1:teams[i],
team2:teams[i+1],
field:1,
status:"Scheduled"
})
}
}
state.schedule=games
renderSchedule()
renderCheckin()
document.getElementById("engineOutput").innerText="Schedule generated."
}

function drag(ev){
ev.dataTransfer.setData("text",ev.target.dataset.index)
}
