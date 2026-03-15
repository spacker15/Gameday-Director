
export function generateSchedule(teams,fields,times){

let games=[]
let fieldIndex=0
let timeIndex=0

for(let i=0;i<teams.length;i+=2){

const team1=teams[i]
const team2=teams[i+1]

if(!team2) continue

games.push({
team1:team1.name,
team2:team2.name,
field:fields[fieldIndex],
time:times[timeIndex],
status:"Scheduled"
})

fieldIndex++

if(fieldIndex>=fields.length){
fieldIndex=0
timeIndex++
}

}

return games

}
