import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'socket.io'

const port = 3000

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe(command => {
  sockets.emit(command.type, command)
})

sockets.on('connection', socket => {
  const playerId = socket.id

  game.addPlayer({ playerId });

  socket.emit('setup', game.state)

  
  socket.on('disconnect', () => {
    game.removePlayer({ playerId })
  })

  socket.on('move-player', command => {
    command.playerId = playerId
    command.type = 'move-player'

    game.movePlayer(command)
  })
})

server.listen(port, () => {
  console.log('> Server listening on port', port)
})
