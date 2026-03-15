
import { useRef } from "react";

export default function UploadPanel({
  onLoadRoster,
  onCommitRoster,
  rosterStatus,
  onLoadSchedule,
  onCommitSchedule,
  scheduleStatus
}){
  const rosterRef = useRef(null);
  const scheduleRef = useRef(null);

  return (
    <div className="panel">
      <div className="panel-title">Uploads</div>
      <div className="upload-box">
        <div>
          <label>Roster File (CSV or XLSX)</label>
          <input ref={rosterRef} type="file" accept=".csv,.xlsx,.xls" onChange={(e)=> onLoadRoster(e.target.files?.[0])} />
          <button className="primary" onClick={onCommitRoster}>OK – Commit Roster Upload</button>
          <div className="small">{rosterStatus}</div>
        </div>
        <div>
          <label>Schedule File (CSV or XLSX)</label>
          <input ref={scheduleRef} type="file" accept=".csv,.xlsx,.xls" onChange={(e)=> onLoadSchedule(e.target.files?.[0])} />
          <button className="primary" onClick={onCommitSchedule}>OK – Commit Schedule Upload</button>
          <div className="small">{scheduleStatus}</div>
        </div>
      </div>
      <div className="small">Roster formats: Team,Player OR Player,Team</div>
      <div className="small">Schedule formats: Time,Team1,Team2,Field</div>
    </div>
  );
}
