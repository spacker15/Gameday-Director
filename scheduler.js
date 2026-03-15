
function updateGameStatus(gameID, newStatus){

const game = LeagueDB.games.find(g=>g.id===gameID)
if(!game) return

game.status = newStatus

renderBoard()
renderDashboard()

}
