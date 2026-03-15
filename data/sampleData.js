
export const initialState={

selectedDate:new Date().toISOString().split("T")[0],

fields:[
{id:1,name:"Field 1"},
{id:2,name:"Field 2"},
{id:3,name:"Field 3"},
{id:4,name:"Field 4"},
{id:5,name:"Field 5"},
{id:6,name:"Field 6"}
],

games:[
{date:"2026-03-15",time:"9:00 AM",team1:"Creeks",team2:"Riptide",field:1,status:"Scheduled"},
{date:"2026-03-15",time:"9:00 AM",team1:"Jax Lax",team2:"Bulldogs",field:2,status:"Scheduled"},
{date:"2026-03-15",time:"10:15 AM",team1:"Creeks Blue",team2:"Riptide Gray",field:3,status:"Scheduled"},

{date:"2026-03-16",time:"9:00 AM",team1:"Creeks",team2:"Bulldogs",field:1,status:"Scheduled"},
{date:"2026-03-16",time:"9:00 AM",team1:"Riptide",team2:"Jax Lax",field:2,status:"Scheduled"}
],

weather:{temp:82,humidity:70,lightning:false,lastStrike:"None"},

incidents:[],
medical:[]

}
