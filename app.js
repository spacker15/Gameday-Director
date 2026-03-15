
const STORAGE_KEY = 'leagueops-live-v5-2-clean-reset';
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const fmtTime = () => new Date().toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
const uid = (p='id') => `${p}-${Math.random().toString(36).slice(2,9)}`;

const DEFAULT_VOLUNTEER_ROLES = ['Score Table','Clock','Field Marshal'];
let state = loadState();
let selectedTeamId = state.teams[0]?.id || null;
let selectedField = state.fields[0]?.name || null;
let selectedGameId = state.games[0]?.id || null;
let scheduleDateFilter = 'ALL';
let scheduleDivisionFilter = 'ALL';
let scheduleAssociationFilter = 'ALL';
let scheduleFieldFilter = 'ALL';
let rosterDivisionFilter = 'ALL';
let rosterAssociationFilter = 'ALL';
let mapInteraction = null;

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){ try { return JSON.parse(raw); } catch(e){} }
  const seed = deepClone(window.__SEED__);
  seed.games = (seed.games || []).map(g => ({...g, id: g.id || uid('game')}));
  seed.fields = (seed.fields || []).map(f => ({...f, r:f.r||0}));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function addMessage(type, text){ state.messages.unshift({time: fmtTime(), type, text}); state.messages = state.messages.slice(0,120); saveState(); render(); }
function getTeamByName(name){ return state.teams.find(t => t.name.toLowerCase()===String(name).toLowerCase()); }
function getTeam(teamId){ return state.teams.find(t => t.id===teamId); }
function getField(name){ return state.fields.find(f => f.name===name); }
function gameTeams(game){ return {home: getTeamByName(game.home), away: getTeamByName(game.away)}; }
function openStaffingCount(){ return state.games.reduce((n,g)=> n + ['ref1','ref2','scoreTable','clock'].filter(k=>!g[k]).length,0); }
function totalVerifiedPlayers(){ return state.teams.reduce((n,t)=> n + t.players.filter(p=>p.status==='Checked In').length, 0); }
function totalWarnings(){ return state.games.reduce((n,g)=>n + Number(g.homeWarnings||0) + Number(g.awayWarnings||0),0); }
function totalEjections(){ return state.games.reduce((n,g)=>n + Number(g.homeEjections||0) + Number(g.awayEjections||0),0); }
function gameStatus(game){
  if(state.weather.activeDelay) return 'delayed';
  if(game.status==='Completed') return 'completed';
  if(game.status==='In Progress') return 'in-progress';
  if(!game.ref1 || !game.ref2 || !game.scoreTable) return 'missing-staff';
  if(!game.homeVerified || !game.awayVerified) return 'roster-issue';
  return 'ready';
}
function uniqueGameDates(){
  return [...new Set(state.games.map(g=>String(g.date||'').trim()).filter(Boolean))].sort((a,b)=>new Date(a)-new Date(b));
}
function uniqueDivisions(){
  const fromGames = state.games.map(g=>String(g.division||'').trim()).filter(Boolean);
  const fromTeams = state.teams.map(t=>String(t.division||'').trim()).filter(Boolean);
  return [...new Set([...fromGames, ...fromTeams])].sort((a,b)=>a.localeCompare(b));
}
function inferAssociationFromName(name=''){
  const n = String(name||'').trim();
  const lowered = n.toLowerCase();
  if(lowered.includes('jax lax')) return 'Jax Lax';
  if(lowered.includes('riptide')) return 'Ponte Vedra Riptide';
  if(lowered.includes('creeks')) return 'Creeks Crocs - CAA';
  if(lowered.includes('bulldog')) return 'Bulldogs LC';
  if(lowered.includes('hammerhead')) return 'Hammerhead Lacrosse';
  if(lowered.includes('redhawk')) return 'Gainesville RedHawks';
  if(lowered.includes('eagles')) return 'Bold City Eagles Lacrosse Club';
  if(lowered.includes('fleming')) return 'Fleming Island';
  return n.replace(/^\d+U\s+/i,'').replace(/^\d+\/\d+\s+/,'').trim() || 'Unassigned';
}
function teamAssociation(team){
  if(!team) return 'Unassigned';
  return String(team.program||'').trim() || inferAssociationFromName(team.name);
}
function gameAssociation(game){
  const home = getTeamByName(game.home);
  const away = getTeamByName(game.away);
  return teamAssociation(home || away || {name: game.home || game.away});
}
function uniqueAssociations(){
  const vals = state.teams.map(teamAssociation).concat(state.games.map(gameAssociation)).filter(Boolean);
  return [...new Set(vals)].sort((a,b)=>a.localeCompare(b));
}
function uniqueFields(){
  const vals = state.games.map(g=>String(g.field||'').trim()).concat(state.fields.map(f=>String(f.name||'').trim())).filter(Boolean);
  return [...new Set(vals)].sort((a,b)=>a.localeCompare(b));
}

function fieldNameFromParts(number, suffix=''){
  const n = String(number||'').trim();
  const suf = String(suffix||'').trim().toUpperCase();
  return `Field ${n}${suf}`.trim();
}
function defaultFieldPlacement(index){
  const cols = 3;
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {x: 18 + col*28, y: 18 + row*24, w: 16, h: 10, r:0};
}
function sortFieldsInPlace(){
  state.fields.sort((a,b)=>{
    const pa = parseFieldName(a.name), pb = parseFieldName(b.name);
    if(pa.num !== pb.num) return pa.num - pb.num;
    return pa.suffix.localeCompare(pb.suffix);
  });
}
function parseFieldName(name=''){
  const m = String(name).match(/field\s*(\d+)\s*([A-Za-z]?)/i);
  return {num: Number(m?.[1]||9999), suffix: String(m?.[2]||'').toUpperCase()};
}
function upsertFieldByParts(number, suffix='', type='Full Field'){
  const name = fieldNameFromParts(number, suffix);
  let field = state.fields.find(f=>String(f.name).toLowerCase()===name.toLowerCase());
  if(!field){
    const placement = defaultFieldPlacement(state.fields.length);
    field = {id: uid('field'), name, type, ...placement};
    state.fields.push(field);
  } else {
    field.name = name;
    if(type) field.type = type;
  }
  sortFieldsInPlace();
  selectedField = field.name;
  return field;
}
function buildSequentialFields(startNum, endNum, suffixMode='none', type='Full Field'){
  const created = [];
  for(let i=startNum;i<=endNum;i++){
    if(suffixMode==='ab'){
      created.push(upsertFieldByParts(i,'A',type));
      created.push(upsertFieldByParts(i,'B',type));
    } else {
      created.push(upsertFieldByParts(i,'',type));
    }
  }
  return created;
}
function filteredGames(){
  return state.games.filter(g => 
    (scheduleDateFilter==='ALL' || String(g.date||'')===scheduleDateFilter) &&
    (scheduleDivisionFilter==='ALL' || String(g.division||'')===scheduleDivisionFilter) &&
    (scheduleAssociationFilter==='ALL' || gameAssociation(g)===scheduleAssociationFilter) &&
    (scheduleFieldFilter==='ALL' || String(g.field||'')===scheduleFieldFilter)
  );
}
function filteredTeams(){
  return state.teams.filter(t => 
    (rosterDivisionFilter==='ALL' || String(t.division||'')===rosterDivisionFilter) &&
    (rosterAssociationFilter==='ALL' || teamAssociation(t)===rosterAssociationFilter)
  );
}
function tabSetup(){ 
  $$('#mainNav button').forEach(btn=> btn.onclick = ()=> switchTab(btn.dataset.tab));
}
function switchTab(id){ $$('#mainNav button').forEach(b=>b.classList.toggle('active', b.dataset.tab===id)); $$('.tab').forEach(t=>t.classList.toggle('active', t.id===id)); }

function render(){ renderDashboard(); renderSchedule(); renderParkMap(); renderCheckin(); renderRosters(); renderStaffing(); renderWeather(); renderAdmin(); }

function renderDashboard(){
  const el = $('#dashboard');
  const latestMsgs = state.messages.slice(0,5).map(m=>`<div class="item"><strong>${m.time}</strong>${m.text}</div>`).join('') || '<div class="empty">No messages yet.</div>';
  const gaps = state.games.filter(g => ['ref1','ref2','scoreTable'].some(k=>!g[k])).slice(0,6).map(g=>`<div class="item"><strong>${g.time} • ${g.home} vs ${g.away}</strong>${['ref1','ref2','scoreTable'].filter(k=>!g[k]).join(', ')} missing</div>`).join('') || '<div class="empty">No open staffing gaps.</div>';
  const incidents = state.games.filter(g=>g.fight || g.homeWarnings || g.awayWarnings || g.homeEjections || g.awayEjections).slice(0,6).map(g=>`<div class="item"><strong>${g.home} vs ${g.away}</strong>Warnings ${g.homeWarnings||0}-${g.awayWarnings||0} • Ejections ${g.homeEjections||0}-${g.awayEjections||0}${g.fight ? ' • Fight/disruption flagged' : ''}</div>`).join('') || '<div class="empty">No conduct issues logged.</div>';
  const lightningBanner = state.weather.activeDelay ? `<div class="alert-banner red">⚡ Lightning delay active until ${state.weather.delayUntil}. ${state.weather.note}</div>` : `<div class="alert-banner green">Weather clear. No active delay.</div>`;
  const dateButtons = uniqueGameDates().slice(0,8).map(d=>`<button class="chip ${scheduleDateFilter===d?'active':''}" data-dash-date="${escapeHtml(d)}">${escapeHtml(d)}</button>`).join('') || '<span class="muted">No dates loaded yet.</span>';
  el.innerHTML = `
    <div class="grid cols-3">
      <div class="card hero">
        <div class="section-title"><div><div class="muted small">Central trainer coverage</div><h2>${state.trainer.name || 'Unassigned'}</h2></div><span class="badge ${state.trainer.status==='Responding'?'red':'green'}">${state.trainer.status}</span></div>
        <div class="muted">${state.trainer.location || 'Set location'} • ${state.meta.venue}</div>
        <div class="actions"><button class="btn" id="trainerEditBtn">Update Trainer</button><button class="btn ghost" id="trainerRespondBtn">Mark Responding</button></div>
      </div>
      <div class="card hero">
        <div class="section-title"><div><div class="muted small">Lightning automation</div><h2>${state.weather.activeDelay ? '30-minute delay running' : 'Lightning automation armed'}</h2></div></div>
        ${lightningBanner}
        <div class="actions"><button class="btn red" id="simulateLightningBtn">Trigger Lightning Alert</button><button class="btn ghost" id="clearDelayBtn">Resume Play</button></div>
      </div>
      <div class="card hero">
        <div class="section-title"><div><div class="muted small">League snapshot</div><h2>Game day KPIs</h2></div></div>
        <div class="kpis">
          <div class="kpi"><div class="label">Games</div><div class="value">${state.games.length}</div></div>
          <div class="kpi"><div class="label">Teams</div><div class="value">${state.teams.length}</div></div>
          <div class="kpi"><div class="label">Refs</div><div class="value">${state.refs.length}</div></div>
          <div class="kpi"><div class="label">Verified</div><div class="value">${totalVerifiedPlayers()}</div></div>
          <div class="kpi"><div class="label">Warnings</div><div class="value">${totalWarnings()}</div></div>
          <div class="kpi"><div class="label">Ejections</div><div class="value">${totalEjections()}</div></div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="section-title"><div><h3>Look at the day by date</h3><div class="muted">Jump into the schedule board already filtered by game day.</div></div><button class="btn ghost" id="viewAllDatesBtn">View all</button></div>
      <div class="chip-row">${dateButtons}</div>
    </div>
    <div class="grid cols-2" style="margin-top:16px">
      <div class="card"><div class="section-title"><div><h3>Today at a glance</h3><div class="muted">Open staffing, live issues, and board health.</div></div></div><div class="kpis"><div class="kpi"><div class="label">Open staffing slots</div><div class="value">${openStaffingCount()}</div></div><div class="kpi"><div class="label">Checked-in players</div><div class="value">${totalVerifiedPlayers()}</div></div><div class="kpi"><div class="label">Incidents</div><div class="value">${state.injuries.length}</div></div><div class="kpi"><div class="label">Messages</div><div class="value">${state.messages.length}</div></div><div class="kpi"><div class="label">Refs checked in</div><div class="value">${state.checkins.filter(c=>c.role==='Referee').length}</div></div><div class="kpi"><div class="label">Volunteers in</div><div class="value">${state.checkins.filter(c=>c.role==='Volunteer').length}</div></div></div></div>
      <div class="card"><div class="section-title"><div><h3>Recommended next actions</h3><div class="muted">Built to make game day simpler.</div></div></div><div class="list"><div class="item"><strong>1. Filter the schedule by date</strong>Use the date, association, division, and field filters to focus on exactly what you need.</div><div class="item"><strong>2. Check teams by association or division</strong>The roster center now groups and filters teams by association and division.</div><div class="item"><strong>3. Fine-tune the field layout</strong>Use the Park Map editor to move, resize, and rotate field rectangles directly on the map.</div></div></div>
    </div>
    <div class="grid cols-3" style="margin-top:16px">
      <div class="card"><div class="section-title"><h3>Open staffing gaps</h3></div><div class="list">${gaps}</div></div>
      <div class="card"><div class="section-title"><h3>Latest communications</h3></div><div class="list">${latestMsgs}</div></div>
      <div class="card"><div class="section-title"><h3>Conduct watch</h3></div><div class="list">${incidents}</div></div>
    </div>`;

  $('#trainerEditBtn').onclick = editTrainer;
  $('#trainerRespondBtn').onclick = ()=> { state.trainer.status = state.trainer.status==='Responding' ? 'Available' : 'Responding'; saveState(); addMessage('trainer', `Trainer status changed to ${state.trainer.status}.`); };
  $('#simulateLightningBtn').onclick = ()=> triggerLightning(8, 'Lightning detected inside 10 miles. Automatic 30-minute delay started.');
  $('#clearDelayBtn').onclick = clearDelay;
  $('#viewAllDatesBtn').onclick = ()=> { scheduleDateFilter='ALL'; switchTab('schedule'); renderSchedule(); };
  $$('[data-dash-date]', el).forEach(btn=> btn.onclick = ()=> { scheduleDateFilter = btn.dataset.dashDate; switchTab('schedule'); renderSchedule(); });
}

function renderSchedule(){
  const el = $('#schedule');
  const refsOptions = '<option value="">Select ref</option>' + state.refs.map(r=>`<option value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join('');
  const volOptions = '<option value="">Select volunteer</option>' + state.volunteers.map(v=>`<option value="${escapeHtml(v.name)}">${escapeHtml(v.name)}</option>`).join('');
  const dateOptions = `<option value="ALL">All dates</option>` + uniqueGameDates().map(d=>`<option ${scheduleDateFilter===d?'selected':''} value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
  const divisionOptions = `<option value="ALL">All divisions</option>` + uniqueDivisions().map(d=>`<option ${scheduleDivisionFilter===d?'selected':''} value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
  const associationOptions = `<option value="ALL">All associations</option>` + uniqueAssociations().map(a=>`<option ${scheduleAssociationFilter===a?'selected':''} value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join('');
  const fieldOptions = `<option value="ALL">All fields</option>` + uniqueFields().map(f=>`<option ${scheduleFieldFilter===f?'selected':''} value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('');
  const gamesForBoard = filteredGames();
  const fieldsMarkup = state.fields.map(field=>{
    const games = gamesForBoard.filter(g=>g.field===field.name).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    return `<div class="field-card"><div class="field-head"><div><h3>${field.name}</h3><div class="field-type">${field.type}</div></div><span class="badge">${games.length} games</span></div>${games.length? games.map(g=>{
      return `<div class="game ${gameStatus(g)}"><div class="game-top"><div><strong>${escapeHtml(g.home)} vs ${escapeHtml(g.away)}</strong><div class="game-meta">${escapeHtml(g.date)} • ${escapeHtml(g.time)} • ${escapeHtml(gameAssociation(g))} • ${escapeHtml(g.division||'')} • ${escapeHtml(g.field||'')}</div></div><span class="badge ${state.weather.activeDelay?'red':'green'}">${state.weather.activeDelay ? 'Delayed' : (g.status||'Scheduled')}</span></div><div class="scorebar"><div>${escapeHtml(g.home)} <span>${g.homeScore||0}</span></div><div>${escapeHtml(g.away)} <span>${g.awayScore||0}</span></div></div><div class="assign-grid"><label>Ref 1<select data-game="${g.id}" data-key="ref1">${refsOptions}</select></label><label>Ref 2<select data-game="${g.id}" data-key="ref2">${refsOptions}</select></label><label>Score Table<select data-game="${g.id}" data-key="scoreTable">${volOptions}</select></label><label>Clock<select data-game="${g.id}" data-key="clock">${volOptions}</select></label></div><div class="pill-row compact"><span class="pill">Home ${g.homeVerified?'Verified':'Pending'}</span><span class="pill">Away ${g.awayVerified?'Verified':'Pending'}</span></div><div class="actions"><button class="btn ghost" data-open-game="${g.id}">Open game</button><button class="btn ghost" data-verify-game="${g.id}">Verify players</button></div></div>`;
    }).join('') : '<div class="empty">No games assigned here for this filter.</div>'}</div>`;
  }).join('');

  const groupedByDate = uniqueGameDates().filter(d=>scheduleDateFilter==='ALL' || d===scheduleDateFilter).map(date=>{
    const rows = filteredGames().filter(g=>g.date===date).sort((a,b)=>(String(a.time||'')).localeCompare(String(b.time||''))).map(g=>`<tr><td>${escapeHtml(g.time)}</td><td>${escapeHtml(gameAssociation(g))}</td><td>${escapeHtml(g.division||'')}</td><td>${escapeHtml(g.home)} vs ${escapeHtml(g.away)}</td><td>${escapeHtml(g.field)}</td></tr>`).join('');
    return `<div class="card"><div class="section-title"><h3>${escapeHtml(date)}</h3><span class="badge">${filteredGames().filter(g=>g.date===date).length} games</span></div><div class="table-wrap"><table class="simple-table"><thead><tr><th>Time</th><th>Association</th><th>Division</th><th>Matchup</th><th>Field</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No games</td></tr>'}</tbody></table></div></div>`;
  }).join('');

  el.innerHTML = `
  <div class="section-title"><div><h2>Schedule Board</h2><div class="muted">Filter by date, association, division, and field. Assign refs/volunteers and work the day from one board.</div></div><div class="actions"><button class="btn" id="newGameBtn">Add Game</button></div></div>
  <div class="toolbar card">
    <div class="toolbar-grid">
      <label>Date<select id="scheduleDateFilter">${dateOptions}</select></label>
      <label>Association<select id="scheduleAssociationFilter">${associationOptions}</select></label>
      <label>Division<select id="scheduleDivisionFilter">${divisionOptions}</select></label>
      <label>Field<select id="scheduleFieldFilter">${fieldOptions}</select></label>
      <div class="summary-box"><strong>${gamesForBoard.length}</strong><span>games in view</span></div>
      <div class="summary-box"><strong>${new Set(gamesForBoard.map(g=>g.field)).size}</strong><span>fields in use</span></div>
    </div>
  </div>
  <div class="grid cols-2" style="margin-top:16px">${groupedByDate || '<div class="card"><div class="empty">No games match this filter.</div></div>'}</div>
  <div class="board" style="margin-top:16px"><div class="sidebar"><div class="card"><h3>Available refs</h3><div class="list">${state.refs.map(r=>`<div class="item"><strong>${escapeHtml(r.name)}</strong><span class="muted">${escapeHtml(r.level || 'Level 1')} • ${escapeHtml(r.phone || '')}</span></div>`).join('')}</div></div><div class="card"><h3>Available volunteers</h3><div class="list">${state.volunteers.map(v=>`<div class="item"><strong>${escapeHtml(v.name)}</strong><span class="muted">${(v.roles||[]).join(', ')}</span></div>`).join('')}</div></div></div><div class="field-grid">${fieldsMarkup}</div></div>`;
  $('#scheduleDateFilter').onchange = e => { scheduleDateFilter = e.target.value; renderSchedule(); };
  $('#scheduleAssociationFilter').onchange = e => { scheduleAssociationFilter = e.target.value; renderSchedule(); };
  $('#scheduleDivisionFilter').onchange = e => { scheduleDivisionFilter = e.target.value; renderSchedule(); };
  $('#scheduleFieldFilter').onchange = e => { scheduleFieldFilter = e.target.value; renderSchedule(); };
  $$('select[data-game]', el).forEach(sel=>{
    const game = state.games.find(g=>g.id===sel.dataset.game); sel.value = game[sel.dataset.key] || '';
    sel.onchange = ()=> { game[sel.dataset.key] = sel.value; saveState(); addMessage('staff', `${sel.dataset.key} assigned for ${game.home} vs ${game.away}: ${sel.value || 'cleared'}`); };
  });
  $$('[data-open-game]', el).forEach(btn=> btn.onclick = ()=> openGameDialog(btn.dataset.openGame));
  $$('[data-verify-game]', el).forEach(btn=> btn.onclick = ()=> { selectedGameId = btn.dataset.verifyGame; switchTab('checkin'); renderCheckin(); });
  $('#newGameBtn').onclick = createGame;
}


function renderParkMap(){
  const el = $('#parkmap');
  const fieldDetail = getField(selectedField) || state.fields[0];
  if(fieldDetail) selectedField = fieldDetail.name;
  const parsed = parseFieldName(fieldDetail?.name || 'Field 1A');
  const fieldGames = fieldDetail ? state.games.filter(g=>g.field===fieldDetail.name).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)) : [];
  const fieldButtons = state.fields.map(f=>`<button class="map-field-btn ${fieldDetail && fieldDetail.name===f.name?'active':''}" data-select-field="${f.name}">${escapeHtml(f.name)}</button>`).join('');
  el.innerHTML = `
  <div class="section-title"><div><h2>Julington Creek Plantation Park map</h2><div class="muted">Build the field layout by number, then drag the fields exactly where you want them. Supports Field 1 through Field n, plus A/B splits like 1A and 1B.</div></div></div>
  <div class="grid cols-2" style="margin-bottom:16px">
    <div class="card">
      <div class="section-title"><div><h3>Quick build fields</h3><div class="muted">Create a numbered run of fields in one shot.</div></div></div>
      <div class="form-grid">
        <label>Start #<input id="bulkStartNum" type="number" min="1" value="1"></label>
        <label>End #<input id="bulkEndNum" type="number" min="1" value="6"></label>
        <label>Suffix mode<select id="bulkSuffixMode"><option value="none">Numbers only</option><option value="ab">Add A + B</option></select></label>
        <label>Field Type<input id="bulkFieldType" value="Full Field"></label>
      </div>
      <div class="actions"><button class="btn" id="buildFieldsBtn">Build / update fields</button></div>
    </div>
    <div class="card">
      <div class="section-title"><div><h3>Add or rename a single field</h3><div class="muted">Place one field at a time with a number and optional letter.</div></div></div>
      <div class="form-grid">
        <label>Number<input id="singleFieldNum" type="number" min="1" value="${parsed.num===9999?1:parsed.num}"></label>
        <label>Suffix<select id="singleFieldSuffix"><option value="" ${!parsed.suffix?'selected':''}>None</option><option value="A" ${parsed.suffix==='A'?'selected':''}>A</option><option value="B" ${parsed.suffix==='B'?'selected':''}>B</option></select></label>
        <label>Field Type<input id="singleFieldType" value="${escapeHtml(fieldDetail?.type||'Full Field')}"></label>
      </div>
      <div class="actions"><button class="btn" id="saveSingleFieldBtn">Save field</button><button class="btn ghost" id="addSingleFieldBtn">Add as new</button><button class="btn ghost" id="deleteFieldBtn">Delete selected</button></div>
    </div>
  </div>
  <div class="map-shell editor">
    <div class="card map-editor-panel">
      <div class="section-title"><div><h3>Field layout editor</h3><div class="muted">Pick a field, then drag on the map or use the controls.</div></div></div>
      <div class="chip-row">${fieldButtons || '<span class="muted">No fields yet. Build some above.</span>'}</div>
      ${fieldDetail ? `
      <div class="form-grid" style="margin-top:12px">
        <label>X %<input id="fieldX" type="number" step="0.1" value="${Number(fieldDetail.x).toFixed(1)}"></label>
        <label>Y %<input id="fieldY" type="number" step="0.1" value="${Number(fieldDetail.y).toFixed(1)}"></label>
        <label>Width %<input id="fieldW" type="number" step="0.1" value="${Number(fieldDetail.w).toFixed(1)}"></label>
        <label>Height %<input id="fieldH" type="number" step="0.1" value="${Number(fieldDetail.h).toFixed(1)}"></label>
        <label>Rotation °<input id="fieldR" type="number" step="1" value="${Number(fieldDetail.r||0).toFixed(0)}"></label>
        <label>Field Type<input id="fieldType" value="${escapeHtml(fieldDetail.type||'')}"></label>
      </div>
      <div class="actions">
        <button class="btn" id="applyFieldEdit">Apply</button>
        <button class="btn ghost" id="resetFieldEdit">Reset field box</button>
      </div>
      <div class="list" style="margin-top:12px">
        ${fieldGames.length ? fieldGames.map(g=>`<div class="item"><strong>${g.date} • ${g.time}</strong>${escapeHtml(g.home)} vs ${escapeHtml(g.away)}<br><span class="muted">${g.ref1||'Open'} / ${g.ref2||'Open'} • ${g.scoreTable||'No table'}</span></div>`).join('') : '<div class="empty">No games on this field.</div>'}
      </div>` : '<div class="empty">No fields loaded yet.</div>'}
    </div>
    <div class="park-map" id="parkMap">
      <img src="julington_map.jpg" alt="Julington Creek Plantation Park editable field map" />
      ${state.fields.map(f=>`
        <div class="field-spot ${fieldDetail && fieldDetail.name===f.name?'active':''}" data-field="${f.name}" style="left:${f.x}%;top:${f.y}%;width:${f.w}%;height:${f.h}%;transform:translate(-50%,-50%) rotate(${f.r||0}deg)">
          <span class="spot-label">${escapeHtml(f.name)}</span>
          <span class="resize-handle" title="Resize"></span>
          <span class="rotate-handle" title="Rotate"></span>
        </div>`).join('')}
    </div>
  </div>`;

  $$('[data-select-field]', el).forEach(btn=> btn.onclick = ()=> { selectedField = btn.dataset.selectField; renderParkMap(); });
  $('#buildFieldsBtn').onclick = ()=> {
    const start = Number($('#bulkStartNum').value || 1);
    const end = Number($('#bulkEndNum').value || start);
    const suffixMode = $('#bulkSuffixMode').value;
    const type = $('#bulkFieldType').value.trim() || 'Full Field';
    if(!start || !end || end < start) return alert('Enter a valid start and end field number.');
    const made = buildSequentialFields(start, end, suffixMode, type);
    saveState();
    addMessage('map', `Built ${made.length} field slots using ${suffixMode==='ab'?'A/B':'number-only'} numbering.`);
    renderParkMap(); renderSchedule();
  };
  $('#saveSingleFieldBtn').onclick = ()=> {
    const num = Number($('#singleFieldNum').value || 1);
    const suffix = $('#singleFieldSuffix').value;
    const type = $('#singleFieldType').value.trim() || 'Full Field';
    const newName = fieldNameFromParts(num, suffix);
    if(fieldDetail){
      const oldName = fieldDetail.name;
      fieldDetail.name = newName;
      fieldDetail.type = type;
      state.games.forEach(g=>{ if(g.field===oldName) g.field = newName; });
      sortFieldsInPlace();
      selectedField = newName;
      saveState();
      addMessage('map', `${oldName} updated to ${newName}.`);
      renderParkMap(); renderSchedule();
    }
  };
  $('#addSingleFieldBtn').onclick = ()=> {
    const num = Number($('#singleFieldNum').value || 1);
    const suffix = $('#singleFieldSuffix').value;
    const type = $('#singleFieldType').value.trim() || 'Full Field';
    const field = upsertFieldByParts(num, suffix, type);
    saveState();
    addMessage('map', `${field.name} added to the park map.`);
    renderParkMap(); renderSchedule();
  };
  $('#deleteFieldBtn').onclick = ()=> {
    if(!fieldDetail) return;
    if(!confirm(`Delete ${fieldDetail.name}? Games on this field will be moved to the first remaining field.`)) return;
    const oldName = fieldDetail.name;
    state.fields = state.fields.filter(f=>f.name!==oldName);
    sortFieldsInPlace();
    const fallback = state.fields[0]?.name || '';
    state.games.forEach(g=>{ if(g.field===oldName) g.field = fallback; });
    selectedField = fallback;
    saveState();
    addMessage('map', `${oldName} deleted.`);
    renderParkMap(); renderSchedule();
  };

  if(fieldDetail){
    $('#applyFieldEdit').onclick = ()=> {
      fieldDetail.x = clamp(Number($('#fieldX').value),0,100);
      fieldDetail.y = clamp(Number($('#fieldY').value),0,100);
      fieldDetail.w = clamp(Number($('#fieldW').value),2,60);
      fieldDetail.h = clamp(Number($('#fieldH').value),2,60);
      fieldDetail.r = clamp(Number($('#fieldR').value),-180,180);
      fieldDetail.type = $('#fieldType').value.trim();
      saveState(); renderParkMap(); renderSchedule();
    };
    $('#resetFieldEdit').onclick = ()=> {
      fieldDetail.r = 0; fieldDetail.w = Math.max(fieldDetail.w, 10); fieldDetail.h = Math.max(fieldDetail.h, 10);
      saveState(); renderParkMap();
    };
  }

  $$('.field-spot', el).forEach(spot=>{
    spot.addEventListener('pointerdown', (ev)=> startMapInteraction(ev, spot));
  });
}

function renderCheckin(){
  const el = $('#checkin');
  const game = state.games.find(g=>g.id===selectedGameId) || filteredGames()[0] || state.games[0];
  if(!game){ el.innerHTML='<div class="card"><h2>No games loaded.</h2></div>'; return; }
  selectedGameId = game.id;
  const teams = gameTeams(game);
  const home = teams.home || {players:[]};
  const away = teams.away || {players:[]};
  const listHtml = (team)=> team.players?.length ? team.players.map(p=>`<div class="check-row"><div><strong>${escapeHtml(p.name)}</strong><div class="muted small">${escapeHtml(p.usaId || 'No USA ID')}</div></div><label><input type="checkbox" data-team="${team.id}" data-player="${p.name}" ${p.status==='Checked In' ? 'checked':''}/> Checked in</label></div>`).join('') : '<div class="empty">No roster loaded for this team yet.</div>';
  el.innerHTML = `<div class="section-title"><div><h2>Pre-game player verification</h2><div class="muted">Check in each player before the game. This is the score table / roster verification workflow.</div></div><div><select id="checkinGameSelect">${state.games.map(g=>`<option value="${g.id}">${escapeHtml(g.date)} • ${escapeHtml(g.time)} • ${escapeHtml(g.home)} vs ${escapeHtml(g.away)}</option>`).join('')}</select></div></div><div class="checkin-layout"><div class="card"><div class="section-title"><div><h3>${escapeHtml(game.home)}</h3><div class="muted">${escapeHtml(game.division||'')}</div></div><span class="badge ${game.homeVerified ? 'green':'orange'}">${game.homeVerified ? 'Verified' : 'Pending'}</span></div><div class="actions"><button class="btn" id="verifyHomeBtn">Verify full home roster</button></div><div class="check-team">${listHtml(home)}</div></div><div class="card"><div class="section-title"><div><h3>${escapeHtml(game.away)}</h3><div class="muted">${escapeHtml(game.division||'')}</div></div><span class="badge ${game.awayVerified ? 'green':'orange'}">${game.awayVerified ? 'Verified' : 'Pending'}</span></div><div class="actions"><button class="btn" id="verifyAwayBtn">Verify full away roster</button></div><div class="check-team">${listHtml(away)}</div></div></div><div class="card" style="margin-top:16px"><div class="section-title"><h3>Quick actions</h3></div><div class="actions"><button class="btn ghost" id="openSelectedGameBtn">Open this game card</button><button class="btn ghost" id="messageRosterBtn">Log roster status</button></div></div>`;
  $('#checkinGameSelect').value = game.id;
  $('#checkinGameSelect').onchange = (e)=> { selectedGameId = e.target.value; renderCheckin(); };
  $$('input[data-team]', el).forEach(box => box.onchange = ()=> {
    const team = getTeam(box.dataset.team); const player = team?.players.find(p => p.name===box.dataset.player); if(player){ player.status = box.checked ? 'Checked In' : 'Not Checked In'; saveState(); renderDashboard(); renderRosters(); }
  });
  $('#verifyHomeBtn').onclick = ()=> bulkVerify(game,'home');
  $('#verifyAwayBtn').onclick = ()=> bulkVerify(game,'away');
  $('#openSelectedGameBtn').onclick = ()=> openGameDialog(game.id);
  $('#messageRosterBtn').onclick = ()=> addMessage('verification', `${game.home} ${game.homeVerified?'verified':'pending'} • ${game.away} ${game.awayVerified?'verified':'pending'}.`);
}

function bulkVerify(game, side){
  const team = getTeamByName(side==='home'? game.home : game.away); if(team){ team.players.forEach(p=> p.status='Checked In'); }
  game[side+'Verified'] = true; saveState(); addMessage('verification', `${side==='home'?game.home:game.away} roster verified for ${game.home} vs ${game.away}.`); render();
}

function renderRosters(){
  const el = $('#rosters');
  const divisionOptions = `<option value="ALL">All divisions</option>` + uniqueDivisions().map(d=>`<option ${rosterDivisionFilter===d?'selected':''} value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
  const teamsInDivision = filteredTeams();
  let team = getTeam(selectedTeamId);
  if(!team || (rosterDivisionFilter!=='ALL' && team.division!==rosterDivisionFilter)){
    team = teamsInDivision[0] || state.teams[0];
  }
  if(team) selectedTeamId = team.id;
  const groupedMarkup = uniqueAssociations().filter(a=>rosterAssociationFilter==='ALL' || a===rosterAssociationFilter).map(assoc=>{
    const assocTeams = filteredTeams().filter(t=>teamAssociation(t)===assoc);
    if(!assocTeams.length) return '';
    const divisionGroups = [...new Set(assocTeams.map(t=>t.division))].sort((a,b)=>a.localeCompare(b)).map(div=>{
      const teams = assocTeams.filter(t=>t.division===div);
      return `<div class="division-group"><div class="division-head">${escapeHtml(div)} <span>${teams.length} teams</span></div>${teams.map(t=>`<button class="${team && team.id===t.id ? 'active':''}" data-team="${t.id}">${escapeHtml(t.name)}<div class="small muted">${escapeHtml(teamAssociation(t))} • ${t.players?.length || 0} players</div></button>`).join('')}</div>`;
    }).join('');
    return `<div class="association-block"><div class="division-head">${escapeHtml(assoc)} <span>${assocTeams.length} teams</span></div>${divisionGroups}</div>`;
  }).join('') || '<div class="empty">No teams match this association/division filter.</div>';
  const cards = team?.players?.map(p=>`<div class="player-card ${p.status==='Checked In'?'checked':''}"><div class="section-title"><div><h4>${escapeHtml(p.name)}</h4><div class="muted small">${escapeHtml(team.name)}</div></div><span class="badge ${p.status==='Checked In'?'green':'orange'}">${p.status==='Checked In'?'Checked In':'Pending'}</span></div><div class="pill-row"><span class="pill">USA ID: ${escapeHtml(p.usaId || '--')}</span><span class="pill">${escapeHtml(team.division || 'Division TBD')}</span></div><div class="muted small" style="margin-top:10px">Birthdate: ${escapeHtml(p.birthdate || '--')}</div></div>`).join('') || '<div class="empty">No players loaded yet.</div>';
  el.innerHTML = `<div class="section-title"><div><h2>Roster center</h2><div class="muted">Browse teams by association and division, then open player cards and verification status.</div></div></div><div class="toolbar card"><div class="toolbar-grid"><label>Association<select id="rosterAssociationFilter">${associationOptions}</select></label><label>Division<select id="rosterDivisionFilter">${divisionOptions}</select></label><div class="summary-box"><strong>${teamsInDivision.length}</strong><span>teams in view</span></div><div class="summary-box"><strong>${teamsInDivision.reduce((n,t)=>n+(t.players?.length||0),0)}</strong><span>players in view</span></div><div class="summary-box"><strong>${teamsInDivision.reduce((n,t)=>n+t.players.filter(p=>p.status==='Checked In').length,0)}</strong><span>players checked in</span></div></div></div><div class="rosters-wrap" style="margin-top:16px"><div class="card team-list"><h3>Teams by division</h3>${groupedMarkup}</div><div class="card"><div class="section-title"><div><h3>${team ? escapeHtml(team.name) : 'Roster'}</h3><div class="muted">Coach: ${escapeHtml(team?.coach || 'Not loaded')} ${team?.coachPhone ? '• ' + escapeHtml(team.coachPhone) : ''} • Association: ${escapeHtml(team ? teamAssociation(team) : '--')}</div></div><button class="btn ghost" id="addPlayerBtn">Add Player</button></div><div class="player-grid">${cards}</div></div></div>`;
  $('#rosterAssociationFilter').onchange = e => { rosterAssociationFilter = e.target.value; renderRosters(); };
  $('#rosterDivisionFilter').onchange = e => { rosterDivisionFilter = e.target.value; renderRosters(); };
  $$('[data-team]', el).forEach(btn=> btn.onclick = ()=> { selectedTeamId = btn.dataset.team; renderRosters(); });
  $('#addPlayerBtn').onclick = addPlayerToSelected;
}

function renderStaffing(){
  const el = $('#staffing');
  el.innerHTML = `<div class="section-title"><div><h2>Refs & Volunteers</h2><div class="muted">Ref development, contacts, shirt sizes, and volunteer role tracking.</div></div></div><div class="staff-grid"><div class="card"><div class="section-title"><div><h3>Youth referees</h3><div class="muted">These populate the schedule dropdowns automatically.</div></div><button class="btn" id="addRefBtn">Add Ref</button></div><div class="list">${state.refs.map(r=>`<div class="staff-card"><h4>${escapeHtml(r.name)}</h4><div class="muted small">${escapeHtml(r.level || 'Level 1')} • ${escapeHtml(r.phone || '')}</div><div class="muted small">${escapeHtml(r.email || '')}</div><div class="pill-row" style="margin-top:8px"><span class="pill">TS ${escapeHtml(r.shirt || '--')}</span></div></div>`).join('')}</div></div><div class="card"><div class="section-title"><div><h3>Volunteers</h3><div class="muted">Score table, clock, and field marshal coverage.</div></div><button class="btn" id="addVolunteerBtn">Add Volunteer</button></div><div class="list">${state.volunteers.map(v=>`<div class="staff-card"><h4>${escapeHtml(v.name)}</h4><div class="muted small">${escapeHtml(v.phone || '')}</div><div class="pill-row" style="margin-top:8px">${(v.roles||[]).map(role=>`<span class="pill">${escapeHtml(role)}</span>`).join('')}</div></div>`).join('')}</div></div></div><div class="grid cols-2" style="margin-top:16px"><div class="card"><h3>Self check-in</h3><div class="form-grid"><label>Role<select id="checkinRole"><option>Referee</option><option>Volunteer</option><option>Trainer</option></select></label><label>Name<input id="checkinName" placeholder="Enter name"/></label><label class="span2">Assignment / Notes<input id="checkinNotes" placeholder="Field 3, score table, etc."/></label></div><div class="actions"><button class="btn" id="staffCheckinBtn">Check In</button></div></div><div class="card"><h3>Check-in log</h3><div class="list">${state.checkins.length ? state.checkins.slice(0,10).map(c=>`<div class="item"><strong>${c.time}</strong>${escapeHtml(c.role)} • ${escapeHtml(c.name)}<br><span class="muted">${escapeHtml(c.notes || '')}</span></div>`).join('') : '<div class="empty">No one checked in yet.</div>'}</div></div></div>`;
  $('#addRefBtn').onclick = addRef;
  $('#addVolunteerBtn').onclick = addVolunteer;
  $('#staffCheckinBtn').onclick = ()=> {
    const role = $('#checkinRole').value; const name = $('#checkinName').value.trim(); const notes = $('#checkinNotes').value.trim(); if(!name) return;
    state.checkins.unshift({time:fmtTime(), role, name, notes}); saveState(); addMessage('checkin', `${role} checked in: ${name}${notes ? ' • ' + notes : ''}`); $('#checkinName').value=''; $('#checkinNotes').value=''; renderStaffing(); renderDashboard();
  };
}

function renderWeather(){
  const el = $('#weather');
  const weatherItems = state.messages.filter(m=>m.type==='weather').slice(0,8).map(m=>`<div class="item"><strong>${m.time}</strong>${m.text}</div>`).join('') || '<div class="empty">No weather events logged yet.</div>';
  el.innerHTML = `<div class="grid cols-2"><div class="card"><div class="section-title"><div><h2>Weather & lightning automation</h2><div class="muted">Built around your rule: WeatherBug lightning alert = automatic 30-minute delay.</div></div></div><div class="automation"><strong>Status:</strong> ${state.weather.activeDelay ? 'Delay active until ' + state.weather.delayUntil : 'No active delay'}<br><span class="muted">Provider status: ${escapeHtml(state.weather.provider)}. This web version is integration-ready for WeatherBug lightning feeds and webhooks.</span></div><div class="form-grid" style="margin-top:12px"><label>Lightning miles<input id="lightningMiles" type="number" placeholder="8"/></label><label>Webhook URL (optional)<input id="webhookUrl" placeholder="https://your-automation-endpoint" value="${escapeHtml(state.settings.webhookUrl || '')}"/></label><label class="span2">Delay message template<textarea id="delayTemplate">⚡ Lightning detected near ${state.meta.venue}. All games are delayed for 30 minutes. Please stay off the fields until the all-clear.</textarea></label></div><div class="actions"><button class="btn red" id="weatherTriggerBtn">Trigger lightning alert</button><button class="btn orange" id="weatherExtendBtn">Extend 30 more min</button><button class="btn ghost" id="weatherClearBtn">Resume play</button></div></div><div class="card"><h3>Weather / delay log</h3><div class="list">${weatherItems}</div></div></div>`;
  $('#weatherTriggerBtn').onclick = ()=> {
    state.settings.webhookUrl = $('#webhookUrl').value.trim(); saveState();
    const miles = Number($('#lightningMiles').value || 8);
    const template = $('#delayTemplate').value;
    triggerLightning(miles, template);
  };
  $('#weatherExtendBtn').onclick = ()=> extendDelay(30);
  $('#weatherClearBtn').onclick = clearDelay;
}

function renderAdmin(){
  const el = $('#admin');
  el.innerHTML = `<div class="section-title"><div><h2>Uploads & setup</h2><div class="muted">Upload roster files, upload schedule files, and keep the live board current without leaving the browser.</div></div></div><div class="grid cols-2"><div class="card"><h3>Roster uploader</h3><div class="upload-zone"><p class="muted">Accepts NFYLL roster templates, CSV, and XLSX. The uploader looks for player name, USA Lacrosse number, division, and team fields automatically.</p><input type="file" id="rosterUpload" accept=".csv,.xlsx,.xls" multiple /></div><div class="actions"><button class="btn" id="processRosterBtn">Process roster files</button></div></div><div class="card"><h3>Schedule uploader</h3><div class="upload-zone"><p class="muted">Accepts the NFYLL master schedule CSV/XLSX. The uploader maps date, time, division, location, Team 1, and Team 2 into the schedule board.</p><input type="file" id="scheduleUpload" accept=".csv,.xlsx,.xls" multiple /></div><div class="actions"><button class="btn" id="processScheduleBtn">Process schedule files</button></div></div></div><div class="grid cols-2" style="margin-top:16px"><div class="card"><h3>Quick setup</h3><div class="form-grid"><label>Trainer name<input id="trainerNameInput" value="${escapeHtml(state.trainer.name || '')}"/></label><label>Trainer location<input id="trainerLocationInput" value="${escapeHtml(state.trainer.location || '')}"/></label></div><div class="actions"><button class="btn" id="saveSetupBtn">Save setup</button></div></div><div class="card"><h3>Data notes</h3><div class="list"><div class="item"><strong>Current teams</strong>${state.teams.length}</div><div class="item"><strong>Current games</strong>${state.games.length}</div><div class="item"><strong>Current refs</strong>${state.refs.length}</div><div class="item"><strong>Map editor</strong>You can move, resize, and rotate field rectangles directly on the Julington map.</div></div></div></div>`;
  $('#processRosterBtn').onclick = async ()=> handleRosterUpload();
  $('#processScheduleBtn').onclick = async ()=> handleScheduleUpload();
  $('#saveSetupBtn').onclick = ()=> { state.trainer.name = $('#trainerNameInput').value.trim(); state.trainer.location = $('#trainerLocationInput').value.trim(); saveState(); addMessage('system','Trainer setup updated.'); };
}

async function handleRosterUpload(){
  const files = $('#rosterUpload').files; if(!files.length) return;
  for(const file of files){
    const rows = await workbookRows(file);
    if(!rows.length) continue;
    const headers = rows[0].map(h => String(h||'').trim().toLowerCase());
    const find = (...names) => headers.findIndex(h => names.includes(h));
    const iFirst = find('firstname','first','first name');
    const iLast = find('lastname','last','last name');
    const iName = find('name','player name');
    const iTeam = find('team','team name');
    const iDiv = find('div','division','roster status');
    const iUsa = find('usa lacrosse number','usa lacrosse member id','usa member id');
    const iBirth = find('birthdate','birth date','dob');
    rows.slice(1).forEach(row=>{
      const name = iName>=0 ? String(row[iName]||'').trim() : `${row[iFirst] || ''} ${row[iLast] || ''}`.trim(); if(!name) return;
      const teamName = String((iTeam>=0 ? row[iTeam] : '') || file.name.replace(/\.[^.]+$/, '')).trim();
      const division = String((iDiv>=0 ? row[iDiv] : '') || '').trim();
      let team = state.teams.find(t => t.name.toLowerCase()===teamName.toLowerCase());
      if(!team){ team = {id: uid('team'), name: teamName, division, players: [], coach:'', coachPhone:'', coachEmail:'', program:''}; state.teams.push(team); }
      if(!team.division && division) team.division = division;
      if(!team.players.some(p => p.name.toLowerCase()===name.toLowerCase())){
        team.players.push({name, usaId: String((iUsa>=0 ? row[iUsa] : '') || '').replace('.0',''), birthdate: iBirth>=0 && row[iBirth] ? String(row[iBirth]).slice(0,10) : '', status:'Not Checked In'});
      }
    });
  }
  saveState(); addMessage('upload', 'Roster upload complete. Teams and player cards were updated.'); render();
}

async function handleScheduleUpload(){
  const files = $('#scheduleUpload').files; if(!files.length) return;
  for(const file of files){
    const rows = await workbookRows(file); if(!rows.length) continue;
    const headers = rows[0].map(h => String(h||'').trim().toLowerCase());
    const find = (...names) => headers.findIndex(h => names.includes(h));
    const iDate = find('game date','date');
    const iTime = find('start time','time');
    const iDiv = find('division','div');
    const iLoc = find('location','field');
    const iTeam1 = find('team 1','home','home team');
    const iTeam2 = find('team 2','away','away team');
    rows.slice(1).forEach(row=>{
      const home = String(row[iTeam1] || '').trim(); const away = String(row[iTeam2] || '').trim(); if(!home || !away) return;
      const fieldGuess = mapLocationToField(String(row[iLoc] || ''));
      state.games.push({id:uid('game'), date:String(row[iDate] || ''), time:String(row[iTime] || ''), division:String(row[iDiv] || ''), location:String(row[iLoc] || ''), field:fieldGuess, home, away, homeScore:0, awayScore:0, status:'Scheduled', ref1:'', ref2:'', scoreTable:'', clock:'', fieldMarshal:'', homeVerified:false, awayVerified:false, homeWarnings:0, awayWarnings:0, homeEjections:0, awayEjections:0, fight:false, disruptionNote:''});
    });
  }
  saveState(); addMessage('upload', 'Schedule upload complete. Games were added to the board.'); render();
}

function mapLocationToField(location){
  const clean = String(location || '').toLowerCase().replace(/\s+/g,'');
  const direct = state.fields.find(f => clean.includes(f.name.toLowerCase().replace(/\s+/g,'')));
  if(direct) return direct.name;
  const m = clean.match(/field(\d+)([ab]?)/); if(m){ const candidate = `Field ${m[1]}${m[2] ? m[2].toUpperCase() : ''}`; if(state.fields.some(f => f.name===candidate)) return candidate; }
  return state.fields[0]?.name || 'Field 1A';
}

async function workbookRows(file){
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, {type:'array'});
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, {header:1, raw:false});
}

function triggerLightning(miles=8, messageText=''){ 
  const mins = Number(state.settings.autoDelayMinutes || 30);
  const until = new Date(Date.now() + mins*60000);
  state.weather.activeDelay = true;
  state.weather.lightningMiles = miles;
  state.weather.delayUntil = until.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  state.weather.note = `Lightning detected within ${miles} miles. Auto-delay started.`;
  saveState();
  const msg = messageText || `⚡ Lightning detected near ${state.meta.venue}. All games are delayed for ${mins} minutes. Resume no earlier than ${state.weather.delayUntil}.`;
  addMessage('weather', msg);
  if(state.settings.webhookUrl){
    fetch(state.settings.webhookUrl, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({type:'lightning_delay', league:state.meta.league, venue:state.meta.venue, until:state.weather.delayUntil, message:msg})}).catch(()=> addMessage('weather', 'Webhook send failed from browser.')); 
  }
}
function extendDelay(mins=30){
  state.weather.activeDelay = true;
  const until = new Date(Date.now() + mins*60000);
  state.weather.delayUntil = until.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  state.weather.note = `Delay extended ${mins} minutes.`;
  saveState(); addMessage('weather', `⚡ Lightning delay extended. New resume time: ${state.weather.delayUntil}.`); render();
}
function clearDelay(){ state.weather.activeDelay=false; state.weather.delayUntil=''; state.weather.note='Fields open'; saveState(); addMessage('weather','Weather all-clear issued. Play may resume.'); render(); }

function openGameDialog(gameId){
  const game = state.games.find(g=>g.id===gameId); if(!game) return;
  const d = $('#gameDialog');
  d.innerHTML = `<div class="modal-body"><div class="section-title"><div><h2>${escapeHtml(game.home)} vs ${escapeHtml(game.away)}</h2><div class="muted">${escapeHtml(game.date)} • ${escapeHtml(game.time)} • ${escapeHtml(game.field)}</div></div><button class="btn ghost" id="closeGameDialog">Close</button></div><div class="form-grid"><label>Game status<select id="dlgStatus"><option ${game.status==='Scheduled'?'selected':''}>Scheduled</option><option ${game.status==='Ready'?'selected':''}>Ready</option><option ${game.status==='In Progress'?'selected':''}>In Progress</option><option ${game.status==='Completed'?'selected':''}>Completed</option></select></label><label>Field<select id="dlgField">${state.fields.map(f=>`<option ${game.field===f.name?'selected':''}>${escapeHtml(f.name)}</option>`).join('')}</select></label><label>Home score<input type="number" id="dlgHomeScore" value="${game.homeScore||0}" min="0" /></label><label>Away score<input type="number" id="dlgAwayScore" value="${game.awayScore||0}" min="0" /></label><label>Home warnings<input type="number" id="dlgHomeWarn" value="${game.homeWarnings||0}" min="0" /></label><label>Away warnings<input type="number" id="dlgAwayWarn" value="${game.awayWarnings||0}" min="0" /></label><label>Home ejections<input type="number" id="dlgHomeEj" value="${game.homeEjections||0}" min="0" /></label><label>Away ejections<input type="number" id="dlgAwayEj" value="${game.awayEjections||0}" min="0" /></label><label class="span2">Fight / disruption notes<textarea id="dlgDisruption">${escapeHtml(game.disruptionNote || '')}</textarea></label></div><div class="actions"><button class="btn" id="saveGameDialog">Save game</button><button class="btn ghost" id="verifyFromDialogBtn">Open check-in</button></div></div>`;
  d.showModal();
  $('#closeGameDialog').onclick = ()=> d.close();
  $('#verifyFromDialogBtn').onclick = ()=> { d.close(); selectedGameId = game.id; switchTab('checkin'); renderCheckin(); };
  $('#saveGameDialog').onclick = ()=> {
    game.status = $('#dlgStatus').value; game.field = $('#dlgField').value; game.homeScore = Number($('#dlgHomeScore').value||0); game.awayScore = Number($('#dlgAwayScore').value||0); game.homeWarnings = Number($('#dlgHomeWarn').value||0); game.awayWarnings = Number($('#dlgAwayWarn').value||0); game.homeEjections = Number($('#dlgHomeEj').value||0); game.awayEjections = Number($('#dlgAwayEj').value||0); game.disruptionNote = $('#dlgDisruption').value.trim(); game.fight = !!game.disruptionNote; saveState(); addMessage('game', `Updated ${game.home} vs ${game.away}. Score ${game.homeScore}-${game.awayScore}.`); d.close(); render();
  };
}

function editTrainer(){
  const d = $('#messageDialog');
  d.innerHTML = `<div class="modal-body"><div class="section-title"><h3>Update trainer</h3></div><div class="form-grid"><label>Name<input id="dlgTrainerName" value="${escapeHtml(state.trainer.name||'')}"/></label><label>Location<input id="dlgTrainerLocation" value="${escapeHtml(state.trainer.location||'')}"/></label><label>Status<select id="dlgTrainerStatus"><option ${state.trainer.status==='Available'?'selected':''}>Available</option><option ${state.trainer.status==='Responding'?'selected':''}>Responding</option><option ${state.trainer.status==='Off Site'?'selected':''}>Off Site</option></select></label></div><div class="actions"><button class="btn" id="saveTrainerDialog">Save</button><button class="btn ghost" id="closeTrainerDialog">Close</button></div></div>`;
  d.showModal(); $('#closeTrainerDialog').onclick = ()=> d.close(); $('#saveTrainerDialog').onclick = ()=> { state.trainer.name=$('#dlgTrainerName').value.trim(); state.trainer.location=$('#dlgTrainerLocation').value.trim(); state.trainer.status=$('#dlgTrainerStatus').value; saveState(); addMessage('trainer','Trainer coverage updated.'); d.close(); render(); };
}

function addPlayerToSelected(){ const team=getTeam(selectedTeamId); if(!team) return; const name=prompt('Player name'); if(!name) return; team.players.push({name, usaId:'', birthdate:'', status:'Not Checked In'}); saveState(); addMessage('roster', `${name} added to ${team.name}.`); renderRosters(); }
function addRef(){ const name=prompt('Referee name'); if(!name) return; state.refs.push({id:uid('ref'), name, level:'Level 1', phone:'', email:'', shirt:''}); saveState(); addMessage('staff', `Referee added: ${name}.`); render(); }
function addVolunteer(){ const name=prompt('Volunteer name'); if(!name) return; state.volunteers.push({id:uid('vol'), name, roles:['Score Table']}); saveState(); addMessage('staff', `Volunteer added: ${name}.`); render(); }
function createGame(){
  const home=prompt('Home team'); if(!home) return; const away=prompt('Away team'); if(!away) return; state.games.unshift({id:uid('game'), date:new Date().toLocaleDateString(), time:'', division:'', location:'', field:state.fields[0]?.name || 'Field 1A', home, away, homeScore:0, awayScore:0, status:'Scheduled', ref1:'', ref2:'', scoreTable:'', clock:'', fieldMarshal:'', homeVerified:false, awayVerified:false, homeWarnings:0, awayWarnings:0, homeEjections:0, awayEjections:0, fight:false, disruptionNote:''}); saveState(); addMessage('schedule', `Game added: ${home} vs ${away}.`); render();
}
function exportBackup(){ const blob=new Blob([JSON.stringify(state,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`leagueops-live-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href); }
function resetDemo(){ localStorage.removeItem(STORAGE_KEY); location.reload(); }
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }

document.addEventListener('DOMContentLoaded', ()=> {
  tabSetup(); render();
  $('#exportBtn').onclick = exportBackup;
  $('#resetBtn').onclick = resetDemo;
});
