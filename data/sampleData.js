
export const initialState={
date:new Date().toISOString().split("T")[0],

games:[
{field:1,time:"9:00 AM",team1:"Creeks",team2:"Riptide",status:"live"},
{field:2,time:"9:00 AM",team1:"Jax Lax",team2:"Bulldogs",status:"scheduled"},
{field:3,time:"9:00 AM",team1:"Creeks Blue",team2:"Riptide Gray",status:"delayed"}
],

refs:[
{name:"Samuel Branford",status:"Checked In"},
{name:"Kaleb Thrasher",status:"Checked In"},
{name:"Gavin Branford",status:"Missing"}
],

volunteers:[
{name:"Amy Packer",role:"Score Table"},
{name:"Brooke Smith",role:"Clock"}
],

incidents:[
{time:"1:12 PM",text:"Player injury – trainer dispatched"},
{time:"1:40 PM",text:"Bench warning – Creeks coach"}
],

weather:{
temp:78,
conditions:"Clear",
wind:"6 mph"
}
}
