
export const initialState = {
  rosters: {
    "Creeks": ["Player 1","Player 2","Player 3","Player 4"],
    "Jax Lax": ["Player A","Player B","Player C","Player D"],
    "Riptide": ["Player X","Player Y","Player Z","Player Q"],
    "Bulldogs": ["Player M","Player N","Player O","Player P"]
  },
  refs: [
    {name:"Samuel Branford", checkedIn:true},
    {name:"Kaleb Thrasher", checkedIn:true},
    {name:"Gavin Branford", checkedIn:false},
    {name:"Grant Charles", checkedIn:false},
    {name:"Sam Larkin", checkedIn:true},
    {name:"Will Larkin", checkedIn:false},
    {name:"Luke Peacock", checkedIn:true},
    {name:"Gunner Lee", checkedIn:false},
    {name:"Xander Lee", checkedIn:true}
  ],
  volunteers: [
    {name:"Amy Packer", checkedIn:true, role:"Score Table"},
    {name:"Megan Packer", checkedIn:true, role:"Score Table"},
    {name:"Ashton Packer", checkedIn:false, role:"Clock / Score"},
    {name:"Brooke Smith", checkedIn:false, role:"Field Marshal"}
  ],
  schedule: [
    {time:"10:00 AM", team1:"Creeks", team2:"Jax Lax", field:"1", status:"Scheduled"},
    {time:"11:00 AM", team1:"Riptide", team2:"Bulldogs", field:"2", status:"Scheduled"},
    {time:"12:15 PM", team1:"Creeks", team2:"Bulldogs", field:"3", status:"Scheduled"},
    {time:"1:30 PM", team1:"Jax Lax", team2:"Riptide", field:"4", status:"Scheduled"}
  ],
  checkins: {},
  alerts: []
};
