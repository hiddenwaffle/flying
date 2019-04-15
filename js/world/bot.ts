import { Spaceship } from './spaceship'
import { Loader } from 'js/gfx/loader'
import { MissilePool } from './missile-pool';

export class Bot {
  readonly spaceship: Spaceship
  readonly scene: any
  lastUpdate = Date.now()

  constructor(
    readonly id: number,
    loader: Loader,
    scene: any,
    missilePool: MissilePool
  ) {
    this.spaceship = new Spaceship(this.id, true, loader, scene, missilePool)
    this.scene = scene
  }

  start() {
    this.spaceship.start()
  }

  step() {
    this.spaceship.step()
  }

  stop() {
    this.spaceship.stop()
  }

  setQ(x: number, y: number, z: number, w: number) {
    this.lastUpdate = Date.now()
    this.spaceship.setQ(x, y, z, w)
  }

  setSpeed(speed: number) {
    this.spaceship.setSpeed(speed)
  }

  fire() {
    this.spaceship.fireMissile()
  }

  signalHit() {
    this.spaceship.hitAnimation()
  }
}
