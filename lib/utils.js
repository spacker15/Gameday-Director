
export function parseTime(t){
  const m = String(t||"").trim().toUpperCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if(!m) return 99999;
  let h = parseInt(m[1],10), min = parseInt(m[2]||"0",10), mer = m[3];
  if(mer==="PM" && h!==12) h += 12;
  if(mer==="AM" && h===12) h = 0;
  return h*60 + min;
}
export function sortSchedule(schedule){
  return [...schedule].sort((a,b)=> parseTime(a.time)-parseTime(b.time) || String(a.field).localeCompare(String(b.field)));
}
export function gameKey(game){
  return `${game.time}|${game.team1}|${game.team2}|${game.field}`;
}
export function playerGlobalKey(team, player){
  return `${team}::${player}`;
}
