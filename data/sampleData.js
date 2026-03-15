
export const initialState={
date:new Date().toISOString().split("T")[0],

teams:{
Creeks:["Megan","Ashton","Player3"],
Riptide:["PlayerA","PlayerB"]
},

games:[
{date:"2026-03-15",time:"9:00 AM",field:1,team1:"Creeks",team2:"Riptide",checkins:{}}
],

refs:["Samuel Branford","Kaleb Thrasher"],
volunteers:["Amy Packer","Brooke Smith"],

incidents:[]
}
