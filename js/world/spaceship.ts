import { Projectile } from './projectile'
import { Loader } from 'js/gfx/loader'

export class Spaceship extends Projectile {
  private readonly id: number
  private spaceshipMeshes: Array<any>
  private readonly red: boolean
  private readonly loader: Loader

  constructor(id: number, red: boolean, loader: Loader, getAnimationRatio: () => number) {
    super(id, getAnimationRatio)
    this.id = id
    this.red = red
    this.loader = loader
  }

  start() {
    this.spaceshipMeshes = this.loader.getSpaceshipInstances(this.id, this.red, this.arrow)
    this.teleportRandom()
  }
}
