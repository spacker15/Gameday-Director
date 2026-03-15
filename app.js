
const STORAGE_KEY = "leagueops_v92";
let pendingRosterRows = [];
let pendingScheduleRows = [];

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
  checkins: {},
  alerts: []
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
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function resetState(){
  state = JSON.parse(JSON.stringify(defaultState));
  saveState();
  renderAll();
}
function exportState(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leagueops-live-backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
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
function normalizeText(v){ return String(v || "").trim(); }
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
      <div class="teams">${escapeHtml(g.team1)} vs ${escapeHtml(g.team2)}</div>
      <div class="small">${g.status}</div>
    </div>`).join("");
  const alerts = state.alerts.slice(0,8);
  document.getElementById("alertsDisplay").innerHTML = alerts.length ? alerts.map(a=>`<div class="alert-box warn">${escapeHtml(a)}</div>`).join("") : `<div class="small">No active alerts.</div>`;
}
function renderSchedule(){
  sortSchedule();
  document.getElementById("scheduleBoard").innerHTML = state.schedule.map((g,i)=>`
    <div class="game-card" draggable="true" ondragstart="drag(event)" data-index="${i}">
      <div class="time">${g.time} • Field ${g.field}</div>
      <div class="teams">${escapeHtml(g.team1)} vs ${escapeHtml(g.team2)}</div>
      <div class="small">Status: ${g.status}</div>
    </div>`).join("");
}
function renderRosterFilter(){
  const sel = document.getElementById("rosterTeamFilter");
  const teams = ["All", ...getTeams().sort()];
  const current = sel.value || "All";
  sel.innerHTML = teams.map(t=>`<option value="${escapeAttr(t)}" ${t===current?"selected":""}>${escapeHtml(t)}</option>`).join("");
  sel.onchange = renderRosters;
}
function renderRosters(){
  const filter = document.getElementById("rosterTeamFilter").value || "All";
  const teams = getTeams().sort().filter(t => filter === "All" ? true : t === filter);
  document.getElementById("rosterDisplay").innerHTML = teams.map(team=>`
    <div class="team-card">
      <h3>${escapeHtml(team)}</h3>
      ${state.rosters[team].map(p=>`<div class="roster-row"><span>${escapeHtml(p)}</span><span class="small">Active</span></div>`).join("")}
    </div>`).join("");
}
function renderGameSelect(){
  const sel = document.getElementById("gameSelect");
  sel.innerHTML = state.schedule.map((g,i)=>`<option value="${i}">${escapeHtml(g.time)} • ${escapeHtml(g.team1)} vs ${escapeHtml(g.team2)} • Field ${escapeHtml(g.field)}</option>`).join("");
  sel.onchange = renderCheckin;
}
function gameKey(game){ return `${game.time}|${game.team1}|${game.team2}|${game.field}`; }
function playerGlobalKey(team, player){ return `${team}::${player}`; }
function findExistingCheckin(playerKey, excludeGameKey){
  for(const [gk, players] of Object.entries(state.checkins)){
    if(gk === excludeGameKey) continue;
    if(players[playerKey]) return gk;
  }
  return null;
}
function renderCheckin(){
  document.getElementById("checkinAlert").innerHTML = "";
  const idx = Number(document.getElementById("gameSelect").value || 0);
  const game = state.schedule[idx];
  if(!game){ document.getElementById("checkinDisplay").innerHTML = ""; return; }
  const players = [...(state.rosters[game.team1]||[]).map(p=>({team:game.team1, player:p})),
                   ...(state.rosters[game.team2]||[]).map(p=>({team:game.team2, player:p}))];
  const gk = gameKey(game);
  if(!state.checkins[gk]) state.checkins[gk] = {};
  document.getElementById("checkinDisplay").innerHTML = `
    <div class="team-card">
      <h3>${escapeHtml(game.team1)} vs ${escapeHtml(game.team2)}</h3>
      ${players.map(({team,player})=>{
        const key = playerGlobalKey(team, player);
        const checked = !!state.checkins[gk][key];
        const otherGame = findExistingCheckin(key, gk);
        return `<div class="roster-row clickable" onclick="togglePlayerCheckin(${idx}, '${encodeURIComponent(team)}', '${encodeURIComponent(player)}')">
          <span>${escapeHtml(player)} <span class="small">(${escapeHtml(team)})</span></span>
          <span class="badge ${otherGame && !checked ? 'alert' : checked ? '' : 'pending'}">${checked ? 'Checked In' : otherGame ? 'Already In Another Game' : 'Click To Check In'}</span>
        </div>`;
      }).join("")}
    </div>`;
}
function togglePlayerCheckin(gameIndex, teamEnc, playerEnc){
  const team = decodeURIComponent(teamEnc);
  const player = decodeURIComponent(playerEnc);
  const game = state.schedule[gameIndex];
  const gk = gameKey(game);
  if(!state.checkins[gk]) state.checkins[gk] = {};
  const pKey = playerGlobalKey(team, player);
  const already = !!state.checkins[gk][pKey];
  if(already){
    delete state.checkins[gk][pKey];
    saveState();
    renderCheckin();
    renderDashboard();
    return;
  }
  const otherGame = findExistingCheckin(pKey, gk);
  if(otherGame){
    const message = `${player} (${team}) is already checked into another game: ${otherGame}`;
    state.alerts.unshift(message);
    saveState();
    document.getElementById("checkinAlert").innerHTML = `<div class="alert-box error">${escapeHtml(message)}</div>`;
    renderDashboard();
    renderCheckin();
    return;
  }
  state.checkins[gk][pKey] = true;
  saveState();
  renderCheckin();
  renderDashboard();
}
function renderStaff(){
  document.getElementById("refDisplay").innerHTML = state.refs.map(r=>`
    <div class="staff-card"><strong>${escapeHtml(r.name)}</strong><div class="small">${r.checkedIn ? "Checked In" : "Not Checked In"}</div></div>`).join("");
  document.getElementById("volDisplay").innerHTML = state.volunteers.map(v=>`
    <div class="staff-card"><strong>${escapeHtml(v.name)}</strong><div class="small">${escapeHtml(v.role)} • ${v.checkedIn ? "Checked In" : "Not Checked In"}</div></div>`).join("");
}
function parseCSVRows(text){
  return text.split(/\r?\n/).map(line => line.split(",").map(c => normalizeText(c))).filter(r => r.some(Boolean));
}
function rowsFromWorkbook(file, callback){
  const reader = new FileReader();
  reader.onload = evt => {
    const data = new Uint8Array(evt.target.result);
    const wb = XLSX.read(data, {type:"array"});
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {header:1, raw:false});
    callback(rows.map(r => r.map(c => normalizeText(c))).filter(r => r.some(Boolean)));
  };
  reader.readAsArrayBuffer(file);
}
function detectRosterRows(rows){
  const out = [];
  rows.forEach((row, idx)=>{
    if(idx === 0 && row.join(" ").toLowerCase().includes("team") && row.join(" ").toLowerCase().includes("player")) return;
    if(row.length < 2) return;
    let a = row[0], b = row[1];
    if(!a || !b) return;
    if(String(a).toLowerCase().includes("player") || String(a).toLowerCase().includes("name")) return;
    out.push([a, b]);
  });
  return out;
}
function detectScheduleRows(rows){
  const out = [];
  rows.forEach((row, idx)=>{
    if(idx === 0 && row.join(" ").toLowerCase().includes("time")) return;
    if(row.length < 4) return;
    const [time, team1, team2, field] = row;
    if(!time || !team1 || !team2 || !field) return;
    out.push([time, team1, team2, field]);
  });
  return out;
}
function bindUploads(){
  document.getElementById("rosterUpload").addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const name = file.name.toLowerCase();
    if(name.endsWith(".xlsx") || name.endsWith(".xls")){
      rowsFromWorkbook(file, rows => {
        pendingRosterRows = detectRosterRows(rows);
        document.getElementById("rosterUploadStatus").textContent = `Roster file loaded: ${pendingRosterRows.length} rows. Click OK to commit.`;
      });
    } else {
      const reader = new FileReader();
      reader.onload = evt => {
        pendingRosterRows = detectRosterRows(parseCSVRows(evt.target.result));
        document.getElementById("rosterUploadStatus").textContent = `Roster file loaded: ${pendingRosterRows.length} rows. Click OK to commit.`;
      };
      reader.readAsText(file);
    }
  });
  document.getElementById("scheduleUpload").addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const name = file.name.toLowerCase();
    if(name.endsWith(".xlsx") || name.endsWith(".xls")){
      rowsFromWorkbook(file, rows => {
        pendingScheduleRows = detectScheduleRows(rows);
        document.getElementById("scheduleUploadStatus").textContent = `Schedule file loaded: ${pendingScheduleRows.length} rows. Click OK to commit.`;
      });
    } else {
      const reader = new FileReader();
      reader.onload = evt => {
        pendingScheduleRows = detectScheduleRows(parseCSVRows(evt.target.result));
        document.getElementById("scheduleUploadStatus").textContent = `Schedule file loaded: ${pendingScheduleRows.length} rows. Click OK to commit.`;
      };
      reader.readAsText(file);
    }
  });
  document.getElementById("commitRoster").addEventListener("click", ()=>{
    if(!pendingRosterRows.length){
      document.getElementById("rosterUploadStatus").textContent = "No roster file loaded yet.";
      return;
    }
    const newRosters = {};
    pendingRosterRows.forEach(([a,b])=>{
      // support Team,Player OR Player,Team using a simple heuristic
      let team, player;
      const lowerA = String(a).toLowerCase();
      const looksLikeTeamA = lowerA.includes("lac") || lowerA.includes("jax") || lowerA.includes("creeks") || lowerA.includes("riptide") || lowerA.includes("bull") || lowerA.includes("hawk") || lowerA.includes("crocs");
      if(looksLikeTeamA){
        team = a; player = b;
      } else {
        player = a; team = b;
      }
      team = normalizeText(team); player = normalizeText(player);
      if(!team || !player) return;
      if(!newRosters[team]) newRosters[team] = [];
      if(!newRosters[team].includes(player)) newRosters[team].push(player);
    });
    state.rosters = newRosters;
    pendingRosterRows = [];
    saveState();
    renderAll();
    document.getElementById("rosterUploadStatus").textContent = "Roster upload committed.";
  });
  document.getElementById("commitSchedule").addEventListener("click", ()=>{
    if(!pendingScheduleRows.length){
      document.getElementById("scheduleUploadStatus").textContent = "No schedule file loaded yet.";
      return;
    }
    const newSchedule = [];
    pendingScheduleRows.forEach(([time, team1, team2, field])=>{
      newSchedule.push({time, team1, team2, field, status:"Scheduled"});
    });
    state.schedule = newSchedule;
    pendingScheduleRows = [];
    saveState();
    renderAll();
    document.getElementById("scheduleUploadStatus").textContent = "Schedule upload committed.";
  });
}
function bindEngine(){
  document.getElementById("generateSchedule").addEventListener("click", ()=>{
    const teams = getTeams().sort();
    const times = ["10:00 AM","11:00 AM","12:15 PM","1:30 PM","2:45 PM","3:30 PM"];
    const generated = [];
    let field = 1;
    for(let i=0;i<teams.length;i+=2){
      if(teams[i+1]){
        generated.push({time: times[Math.floor(i/2)] || "4:15 PM", team1: teams[i], team2: teams[i+1], field: String(field++), status:"Scheduled"});
      }
    }
    state.schedule = generated;
    saveState();
    renderAll();
    document.getElementById("engineOutput").textContent = "Schedule generated from current rosters.";
  });
}
function drag(ev){ ev.dataTransfer.setData("text/plain", ev.target.dataset.index); }
function renderAll(){
  renderDashboard();
  renderSchedule();
  renderRosterFilter();
  renderRosters();
  renderGameSelect();
  renderCheckin();
  renderStaff();
}
function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
function escapeAttr(s){ return escapeHtml(s).replace(/'/g, '&#39;'); }
document.addEventListener("DOMContentLoaded", ()=>{
  bindTabs();
  bindUploads();
  bindEngine();
  document.getElementById("exportBtn").addEventListener("click", exportState);
  document.getElementById("resetBtn").addEventListener("click", resetState);
  renderAll();
});
