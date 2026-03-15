
function renderBoard(){

const container = document.getElementById("boardContainer")
if(!container) return

container.innerHTML=""

const fields = [...new Set(LeagueDB.games.map(g=>g.field))]

fields.forEach(field=>{

const col = document.createElement("div")
col.className="fieldColumn"
col.innerHTML=`<h3>${field}</h3>`

LeagueDB.games
.filter(g=>g.field===field)
.sort((a,b)=>new Date("1/1/2000 "+a.time) - new Date("1/1/2000 "+b.time))
.forEach(game=>{

const card = document.createElement("div")
card.className="gameCard"

card.innerHTML=`
<div>${game.time}</div>
<div>${game.home} vs ${game.away}</div>

<select onchange="updateGameStatus(${game.id}, this.value)">
<option ${game.status==="Scheduled"?"selected":""}>Scheduled</option>
<option ${game.status==="Starting"?"selected":""}>Starting</option>
<option ${game.status==="Live"?"selected":""}>Live</option>
<option ${game.status==="Halftime"?"selected":""}>Halftime</option>
<option ${game.status==="Final"?"selected":""}>Final</option>
<option ${game.status==="Delayed"?"selected":""}>Delayed</option>
</select>

<div class="status">Status: ${game.status}</div>
`

col.appendChild(card)

})

container.appendChild(col)

})

}
