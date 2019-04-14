import { generateId } from 'js/math'
import { Spaceship } from './spaceship'
import { Loader } from 'js/gfx/loader'
import { MissilePool } from './missile-pool';

export class Bot {
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

  setQ(x: number, y: number, z: number, w: number) {
    this.spaceship.setQ(x, y, z, w)
  }

  setSpeed(speed: number) {
    this.spaceship.setSpeed(speed)
  }

  fire() {
    this.spaceship.fireMissile()
  }
}
