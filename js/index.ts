import 'reflect-metadata'
import { container } from 'tsyringe'
import { Game } from './game'

const game = container.resolve(Game)
game.start()

// import { Ui } from 'js/ui/ui'
// import { World } from 'js/world/world'

// const canvas = <HTMLCanvasElement> document.getElementById('renderCanvas')
// const engine = new BABYLON.Engine(canvas, true)

// const ui = new Ui(canvas, engine)
// const world = new World(engine)
// world.start()








// import { db } from './old/database'
// import { environment } from './environment'

// // TODO: Something else with this
// import './ui/ui'
// // import * as tmp from './index.html'

// window.addEventListener('DOMContentLoaded', () => {
//   db.doIt()
//   console.log('Hello World (from index)', environment)
// })

// // TODO: Use this for client ID
// const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
// console.log('Client ID:', id)
