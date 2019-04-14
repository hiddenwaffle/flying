import { generateId } from 'js/math'
import { Spaceship } from './spaceship'
import { Loader } from 'js/gfx/loader'
import { MissilePool } from './missile-pool';

export class RemotePlayer {
  readonly id: number
  readonly spaceship: Spaceship
  readonly scene: any

  constructor(
    loader: Loader,
    scene: any,
    missilePool: MissilePool
  ) {
    this.id = generateId()
    this.spaceship = new Spaceship(this.id, true, loader, scene, missilePool)
    this.scene = scene
  }

  start() {
    this.spaceship.start()
  }

  step() {
    this.spaceship.step()
  }
}
