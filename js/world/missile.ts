import { Projectile } from './projectile'

export class Missile extends Projectile {
  private ttl = 0

  constructor(
    id: number,
    private readonly meshLeft: any,
    private readonly meshRight: any,
    scene: any,
    private readonly returnToPool: (id: number) => void
  ) {
    super(id, scene.getAnimationRatio.bind(scene))
    this.meshLeft.position.x    = -1
    this.meshRight.position.x   =  1
    this.meshLeft.parent = this.arrow
    this.meshRight.parent = this.arrow
    this.maxSpeed = this.currentSpeed = 0.04
    this.setEnabled(false)
  }

  step() {
    super.step()
    this.ttl -= 16.66 * this.getAnimationRatio() // Assumes 60 fps
    if (this.ttl <= 0) {
      this.setEnabled(false)
      this.returnToPool(this.id)
    }
  }

  fire(rotationQuaternion: any) {
    this.ttl = 400 // milliseconds
    this.copyRotationQuaterionFrom(rotationQuaternion)
    this.setEnabled(true)
  }

  private setEnabled(enabled: boolean) {
    this.meshLeft.setEnabled(enabled)
    this.meshRight.setEnabled(enabled)
  }
}
