import { Projectile } from './projectile'

// TODO: Easing function that is fast and then suddenly slower

export class Explosion extends Projectile {
  private ttl = 0

  constructor(
    id: number,
    private readonly meshSphere: any,
    scene: any,
    private readonly returnToPool: (id: number) => void
  ) {
    super(id, scene.getAnimationRatio.bind(scene))
    this.meshSphere.parent = this.arrow
    this.meshSphere.position.y = -1
    this.meshSphere.position.z = -1
    this.minSpeed = this.currentSpeed = 0
    this.setEnabled(false)
  }

  step() {
    super.step()
    this.ttl -= 16.66 * this.getAnimationRatio() // Assumes 60 fps
    if (this.ttl <= 0) {
      this.setEnabled(false)
      this.returnToPool(this.id)
    } else {
      this.increaseSize()
    }
  }

  explode(x: number, y: number, z: number, w: number) {
    this.ttl = 125
    this.setSize(0.1)
    this.setQ(x, y, z, w)
    this.setEnabled(true)
  }

  private setEnabled(enabled: boolean) {
    this.meshSphere.setEnabled(enabled)
  }

  private resetSize() {
    this.setSize(0.1)
  }

  private increaseSize() {
    this.meshSphere.scaling.x += 1 * this.getAnimationRatio()
    this.meshSphere.scaling.y += 1 * this.getAnimationRatio()
    this.meshSphere.scaling.z += 1 * this.getAnimationRatio()
  }

  private setSize(size: number) {
    this.meshSphere.scaling.x = size
    this.meshSphere.scaling.y = size
    this.meshSphere.scaling.z = size
  }
}
