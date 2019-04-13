import { Projectile } from './projectile'
import { Loader } from 'js/gfx/loader'
import { Missile } from './missile'
import { generateId } from 'js/math'

export class Spaceship extends Projectile {
  private readonly red: boolean
  private readonly loader: Loader
  private readonly scene: any
  private readonly missiles: Array<Missile>

  constructor(
    id: number,
    red: boolean,
    loader: Loader,
    scene: any
  ) {
    super(id, scene.getAnimationRatio.bind(scene))
    this.red = red
    this.loader = loader
    this.scene = scene
    this.missiles = []
  }

  start() {
    const meshInstances = this.loader.createSpaceshipMeshInstances(this.id, this.red, this.arrow)
    this.teleportRandom()
  }

  step() {
    super.step()
    this.missiles.forEach((missile) => {
      missile.step()
    })
  }

  fireMissile() {
    const missile = new Missile(generateId(), this.scene, this.getAnimationRatio)
    missile.start(this.cot.rotationQuaternion)
    this.missiles.push(missile)
  }
}
