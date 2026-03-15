
const STORAGE_KEY = "leagueops_v91_sample";
let pendingRosterText = "";
let pendingScheduleText = "";

const defaultState = {
  rosters: {
    "Creeks": ["Player 1","Player 2","Player 3","Player 4"],
    "Jax Lax": ["Player A","Player B","Player C","Player D"],
    "Riptide": ["Player X","Player Y","Player Z","Player Q"],
    "Bulldogs": ["Player M","Player N","Player O","Player P"]
  },
  refs: [
    {name:"Samuel Branford", checkedIn:true},
    {name:"Kaleb Thrasher", checkedIn:true},
    {name:"Gavin Branford", checkedIn:false},
    {name:"Grant Charles", checkedIn:false},
    {name:"Sam Larkin", checkedIn:true},
    {name:"Will Larkin", checkedIn:false},
    {name:"Luke Peacock", checkedIn:true},
    {name:"Gunner Lee", checkedIn:false},
    {name:"Xander Lee", checkedIn:true}
  ],
  volunteers: [
    {name:"Amy Packer", checkedIn:true, role:"Score Table"},
    {name:"Megan Packer", checkedIn:true, role:"Score Table"},
    {name:"Ashton Packer", checkedIn:false, role:"Clock / Score"},
    {name:"Brooke Smith", checkedIn:false, role:"Field Marshal"}
  ],
  schedule: [
    {time:"10:00 AM", team1:"Creeks", team2:"Jax Lax", field:"1", status:"Scheduled"},
    {time:"11:00 AM", team1:"Riptide", team2:"Bulldogs", field:"2", status:"Scheduled"},
    {time:"12:15 PM", team1:"Creeks", team2:"Bulldogs", field:"3", status:"Scheduled"},
    {time:"1:30 PM", team1:"Jax Lax", team2:"Riptide", field:"4", status:"Scheduled"}
  ],
  checkins: {}
};

let state = loadState();

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  return JSON.parse(JSON.stringify(defaultState));
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function getTeams(){ return Object.keys(state.rosters); }
function getPlayerCount(){ return Object.values(state.rosters).reduce((n,arr)=>n+arr.length,0); }
function getCheckedCount(){
  return Object.values(state.checkins).reduce((n,obj)=> n + Object.values(obj).filter(Boolean).length, 0);
}
function parseTime(t){
  const m = String(t||"").trim().toUpperCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if(!m) return 99999;
  let h = parseInt(m[1],10), min = parseInt(m[2]||"0",10), mer = m[3];
  if(mer==="PM" && h!==12) h += 12;
  if(mer==="AM" && h===12) h = 0;
  return h*60 + min;
}
function sortSchedule(){
  state.schedule.sort((a,b)=> parseTime(a.time)-parseTime(b.time) || String(a.field).localeCompare(String(b.field)));
}
function bindTabs(){
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}
function renderDashboard(){
  document.getElementById("teamsCount").textContent = getTeams().length;
  document.getElementById("playersCount").textContent = getPlayerCount();
  document.getElementById("gamesCount").textContent = state.schedule.length;
  document.getElementById("refsCount").textContent = state.refs.length;
  document.getElementById("volCount").textContent = state.volunteers.length;
  document.getElementById("checkinCount").textContent = getCheckedCount();
  sortSchedule();
  document.getElementById("todayGames").innerHTML = state.schedule.map(g=>`
    <div class="game-card">
      <div class="time">${g.time} • Field ${g.field}</div>
      <div class="teams">${g.team1} vs ${g.team2}</div>
      <div class="small">${g.status}</div>
    </div>`).join("");
}
function renderSchedule(){
  sortSchedule();
  document.getElementById("scheduleBoard").innerHTML = state.schedule.map((g,i)=>`
    <div class="game-card" draggable="true" ondragstart="drag(event)" data-index="${i}">
      <div class="time">${g.time} • Field ${g.field}</div>
      <div class="teams">${g.team1} vs ${g.team2}</div>
      <div class="small">Status: ${g.status}</div>
    </div>`).join("");
}
function renderRosters(){
  const teams = getTeams().sort();
  document.getElementById("rosterDisplay").innerHTML = teams.map(team=>`
    <div class="team-card">
      <h3>${team}</h3>
      ${state.rosters[team].map(p=>`<div class="check-row"><span>${p}</span><span class="small">Active</span></div>`).join("")}
    </div>`).join("");
}
function renderGameSelect(){
  const sel = document.getElementById("gameSelect");
  sel.innerHTML = state.schedule.map((g,i)=>`<option value="${i}">${g.time} • ${g.team1} vs ${g.team2} • Field ${g.field}</option>`).join("");
  sel.onchange = renderCheckin;
}
function renderCheckin(){
  const idx = Number(document.getElementById("gameSelect").value || 0);
  const game = state.schedule[idx];
  if(!game){ document.getElementById("checkinDisplay").innerHTML = ""; return; }
  const players = [...(state.rosters[game.team1]||[]).map(p=>({team:game.team1, player:p})),
                   ...(state.rosters[game.team2]||[]).map(p=>({team:game.team2, player:p}))];
  const gameKey = `${game.time}|${game.team1}|${game.team2}|${game.field}`;
  if(!state.checkins[gameKey]) state.checkins[gameKey] = {};
  document.getElementById("checkinDisplay").innerHTML = `
    <div class="team-card">
      <h3>${game.team1} vs ${game.team2}</h3>
      ${players.map(({team,player})=>{
        const key = `${team}::${player}`;
        const checked = !!state.checkins[gameKey][key];
        return `<label class="check-row">
          <span>${player} <span class="small">(${team})</span></span>
          <input type="checkbox" ${checked ? "checked" : ""} onchange="toggleCheckin('${encodeURIComponent(gameKey)}','${encodeURIComponent(key)}', this.checked)">
        </label>`;
      }).join("")}
    </div>`;
}
function toggleCheckin(gameKeyEnc, playerKeyEnc, checked){
  const gameKey = decodeURIComponent(gameKeyEnc);
  const playerKey = decodeURIComponent(playerKeyEnc);
  if(!state.checkins[gameKey]) state.checkins[gameKey] = {};
  state.checkins[gameKey][playerKey] = checked;
  saveState();
  renderDashboard();
}
function renderStaff(){
  document.getElementById("refDisplay").innerHTML = state.refs.map(r=>`
    <div class="staff-card"><strong>${r.name}</strong><div class="small">${r.checkedIn ? "Checked In" : "Not Checked In"}</div></div>`).join("");
  document.getElementById("volDisplay").innerHTML = state.volunteers.map(v=>`
    <div class="staff-card"><strong>${v.name}</strong><div class="small">${v.role} • ${v.checkedIn ? "Checked In" : "Not Checked In"}</div></div>`).join("");
}
function bindUploads(){
  document.getElementById("rosterUpload").addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      pendingRosterText = evt.target.result;
      document.getElementById("rosterUploadStatus").textContent = "Roster file loaded. Click OK to commit.";
    };
    reader.readAsText(file);
  });
  document.getElementById("scheduleUpload").addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      pendingScheduleText = evt.target.result;
      document.getElementById("scheduleUploadStatus").textContent = "Schedule file loaded. Click OK to commit.";
    };
    reader.readAsText(file);
  });
  document.getElementById("commitRoster").addEventListener("click", ()=>{
    if(!pendingRosterText.trim()){
      document.getElementById("rosterUploadStatus").textContent = "No roster file loaded yet.";
      return;
    }
    const newRosters = {};
    pendingRosterText.split(/\r?\n/).forEach(line=>{
      const row = line.split(",");
      if(row.length < 2) return;
      const team = (row[0]||"").trim();
      const player = (row[1]||"").trim();
      if(!team || !player) return;
      if(!newRosters[team]) newRosters[team] = [];
      newRosters[team].push(player);
    });
    state.rosters = newRosters;
    pendingRosterText = "";
    saveState();
    renderAll();
    document.getElementById("rosterUploadStatus").textContent = "Roster upload committed.";
  });
  document.getElementById("commitSchedule").addEventListener("click", ()=>{
    if(!pendingScheduleText.trim()){
      document.getElementById("scheduleUploadStatus").textContent = "No schedule file loaded yet.";
      return;
    }
    const newSchedule = [];
    pendingScheduleText.split(/\r?\n/).forEach(line=>{
      const row = line.split(",");
      if(row.length < 4) return;
      const time = (row[0]||"").trim();
      const team1 = (row[1]||"").trim();
      const team2 = (row[2]||"").trim();
      const field = (row[3]||"").trim();
      if(!time || !team1 || !team2 || !field) return;
      newSchedule.push({time, team1, team2, field, status:"Scheduled"});
    });
    state.schedule = newSchedule;
    pendingScheduleText = "";
    saveState();
    renderAll();
    document.getElementById("scheduleUploadStatus").textContent = "Schedule upload committed.";
  });
}
function bindEngine(){
  document.getElementById("generateSchedule").addEventListener("click", ()=>{
    const teams = getTeams().sort();
    const times = ["10:00 AM","11:00 AM","12:15 PM","1:30 PM","2:45 PM"];
    const generated = [];
    let field = 1;
    for(let i=0;i<teams.length;i+=2){
      if(teams[i+1]){
        generated.push({time: times[Math.floor(i/2)] || "3:30 PM", team1: teams[i], team2: teams[i+1], field: String(field++), status:"Scheduled"});
      }
    }
    state.schedule = generated;
    saveState();
    renderAll();
    document.getElementById("engineOutput").textContent = "Schedule generated from current rosters.";
  });
}
function drag(ev){
  ev.dataTransfer.setData("text/plain", ev.target.dataset.index);
}
function renderAll(){
  renderDashboard();
  renderSchedule();
  renderRosters();
  renderGameSelect();
  renderCheckin();
  renderStaff();
}
document.addEventListener("DOMContentLoaded", ()=>{
  bindTabs();
  bindUploads();
  bindEngine();
  renderAll();
});
