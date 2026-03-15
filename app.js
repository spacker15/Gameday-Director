
const STORAGE_KEY = "leagueops_live_v6_1_scheduling_engine";
const TABS = [
  {id:"dashboard", label:"Dashboard"},
  {id:"schedule", label:"Schedule"},
  {id:"parkmap", label:"Park Map"},
  {id:"checkin", label:"Player Check-In"},
  {id:"rosters", label:"Rosters"},
  {id:"staff", label:"Refs & Volunteers"},
  {id:"weather", label:"Weather & Alerts"},
  {id:"uploads", label:"Uploads & Setup"},
  {id:"scheduler", label:"Scheduling Engine"},
];
let state = loadState();
let activeTab = "dashboard";
let dragContext = null;

function loadState(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try { return JSON.parse(saved); } catch(e){ console.error(e); }
  }
  return structuredClone(window.SEED_DATA);
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function getDates(){
  return [...new Set(state.games.map(g=>g.date))].sort();
}
function fmtDate(date){
  try{
    return new Date(date+"T00:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});
  }catch(e){ return date; }
}
function slug(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,'-'); }
function unique(arr){ return [...new Set(arr.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b))); }
function findGame(id){ return state.games.find(g=>g.id===id); }
function getTeam(name){ return state.teams.find(t=>t.name===name) || {name, association:"", division:""}; }
function getPlayers(team){ return state.players.filter(p=>p.team===team); }

function init(){
  renderTabs();
  bindHeader();
  ensureDerivedData();
  renderAll();
}
function ensureDerivedData(){
  document.getElementById("leagueName").textContent = state.league || "League";
  document.getElementById("venueName").textContent = state.venue || "Venue";
  const dateSel = document.getElementById("globalDateSelect");
  const cur = state.selectedDate || getDates()[0];
  dateSel.innerHTML = getDates().map(d=>`<option value="${d}" ${d===cur?"selected":""}>${fmtDate(d)}</option>`).join("");
  state.selectedDate = cur;
}
function bindHeader(){
  document.getElementById("globalDateSelect").addEventListener("change", e=>{
    state.selectedDate = e.target.value;
    saveState(); renderAll();
  });
  document.getElementById("exportBtn").addEventListener("click", exportBackup);
  document.getElementById("resetBtn").addEventListener("click", ()=>{
    if(confirm("Reset the demo and clear all local changes?")){
      localStorage.removeItem(STORAGE_KEY);
      state = structuredClone(window.SEED_DATA);
      activeTab = "dashboard";
      renderTabs(); ensureDerivedData(); renderAll();
    }
  });
}

function renderTabs(){
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = TABS.map(t=>`<button class="tab-btn ${activeTab===t.id?'active':''}" data-tab="${t.id}">${t.label}</button>`).join("");
  tabs.querySelectorAll(".tab-btn").forEach(btn=>btn.addEventListener("click",()=>{
    activeTab = btn.dataset.tab;
    renderTabs();
    document.querySelectorAll(".tab-pane").forEach(p=>p.classList.remove("active"));
    document.getElementById(activeTab).classList.add("active");
    renderPane(activeTab);
  }));
  document.querySelectorAll(".tab-pane").forEach(p=>p.classList.toggle("active", p.id===activeTab));
}

function renderAll(){
  ensureDerivedData();
  TABS.forEach(t=>renderPane(t.id));
}
function renderPane(id){
  switch(id){
    case "dashboard": renderDashboard(); break;
    case "schedule": renderSchedule(); break;
    case "parkmap": renderParkMap(); break;
    case "checkin": renderCheckIn(); break;
    case "rosters": renderRosters(); break;
    case "staff": renderStaff(); break;
    case "weather": renderWeather(); break;
    case "uploads": renderUploads(); break;
    case "scheduler": renderScheduler(); break;
  }
}

function todaysGames(){
  return state.games.filter(g=>g.date===state.selectedDate);
}
function getOpenStaffCount(games=todaysGames()){
  return games.reduce((sum,g)=>sum + (!g.ref1) + (!g.ref2 && g.division!=="1/2 Grade 4v4") + (!g.scoreTable),0);
}
function checkedInStaffCount(){
  return state.refs.filter(r=>r.checkedIn).length + state.volunteers.filter(v=>v.checkedIn).length;
}
function verifiedGamesCount(){
  return todaysGames().filter(g=>g.verifiedHome && g.verifiedAway).length;
}
function incidentCount(){
  return todaysGames().filter(g=>g.disruption || g.homeWarnings || g.awayWarnings || g.homeEjections || g.awayEjections).length;
}
function commsLatest(n=5){
  return [...state.messages].sort((a,b)=>b.time.localeCompare(a.time)).slice(0,n);
}

function renderDashboard(){
  const el = document.getElementById("dashboard");
  const games = todaysGames();
  const fieldCount = unique(games.map(g=>g.field)).length;
  const delayActive = !!state.weather.delayEnd && new Date(state.weather.delayEnd).getTime() > Date.now();
  const nextGames = [...games].sort((a,b)=>(a.time||"").localeCompare(b.time||"")).slice(0,8);
  el.innerHTML = `
    <div class="grid cols-4">
      <div class="card kpi"><div class="small muted">Games on ${fmtDate(state.selectedDate)}</div><div class="value">${games.length}</div><div class="muted">Across ${fieldCount} active fields</div></div>
      <div class="card kpi green"><div class="small muted">Roster Verified</div><div class="value">${verifiedGamesCount()}</div><div class="muted">Home and away complete</div></div>
      <div class="card kpi red"><div class="small muted">Open Staff Slots</div><div class="value">${getOpenStaffCount(games)}</div><div class="muted">Refs and score table</div></div>
      <div class="card kpi ${delayActive?'red':'green'}"><div class="small muted">Weather Status</div><div class="value">${delayActive?'Delay':'Clear'}</div><div class="muted">${delayActive?('Resume '+new Date(state.weather.delayEnd).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})):'No lightning delay active'}</div></div>
    </div>

    <div class="grid cols-3" style="margin-top:16px;">
      <div class="card">
        <div class="row space"><h3>Central Trainer Coverage</h3><span class="tag ${state.trainer.status==='Available'?'green':'yellow'}">${state.trainer.status}</span></div>
        <div style="font-size:1.5rem;font-weight:900">${state.trainer.name || 'Open'}</div>
        <div class="muted">Location: ${state.trainer.location || 'Not set'}</div>
        <div class="row" style="margin-top:12px">
          <button class="secondary" onclick="quickTrainerStatus('Available')">Mark Available</button>
          <button class="warn" onclick="quickTrainerStatus('Responding')">Mark Responding</button>
          <button class="danger" onclick="quickTrainerStatus('Off Site')">Mark Off Site</button>
        </div>
      </div>
      <div class="card">
        <div class="row space"><h3>Lightning Automation</h3><span class="tag ${delayActive?'red':'green'}">${delayActive?'30-minute delay active':'Monitoring'}</span></div>
        <div class="notice">Static GitHub Pages build: WeatherBug lightning handling is integration-ready. You can trigger the delay flow here, but live WeatherBug polling still needs an API/backend.</div>
        <div class="row" style="margin-top:12px">
          <button class="danger" onclick="triggerLightningPrompt()">Trigger Lightning Alert</button>
          <button class="success" onclick="resumePlay()">Resume Play</button>
        </div>
      </div>
      <div class="card">
        <h3>League Snapshot</h3>
        <div class="metric-strip">
          <div class="card kpi"><div class="small muted">Teams</div><div class="value">${state.teams.length}</div></div>
          <div class="card kpi"><div class="small muted">Refs</div><div class="value">${state.refs.length}</div></div>
          <div class="card kpi"><div class="small muted">Volunteers</div><div class="value">${state.volunteers.length}</div></div>
          <div class="card kpi"><div class="small muted">Check-Ins</div><div class="value">${checkedInStaffCount()}</div></div>
          <div class="card kpi red"><div class="small muted">Conduct</div><div class="value">${incidentCount()}</div></div>
        </div>
      </div>
    </div>

    <div class="grid cols-3" style="margin-top:16px;">
      <div class="card">
        <h3>Today's Schedule</h3>
        <div class="list">${nextGames.map(g=>`
          <div class="log-item">
            <div class="row space"><strong>${g.time} • ${g.field}</strong><span class="tag ${g.verifiedHome&&g.verifiedAway?'green':'yellow'}">${g.verifiedHome&&g.verifiedAway?'Verified':'Pending'}</span></div>
            <div>${g.homeTeam} vs ${g.awayTeam}</div>
            <div class="muted small">${g.division} • ${g.homeAssociation}</div>
          </div>`).join('') || `<div class="board-empty">No games on this date.</div>`}
        </div>
      </div>
      <div class="card">
        <h3>Recent Check-Ins</h3>
        <div class="list">${[...state.refs.filter(r=>r.checkedIn).map(r=>({name:r.name,type:'Ref'})),...state.volunteers.filter(v=>v.checkedIn).map(v=>({name:v.name,type:'Volunteer'}))]
            .slice(0,10)
            .map(x=>`<div class="log-item"><strong>${x.type}</strong><div>${x.name}</div></div>`).join('') || `<div class="board-empty">No staff checked in yet.</div>`}
        </div>
      </div>
      <div class="card">
        <h3>Latest Communications</h3>
        <div class="log">${commsLatest(8).map(m=>`
          <div class="log-item">
            <div class="small muted">${new Date(m.time).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})} • ${m.type}</div>
            <div>${m.text}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function getScheduleFilters(){
  const games = todaysGames();
  return {
    divisions: unique(state.games.map(g=>g.division)),
    fields: unique(state.games.map(g=>g.field)),
    associations: unique([...state.games.map(g=>g.homeAssociation), ...state.games.map(g=>g.awayAssociation)])
  };
}
function renderSchedule(){
  const el = document.getElementById("schedule");
  const f = getScheduleFilters();
  const games = todaysGames();
  const fieldOptions = f.fields.map(x=>`<option value="${x}">${x}</option>`).join("");
  const associationOptions = f.associations.map(x=>`<option value="${x}">${x}</option>`).join("");
  const divisionOptions = f.divisions.map(x=>`<option value="${x}">${x}</option>`).join("");
  el.innerHTML = `
    <div class="card">
      <div class="row space">
        <div>
          <h2>ESPN-Style Schedule Board</h2>
          <div class="muted">Drag games between fields. Drag refs or volunteers from the sidebars onto the assignment boxes in each game card.</div>
        </div>
        <div class="row">
          <label>Association<select id="scheduleAssoc"><option value="">All</option>${associationOptions}</select></label>
          <label>Division<select id="scheduleDivision"><option value="">All</option>${divisionOptions}</select></label>
          <label>Field<select id="scheduleField"><option value="">All</option>${fieldOptions}</select></label>
        </div>
      </div>
    </div>

    <div class="board-wrap" style="margin-top:16px;">
      <div class="board-side">
        <div class="row space"><h3>Available Refs</h3><button class="secondary" onclick="quickCheckIn('ref')">Self Check-In</button></div>
        <div class="drag-list">
          ${state.refs.map(r=>`
            <div class="staff-chip" draggable="true" data-drag-type="ref" data-drag-name="${escapeHtml(r.name)}">
              <div><strong>${r.name}</strong></div>
              <div class="small muted">${r.level} • ${r.shirtSize}</div>
              <div class="small muted">${r.phone}</div>
              <div class="small">${r.checkedIn?'<span class="tag green">Checked In</span>':'<span class="tag gray">Not Checked In</span>'}</div>
            </div>`).join('')}
        </div>
      </div>

      <div id="scheduleBoard" class="board"></div>

      <div class="board-side">
        <div class="row space"><h3>Volunteers</h3><button class="secondary" onclick="quickCheckIn('volunteer')">Self Check-In</button></div>
        <div class="drag-list">
          ${state.volunteers.map(v=>`
            <div class="staff-chip" draggable="true" data-drag-type="volunteer" data-drag-name="${escapeHtml(v.name)}">
              <div><strong>${v.name}</strong></div>
              <div class="small muted">${v.role}</div>
              <div class="small">${v.checkedIn?'<span class="tag green">Checked In</span>':'<span class="tag gray">Not Checked In</span>'}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;
  bindScheduleBoard();
}

function filteredScheduleGames(){
  const assoc = document.getElementById("scheduleAssoc")?.value || "";
  const division = document.getElementById("scheduleDivision")?.value || "";
  const field = document.getElementById("scheduleField")?.value || "";
  return todaysGames().filter(g=>{
    const matchAssoc = !assoc || g.homeAssociation===assoc || g.awayAssociation===assoc;
    const matchDiv = !division || g.division===division;
    const matchField = !field || g.field===field;
    return matchAssoc && matchDiv && matchField;
  });
}
function boardFieldNames(games){
  const existing = unique(games.map(g=>g.field));
  const custom = unique(state.fields.map(f=>f.name));
  return unique([...existing, ...custom]).filter(x=>x);
}
function gameCardClass(g){
  if(g.disruption || g.homeEjections || g.awayEjections) return "alert";
  if(g.verifiedHome && g.verifiedAway && g.ref1 && (g.ref2 || g.division==="1/2 Grade 4v4") && g.scoreTable) return "ready";
  if(!g.ref1 || (!g.ref2 && g.division!=="1/2 Grade 4v4") || !g.scoreTable || !g.verifiedHome || !g.verifiedAway) return "warn";
  return "";
}
function bindScheduleBoard(){
  ["scheduleAssoc","scheduleDivision","scheduleField"].forEach(id=>{
    document.getElementById(id)?.addEventListener("change", drawScheduleBoard);
  });
  document.querySelectorAll(".staff-chip").forEach(bindDragSource);
  drawScheduleBoard();
}
function bindDragSource(el){
  el.addEventListener("dragstart", e=>{
    dragContext = {type: el.dataset.dragType, name: el.dataset.dragName};
    e.dataTransfer.setData("text/plain", JSON.stringify(dragContext));
  });
}
function bindDropzone(el, onDrop){
  el.addEventListener("dragover", e=>{ e.preventDefault(); el.classList.add("drag-over"); });
  el.addEventListener("dragleave", ()=> el.classList.remove("drag-over"));
  el.addEventListener("drop", e=>{
    e.preventDefault(); el.classList.remove("drag-over");
    const raw = e.dataTransfer.getData("text/plain");
    let payload = dragContext;
    try{ if(raw) payload = JSON.parse(raw); }catch(err){}
    onDrop(payload);
  });
}
function drawScheduleBoard(){
  const board = document.getElementById("scheduleBoard");
  if(!board) return;
  const games = filteredScheduleGames();
  const fieldNames = boardFieldNames(games);
  board.innerHTML = fieldNames.map(field=>{
    const fieldGames = games.filter(g=>g.field===field).sort((a,b)=>(a.time||"").localeCompare(b.time||""));
    return `
      <div class="field-col" data-field="${field}">
        <div class="field-head"><div><strong>${field}</strong><div class="small muted">${fieldGames.length} games</div></div><button class="secondary small-btn" onclick="openFieldEditor('${escapeJs(field)}')">Edit</button></div>
        <div class="field-dropzone" data-field="${field}">
          ${fieldGames.map(g=>gameCardMarkup(g)).join('') || `<div class="board-empty">Drop a game here or add one from uploads.</div>`}
        </div>
      </div>`;
  }).join("");
  document.querySelectorAll(".field-dropzone").forEach(zone=>{
    bindDropzone(zone, payload=>{
      if(payload?.type==="game"){
        const game = findGame(payload.id);
        if(game){ game.field = zone.dataset.field; saveState(); renderSchedule(); renderDashboard(); renderParkMap(); }
      }
    });
  });
  document.querySelectorAll(".game-card").forEach(card=>{
    card.addEventListener("dragstart", e=>{
      const payload = {type:"game", id: card.dataset.gameId};
      dragContext = payload;
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    });
  });
  document.querySelectorAll(".assign-slot").forEach(slot=>{
    bindDropzone(slot, payload=>{
      const game = findGame(slot.dataset.gameId);
      if(!game || !payload) return;
      const role = slot.dataset.role;
      if(role.startsWith("ref") && payload.type==="ref"){ game[role] = payload.name; }
      if(role==="scoreTable" && payload.type==="volunteer"){ game.scoreTable = payload.name; }
      if(role==="volunteer" && payload.type==="volunteer"){ game.volunteer = payload.name; }
      addMessage("Assignment", `${payload.name} assigned to ${game.homeTeam} vs ${game.awayTeam} (${role}).`);
      saveState(); renderSchedule(); renderDashboard(); renderStaff();
    });
  });
  document.querySelectorAll(".assign-select").forEach(sel=>sel.addEventListener("change", e=>{
    const game=findGame(e.target.dataset.gameId);
    game[e.target.dataset.role]=e.target.value;
    saveState(); renderSchedule(); renderDashboard(); renderStaff();
  }));
}
function gameCardMarkup(g){
  const allRefs = state.refs.map(r=>r.name);
  const allVols = state.volunteers.map(v=>v.name);
  return `
    <div class="game-card ${gameCardClass(g)}" draggable="true" data-game-id="${g.id}">
      <div class="row space">
        <div class="game-title">${escapeHtml(g.homeTeam)} vs ${escapeHtml(g.awayTeam)}</div>
        <button class="secondary" onclick="openGameDialog('${g.id}')">Open</button>
      </div>
      <div class="game-meta">
        <span class="tag">${g.time}</span>
        <span class="tag">${g.division}</span>
        <span class="tag gray">${g.homeAssociation}</span>
      </div>
      <div class="scoreline">
        <div>${escapeHtml(g.homeTeam)}: ${g.homeScore}</div>
        <div>${escapeHtml(g.awayTeam)}: ${g.awayScore}</div>
      </div>
      <div class="assign-grid">
        ${assignSlotMarkup(g,"ref1","Ref 1",allRefs)}
        ${g.division==="1/2 Grade 4v4"?`<div class="assign-slot"><div class="small muted">Ref 2 not required</div></div>`:assignSlotMarkup(g,"ref2","Ref 2",allRefs)}
        ${assignSlotMarkup(g,"scoreTable","Score Table",allVols)}
        ${assignSlotMarkup(g,"volunteer","Field Support",allVols)}
      </div>
      <div class="row">
        <span class="tag ${g.verifiedHome&&g.verifiedAway?'green':'yellow'}">${g.verifiedHome&&g.verifiedAway?'Roster Verified':'Roster Pending'}</span>
        ${(g.homeWarnings+g.awayWarnings+g.homeEjections+g.awayEjections)>0?`<span class="tag red">Conduct ${g.homeWarnings+g.awayWarnings}/${g.homeEjections+g.awayEjections}</span>`:''}
        ${g.disruption?`<span class="tag red">Disruption</span>`:''}
      </div>
    </div>
  `;
}
function assignSlotMarkup(g, role, label, list){
  return `
    <div class="assign-slot" data-game-id="${g.id}" data-role="${role}">
      <div class="small muted">${label}</div>
      <div><strong>${g[role] || 'Drop here'}</strong></div>
      <select class="assign-select small" data-game-id="${g.id}" data-role="${role}">
        <option value="">Open</option>
        ${list.map(name=>`<option value="${escapeHtml(name)}" ${g[role]===name?'selected':''}>${escapeHtml(name)}</option>`).join('')}
      </select>
    </div>`;
}

function renderParkMap(){
  const el = document.getElementById("parkmap");
  el.innerHTML = `
    <div class="card">
      <div class="row space">
        <div>
          <h2>Julington Creek Plantation Park Map</h2>
          <div class="muted">Using the field map published by Fleming Island Lacrosse Club for Julington Creek Plantation Park. Drag overlays to adjust placement.</div>
        </div>
        <div class="row">
          <button class="secondary" onclick="buildFieldsPrompt()">Quick Build 1–N</button>
          <button class="secondary" onclick="addSingleFieldPrompt()">Add Field</button>
        </div>
      </div>
    </div>

    <div class="map-shell" style="margin-top:16px;">
      <div class="map-stage" id="mapStage">
        <img src="julington_map.jpg" alt="Julington Creek Plantation Park field map">
        ${state.fields.map((f,i)=>mapOverlayMarkup(f,i)).join('')}
      </div>
      <div class="map-sidebar">
        <div class="card">
          <h3>Field Controls</h3>
          <div class="muted small">Select a field from the list to rename, set type, or delete it. Schedule cards can be dragged between fields on the Schedule tab.</div>
          <div class="list" id="fieldList"></div>
        </div>
        <div class="card">
          <h3>How numbering works</h3>
          <div class="list">
            <div class="log-item">Use <strong>Quick Build 1–N</strong> to generate Field 1, Field 2, Field 3, etc.</div>
            <div class="log-item">Turn on <strong>A/B suffixes</strong> to generate Field 1A, Field 1B, Field 2A, Field 2B, etc.</div>
            <div class="log-item">Any renamed or new field is immediately available in the schedule filters and board.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  renderFieldList();
  bindMap();
}
function mapOverlayMarkup(f,i){
  return `<div class="map-overlay ${f.type?.includes('turf')?'red':''}" data-field-id="${f.id}" style="left:${f.x}%; top:${f.y}%; width:${f.w||10}%; height:${f.h||10}%;">${escapeHtml(f.name)}</div>`;
}
function bindMap(){
  const stage = document.getElementById("mapStage");
  let active = null, startX=0, startY=0, origX=0, origY=0;
  stage.querySelectorAll(".map-overlay").forEach(ov=>{
    ov.addEventListener("pointerdown", e=>{
      active = ov.dataset.fieldId;
      startX = e.clientX; startY = e.clientY;
      const fld = state.fields.find(f=>f.id===active);
      origX = fld.x; origY = fld.y;
      ov.setPointerCapture(e.pointerId);
    });
    ov.addEventListener("click", e=>{
      if(e.detail===2){ openFieldEditor(state.fields.find(f=>f.id===ov.dataset.fieldId)?.name); }
    });
  });
  stage.addEventListener("pointermove", e=>{
    if(!active) return;
    const rect = stage.getBoundingClientRect();
    const dx = ((e.clientX-startX)/rect.width)*100;
    const dy = ((e.clientY-startY)/rect.height)*100;
    const fld = state.fields.find(f=>f.id===active);
    fld.x = Math.max(0, Math.min(92, origX + dx));
    fld.y = Math.max(0, Math.min(92, origY + dy));
    saveState();
    renderParkMap();
  });
  stage.addEventListener("pointerup", ()=> active=null);
}
function renderFieldList(){
  const list = document.getElementById("fieldList");
  if(!list) return;
  list.innerHTML = state.fields.map(f=>`
    <div class="log-item">
      <div class="row space"><strong>${f.name}</strong><span class="tag">${f.type || 'field'}</span></div>
      <div class="small muted">Base ${f.base || ''}${f.suffix || ''} • ${Math.round(f.x)}%, ${Math.round(f.y)}%</div>
      <div class="row" style="margin-top:8px">
        <button class="secondary" onclick="openFieldEditor('${escapeJs(f.name)}')">Edit</button>
        <button class="danger ghost" onclick="deleteField('${escapeJs(f.id)}')">Delete</button>
      </div>
    </div>`).join('');
}
function buildFieldsPrompt(){
  const start = parseInt(prompt("Start field number", "1"), 10);
  const end = parseInt(prompt("End field number", "6"), 10);
  const ab = confirm("Add A/B suffixes?");
  if(Number.isNaN(start)||Number.isNaN(end)||end<start) return;
  const newFields = [];
  for(let n=start;n<=end;n++){
    if(ab){
      newFields.push(createFieldObject(`Field ${n}A`, n, "A"));
      newFields.push(createFieldObject(`Field ${n}B`, n, "B"));
    }else{
      newFields.push(createFieldObject(`Field ${n}`, n, ""));
    }
  }
  const existingNames = new Set(state.fields.map(f=>f.name));
  newFields.forEach(f=>{ if(!existingNames.has(f.name)) state.fields.push(f); });
  addMessage("Setup", `Quick-built fields ${start}-${end}${ab ? " with A/B suffixes":""}.`);
  saveState(); renderAll();
}
function createFieldObject(name, base, suffix){
  return {id:`fld_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, name, base:String(base), suffix:suffix||"", x:10 + (state.fields.length*3)%70, y:10 + (state.fields.length*4)%70, w:10, h:10, type:"custom"};
}
function addSingleFieldPrompt(){
  const base = prompt("Field number", "7");
  if(!base) return;
  const suffix = prompt("Suffix (leave blank, or use A/B)", "");
  const name = `Field ${base}${suffix||''}`;
  state.fields.push(createFieldObject(name, base, suffix||""));
  saveState(); renderAll();
}
function openFieldEditor(fieldName){
  const field = state.fields.find(f=>f.name===fieldName) || state.fields.find(f=>f.id===fieldName);
  if(!field) return;
  const newName = prompt("Field name", field.name);
  if(!newName) return;
  const newType = prompt("Field type", field.type || "custom");
  const w = prompt("Width %", field.w || 10);
  const h = prompt("Height %", field.h || 10);
  const oldName = field.name;
  field.name = newName;
  field.type = newType || field.type;
  field.w = parseFloat(w)||field.w;
  field.h = parseFloat(h)||field.h;
  state.games.forEach(g=>{ if(g.field===oldName) g.field = newName; });
  saveState(); renderAll();
}
function deleteField(fieldId){
  if(!confirm("Delete this field?")) return;
  const field = state.fields.find(f=>f.id===fieldId);
  state.fields = state.fields.filter(f=>f.id!==fieldId);
  if(field){
    state.games.forEach(g=>{ if(g.field===field.name) g.field = ""; });
  }
  saveState(); renderAll();
}

function renderCheckIn(){
  const el = document.getElementById("checkin");
  const games = todaysGames();
  const gameOptions = games.map(g=>`<option value="${g.id}">${g.time} • ${g.homeTeam} vs ${g.awayTeam} • ${g.field}</option>`).join("");
  const selectedGame = games[0];
  el.innerHTML = `
    <div class="card">
      <div class="row space">
        <div>
          <h2>Player Verification / Check-In</h2>
          <div class="muted">Check in each player before the game. Verify home and away rosters independently.</div>
        </div>
        <div class="row">
          <label>Game<select id="checkinGame">${gameOptions}</select></label>
          <button class="secondary" id="verifyBothBtn">Verify both sides</button>
        </div>
      </div>
    </div>
    <div id="checkinBody" style="margin-top:16px;"></div>
  `;
  document.getElementById("checkinGame").addEventListener("change", drawCheckInBody);
  document.getElementById("verifyBothBtn").addEventListener("click", ()=>{
    const g = findGame(document.getElementById("checkinGame").value);
    if(!g) return;
    g.verifiedHome = true; g.verifiedAway = true;
    getPlayers(g.homeTeam).forEach(p=>{ p.checkedIn = true; p.verified = true; });
    getPlayers(g.awayTeam).forEach(p=>{ p.checkedIn = true; p.verified = true; });
    addMessage("Roster Verification", `${g.homeTeam} and ${g.awayTeam} verified for ${g.time} on ${g.field}.`);
    saveState(); renderAll();
  });
  drawCheckInBody();
}
function drawCheckInBody(){
  const g = findGame(document.getElementById("checkinGame").value);
  const body = document.getElementById("checkinBody");
  if(!g){ body.innerHTML = `<div class="board-empty">No games on this date.</div>`; return; }
  body.innerHTML = `
    <div class="dual-pane">
      ${teamCheckinPane(g, 'home')}
      ${teamCheckinPane(g, 'away')}
    </div>`;
  body.querySelectorAll(".player-check").forEach(cb=>cb.addEventListener("change", e=>{
    const p = state.players.find(x=>x.id===e.target.dataset.playerId);
    p.checkedIn = e.target.checked;
    p.verified = e.target.checked;
    saveState(); renderDashboard(); renderRosters();
  }));
}
function teamCheckinPane(g, side){
  const teamName = side==='home' ? g.homeTeam : g.awayTeam;
  const players = getPlayers(teamName);
  const assoc = side==='home' ? g.homeAssociation : g.awayAssociation;
  const verifiedFlag = side==='home' ? 'verifiedHome' : 'verifiedAway';
  return `
    <div class="card">
      <div class="row space">
        <div>
          <h3>${teamName}</h3>
          <div class="muted">${assoc} • ${g.division}</div>
        </div>
        <div class="row">
          <span class="tag ${g[verifiedFlag]?'green':'yellow'}">${g[verifiedFlag]?'Verified':'Pending'}</span>
          <button class="secondary" onclick="verifyTeamForGame('${g.id}','${side}')">Verify Team</button>
        </div>
      </div>
      <div class="checklist" style="margin-top:12px;">
        ${players.length ? players.map(p=>`
          <label class="check-row"><input type="checkbox" class="player-check" data-player-id="${p.id}" ${p.checkedIn?'checked':''}>
            <div>
              <div><strong>${p.name}</strong></div>
              <div class="small muted">${p.usaId ? `USA #${p.usaId}` : 'No USA ID loaded'}${p.birthdate ? ` • DOB ${p.birthdate}`:''}</div>
            </div>
          </label>`).join('') : `<div class="board-empty">No roster loaded for this team yet. Upload the roster in Uploads & Setup.</div>`}
      </div>
    </div>`;
}
function verifyTeamForGame(gameId, side){
  const g = findGame(gameId);
  const team = side==='home'?g.homeTeam:g.awayTeam;
  getPlayers(team).forEach(p=>{p.checkedIn=true; p.verified=true;});
  g[side==='home'?'verifiedHome':'verifiedAway']=true;
  addMessage("Roster Verification", `${team} verified for ${g.time} on ${g.field}.`);
  saveState(); renderAll();
}

function renderRosters(){
  const el = document.getElementById("rosters");
  const associations = unique(state.teams.map(t=>t.association));
  const divisions = unique(state.teams.map(t=>t.division));
  const fields = unique(state.games.map(g=>g.field));
  el.innerHTML = `
    <div class="card">
      <div class="row space">
        <div>
          <h2>Roster Center</h2>
          <div class="muted">Browse by association, division, field, date, or team. Teams shown under a field are based on the current selected date.</div>
        </div>
        <div class="row">
          <label>Association<select id="rosterAssoc"><option value="">All</option>${associations.map(x=>`<option value="${x}">${x}</option>`).join('')}</select></label>
          <label>Division<select id="rosterDivision"><option value="">All</option>${divisions.map(x=>`<option value="${x}">${x}</option>`).join('')}</select></label>
          <label>Field<select id="rosterField"><option value="">All</option>${fields.map(x=>`<option value="${x}">${x}</option>`).join('')}</select></label>
          <label>Team<select id="rosterTeam"><option value="">All</option>${state.teams.map(t=>`<option value="${t.name}">${t.name}</option>`).join('')}</select></label>
        </div>
      </div>
    </div>
    <div id="rosterResults" style="margin-top:16px;"></div>
  `;
  ["rosterAssoc","rosterDivision","rosterField","rosterTeam"].forEach(id=>document.getElementById(id).addEventListener("change", drawRosterResults));
  drawRosterResults();
}
function drawRosterResults(){
  const assoc = document.getElementById("rosterAssoc").value;
  const div = document.getElementById("rosterDivision").value;
  const field = document.getElementById("rosterField").value;
  const teamSel = document.getElementById("rosterTeam").value;
  let teams = state.teams.slice();
  if(field){
    const teamsOnField = new Set(todaysGames().filter(g=>g.field===field).flatMap(g=>[g.homeTeam,g.awayTeam]));
    teams = teams.filter(t=>teamsOnField.has(t.name));
  }
  if(assoc) teams = teams.filter(t=>t.association===assoc);
  if(div) teams = teams.filter(t=>t.division===div);
  if(teamSel) teams = teams.filter(t=>t.name===teamSel);
  const body = document.getElementById("rosterResults");
  body.innerHTML = teams.length ? `<div class="grid cols-3">${teams.map(team=>teamRosterCard(team)).join('')}</div>` : `<div class="board-empty">No teams match those filters.</div>`;
}
function teamRosterCard(team){
  const players = getPlayers(team.name);
  return `
    <div class="card">
      <div class="row space"><h3>${team.name}</h3><span class="tag">${players.length} players</span></div>
      <div class="small muted">${team.association} • ${team.division}</div>
      <div class="small muted">${team.coach ? `Coach: ${team.coach}` : ''}</div>
      <div class="player-grid" style="margin-top:12px">
        ${players.slice(0,8).map(p=>`
          <div class="player-card ${p.checkedIn?'checked':''}">
            <div class="name">${p.name}</div>
            <div class="small muted">${p.usaId ? `USA #${p.usaId}`:'No USA ID'}</div>
            <div class="row">
              <span class="tag ${p.verified?'green':'yellow'}">${p.verified?'Verified':'Pending'}</span>
              ${(p.warnings||p.ejections)?`<span class="tag red">W:${p.warnings||0} E:${p.ejections||0}</span>`:''}
            </div>
          </div>`).join('')}
      </div>
      ${players.length>8 ? `<div class="footer-note" style="margin-top:8px;">Showing 8 of ${players.length} players.</div>` : ''}
    </div>`;
}

function renderStaff(){
  const el = document.getElementById("staff");
  const refRows = state.refs.map(r=>{
    const assigned = todaysGames().filter(g=>g.ref1===r.name || g.ref2===r.name).length;
    return `<tr><td>${r.name}</td><td>${r.level}</td><td>${r.phone}</td><td>${r.email}</td><td>${r.shirtSize}</td><td>${assigned}</td><td>${r.checkedIn?'<span class="tag green">Yes</span>':'<span class="tag gray">No</span>'}</td></tr>`;
  }).join('');
  const volRows = state.volunteers.map(v=>{
    const assigned = todaysGames().filter(g=>g.scoreTable===v.name || g.volunteer===v.name).length;
    return `<tr><td>${v.name}</td><td>${v.role}</td><td>${assigned}</td><td>${v.checkedIn?'<span class="tag green">Yes</span>':'<span class="tag gray">No</span>'}</td></tr>`;
  }).join('');
  el.innerHTML = `
    <div class="dual-pane">
      <div class="card">
        <div class="row space"><h2>Referee Development</h2><button class="secondary" onclick="quickCheckIn('ref')">Ref Self Check-In</button></div>
        <table class="table"><thead><tr><th>Name</th><th>Level</th><th>Phone</th><th>Email</th><th>TS Size</th><th>Assigned Today</th><th>Checked In</th></tr></thead><tbody>${refRows}</tbody></table>
      </div>
      <div class="card">
        <div class="row space"><h2>Volunteers</h2><button class="secondary" onclick="quickCheckIn('volunteer')">Volunteer Self Check-In</button></div>
        <table class="table"><thead><tr><th>Name</th><th>Role</th><th>Assigned Today</th><th>Checked In</th></tr></thead><tbody>${volRows}</tbody></table>
      </div>
    </div>
    <div class="card" style="margin-top:16px;">
      <h3>Assignment Quick View</h3>
      <div class="list">${todaysGames().slice(0,12).map(g=>`
        <div class="log-item">
          <div class="row space"><strong>${g.time} • ${g.field}</strong><span class="tag">${g.division}</span></div>
          <div>${g.homeTeam} vs ${g.awayTeam}</div>
          <div class="small muted">Ref 1: ${g.ref1 || 'Open'} • Ref 2: ${g.ref2 || (g.division==='1/2 Grade 4v4' ? 'N/A' : 'Open')} • Score: ${g.scoreTable || 'Open'}</div>
        </div>`).join('')}</div>
    </div>
  `;
}
function quickCheckIn(type){
  const pool = type==='ref' ? state.refs : state.volunteers;
  const name = prompt(`Enter ${type==='ref'?'referee':'volunteer'} name exactly as listed:`, pool[0]?.name || "");
  if(!name) return;
  const person = pool.find(x=>x.name.toLowerCase()===name.toLowerCase());
  if(!person){ alert("Name not found."); return; }
  person.checkedIn = true;
  addMessage("Check-In", `${person.name} checked in as ${type==='ref'?'Referee':'Volunteer'}.`);
  saveState(); renderAll();
}

function renderWeather(){
  const el = document.getElementById("weather");
  const delayActive = !!state.weather.delayEnd && new Date(state.weather.delayEnd).getTime() > Date.now();
  const msg = state.weather.messageTemplate;
  el.innerHTML = `
    <div class="${delayActive?'weather-banner delay':'weather-banner'}">
      <div class="row space"><div><div class="small">${state.weather.source}</div><div style="font-size:1.7rem;">${delayActive?'⚡ Lightning Delay Active':'All Clear'}</div></div><div>${delayActive ? `Resume at ${new Date(state.weather.delayEnd).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}` : 'Fields open'}</div></div>
    </div>
    <div class="grid cols-2" style="margin-top:16px;">
      <div class="card">
        <h2>Lightning Workflow</h2>
        <div class="notice">WeatherBug's consumer site exposes lightning alert status and color bands, but a static GitHub Pages app cannot securely poll their paid API directly. This tab gives you the same 30-minute automation flow, plus a ready spot to wire in a WeatherBug webhook later.</div>
        <div class="form-grid" style="margin-top:12px;">
          <div><label>Lightning distance (miles)<input id="lightningMiles" type="number" min="0" step="0.1" value="${state.weather.lightningMiles || ''}"></label></div>
          <div><label>Auto-rule<select id="lightningRule"><option value="10">Trigger at 10 miles</option></select></label></div>
          <div><label>Auto delay length<select id="delayMinutes"><option value="30">30 minutes</option></select></label></div>
          <div><label>Actions<br><button type="button" class="danger" onclick="handleLightningTrigger()">Trigger Delay</button></label></div>
        </div>
        <div class="row" style="margin-top:12px">
          <button class="success" onclick="resumePlay()">Resume Play</button>
          <button class="secondary" onclick="copyDelayMessage()">Copy Delay Message</button>
          <button class="secondary" onclick="shareDelayMessage()">Share Delay Message</button>
        </div>
      </div>
      <div class="card">
        <h2>Automated Message Preview</h2>
        <textarea id="delayMessageBox">${msg}</textarea>
        <div class="footer-note" style="margin-top:8px;">On a static site, “automated” means the message is generated instantly and ready to copy/share. Full SMS automation needs a backend or service like Twilio.</div>
      </div>
    </div>
    <div class="card" style="margin-top:16px;">
      <h3>Operations Log</h3>
      <div class="log">${commsLatest(20).map(m=>`
        <div class="log-item"><div class="small muted">${new Date(m.time).toLocaleString()} • ${m.type}</div><div>${m.text}</div></div>`).join('')}</div>
    </div>
  `;
}
function triggerLightningPrompt(){
  const dist = prompt("Lightning distance in miles", "8");
  if(dist===null) return;
  document.getElementById("lightningMiles")?.setAttribute("value", dist);
  state.weather.lightningMiles = dist;
  handleLightningTrigger();
}
function handleLightningTrigger(){
  const input = document.getElementById("lightningMiles");
  const miles = parseFloat(input ? input.value : (state.weather.lightningMiles || "999"));
  state.weather.lightningMiles = miles;
  if(Number.isNaN(miles)) return alert("Enter a valid lightning distance.");
  if(miles <= 10){
    const end = new Date(Date.now() + 30*60000);
    state.weather.status = "Lightning Delay";
    state.weather.delayEnd = end.toISOString();
    const message = document.getElementById("delayMessageBox")?.value || state.weather.messageTemplate;
    addMessage("Weather Delay", `${message.replace(/\n/g,' ')}`);
    todaysGames().forEach(g=>g.status='Delayed');
    saveState(); renderAll();
  } else {
    addMessage("Weather", `Lightning monitored at ${miles} miles. No automatic delay triggered.`);
    saveState(); renderAll();
  }
}
function resumePlay(){
  state.weather.delayEnd = "";
  state.weather.status = "Clear";
  todaysGames().forEach(g=>{ if(g.status==='Delayed') g.status='Scheduled'; });
  addMessage("Weather", "All-clear issued. Play may resume.");
  saveState(); renderAll();
}
function copyDelayMessage(){
  const text = document.getElementById("delayMessageBox").value;
  navigator.clipboard?.writeText(text);
  addMessage("Communications", "Lightning delay message copied to clipboard.");
  saveState(); renderAll();
}
async function shareDelayMessage(){
  const text = document.getElementById("delayMessageBox").value;
  if(navigator.share){
    try{ await navigator.share({title:"LeagueOps Live Delay Alert", text}); }catch(e){}
  }else{
    copyDelayMessage();
  }
}

function renderUploads(){
  const el = document.getElementById("uploads");
  el.innerHTML = `
    <div class="grid cols-2">
      <div class="card">
        <h2>Roster Uploader</h2>
        <div class="muted">Upload Excel or CSV roster files. The app will look for common columns like Team, Div, Firstname, Lastname, USA Lacrosse Number, Birthdate, and Email.</div>
        <input id="rosterUpload" type="file" accept=".xlsx,.xls,.csv" multiple style="margin-top:12px;">
        <div class="footer-note">Supports NFYLL roster templates, USA Lacrosse exports, and simple CSVs.</div>
      </div>
      <div class="card">
        <h2>Schedule Uploader</h2>
        <div class="muted">Upload a TourneyMachine/NFYLL CSV or Excel file with Game Date, Start Time, Division, Location, Team 1, and Team 2.</div>
        <input id="scheduleUpload" type="file" accept=".xlsx,.xls,.csv" multiple style="margin-top:12px;">
        <div class="footer-note">Uploaded games are grouped by date automatically and become visible on the Schedule board and Park Map.</div>
      </div>
    </div>
    <div class="grid cols-2" style="margin-top:16px;">
      <div class="card">
        <h2>Field Setup</h2>
        <div class="form-grid">
          <div><label>Start #<input id="fieldStart" type="number" value="1"></label></div>
          <div><label>End #<input id="fieldEnd" type="number" value="6"></label></div>
          <div><label>A/B suffixes<select id="fieldAB"><option value="no">No</option><option value="yes">Yes</option></select></label></div>
          <div><label>Type<select id="fieldType"><option>custom</option><option>10v10</option><option>7v7</option><option>modified</option><option>turf</option></select></label></div>
        </div>
        <div class="row" style="margin-top:12px">
          <button onclick="runFieldBuilder()">Build Fields</button>
          <button class="secondary" onclick="addSingleFieldPrompt()">Add One Field</button>
        </div>
      </div>
      <div class="card">
        <h2>Data Tools</h2>
        <div class="row">
          <button onclick="exportBackup()">Export Backup</button>
          <button class="secondary" onclick="importBackupPrompt()">Import Backup</button>
        </div>
        <div class="footer-note" style="margin-top:10px;">This static version stores everything in your browser. Export regularly if you’re editing live on game day.</div>
      </div>
    </div>
  `;
  document.getElementById("rosterUpload").addEventListener("change", e=>handleRosterFiles(e.target.files));
  document.getElementById("scheduleUpload").addEventListener("change", e=>handleScheduleFiles(e.target.files));
}
function runFieldBuilder(){
  const start = parseInt(document.getElementById("fieldStart").value,10);
  const end = parseInt(document.getElementById("fieldEnd").value,10);
  const ab = document.getElementById("fieldAB").value === "yes";
  const type = document.getElementById("fieldType").value;
  if(Number.isNaN(start)||Number.isNaN(end)||end<start){ return alert("Invalid field range."); }
  for(let n=start;n<=end;n++){
    const names = ab ? [`Field ${n}A`,`Field ${n}B`] : [`Field ${n}`];
    names.forEach(name=>{
      if(!state.fields.find(f=>f.name===name)){
        const suffix = name.endsWith("A")?"A":name.endsWith("B")?"B":"";
        const f = createFieldObject(name, n, suffix);
        f.type = type;
        state.fields.push(f);
      }
    });
  }
  addMessage("Setup", `Built field set ${start}-${end}${ab?' with A/B suffixes':''}.`);
  saveState(); renderAll();
}
function exportBackup(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `leagueops-live-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}
function importBackupPrompt(){
  const input = document.createElement("input");
  input.type = "file"; input.accept = ".json";
  input.onchange = async () => {
    const file = input.files[0];
    if(!file) return;
    const text = await file.text();
    try{
      state = JSON.parse(text);
      saveState(); renderAll();
    }catch(e){ alert("Invalid backup file."); }
  };
  input.click();
}
async function readWorkbook(file){
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, {type:"array"});
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, {defval:""});
}
function normalizeColName(k){ return String(k).trim().toLowerCase(); }
function teamAssocFromName(teamName){
  const t = (teamName||"").toLowerCase();
  if(t.includes("jax lax")) return "Jax Lax";
  if(t.includes("riptide")) return "Ponte Vedra Riptide";
  if(t.includes("creeks")) return "Creeks Crocs - CAA";
  if(t.includes("redhawks")) return "Gainesville RedHawks";
  if(t.includes("bulldog")) return "Bulldogs LC";
  if(t.includes("hammerhead")) return "Hammerhead Lacrosse";
  if(t.includes("bold city")) return "Bold City Eagles Lacrosse Club";
  if(t.includes("fleming")) return "Fleming Island";
  return "";
}
function inferDivisionFromTeam(team){
  const t = (team||"").toLowerCase();
  if(t.includes("8u")) return "1/2 Grade 4v4";
  if(t.includes("10u") || t.includes("3/4")) return "3/4 Grade 7V7";
  if(t.includes("12u") || t.includes("5/6") || t.includes("bulldog") || t.includes("hammerhead") || t.includes("bold city")) return "5/6 Grade 10v10";
  if(t.includes("14u") || t.includes("7/8")) return "7/8 Grade 10V10";
  return "";
}
async function handleRosterFiles(fileList){
  for(const file of fileList){
    const rows = await readWorkbook(file);
    let added = 0;
    rows.forEach(row=>{
      const norm = {};
      Object.keys(row).forEach(k=>norm[normalizeColName(k)] = row[k]);
      const team = String(norm["team"] || norm["team name"] || "").trim();
      const first = String(norm["firstname"] || norm["first"] || norm["first name"] || "").trim();
      const last = String(norm["lastname"] || norm["last"] || norm["last name"] || "").trim();
      if(!team || !first || !last) return;
      const division = String(norm["div"] || norm["division"] || inferDivisionFromTeam(team)).trim();
      const association = teamAssocFromName(team);
      const player = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        team, association, division,
        firstName:first, lastName:last, name:`${first} ${last}`.trim(),
        email: String(norm["email"] || "").trim(),
        usaId: String(norm["usa lacrosse number"] || norm["usa lacrosse member id"] || "").trim(),
        birthdate: String(norm["birthdate"] || "").trim(),
        zipcode: String(norm["zipcode"] || norm["zip"] || "").trim(),
        verified:false, checkedIn:false, warnings:0, ejections:0, source:file.name
      };
      state.players.push(player);
      if(!state.teams.find(t=>t.name===team)){
        state.teams.push({name:team, association, division, coach:"", coachEmail:"", coachPhone:"", playerCount:0});
      }
      added++;
    });
    addMessage("Upload", `${file.name} loaded ${added} roster rows.`);
  }
  state.teams.forEach(t=> t.playerCount = getPlayers(t.name).length);
  saveState(); renderAll();
}
async function handleScheduleFiles(fileList){
  for(const file of fileList){
    const rows = await readWorkbook(file);
    let added=0;
    rows.forEach(row=>{
      const norm={}; Object.keys(row).forEach(k=>norm[normalizeColName(k)] = row[k]);
      const dateRaw = norm["game date"] || norm["date"];
      const time = String(norm["start time"] || norm["time"] || "").trim();
      const division = String(norm["division"] || "").trim();
      const loc = String(norm["location"] || norm["field"] || "").trim();
      const homeTeam = String(norm["team 1"] || norm["home"] || norm["home team"] || "").trim();
      const awayTeam = String(norm["team 2"] || norm["away"] || norm["away team"] || "").trim();
      if(!dateRaw || !homeTeam || !awayTeam) return;
      let date = "";
      if(typeof dateRaw === "number"){
        const d = XLSX.SSF.parse_date_code(dateRaw);
        date = `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
      }else{
        const parsed = new Date(dateRaw);
        if(!isNaN(parsed.getTime())) date = parsed.toISOString().slice(0,10);
        else{
          const parts = String(dateRaw).split(/[\/-]/);
          if(parts.length===3) date = `${parts[2].padStart(4,'20')}-${parts[0].padStart(2,'0')}-${parts[1].padStart(2,'0')}`;
        }
      }
      const fieldMatch = loc.match(/Field\s+([0-9A-Za-z]+)/i);
      const field = fieldMatch ? `Field ${fieldMatch[1]}` : loc || "";
      state.games.push({
        id:`g_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        date, time, division, pool:String(norm["pool"]||"").trim(), location:loc, field,
        homeTeam, awayTeam, homeAssociation:teamAssocFromName(homeTeam), awayAssociation:teamAssocFromName(awayTeam),
        homeScore:0, awayScore:0, ref1:"", ref2:"", scoreTable:"", volunteer:"",
        status:"Scheduled", homeWarnings:0, awayWarnings:0, homeEjections:0, awayEjections:0, disruption:false, disruptionNotes:"",
        verifiedHome:false, verifiedAway:false
      });
      added++;
    });
    addMessage("Upload", `${file.name} loaded ${added} schedule rows.`);
  }
  state.selectedDate = getDates()[0];
  saveState(); renderAll();
}

function openGameDialog(gameId){
  const g = findGame(gameId);
  if(!g) return;
  const dlg = document.getElementById("gameDialog");
  document.getElementById("gameDialogTitle").textContent = `${g.homeTeam} vs ${g.awayTeam}`;
  document.getElementById("gameDialogBody").innerHTML = `
    <div style="padding:16px; display:grid; gap:16px;">
      <div class="form-grid">
        <div><label>Home Score<input id="gdHomeScore" type="number" min="0" value="${g.homeScore}"></label></div>
        <div><label>Away Score<input id="gdAwayScore" type="number" min="0" value="${g.awayScore}"></label></div>
        <div><label>Home Warnings<input id="gdHomeWarn" type="number" min="0" value="${g.homeWarnings||0}"></label></div>
        <div><label>Away Warnings<input id="gdAwayWarn" type="number" min="0" value="${g.awayWarnings||0}"></label></div>
        <div><label>Home Ejections<input id="gdHomeEject" type="number" min="0" value="${g.homeEjections||0}"></label></div>
        <div><label>Away Ejections<input id="gdAwayEject" type="number" min="0" value="${g.awayEjections||0}"></label></div>
        <div><label>Field<select id="gdField">${boardFieldNames(state.games).map(f=>`<option value="${f}" ${g.field===f?'selected':''}>${f}</option>`).join('')}</select></label></div>
        <div><label>Status<select id="gdStatus">${["Scheduled","In Progress","Delayed","Final"].map(s=>`<option ${g.status===s?'selected':''}>${s}</option>`).join('')}</select></label></div>
      </div>
      <div class="split">
        <label><input id="gdDisruption" type="checkbox" ${g.disruption?'checked':''}> Fight / disruption reported</label>
        <button class="secondary" type="button" onclick="verifyTeamForGame('${g.id}','home'); verifyTeamForGame('${g.id}','away'); document.getElementById('gameDialog').close();">Verify Both Rosters</button>
      </div>
      <div><label>Disruption Notes<textarea id="gdNotes">${escapeHtml(g.disruptionNotes||'')}</textarea></label></div>
      <div class="row" style="justify-content:flex-end;">
        <button type="button" onclick="saveGameDialog('${g.id}')">Save Game</button>
      </div>
    </div>
  `;
  dlg.showModal();
}
function saveGameDialog(gameId){
  const g = findGame(gameId);
  g.homeScore = parseInt(document.getElementById("gdHomeScore").value || "0",10);
  g.awayScore = parseInt(document.getElementById("gdAwayScore").value || "0",10);
  g.homeWarnings = parseInt(document.getElementById("gdHomeWarn").value || "0",10);
  g.awayWarnings = parseInt(document.getElementById("gdAwayWarn").value || "0",10);
  g.homeEjections = parseInt(document.getElementById("gdHomeEject").value || "0",10);
  g.awayEjections = parseInt(document.getElementById("gdAwayEject").value || "0",10);
  g.field = document.getElementById("gdField").value;
  g.status = document.getElementById("gdStatus").value;
  g.disruption = document.getElementById("gdDisruption").checked;
  g.disruptionNotes = document.getElementById("gdNotes").value;
  addMessage("Game Update", `${g.homeTeam} vs ${g.awayTeam} updated: ${g.homeScore}-${g.awayScore}${g.disruption ? " with disruption logged" : ""}.`);
  saveState(); document.getElementById("gameDialog").close(); renderAll();
}

function quickTrainerStatus(status){
  state.trainer.status = status;
  addMessage("Trainer", `Trainer marked ${status}.`);
  saveState(); renderDashboard();
}
function addMessage(type, text){
  state.messages.unshift({time:new Date().toISOString(), type, text});
  state.messages = state.messages.slice(0,200);
}
function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function escapeJs(s){ return String(s??"").replace(/\\/g,"\\\\").replace(/'/g,"\\'"); }

init();
window.openGameDialog = openGameDialog;
window.saveGameDialog = saveGameDialog;
window.quickTrainerStatus = quickTrainerStatus;
window.triggerLightningPrompt = triggerLightningPrompt;
window.handleLightningTrigger = handleLightningTrigger;
window.resumePlay = resumePlay;
window.copyDelayMessage = copyDelayMessage;
window.shareDelayMessage = shareDelayMessage;
window.quickCheckIn = quickCheckIn;
window.verifyTeamForGame = verifyTeamForGame;
window.buildFieldsPrompt = buildFieldsPrompt;
window.addSingleFieldPrompt = addSingleFieldPrompt;
window.openFieldEditor = openFieldEditor;
window.deleteField = deleteField;
window.exportBackup = exportBackup;
window.importBackupPrompt = importBackupPrompt;
window.runFieldBuilder = runFieldBuilder;


function renderScheduler(){
  const el = document.getElementById("scheduler");
  const rules = state.schedulingRules || {
    minimumRestMinutes: 30,
    preferredRestMinutes: 60,
    maxRestMinutes: 120,
    allowProgramMatchups: false,
    forcedDoubleHeaderPrograms: ["Ponte Vedra Riptide"],
    restrictedFirstGamePrograms: []
  };
  const divisions = unique(state.games.map(g=>g.division)).map(div=>({
    divisionName: div,
    gameLength: div.includes('1/2') ? 45 : 60,
    startInterval: div.includes('1/2') ? 45 : 60,
    adultRefsRequired: div.includes('5/6') || div.includes('7/8') ? 2 : (div.includes('3/4') ? 1 : 0),
    youthRefsRequired: div.includes('1/2') ? 2 : (div.includes('3/4') ? 1 : 0)
  }));
  const fieldRows = state.fields.map(f=>`<tr><td>${f.name}</td><td>${f.type||''}</td><td>${unique(state.games.filter(g=>g.field===f.name).map(g=>g.division)).join(', ') || 'Open'}</td></tr>`).join('');
  const summary = `<div class="grid cols-4">
    <div class="card kpi"><div class="small muted">Teams</div><div class="value">${state.teams.length}</div><div class="muted">Loaded into scheduling pool</div></div>
    <div class="card kpi"><div class="small muted">Games</div><div class="value">${state.games.length}</div><div class="muted">Current master schedule</div></div>
    <div class="card kpi"><div class="small muted">Fields</div><div class="value">${state.fields.length}</div><div class="muted">Mapped and editable</div></div>
    <div class="card kpi"><div class="small muted">Divisions</div><div class="value">${divisions.length}</div><div class="muted">Variable-driven setup</div></div>
  </div>`;
  const codeBlock = (txt)=>`<pre class="code-block">${txt.replace(/</g,'&lt;')}</pre>`;
  const steps = [
    ['1. Input Data', codeBlock(`Team {
  teamID
  teamName
  programName
  division
}

Division {
  divisionName
  gameLength
  startInterval
  adultRefsRequired
  youthRefsRequired
}

Field {
  fieldID
  fieldName
  supportedDivisions[]
}

TimeSlot {
  startTime
  endTime
}

SchedulingRules {
  minimumRestMinutes
  preferredRestMinutes
  maxRestMinutes
  allowProgramMatchups
  forcedDoubleHeaderPrograms[]
  restrictedFirstGamePrograms[]
}

WeeklyOverrides {
  unavailableTeams[]
  forcedMatchups[]
}`)],
    ['2. Scheduling Process', `<ol class="logic-list">
      <li><strong>Load Teams by Division</strong> and group only within the same division.</li>
      <li><strong>Remove Unavailable Teams</strong> from the weekly pool before pairing begins.</li>
      <li><strong>Create Matchup Pool</strong> enforcing same-division and same-program restrictions.</li>
      <li><strong>Prioritize Special Matchups</strong> such as forced programs or early-slot priority teams.</li>
      <li><strong>Assign Double Headers</strong> only when odd team counts require them, using preferred gap logic.</li>
      <li><strong>Assign Fields and Times</strong> from valid slots and supported fields.</li>
      <li><strong>Validate Rest Periods</strong> against minimum, preferred, and maximum rest windows.</li>
      <li><strong>Validate Double Headers</strong> so only approved teams receive them.</li>
      <li><strong>Run Final Validation</strong> before publish; rebuild any failed game.</li>
      <li><strong>Calculate Referee Requirements</strong> by division, field, and time slot.</li>
    </ol>`],
    ['3. Rule Snapshot', `<div class="grid cols-3">
      <div class="card"><div class="small muted">Minimum Rest</div><div class="value">${rules.minimumRestMinutes}</div><div class="muted">minutes</div></div>
      <div class="card"><div class="small muted">Preferred Rest</div><div class="value">${rules.preferredRestMinutes}</div><div class="muted">minutes</div></div>
      <div class="card"><div class="small muted">Max Rest</div><div class="value">${rules.maxRestMinutes}</div><div class="muted">minutes</div></div>
    </div>
    <div class="card" style="margin-top:12px">
      <div><strong>Allow Program Matchups:</strong> ${rules.allowProgramMatchups ? 'Yes' : 'No'}</div>
      <div><strong>Forced Double Header Programs:</strong> ${(rules.forcedDoubleHeaderPrograms||[]).join(', ') || 'None'}</div>
      <div><strong>Restricted First Game Programs:</strong> ${(rules.restrictedFirstGamePrograms||[]).join(', ') || 'None'}</div>
    </div>`],
    ['4. Active Divisions', `<table class="data-table"><thead><tr><th>Division</th><th>Game Length</th><th>Start Interval</th><th>Adult Refs</th><th>Youth Refs</th></tr></thead><tbody>${divisions.map(d=>`<tr><td>${d.divisionName}</td><td>${d.gameLength} min</td><td>${d.startInterval} min</td><td>${d.adultRefsRequired}</td><td>${d.youthRefsRequired}</td></tr>`).join('')}</tbody></table>`],
    ['5. Active Fields', `<table class="data-table"><thead><tr><th>Field</th><th>Type</th><th>Supported Divisions</th></tr></thead><tbody>${fieldRows}</tbody></table>`],
    ['6. Validation Checklist', `<div class="check-grid">
      <div class="check-item">✔ same division</div>
      <div class="check-item">✔ no restricted program matchups</div>
      <div class="check-item">✔ rest period satisfied</div>
      <div class="check-item">✔ field available</div>
      <div class="check-item">✔ time slot available</div>
      <div class="check-item">✔ double headers allowed</div>
    </div>`],
    ['7. Referee Metrics', `<div class="card"><div class="muted">Metrics are generated per field, per time slot, and per division. Use this with the Refs & Volunteers tab to assign adult and youth coverage after the schedule is built.</div>${codeBlock(`RefRequirement
{
  division
  adultRefs
  youthRefs
}`)}</div>`],
    ['8. Export Outputs', `<div class="check-grid">
      <div class="check-item">Master Schedule</div>
      <div class="check-item">Referee Schedule</div>
      <div class="check-item">Program Game Summary</div>
      <div class="check-item">Excel / CSV / Web dashboard / Game Day field view</div>
    </div>`],
    ['9. Recommended Optimizer', `<div class="notice">Add a schedule optimizer that evaluates thousands of possible schedules and picks the best one using these goals: minimize double headers, minimize rest time violations, balance field usage, and balance early vs late games.</div>`]
  ];

  el.innerHTML = `
    <div class="card">
      <div class="row space">
        <div>
          <h2>NFYLL Automated Scheduling Engine</h2>
          <div class="muted">Variable-driven scheduling logic for LeagueOps Live. This pillar documents the rules your scheduling engine should follow each season.</div>
        </div>
        <button class="secondary" onclick="activeTab='uploads';renderTabs();renderPane('uploads');document.getElementById('uploads').scrollIntoView({behavior:'smooth'});">Go to Uploads & Setup</button>
      </div>
    </div>
    ${summary}
    <div class="stack" style="margin-top:16px">
      ${steps.map(([title,body],idx)=>`<details class="card accordion" ${idx===0?'open':''}><summary><strong>${title}</strong></summary><div style="margin-top:12px">${body}</div></details>`).join('')}
    </div>
  `;
}
