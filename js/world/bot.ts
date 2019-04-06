import { generateId } from 'js/math'
import { Spaceship } from './spaceship'
import { Loader } from 'js/gfx/loader'
import { Direction } from './projectile'

export class Bot {
  readonly id: number
  readonly spaceship: Spaceship

  constructor(loader: Loader, red: boolean, getAnimationRatio) {
    this.id = generateId()
    this.spaceship = new Spaceship(this.id, red, loader, getAnimationRatio)
    this.spaceship.direction = Direction.Forward
  }

  start() {
    this.spaceship.start()
  }

  step() {
    this.spaceship.step()
  }
}
