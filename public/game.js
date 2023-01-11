export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10,
    }
  }

  const observers = []

  function start() {
    const frequency = 500 // in ms

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
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)
    const playerPoints = 'playerPoints' in command ? command.playerPoints : 0;
    const playerName = command.playerId.substring(command.playerId.length-4, command.playerId.length)

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      points: playerPoints,
      name: playerName,
    }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      playerPoints
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
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 100000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

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
        if(player.y - 1 >= 0) {
          player.y -= 1
          return
        }
      },
      ArrowDown(player) {
        if(player.y + 1 < state.screen.height) {
          player.y += 1
          return
        }
      },
      ArrowRight(player) {
        if(player.x + 1 < state.screen.width) {
          player.x += 1
          return
        }
      },
      ArrowLeft(player) {
        if(player.x -1 >= 0) {
          player.x -= 1
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
