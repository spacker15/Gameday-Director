const STORAGE_KEY = 'gameday-director-v1';

const navItems = [
  ['dashboard', 'Dashboard'],
  ['games', 'Games'],
  ['fields', 'Fields'],
  ['refs', 'Referees'],
  ['volunteers', 'Volunteers'],
  ['reports', 'Reports'],
  ['settings', 'Settings']
];

const sampleState = {
  leagueName: 'GameDay Director Demo League',
  eventDate: new Date().toISOString().slice(0, 10),
  payRules: {
    full: 25,
    seven: 18,
    modified_boys: 20,
    modified_girls: 20,
    custom: 20
  },
  fields: [
    { id: uid(), name: 'Field 1', type: 'full', surface: 'Grass' },
    { id: uid(), name: 'Field 2', type: 'seven', surface: 'Grass' },
    { id: uid(), name: 'Field 3', type: 'modified_boys', surface: 'Grass' },
    { id: uid(), name: 'Field 4', type: 'modified_girls', surface: 'Grass' },
    { id: uid(), name: 'Field 5', type: 'custom', surface: 'Grass' },
    { id: uid(), name: 'Field 6', type: 'full', surface: 'Turf' }
  ],
  refs: [
    { id: uid(), name: 'Tyler Brooks', level: 'Level 2', eligible: ['full', 'seven', 'modified_boys', 'modified_girls'], payOverride: 0 },
    { id: uid(), name: 'Mason Lee', level: 'Level 1', eligible: ['seven', 'modified_boys', 'modified_girls'], payOverride: 0 },
    { id: uid(), name: 'Jake Turner', level: 'Level 2', eligible: ['full', 'seven'], payOverride: 0 },
    { id: uid(), name: 'Luke Carter', level: 'Level 1', eligible: ['seven', 'modified_boys', 'modified_girls'], payOverride: 0 }
  ],
  volunteers: [
    { id: uid(), name: 'Megan Packer', roles: ['clock', 'score'] },
    { id: uid(), name: 'Ashton Packer', roles: ['score', 'clock'] },
    { id: uid(), name: 'Amy Packer', roles: ['marshal', 'checkin'] },
    { id: uid(), name: 'Brooke Smith', roles: ['score'] }
  ],
  games: []
};

(function seedGames() {
  const s = sampleState;
  const [f1,f2,f3,f4,f5,f6] = s.fields;
  const [r1,r2,r3,r4] = s.refs;
  const [v1,v2,v3,v4] = s.volunteers;
  s.games = [
    { id: uid(), time: '09:00', endTime: '10:00', division: '12U', home: 'Redhawks', away: 'Lions', fieldId: f1.id, status: 'Scheduled', ref1: r1.id, ref2: r2.id, clock: v1.id, score: v2.id, notes: '' },
    { id: uid(), time: '10:15', endTime: '11:15', division: '12U', home: 'Creekside', away: 'Jax Lax', fieldId: f1.id, status: 'Scheduled', ref1: '', ref2: '', clock: '', score: v4.id, notes: '' },
    { id: uid(), time: '09:00', endTime: '10:00', division: '10U', home: 'Riptide', away: 'Fleming', fieldId: f2.id, status: 'Scheduled', ref1: r4.id, ref2: '', clock: v3.id, score: '', notes: '' },
    { id: uid(), time: '11:30', endTime: '12:30', division: '14U', home: 'Blue Storm', away: 'Warriors', fieldId: f6.id, status: 'Scheduled', ref1: r1.id, ref2: r3.id, clock: v1.id, score: v4.id, notes: '' },
    { id: uid(), time: '12:45', endTime: '13:45', division: '8U', home: 'Sharks', away: 'Knights', fieldId: f3.id, status: 'Scheduled', ref1: r2.id, ref2: '', clock: '', score: '', notes: '' },
    { id: uid(), time: '14:00', endTime: '15:00', division: 'Girls 7v7', home: 'Comets', away: 'Raiders', fieldId: f4.id, status: 'Scheduled', ref1: '', ref2: '', clock: '', score: '', notes: '' }
  ];
})();

let state = loadState();
let currentView = 'dashboard';

const els = {
  nav: document.getElementById('nav'),
  pageTitle: document.getElementById('pageTitle'),
  subtitle: document.getElementById('subtitle'),
  modal: document.getElementById('modal'),
  modalContent: document.getElementById('modalContent'),
  leagueNameInput: document.getElementById('leagueNameInput'),
  eventDateInput: document.getElementById('eventDateInput'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  seedBtn: document.getElementById('seedBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importFile: document.getElementById('importFile')
};

init();

function init() {
  renderNav();
  bindTopControls();
  syncSidebar();
  render();
}

function bindTopControls() {
  els.saveSettingsBtn.addEventListener('click', () => {
    state.leagueName = els.leagueNameInput.value.trim() || 'League Name';
    state.eventDate = els.eventDateInput.value || new Date().toISOString().slice(0,10);
    persist();
    render();
  });
  els.seedBtn.addEventListener('click', () => {
    if (!confirm('Reset to sample data?')) return;
    state = JSON.parse(JSON.stringify(sampleState));
    persist();
    syncSidebar();
    render();
  });
  els.exportBtn.addEventListener('click', exportState);
  els.importFile.addEventListener('change', importState);
}

function renderNav() {
  els.nav.innerHTML = navItems.map(([id, label]) =>
    `<button class="${currentView === id ? 'active' : ''}" data-view="${id}">${label}</button>`
  ).join('');
  els.nav.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      renderNav();
      render();
    });
  });
}

function syncSidebar() {
  els.leagueNameInput.value = state.leagueName;
  els.eventDateInput.value = state.eventDate;
}

function render() {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById(`view-${currentView}`).classList.remove('hidden');
  els.pageTitle.textContent = navItems.find(x => x[0] === currentView)[1];
  els.subtitle.textContent = `${state.leagueName} • ${formatDate(state.eventDate)}`;

  renderDashboard();
  renderGames();
  renderFields();
  renderRefs();
  renderVolunteers();
  renderReports();
  renderSettings();
}

function renderDashboard() {
  const root = document.getElementById('view-dashboard');
  const totalGames = state.games.length;
  const totalRefSlots = totalGames * 2;
  const filledRefSlots = state.games.reduce((n, g) => n + (g.ref1 ? 1 : 0) + (g.ref2 ? 1 : 0), 0);
  const volunteerSlots = totalGames * 2;
  const filledVolunteerSlots = state.games.reduce((n, g) => n + (g.clock ? 1 : 0) + (g.score ? 1 : 0), 0);
  const payroll = calcPayrollTotal();
  const volunteerHours = calcVolunteerHoursTotal();
  const gaps = staffingGaps();

  const byField = state.fields.map(field => ({
    field,
    games: state.games.filter(g => g.fieldId === field.id).sort(sortByTime)
  }));

  root.innerHTML = `
    <div class="kpi-strip">
      ${statCard(totalGames, 'Games')}
      ${statCard(`${filledRefSlots}/${totalRefSlots}`, 'Ref Slots Filled')}
      ${statCard(`${filledVolunteerSlots}/${volunteerSlots}`, 'Volunteer Slots Filled')}
      ${statCard(`$${payroll}`, 'Ref Payroll')}
      ${statCard(`${volunteerHours.toFixed(1)}`, 'Volunteer Hours')}
    </div>
    <div class="grid cols-3" style="margin-top:16px;">
      <div class="card">
        <div class="section-title"><h3>Staffing Gaps</h3></div>
        <div class="list">
          ${gaps.length ? gaps.map(g => `<div class="list-item">${g}</div>`).join('') : '<div class="list-item">Everything is covered.</div>'}
        </div>
      </div>
      <div class="card" style="grid-column: span 2;">
        <div class="section-title"><h3>Today by Field</h3><button class="btn btn-primary" id="quickAddGame">Add Game</button></div>
        <div class="grid cols-2">
          ${byField.map(({field, games}) => `
            <div class="card field-tile">
              <h4>${field.name}</h4>
              <div class="muted">${fieldTypeLabel(field.type)} • ${field.surface}</div>
              <div class="list" style="margin-top:10px;">
                ${games.length ? games.map(gameSummaryCard).join('') : '<div class="list-item muted">No games scheduled</div>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  root.querySelector('#quickAddGame').addEventListener('click', () => openGameModal());
  bindActionButtons(root);
}

function renderGames() {
  const root = document.getElementById('view-games');
  root.innerHTML = `
    <div class="card">
      <div class="toolbar">
        <div>
          <h3 style="margin:0;">Games Schedule</h3>
          <div class="helper">Add games, assign field, refs, and table crew.</div>
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="addGameBtn">Add Game</button>
          <button class="btn" id="csvTemplateBtn">Download CSV Template</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th><th>Division</th><th>Matchup</th><th>Field</th><th>Refs</th><th>Clock / Score</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${state.games.sort(sortByTime).map(g => `
              <tr>
                <td>${g.time} - ${g.endTime}</td>
                <td>${g.division}</td>
                <td><strong>${g.home}</strong> vs <strong>${g.away}</strong></td>
                <td>${fieldName(g.fieldId)}</td>
                <td>${personName('refs', g.ref1) || 'Open'} / ${personName('refs', g.ref2) || 'Open'}</td>
                <td>${personName('volunteers', g.clock) || 'Open'} / ${personName('volunteers', g.score) || 'Open'}</td>
                <td>${statusBadge(gameCoverageBadge(g), badgeClass(gameCoverageBadge(g)))}</td>
                <td><button class="btn" data-action="edit-game" data-id="${g.id}">Edit</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  root.querySelector('#addGameBtn').addEventListener('click', () => openGameModal());
  root.querySelector('#csvTemplateBtn').addEventListener('click', downloadCsvTemplate);
  bindActionButtons(root);
}

function renderFields() {
  const root = document.getElementById('view-fields');
  root.innerHTML = `
    <div class="card">
      <div class="toolbar">
        <div><h3 style="margin:0;">Fields</h3><div class="helper">Manage surfaces and field types.</div></div>
        <button class="btn btn-primary" id="addFieldBtn">Add Field</button>
      </div>
      <div class="field-grid">
        ${state.fields.map(f => `
          <div class="card field-tile">
            <div class="section-title"><h4>${f.name}</h4><button class="btn" data-action="edit-field" data-id="${f.id}">Edit</button></div>
            <div class="muted">${fieldTypeLabel(f.type)}</div>
            <div class="helper">Surface: ${f.surface}</div>
            <div class="helper" style="margin-top:8px;">Games: ${state.games.filter(g => g.fieldId === f.id).length}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  root.querySelector('#addFieldBtn').addEventListener('click', () => openFieldModal());
  bindActionButtons(root);
}

function renderRefs() {
  const root = document.getElementById('view-refs');
  root.innerHTML = `
    <div class="card">
      <div class="toolbar">
        <div><h3 style="margin:0;">Referees</h3><div class="helper">Paid staff and assignment eligibility.</div></div>
        <button class="btn btn-primary" id="addRefBtn">Add Referee</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Level</th><th>Eligible Types</th><th>Games</th><th>Pay Today</th><th></th></tr></thead>
          <tbody>
            ${state.refs.map(r => `
              <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.level}</td>
                <td>${r.eligible.map(fieldTypeLabel).join(', ')}</td>
                <td>${refGames(r.id).length}</td>
                <td>$${refPay(r.id)}</td>
                <td><button class="btn" data-action="edit-ref" data-id="${r.id}">Edit</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  root.querySelector('#addRefBtn').addEventListener('click', () => openRefModal());
  bindActionButtons(root);
}

function renderVolunteers() {
  const root = document.getElementById('view-volunteers');
  root.innerHTML = `
    <div class="card">
      <div class="toolbar">
        <div><h3 style="margin:0;">Volunteers</h3><div class="helper">Track roles and service hours.</div></div>
        <button class="btn btn-primary" id="addVolunteerBtn">Add Volunteer</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Roles</th><th>Assignments</th><th>Hours</th><th></th></tr></thead>
          <tbody>
            ${state.volunteers.map(v => `
              <tr>
                <td><strong>${v.name}</strong></td>
                <td>${v.roles.join(', ')}</td>
                <td>${volunteerAssignments(v.id).length}</td>
                <td>${volunteerHours(v.id).toFixed(1)}</td>
                <td><button class="btn" data-action="edit-volunteer" data-id="${v.id}">Edit</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  root.querySelector('#addVolunteerBtn').addEventListener('click', () => openVolunteerModal());
  bindActionButtons(root);
}

function renderReports() {
  const root = document.getElementById('view-reports');
  root.innerHTML = `
    <div class="grid cols-2">
      <div class="card">
        <div class="section-title"><h3>Ref Payroll</h3><button class="btn" id="downloadRefReport">Download CSV</button></div>
        <div class="list">
          ${state.refs.map(r => `<div class="list-item"><strong>${r.name}</strong><br><span class="muted">${refGames(r.id).length} games • $${refPay(r.id)}</span></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="section-title"><h3>Volunteer Hours</h3><button class="btn" id="downloadVolReport">Download CSV</button></div>
        <div class="list">
          ${state.volunteers.map(v => `<div class="list-item"><strong>${v.name}</strong><br><span class="muted">${volunteerAssignments(v.id).length} assignments • ${volunteerHours(v.id).toFixed(1)} hours</span></div>`).join('')}
        </div>
      </div>
    </div>
  `;
  root.querySelector('#downloadRefReport').addEventListener('click', downloadRefReport);
  root.querySelector('#downloadVolReport').addEventListener('click', downloadVolunteerReport);
}

function renderSettings() {
  const root = document.getElementById('view-settings');
  root.innerHTML = `
    <div class="grid cols-2">
      <div class="card">
        <h3>League Settings</h3>
        <p class="helper">These update the app header and event view.</p>
        <div class="form-grid">
          <div class="full"><label>League Name</label><input id="settingsLeagueName" value="${escapeHtml(state.leagueName)}"></div>
          <div><label>Event Date</label><input id="settingsEventDate" type="date" value="${state.eventDate}"></div>
        </div>
        <div class="actions" style="margin-top:12px;"><button class="btn btn-primary" id="saveLeagueSettingsInline">Save</button></div>
      </div>
      <div class="card">
        <h3>Default Ref Pay Rules</h3>
        <div class="form-grid">
          <div><label>Full Field</label><input id="pay_full" type="number" value="${state.payRules.full}"></div>
          <div><label>7v7</label><input id="pay_seven" type="number" value="${state.payRules.seven}"></div>
          <div><label>Modified Boys</label><input id="pay_modified_boys" type="number" value="${state.payRules.modified_boys}"></div>
          <div><label>Modified Girls</label><input id="pay_modified_girls" type="number" value="${state.payRules.modified_girls}"></div>
          <div><label>Custom</label><input id="pay_custom" type="number" value="${state.payRules.custom}"></div>
        </div>
        <div class="actions" style="margin-top:12px;"><button class="btn btn-primary" id="savePayRules">Save Pay Rules</button></div>
      </div>
    </div>
  `;
  root.querySelector('#saveLeagueSettingsInline').addEventListener('click', () => {
    state.leagueName = document.getElementById('settingsLeagueName').value.trim() || state.leagueName;
    state.eventDate = document.getElementById('settingsEventDate').value || state.eventDate;
    persist(); syncSidebar(); render();
  });
  root.querySelector('#savePayRules').addEventListener('click', () => {
    ['full','seven','modified_boys','modified_girls','custom'].forEach(k => {
      state.payRules[k] = Number(document.getElementById(`pay_${k}`).value || 0);
    });
    persist(); render();
  });
}

function gameSummaryCard(g) {
  return `
    <div class="list-item">
      <strong>${g.time}</strong> • ${g.home} vs ${g.away}<br>
      <span class="muted">${g.division}</span><br>
      ${statusBadge(gameCoverageBadge(g), badgeClass(gameCoverageBadge(g)))}
      <div class="actions" style="margin-top:8px;">
        <button class="btn" data-action="edit-game" data-id="${g.id}">Edit</button>
      </div>
    </div>
  `;
}

function bindActionButtons(root) {
  root.querySelectorAll('[data-action="edit-game"]').forEach(btn => btn.addEventListener('click', () => openGameModal(btn.dataset.id)));
  root.querySelectorAll('[data-action="edit-field"]').forEach(btn => btn.addEventListener('click', () => openFieldModal(btn.dataset.id)));
  root.querySelectorAll('[data-action="edit-ref"]').forEach(btn => btn.addEventListener('click', () => openRefModal(btn.dataset.id)));
  root.querySelectorAll('[data-action="edit-volunteer"]').forEach(btn => btn.addEventListener('click', () => openVolunteerModal(btn.dataset.id)));
}

function openGameModal(id = '') {
  const g = id ? state.games.find(x => x.id === id) : { id: uid(), time: '09:00', endTime: '10:00', division: '', home: '', away: '', fieldId: state.fields[0]?.id || '', status: 'Scheduled', ref1: '', ref2: '', clock: '', score: '', notes: '' };
  const isNew = !id;
  els.modalContent.innerHTML = `
    <div class="modal-header"><h3>${isNew ? 'Add Game' : 'Edit Game'}</h3><button class="btn">Close</button></div>
    <div class="form-grid">
      <div><label>Start Time</label><input name="time" type="time" value="${g.time}"></div>
      <div><label>End Time</label><input name="endTime" type="time" value="${g.endTime}"></div>
      <div><label>Division</label><input name="division" value="${escapeHtml(g.division)}"></div>
      <div><label>Status</label>${selectHtml('status', ['Scheduled','Warmup','In Progress','Delayed','Final'], g.status)}</div>
      <div><label>Home Team</label><input name="home" value="${escapeHtml(g.home)}"></div>
      <div><label>Away Team</label><input name="away" value="${escapeHtml(g.away)}"></div>
      <div><label>Field</label>${selectEntity('fieldId', state.fields, g.fieldId, x => x.name)}</div>
      <div><label>Field Type</label><input value="${fieldTypeLabel(fieldById(g.fieldId)?.type || '')}" disabled></div>
      <div><label>Ref 1</label>${selectEntity('ref1', [{id:'',name:'Open'},...state.refs], g.ref1, x => x.name)}</div>
      <div><label>Ref 2</label>${selectEntity('ref2', [{id:'',name:'Open'},...state.refs], g.ref2, x => x.name)}</div>
      <div><label>Clock</label>${selectEntity('clock', [{id:'',name:'Open'},...state.volunteers], g.clock, x => x.name)}</div>
      <div><label>Score</label>${selectEntity('score', [{id:'',name:'Open'},...state.volunteers], g.score, x => x.name)}</div>
      <div class="full"><label>Notes</label><textarea name="notes">${escapeHtml(g.notes || '')}</textarea></div>
    </div>
    <div class="actions" style="margin-top:16px; justify-content: space-between;">
      <div>${!isNew ? '<button type="button" class="btn btn-danger" id="deleteGameBtn">Delete</button>' : ''}</div>
      <div class="actions"><button class="btn" value="cancel">Cancel</button><button type="submit" class="btn btn-primary">Save Game</button></div>
    </div>
  `;
  els.modalContent.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(els.modalContent);
    Object.assign(g, Object.fromEntries(fd.entries()));
    if (isNew) state.games.push(g);
    persist(); els.modal.close(); render();
  };
  if (!isNew) document.getElementById('deleteGameBtn').onclick = () => {
    if (!confirm('Delete this game?')) return;
    state.games = state.games.filter(x => x.id !== g.id);
    persist(); els.modal.close(); render();
  };
  els.modal.showModal();
}

function openFieldModal(id = '') {
  const f = id ? state.fields.find(x => x.id === id) : { id: uid(), name: '', type: 'full', surface: 'Grass' };
  const isNew = !id;
  els.modalContent.innerHTML = `
    <div class="modal-header"><h3>${isNew ? 'Add Field' : 'Edit Field'}</h3><button class="btn">Close</button></div>
    <div class="form-grid">
      <div><label>Field Name</label><input name="name" value="${escapeHtml(f.name)}"></div>
      <div><label>Surface</label><input name="surface" value="${escapeHtml(f.surface)}"></div>
      <div class="full"><label>Field Type</label>${selectHtml('type', ['full','seven','modified_boys','modified_girls','custom'], f.type, fieldTypeLabel)}</div>
    </div>
    <div class="actions" style="margin-top:16px; justify-content: space-between;">
      <div>${!isNew ? '<button type="button" class="btn btn-danger" id="deleteFieldBtn">Delete</button>' : ''}</div>
      <div class="actions"><button class="btn">Cancel</button><button type="submit" class="btn btn-primary">Save Field</button></div>
    </div>
  `;
  els.modalContent.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(els.modalContent);
    Object.assign(f, Object.fromEntries(fd.entries()));
    if (isNew) state.fields.push(f);
    persist(); els.modal.close(); render();
  };
  if (!isNew) document.getElementById('deleteFieldBtn').onclick = () => {
    if (state.games.some(g => g.fieldId === f.id)) return alert('Move or delete games on this field first.');
    state.fields = state.fields.filter(x => x.id !== f.id);
    persist(); els.modal.close(); render();
  };
  els.modal.showModal();
}

function openRefModal(id = '') {
  const r = id ? state.refs.find(x => x.id === id) : { id: uid(), name: '', level: 'Level 1', eligible: ['seven'], payOverride: 0 };
  const isNew = !id;
  els.modalContent.innerHTML = `
    <div class="modal-header"><h3>${isNew ? 'Add Referee' : 'Edit Referee'}</h3><button class="btn">Close</button></div>
    <div class="form-grid">
      <div><label>Name</label><input name="name" value="${escapeHtml(r.name)}"></div>
      <div><label>Level</label>${selectHtml('level', ['Level 1','Level 2','Senior'], r.level)}</div>
      <div class="full"><label>Eligible Field Types</label>
        <div class="list">
        ${['full','seven','modified_boys','modified_girls','custom'].map(type => `
          <label><input type="checkbox" name="eligible" value="${type}" ${r.eligible.includes(type) ? 'checked' : ''}> ${fieldTypeLabel(type)}</label>
        `).join('')}
        </div>
      </div>
      <div><label>Pay Override (optional)</label><input name="payOverride" type="number" min="0" value="${r.payOverride || 0}"></div>
    </div>
    <div class="actions" style="margin-top:16px; justify-content: space-between;">
      <div>${!isNew ? '<button type="button" class="btn btn-danger" id="deleteRefBtn">Delete</button>' : ''}</div>
      <div class="actions"><button class="btn">Cancel</button><button type="submit" class="btn btn-primary">Save Referee</button></div>
    </div>
  `;
  els.modalContent.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(els.modalContent);
    const eligible = fd.getAll('eligible');
    r.name = fd.get('name');
    r.level = fd.get('level');
    r.eligible = eligible;
    r.payOverride = Number(fd.get('payOverride') || 0);
    if (isNew) state.refs.push(r);
    persist(); els.modal.close(); render();
  };
  if (!isNew) document.getElementById('deleteRefBtn').onclick = () => {
    if (state.games.some(g => g.ref1 === r.id || g.ref2 === r.id)) return alert('Remove assignments first.');
    state.refs = state.refs.filter(x => x.id !== r.id);
    persist(); els.modal.close(); render();
  };
  els.modal.showModal();
}

function openVolunteerModal(id = '') {
  const v = id ? state.volunteers.find(x => x.id === id) : { id: uid(), name: '', roles: ['clock'] };
  const isNew = !id;
  els.modalContent.innerHTML = `
    <div class="modal-header"><h3>${isNew ? 'Add Volunteer' : 'Edit Volunteer'}</h3><button class="btn">Close</button></div>
    <div class="form-grid">
      <div><label>Name</label><input name="name" value="${escapeHtml(v.name)}"></div>
      <div class="full"><label>Allowed Roles</label>
        <div class="list">
        ${['clock','score','marshal','checkin','setup'].map(role => `
          <label><input type="checkbox" name="roles" value="${role}" ${v.roles.includes(role) ? 'checked' : ''}> ${role}</label>
        `).join('')}
        </div>
      </div>
    </div>
    <div class="actions" style="margin-top:16px; justify-content: space-between;">
      <div>${!isNew ? '<button type="button" class="btn btn-danger" id="deleteVolunteerBtn">Delete</button>' : ''}</div>
      <div class="actions"><button class="btn">Cancel</button><button type="submit" class="btn btn-primary">Save Volunteer</button></div>
    </div>
  `;
  els.modalContent.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(els.modalContent);
    v.name = fd.get('name');
    v.roles = fd.getAll('roles');
    if (isNew) state.volunteers.push(v);
    persist(); els.modal.close(); render();
  };
  if (!isNew) document.getElementById('deleteVolunteerBtn').onclick = () => {
    if (state.games.some(g => g.clock === v.id || g.score === v.id)) return alert('Remove assignments first.');
    state.volunteers = state.volunteers.filter(x => x.id !== v.id);
    persist(); els.modal.close(); render();
  };
  els.modal.showModal();
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return JSON.parse(JSON.stringify(sampleState));
}

function uid() { return Math.random().toString(36).slice(2, 10); }
function fieldTypeLabel(type) {
  return ({ full:'Full Field', seven:'7v7', modified_boys:'Modified Boys', modified_girls:'Modified Girls', custom:'Custom' })[type] || type;
}
function sortByTime(a,b) { return a.time.localeCompare(b.time); }
function fieldById(id) { return state.fields.find(f => f.id === id); }
function fieldName(id) { return fieldById(id)?.name || 'Unassigned'; }
function personName(kind, id) {
  if (!id) return '';
  const arr = kind === 'refs' ? state.refs : state.volunteers;
  return arr.find(x => x.id === id)?.name || '';
}
function statusBadge(text, cls) { return `<span class="badge ${cls}">${text}</span>`; }
function badgeClass(text) {
  if (text === 'Covered') return 'success';
  if (text === 'Partial') return 'warning';
  return 'danger';
}
function gameCoverageBadge(g) {
  const count = [g.ref1, g.ref2, g.clock, g.score].filter(Boolean).length;
  if (count === 4) return 'Covered';
  if (count >= 2) return 'Partial';
  return 'Open';
}
function refGames(refId) { return state.games.filter(g => g.ref1 === refId || g.ref2 === refId); }
function refPay(refId) {
  const ref = state.refs.find(r => r.id === refId);
  return refGames(refId).reduce((sum, g) => {
    const fieldType = fieldById(g.fieldId)?.type || 'custom';
    const rate = Number(ref?.payOverride) > 0 ? Number(ref.payOverride) : Number(state.payRules[fieldType] || 0);
    return sum + rate;
  }, 0);
}
function calcPayrollTotal() { return state.refs.reduce((sum, r) => sum + refPay(r.id), 0); }
function volunteerAssignments(volId) { return state.games.filter(g => g.clock === volId || g.score === volId); }
function diffHours(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
}
function volunteerHours(volId) { return volunteerAssignments(volId).reduce((sum, g) => sum + diffHours(g.time, g.endTime), 0); }
function calcVolunteerHoursTotal() { return state.volunteers.reduce((sum, v) => sum + volunteerHours(v.id), 0); }
function staffingGaps() {
  const gaps = [];
  state.games.sort(sortByTime).forEach(g => {
    const title = `${g.time} ${g.home} vs ${g.away} @ ${fieldName(g.fieldId)}`;
    if (!g.ref1) gaps.push(`Missing Ref 1 — ${title}`);
    if (!g.ref2) gaps.push(`Missing Ref 2 — ${title}`);
    if (!g.clock) gaps.push(`Missing Clock — ${title}`);
    if (!g.score) gaps.push(`Missing Score — ${title}`);
  });
  return gaps;
}
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday:'short', year:'numeric', month:'short', day:'numeric' });
}
function escapeHtml(v = '') {
  return String(v).replace(/[&<>"]/g, s => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[s]));
}
function statCard(value, label) {
  return `<div class="card stat-card"><div class="value">${value}</div><div class="label">${label}</div></div>`;
}
function selectHtml(name, options, selected, labelFn = x => x) {
  return `<select name="${name}">${options.map(v => `<option value="${v}" ${selected === v ? 'selected' : ''}>${labelFn(v)}</option>`).join('')}</select>`;
}
function selectEntity(name, arr, selected, labelFn) {
  return `<select name="${name}">${arr.map(v => `<option value="${v.id}" ${selected === v.id ? 'selected' : ''}>${labelFn(v)}</option>`).join('')}</select>`;
}
function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'gameday-director-export.json');
}
function importState(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = JSON.parse(reader.result);
      persist(); syncSidebar(); render();
      alert('Data imported.');
    } catch {
      alert('Could not import that file.');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}
function csvEscape(v) { return '"' + String(v ?? '').replaceAll('"', '""') + '"'; }
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
function downloadRefReport() {
  const rows = [['Name','Games','Pay']].concat(state.refs.map(r => [r.name, refGames(r.id).length, refPay(r.id)]));
  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
  downloadBlob(new Blob([csv], {type:'text/csv'}), 'ref-payroll-report.csv');
}
function downloadVolunteerReport() {
  const rows = [['Name','Assignments','Hours']].concat(state.volunteers.map(v => [v.name, volunteerAssignments(v.id).length, volunteerHours(v.id).toFixed(1)]));
  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
  downloadBlob(new Blob([csv], {type:'text/csv'}), 'volunteer-hours-report.csv');
}
function downloadCsvTemplate() {
  const rows = [['time','endTime','division','home','away','fieldName','status']];
  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
  downloadBlob(new Blob([csv], {type:'text/csv'}), 'games-template.csv');
}
