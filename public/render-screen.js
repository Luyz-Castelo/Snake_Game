import * as constants from "./constants/scale.js";

export default function createScreenRenderer() {
  let previousRenderUsedId = 0;
  const directions = {
    up(player, context, color) {
      context.fillStyle = color
      context.fillRect(player.x, player.y, 1*constants.scale, .2*constants.scale)
    },
    down(player, context, color) {
      context.fillStyle = color
      context.fillRect(player.x, player.y+constants.scale*.8, 1*constants.scale, .2*constants.scale)
    },
    right(player, context, color) {
      context.fillStyle = color
      context.fillRect(player.x+constants.scale*.8, player.y, .2*constants.scale, 1*constants.scale)
    },
    left(player, context, color) {
      context.fillStyle = color
      context.fillRect(player.x, player.y, .2*constants.scale, 1*constants.scale)
    },
  }
  
  function renderScreen(screen, game, requestAnimationFrame, currentPlayerId, selectedColor) {
    const context = screen.getContext('2d')
  
    const width = game.state.screen.width
    const height = game.state.screen.height
  
    context.fillStyle = 'white'
    context.clearRect(0, 0, width, height)
  
    for (const playerId in game.state.players) {
      const player = game.state.players[playerId]
      context.fillStyle = 'black'
      context.fillRect(player.x, player.y, 1*constants.scale, 1*constants.scale)

      const directionIndicator = directions[player.direction]
      directionIndicator(player, context, 'purple')
    }
    
    for (const fruitId in game.state.fruits) {
      const fruit = game.state.fruits[fruitId]
      context.fillStyle = 'green'
      context.fillRect(fruit.x, fruit.y, 1*constants.scale, 1*constants.scale)
    }
  
    const currentPlayer = game.state.players[currentPlayerId]
    
    if(currentPlayer) {
      context.fillStyle = selectedColor || '#F0DB4F'
      context.fillRect(currentPlayer.x, currentPlayer.y, 1*constants.scale, 1*constants.scale)

      const directionIndicator = directions[currentPlayer.direction]

      directionIndicator(currentPlayer, context, 'black')
    }

    cancelAnimationFrame(previousRenderUsedId)
    
    previousRenderUsedId = requestAnimationFrame(() => renderScreen(screen, game, requestAnimationFrame, currentPlayerId, selectedColor))
  }

  return {
    renderScreen,
  }
}
