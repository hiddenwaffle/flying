import { Projectile } from './projectile'
import { Loader } from 'js/gfx/loader'

export abstract class Spaceship extends Projectile {
  private spaceshipMeshes: Array<any>
  private readonly red: boolean
  private readonly loader: Loader

  constructor(red: boolean, loader: Loader) {
    super()
    this.red = red
    this.loader = loader
  }

  start() {
    const id = Math.random() // TODO: What to do about this?
    this.spaceshipMeshes = this.loader.getSpaceshipInstances(id, this.red, this.arrow)
  }
}
