export function addPlayerToScoreBoard(newPlayer, newPlayerId) {
  const scoreboard = document.getElementById('scoreboard')

  const li = document.createElement('li')
  li.id = newPlayerId
  li.innerText = `${newPlayer.name}: ${newPlayer.points}`

  scoreboard.appendChild(li)
}

export function removePlayerFromScoreboard(playerIdToRemove) {
  const playerToRemove = document.getElementById(playerIdToRemove)

  playerToRemove?.remove()
}

export function setupScoreboard(players, playerId) {
  const scoreboard = document.getElementById('scoreboard')

  for (const otherPlayerId in players) {
    const li = document.createElement('li')
    li.id = otherPlayerId
    li.innerText = `${players[otherPlayerId].name}: ${players[otherPlayerId].points}`
    if(playerId === otherPlayerId) {
      li.style.color = 'green'
      li.style.fontWeight = 'bold'
    }

    scoreboard.appendChild(li)
  }
}

export function updateScoreboard(player, playerId) {
  const playerInHtml = document.getElementById(playerId)
  
  if(playerInHtml) {
    playerInHtml.innerText = `${player.name}:  ${player.points}`
  }
}
