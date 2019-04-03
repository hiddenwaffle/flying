import 'reflect-metadata'
import { container } from 'tsyringe'
import { Game } from './game'

const game = container.resolve(Game)
game.start()
