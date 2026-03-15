
export const initialState = {

selectedDate:new Date().toISOString().split("T")[0],

fields:[
{id:1,name:"Field 1"},
{id:2,name:"Field 2"},
{id:3,name:"Field 3"},
{id:4,name:"Field 4"},
{id:5,name:"Field 5"},
{id:6,name:"Field 6"}
],

teams:{
Creeks:["Player1","Player2","Player3"],
Riptide:["PlayerA","PlayerB","PlayerC"],
JaxLax:["PlayerX","PlayerY","PlayerZ"],
Bulldogs:["PlayerM","PlayerN","PlayerO"]
},

games:[
{date:"2026-03-15",time:"9:00 AM",team1:"Creeks",team2:"Riptide",field:1,status:"Scheduled"},
{date:"2026-03-15",time:"9:00 AM",team1:"JaxLax",team2:"Bulldogs",field:2,status:"Scheduled"},
{date:"2026-03-16",time:"9:00 AM",team1:"Creeks",team2:"Bulldogs",field:1,status:"Scheduled"}
],

refs:[
{name:"Samuel Branford"},
{name:"Kaleb Thrasher"},
{name:"Gunner Lee"}
],

volunteers:[
{name:"Amy Packer",role:"Score Table"},
{name:"Brooke Smith",role:"Clock"}
],

incidents:[],
medical:[],

weather:{
temp:82,
humidity:71,
lightning:false
}

}
