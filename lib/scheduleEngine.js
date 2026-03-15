
export function generateScheduleFromRosters(rosters){
  const teams = Object.keys(rosters).sort();
  const times = ["10:00 AM","11:00 AM","12:15 PM","1:30 PM","2:45 PM","3:30 PM"];
  const generated = [];
  let field = 1;
  for(let i=0;i<teams.length;i+=2){
    if(teams[i+1]){
      generated.push({
        time: times[Math.floor(i/2)] || "4:15 PM",
        team1: teams[i],
        team2: teams[i+1],
        field: String(field++),
        status:"Scheduled"
      });
    }
  }
  return generated;
}
