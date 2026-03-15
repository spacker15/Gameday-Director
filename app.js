
const STORAGE_KEY = 'leagueops-live-v5-pro';
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const fmtTime = () => new Date().toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
const uid = (p='id') => `${p}-${Math.random().toString(36).slice(2,9)}`;

const DEFAULT_VOLUNTEER_ROLES = ['Score Table','Clock','Field Marshal'];
let state = loadState();
let selectedTeamId = state.teams[0]?.id || null;
let selectedField = null;
let selectedGameId = state.games[0]?.id || null;

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){ try { return JSON.parse(raw); } catch(e){} }
  const seed = deepClone(window.__SEED__);
  seed.games = seed.games.map(g => ({...g, id: g.id || uid('game')}));
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
function tabSetup(){ $$('#mainNav button').forEach(btn=> btn.onclick = ()=> { $$('#mainNav button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); $$('.tab').forEach(p=>p.classList.remove('active')); $('#'+btn.dataset.tab).classList.add('active'); }); }

function render(){ renderDashboard(); renderSchedule(); renderParkMap(); renderCheckin(); renderRosters(); renderStaffing(); renderWeather(); renderAdmin(); }

function renderDashboard(){
  const el = $('#dashboard');
  const latestMsgs = state.messages.slice(0,5).map(m=>`<div class="item"><strong>${m.time}</strong>${m.text}</div>`).join('') || '<div class="empty">No messages yet.</div>';
  const gaps = state.games.filter(g => ['ref1','ref2','scoreTable'].some(k=>!g[k])).slice(0,6).map(g=>`<div class="item"><strong>${g.time} • ${g.home} vs ${g.away}</strong>${['ref1','ref2','scoreTable'].filter(k=>!g[k]).join(', ')} missing</div>`).join('') || '<div class="empty">No open staffing gaps.</div>';
  const incidents = state.games.filter(g=>g.fight || g.homeWarnings || g.awayWarnings || g.homeEjections || g.awayEjections).slice(0,6).map(g=>`<div class="item"><strong>${g.home} vs ${g.away}</strong>Warnings ${g.homeWarnings||0}-${g.awayWarnings||0} • Ejections ${g.homeEjections||0}-${g.awayEjections||0}${g.fight ? ' • Fight/disruption flagged' : ''}</div>`).join('') || '<div class="empty">No conduct issues logged.</div>';
  const lightningBanner = state.weather.activeDelay ? `<div class="alert-banner red">⚡ Lightning delay active until ${state.weather.delayUntil}. ${state.weather.note}</div>` : `<div class="alert-banner green">Weather clear. No active delay.</div>`;
  el.innerHTML = `
    <div class="grid cols-3">
      <div class="card hero">
        <div class="section-title"><div><div class="muted small">Central trainer coverage</div><h2>${state.trainer.name || 'Unassigned'}</h2></div><span class="badge ${state.trainer.status==='Responding'?'red':'green'}">${state.trainer.status}</span></div>
        <div class="muted">${state.trainer.location || 'Set location'} • ${state.meta.venue}</div>
        <div class="actions"><button class="btn" id="trainerEditBtn">Update Trainer</button><button class="btn ghost" id="trainerRespondBtn">Mark Responding</button></div>
      </div>
      <div class="card hero">
        <div class="section-title"><div><div class="muted small">WeatherBug-style lightning automation</div><h2>${state.weather.activeDelay ? '30-minute delay running' : 'Lightning automation armed'}</h2></div></div>
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
    <div class="grid cols-2" style="margin-top:16px">
      <div class="card"><div class="section-title"><div><h3>Today at a glance</h3><div class="muted">Open staffing, live issues, and board health.</div></div></div><div class="kpis"><div class="kpi"><div class="label">Open staffing slots</div><div class="value">${openStaffingCount()}</div></div><div class="kpi"><div class="label">Checked-in players</div><div class="value">${totalVerifiedPlayers()}</div></div><div class="kpi"><div class="label">Incidents</div><div class="value">${state.injuries.length}</div></div><div class="kpi"><div class="label">Messages</div><div class="value">${state.messages.length}</div></div><div class="kpi"><div class="label">Refs checked in</div><div class="value">${state.checkins.filter(c=>c.role==='Referee').length}</div></div><div class="kpi"><div class="label">Volunteers in</div><div class="value">${state.checkins.filter(c=>c.role==='Volunteer').length}</div></div></div></div>
      <div class="card"><div class="section-title"><div><h3>Recommended next actions</h3><div class="muted">Built to make game day simpler.</div></div></div><div class="list"><div class="item"><strong>1. Upload fresh rosters and schedule</strong>Use Uploads & Setup to import CSV/XLSX files directly into the live board.</div><div class="item"><strong>2. Assign refs and score table by dropdown</strong>Every game card supports instant staffing changes.</div><div class="item"><strong>3. Verify players before faceoff</strong>Use Player Check-In to confirm eligibility one player at a time or by bulk action.</div></div></div>
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
}

function renderSchedule(){
  const el = $('#schedule');
  const refsOptions = '<option value="">Select ref</option>' + state.refs.map(r=>`<option value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join('');
  const volOptions = '<option value="">Select volunteer</option>' + state.volunteers.map(v=>`<option value="${escapeHtml(v.name)}">${escapeHtml(v.name)}</option>`).join('');
  const fieldsMarkup = state.fields.map(field=>{
    const games = state.games.filter(g=>g.field===field.name);
    return `<div class="field-card"><div class="field-head"><div><h3>${field.name}</h3><div class="field-type">${field.type}</div></div><span class="badge">${games.length} games</span></div>${games.length? games.map(g=>{
      const teams = gameTeams(g);
      return `<div class="game ${gameStatus(g)}"><div class="game-top"><div><strong>${escapeHtml(g.home)} vs ${escapeHtml(g.away)}</strong><div class="game-meta">${g.date} • ${g.time} • ${escapeHtml(g.division||'')}</div></div><span class="badge ${state.weather.activeDelay?'red':'green'}">${state.weather.activeDelay ? 'Delayed' : (g.status||'Scheduled')}</span></div><div class="scorebar"><div>${escapeHtml(g.home)} <span>${g.homeScore||0}</span></div><div>${escapeHtml(g.away)} <span>${g.awayScore||0}</span></div></div><div class="assign-grid"><label>Ref 1<select data-game="${g.id}" data-key="ref1">${refsOptions}</select></label><label>Ref 2<select data-game="${g.id}" data-key="ref2">${refsOptions}</select></label><label>Score Table<select data-game="${g.id}" data-key="scoreTable">${volOptions}</select></label><label>Clock<select data-game="${g.id}" data-key="clock">${volOptions}</select></label></div><div class="actions"><button class="btn ghost" data-open-game="${g.id}">Open game</button><button class="btn ghost" data-verify-game="${g.id}">Verify players</button></div></div>`;
    }).join('') : '<div class="empty">No games assigned here.</div>'}</div>`;
  }).join('');

  el.innerHTML = `<div class="section-title"><div><h2>Schedule Board</h2><div class="muted">Dropdown staffing, game control, score table updates, conduct tracking, and player verification in one board.</div></div><div class="actions"><button class="btn" id="newGameBtn">Add Game</button></div></div><div class="board"><div class="sidebar"><div class="card"><h3>Available refs</h3><div class="list">${state.refs.map(r=>`<div class="item"><strong>${escapeHtml(r.name)}</strong><span class="muted">${escapeHtml(r.level || 'Level 1')} • ${escapeHtml(r.phone || '')}</span></div>`).join('')}</div></div><div class="card"><h3>Available volunteers</h3><div class="list">${state.volunteers.map(v=>`<div class="item"><strong>${escapeHtml(v.name)}</strong><span class="muted">${(v.roles||[]).join(', ')}</span></div>`).join('')}</div></div></div><div class="field-grid">${fieldsMarkup}</div></div>`;
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
  const fieldDetail = selectedField ? getField(selectedField) : state.fields[0];
  const fieldGames = state.games.filter(g=>g.field===fieldDetail.name);
  el.innerHTML = `<div class="section-title"><div><h2>Julington Creek Plantation Park map</h2><div class="muted">Interactive field layout using the actual Julington map with live field overlays.</div></div></div><div class="map-shell"><div class="card"><h3>${fieldDetail.name}</h3><div class="muted">${fieldDetail.type}</div><div class="list" style="margin-top:12px">${fieldGames.length ? fieldGames.map(g=>`<div class="item"><strong>${g.time} • ${escapeHtml(g.home)} vs ${escapeHtml(g.away)}</strong>Refs: ${g.ref1||'Open'} / ${g.ref2||'Open'}<br>Score Table: ${g.scoreTable||'Open'}<br>Status: ${state.weather.activeDelay ? 'Delayed' : (g.status || 'Scheduled')}</div>`).join('') : '<div class="empty">No games on this field.</div>'}</div></div><div class="park-map"><img src="julington_map.jpg" alt="Julington Creek Plantation Park map" />${state.fields.map(f=>`<button class="field-spot ${fieldDetail.name===f.name?'active':''}" data-field="${f.name}" style="left:${f.x}%;top:${f.y}%;width:${f.w}%;height:${f.h}%"><span class="spot-label">${f.name}</span></button>`).join('')}</div></div>`;
  $$('[data-field]', el).forEach(btn=> btn.onclick = ()=> { selectedField = btn.dataset.field; renderParkMap(); });
}

function renderCheckin(){
  const el = $('#checkin');
  const game = state.games.find(g=>g.id===selectedGameId) || state.games[0];
  if(!game){ el.innerHTML='<div class="card"><h2>No games loaded.</h2></div>'; return; }
  selectedGameId = game.id;
  const teams = gameTeams(game);
  const home = teams.home || {players:[]};
  const away = teams.away || {players:[]};
  const listHtml = (team, side)=> team.players?.length ? team.players.map(p=>`<div class="check-row"><div><strong>${escapeHtml(p.name)}</strong><div class="muted small">${escapeHtml(p.usaId || 'No USA ID')}</div></div><label><input type="checkbox" data-team="${team.id}" data-player="${p.name}" ${p.status==='Checked In' ? 'checked':''}/> Checked in</label></div>`).join('') : '<div class="empty">No roster loaded for this team yet.</div>';
  el.innerHTML = `<div class="section-title"><div><h2>Pre-game player verification</h2><div class="muted">Check in each player before the game. This is the score table / roster verification workflow.</div></div><div><select id="checkinGameSelect">${state.games.map(g=>`<option value="${g.id}">${escapeHtml(g.time)} • ${escapeHtml(g.home)} vs ${escapeHtml(g.away)}</option>`).join('')}</select></div></div><div class="checkin-layout"><div class="card"><div class="section-title"><div><h3>${escapeHtml(game.home)}</h3><div class="muted">${escapeHtml(game.division||'')}</div></div><span class="badge ${game.homeVerified ? 'green':'orange'}">${game.homeVerified ? 'Verified' : 'Pending'}</span></div><div class="actions"><button class="btn" id="verifyHomeBtn">Verify full home roster</button></div><div class="check-team">${listHtml(home,'home')}</div></div><div class="card"><div class="section-title"><div><h3>${escapeHtml(game.away)}</h3><div class="muted">${escapeHtml(game.division||'')}</div></div><span class="badge ${game.awayVerified ? 'green':'orange'}">${game.awayVerified ? 'Verified' : 'Pending'}</span></div><div class="actions"><button class="btn" id="verifyAwayBtn">Verify full away roster</button></div><div class="check-team">${listHtml(away,'away')}</div></div></div><div class="card" style="margin-top:16px"><div class="section-title"><h3>Quick actions</h3></div><div class="actions"><button class="btn ghost" id="openSelectedGameBtn">Open this game card</button><button class="btn ghost" id="messageRosterBtn">Log roster status</button></div></div>`;
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
  const team = getTeam(selectedTeamId) || state.teams[0]; if(team) selectedTeamId = team.id;
  const teamsMarkup = state.teams.map(t=>`<button class="${team && team.id===t.id ? 'active':''}" data-team="${t.id}">${escapeHtml(t.name)}<div class="small muted">${escapeHtml(t.division || '')} • ${t.players?.length || 0} players</div></button>`).join('');
  const cards = team?.players?.map(p=>`<div class="player-card ${p.status==='Checked In'?'checked':''}"><div class="section-title"><div><h4>${escapeHtml(p.name)}</h4><div class="muted small">${escapeHtml(team.name)}</div></div><span class="badge ${p.status==='Checked In'?'green':'orange'}">${p.status==='Checked In'?'Checked In':'Pending'}</span></div><div class="pill-row"><span class="pill">USA ID: ${escapeHtml(p.usaId || '--')}</span><span class="pill">${escapeHtml(team.division || 'Division TBD')}</span></div><div class="muted small" style="margin-top:10px">Birthdate: ${escapeHtml(p.birthdate || '--')}</div></div>`).join('') || '<div class="empty">No players loaded yet.</div>';
  el.innerHTML = `<div class="section-title"><div><h2>Roster center</h2><div class="muted">Browse teams, player cards, and verification status.</div></div></div><div class="rosters-wrap"><div class="card team-list"><h3>Teams</h3>${teamsMarkup}</div><div class="card"><div class="section-title"><div><h3>${team ? escapeHtml(team.name) : 'Roster'}</h3><div class="muted">Coach: ${escapeHtml(team?.coach || 'Not loaded')} ${team?.coachPhone ? '• ' + escapeHtml(team.coachPhone) : ''}</div></div><button class="btn ghost" id="addPlayerBtn">Add Player</button></div><div class="player-grid">${cards}</div></div></div>`;
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
  el.innerHTML = `<div class="grid cols-2"><div class="card"><div class="section-title"><div><h2>Weather & lightning automation</h2><div class="muted">Built around your rule: lightning alert = automatic 30-minute delay.</div></div></div><div class="automation"><strong>Status:</strong> ${state.weather.activeDelay ? 'Delay active until ' + state.weather.delayUntil : 'No active delay'}<br><span class="muted">Provider status: ${escapeHtml(state.weather.provider)}. This web version is integration-ready for WeatherBug lightning feeds and webhooks.</span></div><div class="form-grid" style="margin-top:12px"><label>Lightning miles<input id="lightningMiles" type="number" placeholder="8"/></label><label>Webhook URL (optional)<input id="webhookUrl" placeholder="https://your-automation-endpoint" value="${escapeHtml(state.settings.webhookUrl || '')}"/></label><label class="span2">Delay message template<textarea id="delayTemplate">⚡ Lightning detected near ${state.meta.venue}. All games are delayed for 30 minutes. Please stay off the fields until the all-clear.</textarea></label></div><div class="actions"><button class="btn red" id="weatherTriggerBtn">Trigger lightning alert</button><button class="btn orange" id="weatherExtendBtn">Extend 30 more min</button><button class="btn ghost" id="weatherClearBtn">Resume play</button></div></div><div class="card"><h3>Weather / delay log</h3><div class="list">${weatherItems}</div></div></div>`;
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
  el.innerHTML = `<div class="section-title"><div><h2>Uploads & setup</h2><div class="muted">Upload roster files, schedule files, and keep the live board current without leaving the browser.</div></div></div><div class="grid cols-2"><div class="card"><h3>Roster uploader</h3><div class="upload-zone"><p class="muted">Accepts NFYLL roster templates, CSV, and XLSX. The uploader looks for player name, USA Lacrosse number, division, and team fields automatically.</p><input type="file" id="rosterUpload" accept=".csv,.xlsx,.xls" multiple /></div><div class="actions"><button class="btn" id="processRosterBtn">Process roster files</button></div></div><div class="card"><h3>Schedule uploader</h3><div class="upload-zone"><p class="muted">Accepts the NFYLL master schedule CSV/XLSX. The uploader maps date, time, division, location, Team 1, and Team 2 into the schedule board.</p><input type="file" id="scheduleUpload" accept=".csv,.xlsx,.xls" multiple /></div><div class="actions"><button class="btn" id="processScheduleBtn">Process schedule files</button></div></div></div><div class="grid cols-2" style="margin-top:16px"><div class="card"><h3>Quick setup</h3><div class="form-grid"><label>Trainer name<input id="trainerNameInput" value="${escapeHtml(state.trainer.name || '')}"/></label><label>Trainer location<input id="trainerLocationInput" value="${escapeHtml(state.trainer.location || '')}"/></label></div><div class="actions"><button class="btn" id="saveSetupBtn">Save setup</button></div></div><div class="card"><h3>Data notes</h3><div class="list"><div class="item"><strong>Current teams</strong>${state.teams.length}</div><div class="item"><strong>Current games</strong>${state.games.length}</div><div class="item"><strong>Current refs</strong>${state.refs.length}</div><div class="item"><strong>How automation works here</strong>Lightning automation, message generation, and webhook posting run in-browser. A live WeatherBug feed needs an API endpoint or webhook to be fully automatic.</div></div></div></div>`;
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
    const iTeam = find('team','team name');
    const iDiv = find('div','division','roster status');
    const iUsa = find('usa lacrosse number','usa lacrosse member id','usa member id');
    const iBirth = find('birthdate','birth date','dob');
    if(iFirst<0 && iLast<0) continue;
    rows.slice(1).forEach(row=>{
      const name = `${row[iFirst] || ''} ${row[iLast] || ''}`.trim(); if(!name) return;
      const teamName = String(row[iTeam] || file.name.replace(/\.[^.]+$/, '')).trim();
      const division = String(row[iDiv] || '').trim();
      let team = state.teams.find(t => t.name.toLowerCase()===teamName.toLowerCase());
      if(!team){ team = {id: uid('team'), name: teamName, division, players: [], coach:'', coachPhone:'', coachEmail:'', program:''}; state.teams.push(team); }
      if(!team.players.some(p => p.name.toLowerCase()===name.toLowerCase())){
        team.players.push({name, usaId: String(row[iUsa] || '').replace('.0',''), birthdate: row[iBirth] ? String(row[iBirth]).slice(0,10) : '', status:'Not Checked In'});
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
  const m = clean.match(/field(\d)([ab]?)/); if(m){ const candidate = `Field ${m[1]}${m[2] ? m[2].toUpperCase() : ''}`; if(state.fields.some(f => f.name===candidate)) return candidate; }
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
  const base = state.weather.activeDelay && state.weather.delayUntil ? new Date() : new Date();
  state.weather.activeDelay = true;
  const until = new Date(Date.now() + mins*60000);
  state.weather.delayUntil = until.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  state.weather.note = `Delay extended ${mins} minutes.`;
  saveState(); addMessage('weather', `⚡ Lightning delay extended. New resume time: ${state.weather.delayUntil}.`); render();
}
function clearDelay(){ state.weather.activeDelay=false; state.weather.delayUntil=''; state.weather.note='Fields open'; saveState(); addMessage('weather','Weather all-clear issued. Play may resume.'); render(); }

function openGameDialog(gameId){
  const game = state.games.find(g=>g.id===gameId); if(!game) return; const teams = gameTeams(game);
  const refsOpts = '<option value="">Select ref</option>' + state.refs.map(r=>`<option ${game.ref1===r.name?'selected':''} value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join('');
  const ref2Opts = '<option value="">Select ref</option>' + state.refs.map(r=>`<option ${game.ref2===r.name?'selected':''} value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join('');
  const volOpts = '<option value="">Select volunteer</option>' + state.volunteers.map(v=>`<option value="${escapeHtml(v.name)}">${escapeHtml(v.name)}</option>`).join('');
  const d = $('#gameDialog');
  d.innerHTML = `<div class="modal-body"><div class="section-title"><div><h2>${escapeHtml(game.home)} vs ${escapeHtml(game.away)}</h2><div class="muted">${escapeHtml(game.date)} • ${escapeHtml(game.time)} • ${escapeHtml(game.field)}</div></div><button class="btn ghost" id="closeGameDialog">Close</button></div><div class="form-grid"><label>Game status<select id="dlgStatus"><option ${game.status==='Scheduled'?'selected':''}>Scheduled</option><option ${game.status==='Ready'?'selected':''}>Ready</option><option ${game.status==='In Progress'?'selected':''}>In Progress</option><option ${game.status==='Completed'?'selected':''}>Completed</option></select></label><label>Field<select id="dlgField">${state.fields.map(f=>`<option ${game.field===f.name?'selected':''}>${escapeHtml(f.name)}</option>`).join('')}</select></label><label>Ref 1<select id="dlgRef1">${refsOpts}</select></label><label>Ref 2<select id="dlgRef2">${ref2Opts}</select></label><label>Score Table<select id="dlgScoreTable"><option value="">Select volunteer</option>${state.volunteers.map(v=>`<option ${game.scoreTable===v.name?'selected':''}>${escapeHtml(v.name)}</option>`).join('')}</select></label><label>Clock<select id="dlgClock"><option value="">Select volunteer</option>${state.volunteers.map(v=>`<option ${game.clock===v.name?'selected':''}>${escapeHtml(v.name)}</option>`).join('')}</select></label><label>Home score<input type="number" id="dlgHomeScore" value="${game.homeScore||0}" min="0" /></label><label>Away score<input type="number" id="dlgAwayScore" value="${game.awayScore||0}" min="0" /></label><label>Home warnings<input type="number" id="dlgHomeWarn" value="${game.homeWarnings||0}" min="0" /></label><label>Away warnings<input type="number" id="dlgAwayWarn" value="${game.awayWarnings||0}" min="0" /></label><label>Home ejections<input type="number" id="dlgHomeEj" value="${game.homeEjections||0}" min="0" /></label><label>Away ejections<input type="number" id="dlgAwayEj" value="${game.awayEjections||0}" min="0" /></label><label class="span2">Fight / disruption notes<textarea id="dlgDisruption">${escapeHtml(game.disruptionNote || '')}</textarea></label></div><div class="actions"><button class="btn" id="saveGameDialog">Save game</button><button class="btn ghost" id="verifyFromDialogBtn">Open check-in</button></div></div>`;
  d.showModal();
  $('#closeGameDialog').onclick = ()=> d.close();
  $('#verifyFromDialogBtn').onclick = ()=> { d.close(); selectedGameId = game.id; switchTab('checkin'); renderCheckin(); };
  $('#saveGameDialog').onclick = ()=> {
    game.status = $('#dlgStatus').value; game.field = $('#dlgField').value; game.ref1 = $('#dlgRef1').value; game.ref2 = $('#dlgRef2').value; game.scoreTable = $('#dlgScoreTable').value; game.clock = $('#dlgClock').value; game.homeScore = Number($('#dlgHomeScore').value||0); game.awayScore = Number($('#dlgAwayScore').value||0); game.homeWarnings = Number($('#dlgHomeWarn').value||0); game.awayWarnings = Number($('#dlgAwayWarn').value||0); game.homeEjections = Number($('#dlgHomeEj').value||0); game.awayEjections = Number($('#dlgAwayEj').value||0); game.disruptionNote = $('#dlgDisruption').value.trim(); game.fight = !!game.disruptionNote; saveState(); addMessage('game', `Updated ${game.home} vs ${game.away}. Score ${game.homeScore}-${game.awayScore}.`); d.close(); render();
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
function switchTab(id){ $$('#mainNav button').forEach(b=>b.classList.toggle('active', b.dataset.tab===id)); $$('.tab').forEach(t=>t.classList.toggle('active', t.id===id)); }
function exportBackup(){ const blob=new Blob([JSON.stringify(state,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`leagueops-live-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href); }
function resetDemo(){ localStorage.removeItem(STORAGE_KEY); location.reload(); }
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

document.addEventListener('DOMContentLoaded', ()=> {
  tabSetup(); render();
  $('#exportBtn').onclick = exportBackup;
  $('#resetBtn').onclick = resetDemo;
});
