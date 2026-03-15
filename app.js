const STORAGE_KEY = 'leagueops-live-v4';

const seed = {
  leagues: [
    {
      id: 'nfyll',
      name: 'NFYLL',
      trainer: { name: 'Sarah Lopez', location: 'Central Tent', status: 'Available', respondingTo: '' },
      weather: { active: false, until: '', note: 'Fields open' },
      fields: [
        { id: 'f1', name: 'Field 1', type: 'Full Field' },
        { id: 'f2', name: 'Field 2', type: '7v7' },
        { id: 'f3', name: 'Field 3', type: 'Modified' },
        { id: 'f6', name: 'Field 6 Turf', type: 'Full Field' }
      ],
      teams: [
        { id: 't1', name: 'Creekside', division: '14U', players: [
          { id: 'p1', number: 12, name: 'Megan Packer', eligibility: 'Verified', usaId: 'USAL-10293' },
          { id: 'p2', number: 8, name: 'Brooke Smith', eligibility: 'Verified', usaId: 'USAL-11552' }
        ]},
        { id: 't2', name: 'Jax Lax', division: '14U', players: [
          { id: 'p3', number: 22, name: 'Ava Jones', eligibility: 'Verified', usaId: 'USAL-90212' },
          { id: 'p4', number: 4, name: 'Ella Martin', eligibility: 'Pending', usaId: 'USAL-77880' }
        ]},
        { id: 't3', name: 'Riptide', division: '12U', players: [
          { id: 'p5', number: 3, name: 'Kylie Grant', eligibility: 'Verified', usaId: 'USAL-19002' }
        ]},
        { id: 't4', name: 'Redhawks', division: '12U', players: [
          { id: 'p6', number: 11, name: 'Harper Lee', eligibility: 'Verified', usaId: 'USAL-22018' }
        ]}
      ],
      refs: [
        { id: 'r1', name: 'Tyler Brooks', level: 'Level 2', games7v7: 6, gamesModified: 4, gamesFull: 8, notes: 'Strong positioning.' },
        { id: 'r2', name: 'Mason Lee', level: 'Level 1', games7v7: 8, gamesModified: 3, gamesFull: 0, notes: 'Needs more full field reps.' },
        { id: 'r3', name: 'Jake Turner', level: 'Level 2', games7v7: 4, gamesModified: 6, gamesFull: 5, notes: 'Good game management.' }
      ],
      volunteers: [
        { id: 'v1', name: 'Megan Packer', role: 'Clock / Score' },
        { id: 'v2', name: 'Ashton Packer', role: 'Score Table' },
        { id: 'v3', name: 'Amy Packer', role: 'Field Marshal' }
      ],
      games: [
        { id: 'g1', time: '9:00 AM', homeTeamId: 't4', awayTeamId: 't3', fieldId: 'f1', fieldType: 'Full Field', status: 'Ready', ref1: 'Tyler Brooks', ref2: 'Jake Turner', clock: 'Megan Packer', score: 'Ashton Packer', rosterHomeVerified: true, rosterAwayVerified: true },
        { id: 'g2', time: '10:15 AM', homeTeamId: 't1', awayTeamId: 't2', fieldId: 'f2', fieldType: '7v7', status: 'Missing Staff', ref1: 'OPEN', ref2: 'OPEN', clock: 'OPEN', score: 'Amy Packer', rosterHomeVerified: false, rosterAwayVerified: false },
        { id: 'g3', time: '11:30 AM', homeTeamId: 't3', awayTeamId: 't2', fieldId: 'f6', fieldType: 'Full Field', status: 'Roster Issue', ref1: 'Tyler Brooks', ref2: 'OPEN', clock: 'OPEN', score: 'OPEN', rosterHomeVerified: true, rosterAwayVerified: false }
      ],
      checkins: [],
      messages: [
        { id: 'm1', time: timestamp(), type: 'Site Alert', text: 'Operations board initialized.' }
      ],
      injuries: []
    },
    {
      id: 'creeks',
      name: 'Creeks Girls Lacrosse',
      trainer: { name: 'Open', location: 'Sideline Tent', status: 'Unassigned', respondingTo: '' },
      weather: { active: false, until: '', note: 'Fields open' },
      fields: [
        { id: 'cf1', name: 'Stadium Field', type: 'Full Field' },
        { id: 'cf2', name: 'Practice Field', type: 'Modified' }
      ],
      teams: [
        { id: 'ct1', name: 'Creeks JV', division: 'JV', players: [] },
        { id: 'ct2', name: 'Creeks Varsity', division: 'Varsity', players: [] }
      ],
      refs: [], volunteers: [], games: [], checkins: [], messages: [], injuries: []
    }
  ],
  selectedLeagueId: 'nfyll',
  selectedTeamId: 't1'
};

let state = loadState();
let editingGameId = null;

function timestamp() {
  return new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(seed);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(seed);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currentLeague() {
  return state.leagues.find(l => l.id === state.selectedLeagueId) || state.leagues[0];
}

function currentTeam() {
  const league = currentLeague();
  return league.teams.find(t => t.id === state.selectedTeamId) || league.teams[0] || null;
}

function byId(list, id) {
  return list.find(item => item.id === id);
}

function teamName(teamId) {
  const league = currentLeague();
  return byId(league.teams, teamId)?.name || 'TBD';
}

function fieldName(fieldId) {
  const league = currentLeague();
  return byId(league.fields, fieldId)?.name || 'Unassigned';
}

function setActiveTab(tabId) {
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === tabId));
}

function initTabs() {
  document.getElementById('tabs').addEventListener('click', e => {
    if (e.target.matches('button[data-tab]')) setActiveTab(e.target.dataset.tab);
  });
}

function renderLeagueSelect() {
  const select = document.getElementById('leagueSelect');
  select.innerHTML = state.leagues.map(league => `<option value="${league.id}">${league.name}</option>`).join('');
  select.value = state.selectedLeagueId;
  select.onchange = () => {
    state.selectedLeagueId = select.value;
    const league = currentLeague();
    state.selectedTeamId = league.teams[0]?.id || '';
    saveState();
    renderAll();
  };
}

function renderHeader() {
  const league = currentLeague();
  document.getElementById('trainerName').textContent = `Trainer: ${league.trainer.name || 'Unassigned'}`;
  const response = league.trainer.respondingTo ? ` | Responding: ${league.trainer.respondingTo}` : '';
  document.getElementById('trainerMeta').textContent = `Location: ${league.trainer.location || '--'} | Status: ${league.trainer.status || '--'}${response}`;
  document.getElementById('weatherStatus').textContent = league.weather.active ? '⚡ Weather Delay Active' : 'No Active Delay';
  document.getElementById('weatherMeta').textContent = league.weather.active ? `Hold until ${league.weather.until} | ${league.weather.note}` : league.weather.note;

  const totalGames = league.games.length;
  const verifiedGames = league.games.filter(g => g.rosterHomeVerified && g.rosterAwayVerified).length;
  const openSpots = league.games.reduce((sum, g) => sum + [g.ref1, g.ref2, g.clock, g.score].filter(v => v === 'OPEN').length, 0);
  const statTiles = [
    ['Games', totalGames],
    ['Teams', league.teams.length],
    ['Verified Games', verifiedGames],
    ['Open Staff Slots', openSpots]
  ];
  document.getElementById('snapshotStats').innerHTML = statTiles.map(([label, value]) => `<div class="stat-tile"><div class="muted">${label}</div><strong>${value}</strong></div>`).join('');
}

function renderBoard() {
  const league = currentLeague();
  document.getElementById('availableRefs').innerHTML = league.refs.length
    ? league.refs.map(ref => `<div class="person-chip"><strong>${ref.name}</strong><div class="muted">${ref.level}</div></div>`).join('')
    : '<div class="muted">No referees loaded.</div>';
  document.getElementById('availableVolunteers').innerHTML = league.volunteers.length
    ? league.volunteers.map(vol => `<div class="person-chip"><strong>${vol.name}</strong><div class="muted">${vol.role}</div></div>`).join('')
    : '<div class="muted">No volunteers loaded.</div>';

  const gaps = league.games.flatMap(game => {
    const items = [];
    if (game.ref1 === 'OPEN' || game.ref2 === 'OPEN') items.push(`${teamName(game.homeTeamId)} vs ${teamName(game.awayTeamId)} - refs needed`);
    if (game.clock === 'OPEN' || game.score === 'OPEN') items.push(`${teamName(game.homeTeamId)} vs ${teamName(game.awayTeamId)} - table help needed`);
    return items;
  });
  document.getElementById('staffingGaps').innerHTML = gaps.length ? gaps.map(g => `<div class="log-item">${g}</div>`).join('') : '<div class="muted">No current staffing gaps.</div>';

  const board = document.getElementById('fieldBoard');
  board.innerHTML = league.fields.map(field => {
    const games = league.games.filter(game => game.fieldId === field.id);
    return `
      <div class="field-column">
        <h4>${field.name}</h4>
        <div class="field-meta">${field.type}</div>
        <div class="game-stack">
          ${games.length ? games.map(gameCard).join('') : '<div class="muted">No games assigned.</div>'}
        </div>
      </div>
    `;
  }).join('');

  board.querySelectorAll('[data-edit-game]').forEach(btn => btn.addEventListener('click', () => openGameDialog(btn.dataset.editGame)));
  board.querySelectorAll('[data-toggle-home]').forEach(btn => btn.addEventListener('click', () => toggleVerification(btn.dataset.toggleHome, 'home')));
  board.querySelectorAll('[data-toggle-away]').forEach(btn => btn.addEventListener('click', () => toggleVerification(btn.dataset.toggleAway, 'away')));
}

function gameCard(game) {
  const statusClass = game.status.toLowerCase().replace(/\s+/g, '-');
  return `
    <article class="game-card ${statusClass}">
      <div class="game-title">
        <div>
          <h5>${teamName(game.homeTeamId)} vs ${teamName(game.awayTeamId)}</h5>
          <div class="muted">${game.time}</div>
        </div>
        <span class="pill">${game.status}</span>
      </div>
      <div class="details-grid">
        <div><strong>Field Type:</strong> ${game.fieldType}</div>
        <div><strong>Ref 1:</strong> ${game.ref1}</div>
        <div><strong>Ref 2:</strong> ${game.ref2}</div>
        <div><strong>Clock:</strong> ${game.clock}</div>
        <div><strong>Score:</strong> ${game.score}</div>
        <div><strong>Roster:</strong> Home ${game.rosterHomeVerified ? 'Verified' : 'Pending'} / Away ${game.rosterAwayVerified ? 'Verified' : 'Pending'}</div>
      </div>
      <div class="game-actions">
        <button class="ghost" data-edit-game="${game.id}">Edit</button>
        <button class="ghost" data-toggle-home="${game.id}">${game.rosterHomeVerified ? 'Unverify Home' : 'Verify Home'}</button>
        <button class="ghost" data-toggle-away="${game.id}">${game.rosterAwayVerified ? 'Unverify Away' : 'Verify Away'}</button>
      </div>
    </article>
  `;
}

function renderRosters() {
  const league = currentLeague();
  const teamList = document.getElementById('teamList');
  teamList.innerHTML = league.teams.length ? league.teams.map(team => `
    <div class="team-item ${team.id === state.selectedTeamId ? 'active' : ''}" data-team-id="${team.id}">
      <strong>${team.name}</strong>
      <div class="muted">${team.division} • ${team.players.length} players</div>
    </div>
  `).join('') : '<div class="muted">No teams added yet.</div>';
  teamList.querySelectorAll('[data-team-id]').forEach(el => el.addEventListener('click', () => {
    state.selectedTeamId = el.dataset.teamId;
    saveState();
    renderRosters();
  }));

  const team = currentTeam();
  document.getElementById('rosterTitle').textContent = team ? `${team.name} Roster` : 'Roster';
  document.getElementById('playerCards').innerHTML = team?.players.length ? team.players.map(player => `
    <div class="player-card">
      <div class="number">#${player.number}</div>
      <strong>${player.name}</strong>
      <div class="muted">${team.name} • ${team.division}</div>
      <div class="muted">USA Lacrosse ID: ${player.usaId || '--'}</div>
      <span class="tag">${player.eligibility}</span>
    </div>
  `).join('') : '<div class="muted">No players added yet.</div>';
}

function renderVerification() {
  const league = currentLeague();
  const list = document.getElementById('verificationList');
  list.innerHTML = league.games.length ? league.games.map(game => `
    <div class="verification-card">
      <strong>${teamName(game.homeTeamId)} vs ${teamName(game.awayTeamId)}</strong>
      <div class="muted">${game.time} • ${fieldName(game.fieldId)}</div>
      <div class="verification-actions">
        <span class="pill">Home: ${game.rosterHomeVerified ? 'Verified' : 'Pending'}</span>
        <span class="pill">Away: ${game.rosterAwayVerified ? 'Verified' : 'Pending'}</span>
        <button class="ghost" data-toggle-home="${game.id}">${game.rosterHomeVerified ? 'Unverify Home' : 'Verify Home'}</button>
        <button class="ghost" data-toggle-away="${game.id}">${game.rosterAwayVerified ? 'Unverify Away' : 'Verify Away'}</button>
      </div>
    </div>
  `).join('') : '<div class="muted">No games scheduled.</div>';
  list.querySelectorAll('[data-toggle-home]').forEach(btn => btn.addEventListener('click', () => toggleVerification(btn.dataset.toggleHome, 'home')));
  list.querySelectorAll('[data-toggle-away]').forEach(btn => btn.addEventListener('click', () => toggleVerification(btn.dataset.toggleAway, 'away')));
}

function renderRefs() {
  const league = currentLeague();
  document.getElementById('refDevelopmentList').innerHTML = league.refs.length ? league.refs.map(ref => {
    const total = Number(ref.games7v7) + Number(ref.gamesModified) + Number(ref.gamesFull);
    const progress = Math.min(100, Math.round((Number(ref.gamesFull) / 10) * 100));
    return `
      <div class="log-item">
        <strong>${ref.name}</strong>
        <div>${ref.level}</div>
        <div class="muted">Games Worked: ${total} | 7v7: ${ref.games7v7} | Modified: ${ref.gamesModified} | Full: ${ref.gamesFull}</div>
        <div class="muted">Progress toward next level: ${progress}%</div>
        <div class="muted">Notes: ${ref.notes || '--'}</div>
      </div>
    `;
  }).join('') : '<div class="muted">No referee development records yet.</div>';
}

function renderCheckins() {
  const league = currentLeague();
  const log = document.getElementById('checkinLog');
  log.innerHTML = league.checkins.length ? [...league.checkins].reverse().map(item => `
    <div class="log-item"><strong>${item.name}</strong><div class="muted">${item.role} • ${item.notes || 'No notes'} • ${item.time}</div></div>
  `).join('') : '<div class="muted">No one has checked in yet.</div>';
}

function renderMessages() {
  const league = currentLeague();
  const log = document.getElementById('messageLog');
  log.innerHTML = league.messages.length ? [...league.messages].reverse().map(msg => `
    <div class="log-item"><strong>${msg.type}</strong><div>${msg.text}</div><div class="muted">${msg.time}</div></div>
  `).join('') : '<div class="muted">No messages posted.</div>';
}

function renderInjuries() {
  const league = currentLeague();
  document.getElementById('injuryLog').innerHTML = league.injuries.length ? [...league.injuries].reverse().map(report => `
    <div class="log-item">
      <strong>${report.player}</strong>
      <div>${report.team} • ${report.field} • ${report.severity}</div>
      <div class="muted">${report.type} • ${report.notes || 'No notes'} • ${report.time}</div>
    </div>
  `).join('') : '<div class="muted">No injury reports logged.</div>';
}

function populateSelects() {
  const league = currentLeague();
  const teamOptions = league.teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('');
  document.getElementById('injuryTeam').innerHTML = teamOptions;
  document.getElementById('gameHomeInput').innerHTML = teamOptions;
  document.getElementById('gameAwayInput').innerHTML = teamOptions;

  const fieldOptions = league.fields.map(field => `<option value="${field.id}">${field.name}</option>`).join('');
  document.getElementById('injuryField').innerHTML = league.fields.map(field => `<option>${field.name}</option>`).join('');
  document.getElementById('gameFieldInput').innerHTML = fieldOptions;
}

function toggleVerification(gameId, side) {
  const league = currentLeague();
  const game = byId(league.games, gameId);
  if (!game) return;
  if (side === 'home') game.rosterHomeVerified = !game.rosterHomeVerified;
  if (side === 'away') game.rosterAwayVerified = !game.rosterAwayVerified;
  if (game.rosterHomeVerified && game.rosterAwayVerified && game.status === 'Roster Issue') game.status = 'Ready';
  league.messages.push({ id: crypto.randomUUID(), time: timestamp(), type: 'Roster', text: `${teamName(game.homeTeamId)} vs ${teamName(game.awayTeamId)} roster updated.` });
  saveState();
  renderAll();
}

function openGameDialog(gameId) {
  const league = currentLeague();
  const game = byId(league.games, gameId);
  if (!game) return;
  editingGameId = gameId;
  document.getElementById('gameTimeInput').value = game.time;
  document.getElementById('gameHomeInput').value = game.homeTeamId;
  document.getElementById('gameAwayInput').value = game.awayTeamId;
  document.getElementById('gameFieldInput').value = game.fieldId;
  document.getElementById('gameTypeInput').value = game.fieldType;
  document.getElementById('gameStatusInput').value = game.status;
  document.getElementById('gameDialog').showModal();
}

function closeGameDialog() {
  document.getElementById('gameDialog').close();
  editingGameId = null;
}

function bindActions() {
  document.getElementById('setTrainerBtn').onclick = () => {
    const league = currentLeague();
    const name = prompt('Trainer name', league.trainer.name || '');
    if (name === null) return;
    const location = prompt('Trainer location', league.trainer.location || 'Central Tent');
    if (location === null) return;
    league.trainer.name = name || 'Unassigned';
    league.trainer.location = location || '--';
    league.trainer.status = 'Available';
    saveState();
    renderAll();
  };
  document.getElementById('trainerRespondBtn').onclick = () => {
    const league = currentLeague();
    const response = prompt('Responding to which field / incident?', league.trainer.respondingTo || 'Field 2');
    if (response === null) return;
    league.trainer.status = 'Responding';
    league.trainer.respondingTo = response;
    league.messages.push({ id: crypto.randomUUID(), time: timestamp(), type: 'Trainer', text: `Trainer responding to ${response}.` });
    saveState();
    renderAll();
  };
  document.getElementById('trainerClearBtn').onclick = () => {
    const league = currentLeague();
    league.trainer.status = 'Available';
    league.trainer.respondingTo = '';
    saveState();
    renderAll();
  };

  document.getElementById('startDelayBtn').onclick = () => {
    const league = currentLeague();
    const until = prompt('Delay until what time?', '10:45 AM');
    if (!until) return;
    league.weather.active = true;
    league.weather.until = until;
    league.weather.note = 'Lightning delay in effect';
    league.games.forEach(game => { if (game.status !== 'Final') game.status = 'Weather Delay'; });
    league.messages.push({ id: crypto.randomUUID(), time: timestamp(), type: 'Weather', text: `Weather delay started until ${until}.` });
    saveState();
    renderAll();
  };
  document.getElementById('resumePlayBtn').onclick = () => {
    const league = currentLeague();
    league.weather.active = false;
    league.weather.until = '';
    league.weather.note = 'Fields open';
    league.games.forEach(game => { if (game.status === 'Weather Delay') game.status = 'Ready'; });
    league.messages.push({ id: crypto.randomUUID(), time: timestamp(), type: 'Weather', text: 'Play resumed. Weather delay cleared.' });
    saveState();
    renderAll();
  };

  document.getElementById('checkinSubmitBtn').onclick = () => {
    const role = document.getElementById('checkinRole').value;
    const name = document.getElementById('checkinName').value.trim();
    const notes = document.getElementById('checkinNotes').value.trim();
    if (!name) return alert('Enter a name to check in.');
    const league = currentLeague();
    league.checkins.push({ id: crypto.randomUUID(), role, name, notes, time: timestamp() });
    league.messages.push({ id: crypto.randomUUID(), time: timestamp(), type: role, text: `${name} checked in${notes ? ` (${notes})` : ''}.` });
    document.getElementById('checkinName').value = '';
    document.getElementById('checkinNotes').value = '';
    saveState();
    renderAll();
  };

  document.getElementById('sendMessageBtn').onclick = () => {
    const type = document.getElementById('messageType').value;
    const text = document.getElementById('messageText').value.trim();
    if (!text) return alert('Enter a message.');
    currentLeague().messages.push({ id: crypto.randomUUID(), time: timestamp(), type, text });
    document.getElementById('messageText').value = '';
    saveState();
    renderAll();
  };

  document.getElementById('saveInjuryBtn').onclick = () => {
    const report = {
      id: crypto.randomUUID(),
      player: document.getElementById('injuryPlayer').value.trim(),
      team: document.getElementById('injuryTeam').selectedOptions[0]?.textContent || '',
      field: document.getElementById('injuryField').value,
      severity: document.getElementById('injurySeverity').value,
      type: document.getElementById('injuryType').value,
      notes: document.getElementById('injuryNotes').value.trim(),
      time: timestamp()
    };
    if (!report.player) return alert('Enter player name.');
    currentLeague().injuries.push(report);
    currentLeague().messages.push({ id: crypto.randomUUID(), time: timestamp(), type: 'Trainer', text: `Injury report logged for ${report.player} on ${report.field}.` });
    document.getElementById('injuryPlayer').value = '';
    document.getElementById('injuryNotes').value = '';
    saveState();
    renderAll();
  };

  document.getElementById('saveRefBtn').onclick = () => {
    const name = document.getElementById('refName').value.trim();
    if (!name) return alert('Enter referee name.');
    currentLeague().refs.push({
      id: crypto.randomUUID(),
      name,
      level: document.getElementById('refLevel').value,
      games7v7: Number(document.getElementById('ref7v7').value || 0),
      gamesModified: Number(document.getElementById('refModified').value || 0),
      gamesFull: Number(document.getElementById('refFull').value || 0),
      notes: document.getElementById('refNotes').value.trim()
    });
    ['refName','refNotes'].forEach(id => document.getElementById(id).value = '');
    ['ref7v7','refModified','refFull'].forEach(id => document.getElementById(id).value = 0);
    saveState();
    renderAll();
  };

  document.getElementById('addTeamBtn').onclick = () => {
    const name = prompt('Team name');
    if (!name) return;
    const division = prompt('Division', '12U') || '12U';
    const id = crypto.randomUUID();
    currentLeague().teams.push({ id, name, division, players: [] });
    state.selectedTeamId = id;
    saveState();
    renderAll();
  };

  document.getElementById('addPlayerBtn').onclick = () => {
    const team = currentTeam();
    if (!team) return alert('Add a team first.');
    const number = prompt('Player number');
    const name = prompt('Player name');
    if (!name) return;
    const usaId = prompt('USA Lacrosse ID', 'USAL-') || '';
    team.players.push({ id: crypto.randomUUID(), number: number || '--', name, eligibility: 'Pending', usaId });
    saveState();
    renderAll();
  };

  document.getElementById('addGameBtn').onclick = () => {
    editingGameId = null;
    const league = currentLeague();
    document.getElementById('gameTimeInput').value = '12:30 PM';
    document.getElementById('gameHomeInput').value = league.teams[0]?.id || '';
    document.getElementById('gameAwayInput').value = league.teams[1]?.id || league.teams[0]?.id || '';
    document.getElementById('gameFieldInput').value = league.fields[0]?.id || '';
    document.getElementById('gameTypeInput').value = league.fields[0]?.type || 'Full Field';
    document.getElementById('gameStatusInput').value = 'Ready';
    document.getElementById('gameDialog').showModal();
  };

  document.getElementById('addLeagueNoteBtn').onclick = () => {
    const text = prompt('Operations note');
    if (!text) return;
    currentLeague().messages.push({ id: crypto.randomUUID(), time: timestamp(), type: 'Site Alert', text });
    saveState();
    renderAll();
  };

  document.getElementById('saveGameDialogBtn').onclick = (e) => {
    e.preventDefault();
    const league = currentLeague();
    const payload = {
      id: editingGameId || crypto.randomUUID(),
      time: document.getElementById('gameTimeInput').value,
      homeTeamId: document.getElementById('gameHomeInput').value,
      awayTeamId: document.getElementById('gameAwayInput').value,
      fieldId: document.getElementById('gameFieldInput').value,
      fieldType: document.getElementById('gameTypeInput').value,
      status: document.getElementById('gameStatusInput').value,
      ref1: 'OPEN', ref2: 'OPEN', clock: 'OPEN', score: 'OPEN',
      rosterHomeVerified: false, rosterAwayVerified: false
    };
    if (editingGameId) {
      const index = league.games.findIndex(g => g.id === editingGameId);
      payload.ref1 = league.games[index].ref1;
      payload.ref2 = league.games[index].ref2;
      payload.clock = league.games[index].clock;
      payload.score = league.games[index].score;
      payload.rosterHomeVerified = league.games[index].rosterHomeVerified;
      payload.rosterAwayVerified = league.games[index].rosterAwayVerified;
      league.games[index] = payload;
    } else {
      league.games.push(payload);
    }
    saveState();
    closeGameDialog();
    renderAll();
  };

  document.getElementById('gameDialog').addEventListener('close', () => { editingGameId = null; });

  document.getElementById('exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leagueops-live-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  document.getElementById('resetBtn').onclick = () => {
    if (!confirm('Reset the demo and clear saved browser data?')) return;
    state = structuredClone(seed);
    saveState();
    renderAll();
  };
}

function renderAll() {
  renderLeagueSelect();
  renderHeader();
  populateSelects();
  renderBoard();
  renderCheckins();
  renderRosters();
  renderVerification();
  renderRefs();
  renderInjuries();
  renderMessages();
}

initTabs();
bindActions();
renderAll();
