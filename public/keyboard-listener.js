export default function createKeyboardListener(document) {
  const state = {
    observers: [],
    playerId: null
  }

  function registerPlayerId(playerId) {
    state.playerId = playerId
  }

  function subscribe(observerFunction) {
    state.observers.push(observerFunction)
  }

  function unsubscribeAll() {
    state.observers = []
  }

  function notifyAll(command) {
    for (const observerFunction of state.observers) {
      observerFunction(command)
    }
  }

  document.addEventListener('keydown', handleKeydown)

  function handleKeydown(event) {
    const keyPressed = event.key
    const playerId = state.playerId

    const command = {
      type: 'move-player',
      playerId,
      keyPressed,
    }

    notifyAll(command)
  }
  
  return {
    subscribe,
    unsubscribeAll,
    registerPlayerId
  }
}
