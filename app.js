const STORAGE_KEY = 'leagueops-live-rwb-v1';
const uid = (p='id') => `${p}-${Math.random().toString(36).slice(2,9)}`;
const timestamp = () => new Date().toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});

const seed = {
  currentLeagueId: 'nfyll',
  selectedTeamId: 't1',
  leagues: [
    {
      id: 'nfyll',
      name: 'NFYLL',
      trainer: {name:'Sarah Lopez', location:'Central Tent', status:'Available', respondingTo:''},
      weather: {active:false, until:'', note:'Fields open', history:[{time:timestamp(), text:'No active weather delay. Fields open.'}]},
      fields: [
        {id:'f1', name:'Field 1', type:'Full Field'},
        {id:'f2', name:'Field 2', type:'7v7'},
        {id:'f3', name:'Field 3', type:'Modified'},
        {id:'f6', name:'Field 6 Turf', type:'Full Field'}
      ],
      teams: [
        {id:'t1', name:'Creekside', division:'14U', players:[
          {id:'p1', number:12, name:'Megan Packer', eligibility:'Verified', usaId:'USAL-10293'},
          {id:'p2', number:8, name:'Brooke Smith', eligibility:'Verified', usaId:'USAL-11552'}
        ]},
        {id:'t2', name:'Jax Lax', division:'14U', players:[
          {id:'p3', number:22, name:'Ava Jones', eligibility:'Verified', usaId:'USAL-90212'},
          {id:'p4', number:4, name:'Ella Martin', eligibility:'Pending', usaId:'USAL-77880'}
        ]},
        {id:'t3', name:'Riptide', division:'12U', players:[
          {id:'p5', number:7, name:'Kaylee Ford', eligibility:'Verified', usaId:'USAL-44211'},
          {id:'p6', number:15, name:'Harper Green', eligibility:'Verified', usaId:'USAL-44009'}
        ]}
      ],
      refs: [
        {id:'r1', name:'Tyler Brooks', level:'Level 2', games7v7:10, gamesModified:9, gamesFull:8, notes:'Strong on restart mechanics.'},
        {id:'r2', name:'Mason Lee', level:'Level 1', games7v7:12, gamesModified:7, gamesFull:2, notes:'Needs more full field reps.'},
        {id:'r3', name:'Jake Turner', level:'Level 2', games7v7:8, gamesModified:11, gamesFull:6, notes:'Good field presence.'}
      ],
      volunteers: [
        {id:'v1', name:'Megan Packer', role:'Clock'},
        {id:'v2', name:'Ashton Packer', role:'Score Table'},
        {id:'v3', name:'Amy Packer', role:'Field Marshal'}
      ],
      games: [
        {id:'g1', time:'9:00 AM', homeTeamId:'t1', awayTeamId:'t2', fieldId:'f1', fieldType:'Full Field', status:'In Progress', ref1:'Tyler Brooks', ref2:'Mason Lee', clock:'Megan Packer', score:'Ashton Packer', rosterHomeVerified:true, rosterAwayVerified:true, homeScore:4, awayScore:3, warningsHome:1, warningsAway:0, ejectionsHome:0, ejectionsAway:0, fightOrDisruption:false, disruptionNotes:''},
        {id:'g2', time:'10:15 AM', homeTeamId:'t2', awayTeamId:'t3', fieldId:'f2', fieldType:'7v7', status:'Missing Staff', ref1:'OPEN', ref2:'Jake Turner', clock:'OPEN', score:'OPEN', rosterHomeVerified:true, rosterAwayVerified:false, homeScore:0, awayScore:0, warningsHome:0, warningsAway:0, ejectionsHome:0, ejectionsAway:0, fightOrDisruption:false, disruptionNotes:''},
        {id:'g3', time:'11:30 AM', homeTeamId:'t1', awayTeamId:'t3', fieldId:'f6', fieldType:'Full Field', status:'Ready', ref1:'Tyler Brooks', ref2:'Jake Turner', clock:'Megan Packer', score:'Ashton Packer', rosterHomeVerified:false, rosterAwayVerified:false, homeScore:0, awayScore:0, warningsHome:0, warningsAway:0, ejectionsHome:0, ejectionsAway:0, fightOrDisruption:false, disruptionNotes:''}
      ],
      checkins: [
        {id:'c1', time:timestamp(), role:'Volunteer', name:'Megan Packer', notes:'Field 1 clock'},
        {id:'c2', time:timestamp(), role:'Referee', name:'Tyler Brooks', notes:'On site'}
      ],
      injuries: [],
      messages: [
        {id:'m1', time:timestamp(), type:'Site Alert', text:'Game day operations live.'},
        {id:'m2', time:timestamp(), type:'Score Table', text:'Field 1 score table staffed and active.'}
      ]
    },
    {
      id: 'creeks',
      name: 'Creeks Girls Lacrosse',
      trainer: {name:'Open', location:'Home sideline', status:'Pending', respondingTo:''},
      weather: {active:false, until:'', note:'Fields open', history:[{time:timestamp(), text:'No active weather delay. Fields open.'}]},
      fields: [{id:'cf1', name:'Stadium', type:'Full Field'}],
      teams: [{id:'ct1', name:'Creeks Varsity', division:'HS', players:[]}],
      refs: [],
      volunteers: [],
      games: [],
      checkins: [],
      injuries: [],
      messages: []
    }
  ]
};

let state = loadState();
let editingGameId = null;

function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function league(){ return state.leagues.find(l => l.id === state.currentLeagueId) || state.leagues[0]; }
function team(){ return league().teams.find(t => t.id === state.selectedTeamId) || league().teams[0] || null; }
function teamName(id){ return league().teams.find(t => t.id === id)?.name || 'Open'; }
function fieldName(id){ return league().fields.find(f => f.id === id)?.name || 'Unassigned'; }
function statusClass(status){ return status.toLowerCase().replace(/\s+/g,'-'); }
function totalWarnings(g){ return Number(g.warningsHome||0) + Number(g.warningsAway||0); }
function totalEjections(g){ return Number(g.ejectionsHome||0) + Number(g.ejectionsAway||0); }
function listHTML(items, fallback='Nothing to show.'){
  return items.length ? items.join('') : `<div class="muted">${fallback}</div>`;
}

function initTabs(){
  document.querySelectorAll('#tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tabs button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function renderLeagueSelect(){
  const select = document.getElementById('leagueSelect');
  select.innerHTML = state.leagues.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
  select.value = state.currentLeagueId;
  select.onchange = () => {
    state.currentLeagueId = select.value;
    if (!league().teams.find(t => t.id === state.selectedTeamId)) state.selectedTeamId = league().teams[0]?.id || null;
    saveState();
    renderAll();
  };
}

function renderHeader(){
  const l = league();
  document.getElementById('trainerName').textContent = `Trainer: ${l.trainer.name || 'Unassigned'}`;
  const trainerBits = [`Location: ${l.trainer.location || '--'}`, `Status: ${l.trainer.status || '--'}`];
  if (l.trainer.respondingTo) trainerBits.push(`Responding To: ${l.trainer.respondingTo}`);
  document.getElementById('trainerMeta').textContent = trainerBits.join(' | ');
  document.getElementById('weatherStatus').textContent = l.weather.active ? 'Weather Delay Active' : 'No Active Delay';
  document.getElementById('weatherMeta').textContent = l.weather.active ? `${l.weather.note} | Until ${l.weather.until || 'TBD'}` : 'Fields open';

  const gaps = l.games.filter(g => [g.ref1,g.ref2,g.clock,g.score].includes('OPEN')).length;
  const conductGames = l.games.filter(g => g.fightOrDisruption || totalWarnings(g) || totalEjections(g)).length;
  const stats = [
    {label:'Games', value:l.games.length},
    {label:'Open Gaps', value:gaps},
    {label:'Warnings', value:l.games.reduce((sum,g)=>sum+totalWarnings(g),0)},
    {label:'Ejections', value:l.games.reduce((sum,g)=>sum+totalEjections(g),0)},
    {label:'Disruptions', value:l.games.filter(g=>g.fightOrDisruption).length},
    {label:'Roster Issues', value:l.games.filter(g=>!g.rosterHomeVerified || !g.rosterAwayVerified).length},
    {label:'Check-Ins', value:l.checkins.length},
    {label:'Conduct Games', value:conductGames}
  ];
  document.getElementById('snapshotStats').innerHTML = stats.map(s => `<div class="stat-tile"><div class="label">${s.label}</div><div class="value">${s.value}</div></div>`).join('');
}

function dashboardGapItems(){
  return league().games.flatMap(g => {
    const items = [];
    if ([g.ref1,g.ref2].includes('OPEN')) items.push(`<div class="log-item"><strong>${g.time}</strong><div>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</div><div class="muted">Ref coverage needed</div></div>`);
    if ([g.clock,g.score].includes('OPEN')) items.push(`<div class="log-item"><strong>${g.time}</strong><div>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</div><div class="muted">Score table staffing needed</div></div>`);
    return items;
  });
}

function renderDashboard(){
  const l = league();
  document.getElementById('dashboardGaps').innerHTML = listHTML(dashboardGapItems().slice(0,6), 'No staffing gaps right now.');
  document.getElementById('dashboardCheckins').innerHTML = listHTML(
    l.checkins.slice().reverse().slice(0,6).map(c => `<div class="log-item"><strong>${c.time}</strong><div>${c.role} — ${c.name}</div><div class="muted">${c.notes || ''}</div></div>`),
    'No recent check-ins.'
  );
  document.getElementById('dashboardMessages').innerHTML = listHTML(
    l.messages.slice().reverse().slice(0,6).map(m => `<div class="log-item"><strong>${m.time}</strong><div>${m.type}</div><div>${m.text}</div></div>`),
    'No messages yet.'
  );
  const conduct = l.games.filter(g => g.fightOrDisruption || totalWarnings(g) || totalEjections(g));
  document.getElementById('dashboardConduct').innerHTML = listHTML(
    conduct.slice(0,6).map(g => `<div class="log-item"><strong>${g.time}</strong><div>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</div><div class="muted">Warnings: ${totalWarnings(g)} | Ejections: ${totalEjections(g)}${g.fightOrDisruption ? ' | Disruption flagged' : ''}</div></div>`),
    'No conduct issues logged.'
  );
}

function gameCard(g){
  const disruption = g.fightOrDisruption ? `<div class="disruption-flag">Fight / disruption flagged${g.disruptionNotes ? ` — ${g.disruptionNotes}` : ''}</div>` : '';
  const rosterPill = (!g.rosterHomeVerified || !g.rosterAwayVerified) ? '<span class="pill alert">Roster Pending</span>' : '<span class="pill">Roster Verified</span>';
  const conductPill = (totalWarnings(g) || totalEjections(g) || g.fightOrDisruption) ? '<span class="pill warn">Conduct Logged</span>' : '';
  return `
    <div class="game-card ${statusClass(g.status)}">
      <div class="game-title">
        <div>
          <h5>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</h5>
          <div class="small-meta">${g.time} • ${fieldName(g.fieldId)} • ${g.fieldType}</div>
        </div>
        <div>
          <span class="pill">${g.status}</span>
        </div>
      </div>
      <div class="score-row">
        <div>
          <div class="small-meta">Score Table</div>
          <div class="score-line">${teamName(g.homeTeamId)} ${g.homeScore || 0} — ${g.awayScore || 0} ${teamName(g.awayTeamId)}</div>
        </div>
        <div class="small-meta">Recorder: ${g.score || 'OPEN'}</div>
      </div>
      <div class="conduct-row">
        <div class="conduct-cell"><strong>Home</strong><div>Warnings: ${g.warningsHome || 0}</div><div>Ejections: ${g.ejectionsHome || 0}</div></div>
        <div class="conduct-cell"><strong>Away</strong><div>Warnings: ${g.warningsAway || 0}</div><div>Ejections: ${g.ejectionsAway || 0}</div></div>
      </div>
      ${disruption}
      <div class="details-grid small-meta">
        <div>Ref 1: ${g.ref1 || 'OPEN'}</div>
        <div>Ref 2: ${g.ref2 || 'OPEN'}</div>
        <div>Clock: ${g.clock || 'OPEN'}</div>
        <div>Score Table: ${g.score || 'OPEN'}</div>
      </div>
      <div class="inline-actions">${rosterPill}${conductPill}</div>
      <div class="game-actions">
        <button data-edit-game="${g.id}">Edit / Score</button>
        <button class="ghost" data-toggle-home="${g.id}">${g.rosterHomeVerified ? 'Home Verified' : 'Verify Home'}</button>
        <button class="ghost" data-toggle-away="${g.id}">${g.rosterAwayVerified ? 'Away Verified' : 'Verify Away'}</button>
      </div>
    </div>`;
}

function renderBoard(){
  const l = league();
  document.getElementById('availableRefs').innerHTML = listHTML(
    l.refs.map(r => `<div class="person-chip"><strong>${r.name}</strong><div class="muted">${r.level}</div></div>`),
    'No referees loaded.'
  );
  document.getElementById('availableVolunteers').innerHTML = listHTML(
    l.volunteers.map(v => `<div class="person-chip"><strong>${v.name}</strong><div class="muted">${v.role}</div></div>`),
    'No volunteers loaded.'
  );
  document.getElementById('staffingGaps').innerHTML = listHTML(dashboardGapItems().slice(0,10), 'No current staffing gaps.');
  const board = document.getElementById('fieldBoard');
  board.innerHTML = l.fields.map(f => `
    <div class="field-column">
      <h4>${f.name}</h4>
      <div class="field-meta">${f.type}</div>
      <div class="game-stack">${listHTML(l.games.filter(g => g.fieldId === f.id).map(gameCard), 'No games assigned.')}</div>
    </div>`).join('');
  board.querySelectorAll('[data-edit-game]').forEach(btn => btn.onclick = () => openGameDialog(btn.dataset.editGame));
  board.querySelectorAll('[data-toggle-home]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleHome, 'home'));
  board.querySelectorAll('[data-toggle-away]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleAway, 'away'));
}

function renderSiteOps(){
  const l = league();
  const summary = [
    `<div class="site-item"><strong>League</strong><div class="muted">${l.name}</div></div>`,
    `<div class="site-item"><strong>Trainer</strong><div class="muted">${l.trainer.name} • ${l.trainer.status}${l.trainer.respondingTo ? ` • ${l.trainer.respondingTo}` : ''}</div></div>`,
    `<div class="site-item"><strong>Weather</strong><div class="muted">${l.weather.active ? `Delay until ${l.weather.until}` : 'Open'}</div></div>`,
    `<div class="site-item"><strong>Conduct</strong><div class="muted">Warnings ${l.games.reduce((s,g)=>s+totalWarnings(g),0)} • Ejections ${l.games.reduce((s,g)=>s+totalEjections(g),0)} • Disruptions ${l.games.filter(g=>g.fightOrDisruption).length}</div></div>`
  ];
  document.getElementById('siteOpsSummary').innerHTML = summary.join('');
  document.getElementById('fieldStatusList').innerHTML = l.fields.map(f => {
    const games = l.games.filter(g => g.fieldId === f.id);
    const scoreReady = games.filter(g => g.score !== 'OPEN').length;
    return `<div class="site-item"><strong>${f.name}</strong><div class="muted">${games.length} games • Score table staffed ${scoreReady}/${games.length || 0}</div></div>`;
  }).join('');
}

function renderCheckins(){
  document.getElementById('checkinLog').innerHTML = listHTML(
    league().checkins.slice().reverse().map(c => `<div class="log-item"><strong>${c.time}</strong><div>${c.role} — ${c.name}</div><div class="muted">${c.notes || ''}</div></div>`),
    'No check-ins yet.'
  );
}

function renderRosters(){
  const l = league();
  const teamList = document.getElementById('teamList');
  teamList.innerHTML = l.teams.map(t => `<button class="ghost ${state.selectedTeamId===t.id?'active-team':''}" data-team-id="${t.id}">${t.name}<div class="muted">${t.division}</div></button>`).join('');
  teamList.querySelectorAll('[data-team-id]').forEach(btn => btn.onclick = () => {
    state.selectedTeamId = btn.dataset.teamId; saveState(); renderRosters();
  });
  const t = team();
  document.getElementById('rosterTitle').textContent = t ? `${t.name} Roster` : 'Roster';
  document.getElementById('playerCards').innerHTML = t && t.players.length ? t.players.map(p => `
    <div class="player-card">
      <strong>#${p.number} ${p.name}</strong>
      <div>${t.name}</div>
      <div class="muted">Eligibility: ${p.eligibility}</div>
      <div class="muted">USA ID: ${p.usaId || '--'}</div>
    </div>`).join('') : '<div class="muted">No players added.</div>';
}

function renderVerification(){
  const list = league().games.map(g => `
    <div class="verification-item">
      <strong>${g.time} — ${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</strong>
      <div class="muted">${fieldName(g.fieldId)}</div>
      <div class="inline-actions">
        <button class="ghost" data-toggle-home="${g.id}">${g.rosterHomeVerified ? 'Home Verified' : 'Verify Home'}</button>
        <button class="ghost" data-toggle-away="${g.id}">${g.rosterAwayVerified ? 'Away Verified' : 'Verify Away'}</button>
      </div>
    </div>`);
  document.getElementById('verificationList').innerHTML = listHTML(list, 'No games loaded.');
  document.querySelectorAll('#verification [data-toggle-home]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleHome, 'home'));
  document.querySelectorAll('#verification [data-toggle-away]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleAway, 'away'));
}

function renderRefs(){
  document.getElementById('refDevelopmentList').innerHTML = listHTML(
    league().refs.map(r => {
      const total = Number(r.games7v7||0)+Number(r.gamesModified||0)+Number(r.gamesFull||0);
      return `<div class="log-item"><strong>${r.name}</strong><div>${r.level}</div><div class="muted">7v7: ${r.games7v7} • Modified: ${r.gamesModified} • Full: ${r.gamesFull} • Total: ${total}</div><div class="muted">${r.notes || ''}</div></div>`;
    }),
    'No referees added.'
  );
}

function renderInjuries(){
  const l = league();
  const teamSelect = document.getElementById('injuryTeam');
  const fieldSelect = document.getElementById('injuryField');
  teamSelect.innerHTML = l.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  fieldSelect.innerHTML = l.fields.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  document.getElementById('injuryLog').innerHTML = listHTML(
    l.injuries.slice().reverse().map(i => `<div class="log-item"><strong>${i.time}</strong><div>${i.player} • ${teamName(i.teamId)} • ${fieldName(i.fieldId)}</div><div class="muted">${i.type} • ${i.severity}</div><div class="muted">${i.notes || ''}</div></div>`),
    'No injuries reported.'
  );
}

function renderWeather(){
  document.getElementById('weatherHistory').innerHTML = listHTML(
    league().weather.history.slice().reverse().map(h => `<div class="log-item"><strong>${h.time}</strong><div>${h.text}</div></div>`),
    'No weather events logged.'
  );
}

function renderComms(){
  document.getElementById('messageLog').innerHTML = listHTML(
    league().messages.slice().reverse().map(m => `<div class="log-item"><strong>${m.time}</strong><div>${m.type}</div><div>${m.text}</div></div>`),
    'No messages yet.'
  );
}

function renderAll(){
  renderLeagueSelect();
  renderHeader();
  renderDashboard();
  renderBoard();
  renderSiteOps();
  renderCheckins();
  renderRosters();
  renderVerification();
  renderRefs();
  renderInjuries();
  renderWeather();
  renderComms();
}

function toggleVerification(gameId, side){
  const g = league().games.find(x => x.id === gameId);
  if (!g) return;
  if (side === 'home') g.rosterHomeVerified = !g.rosterHomeVerified;
  if (side === 'away') g.rosterAwayVerified = !g.rosterAwayVerified;
  league().messages.push({id:uid('m'), time:timestamp(), type:'Roster', text:`${teamName(side === 'home' ? g.homeTeamId : g.awayTeamId)} ${side} roster ${side === 'home' ? g.rosterHomeVerified : g.rosterAwayVerified ? 'verified' : 'marked pending'}.`});
  saveState();
  renderAll();
}

function openGameDialog(gameId){
  editingGameId = gameId;
  const l = league();
  const g = l.games.find(x => x.id === gameId);
  if (!g) return;
  gameHomeInput.innerHTML = l.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  gameAwayInput.innerHTML = l.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  gameFieldInput.innerHTML = l.fields.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  gameTimeInput.value = g.time;
  gameHomeInput.value = g.homeTeamId;
  gameAwayInput.value = g.awayTeamId;
  gameFieldInput.value = g.fieldId;
  gameFieldTypeInput.value = g.fieldType;
  gameStatusInput.value = g.status;
  gameRef1Input.value = g.ref1;
  gameRef2Input.value = g.ref2;
  gameClockInput.value = g.clock;
  gameScoreInput.value = g.score;
  gameHomeScoreInput.value = g.homeScore || 0;
  gameAwayScoreInput.value = g.awayScore || 0;
  gameWarningsHomeInput.value = g.warningsHome || 0;
  gameWarningsAwayInput.value = g.warningsAway || 0;
  gameEjectionsHomeInput.value = g.ejectionsHome || 0;
  gameEjectionsAwayInput.value = g.ejectionsAway || 0;
  gameFightInput.checked = !!g.fightOrDisruption;
  gameDisruptionNotesInput.value = g.disruptionNotes || '';
  gameDialog.showModal();
}

function startDelay(untilVal, noteVal){
  const l = league();
  const until = untilVal || prompt('Delay until?', l.weather.until || '10:45 AM') || '';
  const note = noteVal || prompt('Delay note', l.weather.note === 'Fields open' ? 'Lightning within 8 miles' : l.weather.note) || 'Weather hold';
  l.weather.active = true;
  l.weather.until = until;
  l.weather.note = note;
  l.weather.history.push({time:timestamp(), text:`Delay active until ${until}. ${note}`});
  l.messages.push({id:uid('m'), time:timestamp(), type:'Weather', text:`Delay active until ${until}. ${note}`});
  saveState();
  renderAll();
}

function resumePlay(){
  const l = league();
  l.weather.active = false;
  l.weather.until = '';
  l.weather.note = 'Fields open';
  l.weather.history.push({time:timestamp(), text:'Weather delay cleared. Resume play.'});
  l.messages.push({id:uid('m'), time:timestamp(), type:'Weather', text:'Weather delay cleared. Resume play.'});
  saveState();
  renderAll();
}

function bindActions(){
  document.getElementById('exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leagueops-live-data.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  document.getElementById('resetBtn').onclick = () => {
    if (confirm('Reset demo data?')) {
      state = structuredClone(seed);
      saveState();
      renderAll();
    }
  };
  document.getElementById('setTrainerBtn').onclick = () => {
    const name = prompt('Trainer name', league().trainer.name || '');
    if (name !== null) {
      league().trainer.name = name || 'Unassigned';
      saveState();
      renderAll();
    }
  };
  document.getElementById('trainerRespondBtn').onclick = () => {
    const loc = prompt('Responding to which field?', league().trainer.respondingTo || '');
    if (loc !== null) {
      league().trainer.respondingTo = loc;
      league().trainer.status = 'Responding';
      league().messages.push({id:uid('m'), time:timestamp(), type:'Trainer', text:`Trainer responding to ${loc}`});
      saveState();
      renderAll();
    }
  };
  document.getElementById('trainerClearBtn').onclick = () => {
    league().trainer.respondingTo = '';
    league().trainer.status = 'Available';
    saveState();
    renderAll();
  };
  document.getElementById('startDelayBtn').onclick = () => startDelay();
  document.getElementById('resumePlayBtn').onclick = () => resumePlay();
  document.getElementById('startDelayFromFormBtn').onclick = () => startDelay(delayUntilInput.value, delayNoteInput.value);
  document.getElementById('resumeFromFormBtn').onclick = () => resumePlay();

  document.getElementById('checkinSubmitBtn').onclick = () => {
    const name = checkinName.value.trim();
    if (!name) return;
    league().checkins.push({id:uid('c'), time:timestamp(), role:checkinRole.value, name, notes:checkinNotes.value.trim()});
    checkinName.value = '';
    checkinNotes.value = '';
    saveState();
    renderAll();
  };

  document.getElementById('sendMessageBtn').onclick = () => {
    const text = messageText.value.trim();
    if (!text) return;
    league().messages.push({id:uid('m'), time:timestamp(), type:messageType.value, text});
    messageText.value = '';
    saveState();
    renderAll();
  };

  document.getElementById('saveRefBtn').onclick = () => {
    const name = refName.value.trim();
    if (!name) return;
    league().refs.push({
      id:uid('r'),
      name,
      level:refLevel.value,
      games7v7:Number(ref7v7.value || 0),
      gamesModified:Number(refModified.value || 0),
      gamesFull:Number(refFull.value || 0),
      notes:refNotes.value.trim()
    });
    refName.value = refNotes.value = '';
    ref7v7.value = refModified.value = refFull.value = 0;
    saveState();
    renderAll();
  };

  document.getElementById('saveInjuryBtn').onclick = () => {
    const player = injuryPlayer.value.trim();
    if (!player) return;
    league().injuries.push({
      id:uid('i'),
      time:timestamp(),
      player,
      teamId:injuryTeam.value,
      fieldId:injuryField.value,
      severity:injurySeverity.value,
      type:injuryType.value,
      notes:injuryNotes.value.trim()
    });
    injuryPlayer.value = injuryNotes.value = '';
    league().messages.push({id:uid('m'), time:timestamp(), type:'Site Alert', text:`Injury reported for ${player} on ${fieldName(injuryField.value)}.`});
    saveState();
    renderAll();
  };

  document.getElementById('addTeamBtn').onclick = () => {
    const name = prompt('Team name');
    if (!name) return;
    const division = prompt('Division', '14U') || '14U';
    const t = {id:uid('t'), name, division, players:[]};
    league().teams.push(t);
    state.selectedTeamId = t.id;
    saveState();
    renderAll();
  };

  document.getElementById('addPlayerBtn').onclick = () => {
    const t = team();
    if (!t) return;
    const name = prompt('Player name');
    if (!name) return;
    const number = prompt('Jersey number', '0') || '0';
    const usaId = prompt('USA Lacrosse ID', '') || '';
    t.players.push({id:uid('p'), number, name, eligibility:'Pending', usaId});
    saveState();
    renderAll();
  };

  document.getElementById('addGameBtn').onclick = () => {
    const l = league();
    const home = l.teams[0]?.id, away = l.teams[1]?.id, field = l.fields[0]?.id;
    if (!home || !away || !field) return;
    l.games.push({id:uid('g'), time:'12:00 PM', homeTeamId:home, awayTeamId:away, fieldId:field, fieldType:fieldName(field), status:'Missing Staff', ref1:'OPEN', ref2:'OPEN', clock:'OPEN', score:'OPEN', rosterHomeVerified:false, rosterAwayVerified:false, homeScore:0, awayScore:0, warningsHome:0, warningsAway:0, ejectionsHome:0, ejectionsAway:0, fightOrDisruption:false, disruptionNotes:''});
    saveState();
    renderAll();
  };

  document.getElementById('saveGameBtn').onclick = (e) => {
    e.preventDefault();
    const g = league().games.find(x => x.id === editingGameId);
    if (!g) return;
    const previousDisruption = g.fightOrDisruption;
    g.time = gameTimeInput.value;
    g.homeTeamId = gameHomeInput.value;
    g.awayTeamId = gameAwayInput.value;
    g.fieldId = gameFieldInput.value;
    g.fieldType = gameFieldTypeInput.value;
    g.status = gameStatusInput.value;
    g.ref1 = gameRef1Input.value || 'OPEN';
    g.ref2 = gameRef2Input.value || 'OPEN';
    g.clock = gameClockInput.value || 'OPEN';
    g.score = gameScoreInput.value || 'OPEN';
    g.homeScore = Number(gameHomeScoreInput.value || 0);
    g.awayScore = Number(gameAwayScoreInput.value || 0);
    g.warningsHome = Number(gameWarningsHomeInput.value || 0);
    g.warningsAway = Number(gameWarningsAwayInput.value || 0);
    g.ejectionsHome = Number(gameEjectionsHomeInput.value || 0);
    g.ejectionsAway = Number(gameEjectionsAwayInput.value || 0);
    g.fightOrDisruption = gameFightInput.checked;
    g.disruptionNotes = gameDisruptionNotesInput.value.trim();

    league().messages.push({id:uid('m'), time:timestamp(), type:'Score Table', text:`${teamName(g.homeTeamId)} ${g.homeScore} - ${g.awayScore} ${teamName(g.awayTeamId)} updated on ${fieldName(g.fieldId)}.`});
    if ((totalWarnings(g) || totalEjections(g)) > 0) {
      league().messages.push({id:uid('m'), time:timestamp(), type:'Conduct', text:`${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)} conduct updated. Warnings ${totalWarnings(g)}, Ejections ${totalEjections(g)}.`});
    }
    if (g.fightOrDisruption && (!previousDisruption || g.disruptionNotes)) {
      league().messages.push({id:uid('m'), time:timestamp(), type:'Conduct', text:`Fight/disruption flagged for ${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}${g.disruptionNotes ? ` — ${g.disruptionNotes}` : ''}.`});
    }
    saveState();
    renderAll();
    gameDialog.close();
  };
}

initTabs();
bindActions();
renderAll();
