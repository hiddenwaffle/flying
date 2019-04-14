import { Projectile } from './projectile'
import { Loader } from 'js/gfx/loader'
import { MissilePool } from './missile-pool'

export class Spaceship extends Projectile {
  private readonly meshInstances: Array<any>
  readonly red: boolean
  private readonly loader: Loader
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
    this.missilePool = missilePool
  }

  start() {
    const meshInstances = this.loader.createSpaceshipMeshInstances(this.id, this.red, this.arrow)
    this.teleportRandom()
  }

  stop() {
    super.stop()
    if (this.meshInstances) {
      for (let meshInstance of this.meshInstances) {
        meshInstance.dispose()
      }
    }
  }

  fireMissile() {
    this.missilePool.fire(this.id, this.cot.rotationQuaternion)
  }
}
