
const STATUS_ORDER = ["Scheduled","Starting","Live","Halftime","Final","Delayed"];
const state = {
  refs: [
    {name:"Samuel Branford", checkedIn:true},
    {name:"Kaleb Thrasher", checkedIn:true},
    {name:"Gavin Branford", checkedIn:true},
    {name:"Grant Charles", checkedIn:false},
    {name:"Sam Larkin", checkedIn:true}
  ],
  volunteers: [
    {name:"Amy Packer", checkedIn:true},
    {name:"Megan Packer", checkedIn:true},
    {name:"Ashton Packer", checkedIn:false}
  ],
  incidents: [
    {time:"1:12 PM", field:"Field 3", text:"Player Injury • Trainer dispatched"},
    {time:"1:40 PM", field:"Field 1", text:"Bench Warning • Creeks coach"}
  ],
  logs: [
    "1:05 PM • Field 4 game starting",
    "1:12 PM • Trainer dispatched to Field 3",
    "1:35 PM • Lightning watch active"
  ],
  rosters: [
    {team:"Creeks", players:["Player 1","Player 2","Player 3"]},
    {team:"Jax Lax", players:["Player A","Player B","Player C"]},
    {team:"Riptide", players:["Player X","Player Y","Player Z"]}
  ],
  fields: [
    {name:"Field 1", time:"1:00 PM", match:"Creeks vs Jax Lax", status:"Live", verified:"16 / 18 checked in"},
    {name:"Field 2", time:"1:15 PM", match:"Riptide vs Bulldogs", status:"Starting", verified:"14 / 16 checked in"},
    {name:"Field 3", time:"1:30 PM", match:"Creeks Blue vs Riptide Gray", status:"Halftime", verified:"18 / 18 verified"},
    {name:"Field 4", time:"2:00 PM", match:"Bulldogs vs Riptide", status:"Scheduled", verified:"0 / 18 checked in"},
    {name:"Field 5", time:"12:45 PM", match:"Creeks vs Fleming", status:"Final", verified:"18 / 18 verified"},
    {name:"Field 6", time:"2:15 PM", match:"Island vs Jax Lax", status:"Delayed", verified:"12 / 16 checked in"}
  ]
};

function init(){
  bindTabs();
  renderAll();
  document.getElementById("delayAllBtn").addEventListener("click", triggerDelay);
  document.getElementById("delayWeatherBtn").addEventListener("click", triggerDelay);
}
function triggerDelay(){
  state.fields = state.fields.map(f => ({...f, status:"Delayed"}));
  state.logs.unshift(`${currentClock()} • Lightning detected • All games delayed 30 minutes`);
  document.getElementById("weatherStatus").textContent = "30-MINUTE DELAY";
  document.getElementById("weatherStatus").className = "weather-alert delay";
  renderAll();
}
function currentClock(){
  const d = new Date();
  return d.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
}
function bindTabs(){
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}
function renderMetrics(){
  const counts = Object.fromEntries(STATUS_ORDER.map(s => [s, 0]));
  state.fields.forEach(g => counts[g.status] = (counts[g.status] || 0) + 1);
  document.getElementById("metricScheduled").textContent = counts.Scheduled;
  document.getElementById("metricStarting").textContent = counts.Starting;
  document.getElementById("metricLive").textContent = counts.Live;
  document.getElementById("metricHalftime").textContent = counts.Halftime;
  document.getElementById("metricFinal").textContent = counts.Final;
  document.getElementById("metricDelayed").textContent = counts.Delayed;
}
function renderFieldStatus(){
  document.getElementById("fieldStatusGrid").innerHTML = state.fields.map(f => `
    <div class="field-tile">
      <div class="field-name">${f.name}</div>
      <div class="small">${f.time}</div>
      <div class="field-match">${f.match}</div>
      <div class="status-pill status-${f.status}">${f.status}</div>
      <div class="small" style="margin-top:10px">Roster: ${f.verified}</div>
    </div>`).join("");
}
function renderRefCoverage(){
  document.getElementById("refCoverage").innerHTML = state.refs.map(r => `
    <div class="list-row"><div>${r.name}</div><div class="${r.checkedIn ? 'ok' : 'miss'}">${r.checkedIn ? 'Checked In' : 'Missing'}</div></div>`).join("");
}
function renderPlayerVerification(){
  document.getElementById("playerVerification").innerHTML = state.fields.map(f => `
    <div class="list-row"><div>${f.name}<div class="small">${f.match}</div></div><div>${f.verified}</div></div>`).join("");
}
function renderIncidents(){
  document.getElementById("incidentMonitor").innerHTML = state.incidents.map(i => `
    <div class="log-item"><strong>${i.time}</strong> • ${i.field}<br>${i.text}</div>`).join("");
}
function renderLogs(){
  document.getElementById("opsLog").innerHTML = state.logs.map(l => `<div class="log-item">${l}</div>`).join("");
}
function renderBoard(){
  document.getElementById("boardGrid").innerHTML = state.fields.map((f, idx) => `
    <div class="board-col"><h3>${f.name}</h3>
      <div class="game-card">
        <div class="small">${f.time}</div>
        <div class="teams">${f.match}</div>
        <div class="status-pill status-${f.status}">${f.status}</div>
        <select data-index="${idx}">
          ${STATUS_ORDER.map(s => `<option value="${s}" ${s === f.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
    </div>`).join("");
  document.querySelectorAll("#boardGrid select").forEach(sel => {
    sel.addEventListener("change", e => {
      const idx = Number(e.target.dataset.index);
      const next = e.target.value;
      state.fields[idx].status = next;
      state.logs.unshift(`${currentClock()} • ${state.fields[idx].name} changed to ${next}`);
      renderAll();
    });
  });
}
function renderRosters(){
  document.getElementById("rosterList").innerHTML = state.rosters.map(r => `
    <div class="panel" style="margin-bottom:12px">
      <div class="panel-title">${r.team}</div>
      ${r.players.map(p => `<div class="list-row"><div>${p}</div><div class="small">Active</div></div>`).join("")}
    </div>`).join("");
}
function renderCheckin(){
  const samplePlayers = ["Player 1","Player 2","Player 3","Player 4"];
  document.getElementById("checkinList").innerHTML = samplePlayers.map(p => `
    <div class="list-row"><div>${p}</div><div><input type="checkbox"></div></div>`).join("");
}
function renderStaff(){
  document.getElementById("refList").innerHTML = state.refs.map(r => `<div class="list-row"><div>${r.name}</div><div class="${r.checkedIn ? 'ok' : 'miss'}">${r.checkedIn ? 'In' : 'Out'}</div></div>`).join("");
  document.getElementById("volList").innerHTML = state.volunteers.map(v => `<div class="list-row"><div>${v.name}</div><div class="${v.checkedIn ? 'ok' : 'miss'}">${v.checkedIn ? 'In' : 'Out'}</div></div>`).join("");
}
function renderAll(){
  renderMetrics(); renderFieldStatus(); renderRefCoverage(); renderPlayerVerification();
  renderIncidents(); renderLogs(); renderBoard(); renderRosters(); renderCheckin(); renderStaff();
}
document.addEventListener("DOMContentLoaded", init);
