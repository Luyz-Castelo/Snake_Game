import * as constants from './constants/scale.js';

export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10*constants.scale,
      height: 10*constants.scale,
    }
  }

  const observers = []

  function start() {
    const frequency = 2000 // in ms

    setInterval(addFruit, frequency)
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function unsubscribeAll() {
    observers.splice(0)
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function addPlayer(command) {
    const [randomPosX, randomPosY] = [Math.floor(Math.random() * state.screen.width), Math.floor(Math.random() * state.screen.height)]
    
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : randomPosX - (randomPosX%constants.scale)
    const playerY = 'playerY' in command ? command.playerY : randomPosY - (randomPosY%constants.scale)
    const playerPoints = 'playerPoints' in command ? command.playerPoints : 0;
    const playerName = command.playerId.substring(command.playerId.length-4, command.playerId.length)
    const playerDirection = 'direction' in command ? command.direction : 'right'

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      points: playerPoints,
      name: playerName,
      direction: playerDirection,
    }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      playerPoints,
      playerDirection,
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId,
    })
  }

  function incrementPoint(command) {
    const playerId = command.playerId
    
    const player = state.players[playerId]

    if(player) {
      player.points += 1
    }

    notifyAll({
      type: 'point-incremented',
      playerId,
      player
    })
  }

  function addFruit(command) {
    const [randomPosX, randomPosY] = [Math.floor(Math.random() * state.screen.width), Math.floor(Math.random() * state.screen.height)]

    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 100000)
    const fruitX = command ? command.fruitX : randomPosX - (randomPosX%constants.scale)
    const fruitY = command ? command.fruitY : randomPosY - (randomPosY%constants.scale)

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    }

    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY,
    })
  }

  function removeFruit(command) {
    const fruitId = command.fruitId

    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId
    })
  }

  function movePlayer(command) {
    notifyAll(command)

    const acceptedMoves = {
      ArrowUp(player) {
        if(player.y - 1*constants.scale >= 0) {
          player.y -= 1*constants.scale
          player.direction = 'up'
          return
        }
      },
      ArrowDown(player) {
        if(player.y + 1*constants.scale < state.screen.height) {
          player.y += 1*constants.scale
          player.direction = 'down'
          return
        }
      },
      ArrowRight(player) {
        if(player.x + 1*constants.scale < state.screen.width) {
          player.x += 1*constants.scale
          player.direction = 'right'
          return
        }
      },
      ArrowLeft(player) {
        if(player.x -1*constants.scale >= 0) {
          player.x -= 1*constants.scale
          player.direction = 'left'
          return
        }
      },
    }

    const player = state.players[command.playerId]
    const playerId = command.playerId
    const keyPressed = command.keyPressed
    const moveFunction = acceptedMoves[keyPressed]

    if(player && moveFunction) {
      moveFunction(player)
      checkForFruitCollision(playerId)          
    }
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId]

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]

      if(player.y === fruit.y && player.x === fruit.x) {
        removeFruit({ fruitId })
        incrementPoint({ playerId })
      }
    }
  }
  
  return {
    addPlayer,
    removePlayer,
    movePlayer,
    addFruit,
    removeFruit,
    state,
    setState,
    start,
    subscribe,
    unsubscribeAll,
    incrementPoint,
  }
}
