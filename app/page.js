
"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import Tabs from "../components/Tabs";
import MetricTile from "../components/MetricTile";
import GameCard from "../components/GameCard";
import UploadPanel from "../components/UploadPanel";
import { initialState } from "../data/sampleData";
import { sortSchedule, gameKey, playerGlobalKey } from "../lib/utils";
import { generateScheduleFromRosters } from "../lib/scheduleEngine";

const STORAGE_KEY = "leagueops_v10_1";

export default function Page(){
  const [state, setState] = useState(initialState);
  const [active, setActive] = useState("dashboard");
  const [rosterRows, setRosterRows] = useState([]);
  const [scheduleRows, setScheduleRows] = useState([]);
  const [rosterStatus, setRosterStatus] = useState("");
  const [scheduleStatus, setScheduleStatus] = useState("");
  const [selectedGame, setSelectedGame] = useState(0);
  const [checkinAlert, setCheckinAlert] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if(raw){
      try { setState(JSON.parse(raw)); } catch(e){}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const sortedSchedule = useMemo(() => sortSchedule(state.schedule), [state.schedule]);
  const teams = useMemo(() => Object.keys(state.rosters).sort(), [state.rosters]);
  const playerCount = useMemo(() => Object.values(state.rosters).reduce((n, arr) => n + arr.length, 0), [state.rosters]);
  const checkedCount = useMemo(() => Object.values(state.checkins || {}).reduce((n, obj) => n + Object.values(obj).filter(Boolean).length, 0), [state.checkins]);

  const tabs = [
    {key:"dashboard", label:"Dashboard"},
    {key:"schedule", label:"Schedule"},
    {key:"rosters", label:"Rosters"},
    {key:"checkin", label:"Game Check-In"},
    {key:"staff", label:"Refs & Volunteers"},
    {key:"uploads", label:"Uploads"},
    {key:"engine", label:"Scheduling Engine"}
  ];

  function exportState(){
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leagueops-live-v10-1-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function resetDemo(){
    setState(JSON.parse(JSON.stringify(initialState)));
    setSelectedGame(0);
    setCheckinAlert("");
  }

  function parseRowsFromWorkbook(file){
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = evt => {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, {type:"array"});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, {header:1, raw:false});
        resolve(rows.map(r => r.map(c => String(c ?? "").trim())).filter(r => r.some(Boolean)));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function parseRowsFromCsv(file){
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = evt => {
        const rows = String(evt.target.result)
          .split(/\r?\n/)
          .map(line => line.split(",").map(c => String(c ?? "").trim()))
          .filter(r => r.some(Boolean));
        resolve(rows);
      };
      reader.readAsText(file);
    });
  }

  async function loadAnyRows(file){
    if(!file) return [];
    const name = file.name.toLowerCase();
    if(name.endsWith(".xlsx") || name.endsWith(".xls")) return await parseRowsFromWorkbook(file);
    return await parseRowsFromCsv(file);
  }

  function detectRosterRows(rows){
    const out = [];
    rows.forEach((row, idx) => {
      if(!row || row.length < 2) return;
      const joined = row.join(" ").toLowerCase();
      if(idx === 0 && joined.includes("team") && (joined.includes("player") || joined.includes("name"))) return;
      const a = row[0], b = row[1];
      if(!a || !b) return;
      out.push([a,b]);
    });
    return out;
  }

  function detectScheduleRows(rows){
    const out = [];
    rows.forEach((row, idx) => {
      if(!row || row.length < 4) return;
      const joined = row.join(" ").toLowerCase();
      if(idx === 0 && joined.includes("time")) return;
      const [time, team1, team2, field] = row;
      if(time && team1 && team2 && field) out.push([time,team1,team2,field]);
    });
    return out;
  }

  async function handleRosterLoad(file){
    const rows = await loadAnyRows(file);
    const parsed = detectRosterRows(rows);
    setRosterRows(parsed);
    setRosterStatus(parsed.length ? `Roster file loaded: ${parsed.length} rows. Click OK to commit.` : "No roster rows found.");
  }

  async function handleScheduleLoad(file){
    const rows = await loadAnyRows(file);
    const parsed = detectScheduleRows(rows);
    setScheduleRows(parsed);
    setScheduleStatus(parsed.length ? `Schedule file loaded: ${parsed.length} rows. Click OK to commit.` : "No schedule rows found.");
  }

  function commitRoster(){
    if(!rosterRows.length){
      setRosterStatus("No roster file loaded yet.");
      return;
    }
    const nextRosters = {};
    rosterRows.forEach(([a,b]) => {
      let team, player;
      const la = String(a).toLowerCase();
      const looksLikeTeam = la.includes("lax") || la.includes("creeks") || la.includes("riptide") || la.includes("bulldog") || la.includes("hawk") || la.includes("crocs");
      if(looksLikeTeam){ team = a; player = b; } else { player = a; team = b; }
      team = String(team).trim();
      player = String(player).trim();
      if(!team || !player) return;
      if(!nextRosters[team]) nextRosters[team] = [];
      if(!nextRosters[team].includes(player)) nextRosters[team].push(player);
    });
    setState(prev => ({ ...prev, rosters: nextRosters }));
    setRosterRows([]);
    setRosterStatus("Roster upload committed.");
    setSelectedGame(0);
  }

  function commitSchedule(){
    if(!scheduleRows.length){
      setScheduleStatus("No schedule file loaded yet.");
      return;
    }
    const nextSchedule = scheduleRows.map(([time, team1, team2, field]) => ({
      time, team1, team2, field, status:"Scheduled"
    }));
    setState(prev => ({ ...prev, schedule: nextSchedule }));
    setScheduleRows([]);
    setScheduleStatus("Schedule upload committed.");
    setSelectedGame(0);
  }

  function duplicateCheck(playerKey, excludeGameKey){
    for(const [gk, players] of Object.entries(state.checkins || {})){
      if(gk === excludeGameKey) continue;
      if(players[playerKey]) return gk;
    }
    return null;
  }

  function toggleCheckIn(team, player){
    const game = sortedSchedule[selectedGame];
    if(!game) return;
    const gk = gameKey(game);
    const pKey = playerGlobalKey(team, player);
    const nextCheckins = { ...(state.checkins || {}) };
    nextCheckins[gk] = { ...(nextCheckins[gk] || {}) };

    if(nextCheckins[gk][pKey]){
      delete nextCheckins[gk][pKey];
      setCheckinAlert("");
      setState(prev => ({ ...prev, checkins: nextCheckins }));
      return;
    }

    const duplicate = duplicateCheck(pKey, gk);
    if(duplicate){
      const alert = `${player} (${team}) is already checked into another game: ${duplicate}`;
      setCheckinAlert(alert);
      setState(prev => ({ ...prev, alerts: [alert, ...(prev.alerts || [])].slice(0, 20) }));
      return;
    }

    nextCheckins[gk][pKey] = true;
    setCheckinAlert("");
    setState(prev => ({ ...prev, checkins: nextCheckins }));
  }

  const game = sortedSchedule[selectedGame];
  const currentGamePlayers = game ? [
    ...(state.rosters[game.team1] || []).map(p => ({ team: game.team1, player: p })),
    ...(state.rosters[game.team2] || []).map(p => ({ team: game.team2, player: p }))
  ] : [];

  return (
    <div>
      <header className="topbar">
        <div>
          <div className="eyebrow">WEB-BASED LEAGUE COMMAND CENTER</div>
          <h1>LeagueOps Live v10.1</h1>
          <div className="subline">Full tabs restored • uploads wired • roster linkage • click check-in with duplicate alerts</div>
        </div>
        <div className="top-actions">
          <button className="ghost" onClick={exportState}>Export Backup</button>
          <button className="danger" onClick={resetDemo}>Reset Demo</button>
        </div>
      </header>

      <Tabs active={active} setActive={setActive} tabs={tabs} />

      <main className="main-wrap">
        {active === "dashboard" && (
          <>
            <div className="tile-grid">
              <MetricTile label="Teams" value={teams.length} />
              <MetricTile label="Players" value={playerCount} />
              <MetricTile label="Games" value={sortedSchedule.length} />
              <MetricTile label="Refs" value={state.refs.length} />
              <MetricTile label="Volunteers" value={state.volunteers.length} />
              <MetricTile label="Checked In" value={checkedCount} />
            </div>
            <div className="panel">
              <div className="panel-title">Today at a Glance</div>
              {sortedSchedule.map((g, i) => <GameCard key={i} game={g} />)}
            </div>
            <div className="panel">
              <div className="panel-title">Alerts</div>
              {(state.alerts || []).length ? state.alerts.slice(0,8).map((a, i) => (
                <div className="alert-box warn" key={i}>{a}</div>
              )) : <div className="small">No active alerts.</div>}
            </div>
          </>
        )}

        {active === "schedule" && (
          <div className="panel">
            <div className="panel-title">Schedule Board</div>
            <div className="schedule-grid">
              {sortedSchedule.map((g, i) => <GameCard key={i} game={g} />)}
            </div>
          </div>
        )}

        {active === "rosters" && (
          <div className="panel">
            <div className="panel-title">Team Rosters</div>
            {teams.map(team => (
              <div className="team-card" key={team}>
                <h3>{team}</h3>
                {(state.rosters[team] || []).map(player => (
                  <div className="roster-row" key={player}>
                    <span>{player}</span>
                    <span className="small">Active</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {active === "checkin" && (
          <div className="panel">
            <div className="panel-title">Game Check-In</div>
            <div className="toolbar">
              <label>Game</label>
              <select value={selectedGame} onChange={(e)=> setSelectedGame(Number(e.target.value))}>
                {sortedSchedule.map((g, i) => (
                  <option value={i} key={i}>{g.time} • {g.team1} vs {g.team2} • Field {g.field}</option>
                ))}
              </select>
            </div>
            <div className="small">Click a player row to check them in for that specific game. If they are already checked into another game, the system alerts you.</div>
            {checkinAlert ? <div className="alert-box error">{checkinAlert}</div> : null}
            <div className="team-card">
              <h3>{game ? `${game.team1} vs ${game.team2}` : "No Game Selected"}</h3>
              {currentGamePlayers.map(({team, player}) => {
                const currentGameKey = gameKey(game);
                const pKey = playerGlobalKey(team, player);
                const checked = !!((state.checkins || {})[currentGameKey] || {})[pKey];
                const duplicate = duplicateCheck(pKey, currentGameKey);
                return (
                  <div className="roster-row clickable" key={team + player} onClick={() => toggleCheckIn(team, player)}>
                    <span>{player} <span className="small">({team})</span></span>
                    <span className={`badge ${duplicate && !checked ? "alert" : checked ? "" : "pending"}`}>
                      {checked ? "Checked In" : duplicate ? "Already In Another Game" : "Click To Check In"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {active === "staff" && (
          <div className="panel">
            <div className="panel-title">Refs & Volunteers</div>
            <div className="staff-columns">
              <div>
                <h3>Youth Refs</h3>
                {state.refs.map(ref => (
                  <div className="staff-card" key={ref.name}>
                    <strong>{ref.name}</strong>
                    <div className="small">{ref.checkedIn ? "Checked In" : "Not Checked In"}</div>
                  </div>
                ))}
              </div>
              <div>
                <h3>Volunteers</h3>
                {state.volunteers.map(vol => (
                  <div className="staff-card" key={vol.name}>
                    <strong>{vol.name}</strong>
                    <div className="small">{vol.role} • {vol.checkedIn ? "Checked In" : "Not Checked In"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === "uploads" && (
          <UploadPanel
            onLoadRoster={handleRosterLoad}
            onCommitRoster={commitRoster}
            rosterStatus={rosterStatus}
            onLoadSchedule={handleScheduleLoad}
            onCommitSchedule={commitSchedule}
            scheduleStatus={scheduleStatus}
          />
        )}

        {active === "engine" && (
          <div className="panel">
            <div className="panel-title">Scheduling Engine</div>
            <button
              className="primary"
              onClick={() => {
                const nextSchedule = generateScheduleFromRosters(state.rosters);
                setState(prev => ({ ...prev, schedule: nextSchedule }));
              }}
            >
              Generate Schedule From Current Rosters
            </button>
            <div className="small">Reads current teams from rosters and creates a basic schedule.</div>
            <ul className="engine-list">
              <li>Reads teams by division</li>
              <li>Removes unavailable teams</li>
              <li>Builds matchup pools</li>
              <li>Handles double headers</li>
              <li>Assigns fields/times</li>
              <li>Validates rest windows</li>
              <li>Outputs weekly schedule automatically</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
