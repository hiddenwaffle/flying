import { Projectile } from './projectile'
import { Loader } from 'js/gfx/loader'
import { Missile } from './missile'
import { generateId } from 'js/math'
import { MissilePool } from './missile-pool'

export class Spaceship extends Projectile {
  private readonly red: boolean
  private readonly loader: Loader
  private readonly scene: any
  private readonly missilePool: MissilePool

  constructor(
    id: number,
    red: boolean,
    loader: Loader,
    scene: any,
    missilePool: MissilePool
  ) {
    super(id, scene.getAnimationRatio.bind(scene))
    this.red = red
    this.loader = loader
    this.scene = scene
    this.missilePool = missilePool
  }

  start() {
    const meshInstances = this.loader.createSpaceshipMeshInstances(this.id, this.red, this.arrow)
    this.teleportRandom()
  }

  fireMissile() {
    this.missilePool.fire(this.id, this.cot.rotationQuaternion)
  }
}
