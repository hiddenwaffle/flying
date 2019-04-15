import { Projectile } from './projectile'

// TODO: Easing function that is fast and then suddenly slower

export class Explosion extends Projectile {
  constructor(
    id: number,
    private readonly meshSphere: any,
    scene: any,
    private readonly returnToPool: (id: number) => void
  ) {
    super(id, scene.getAnimationRatio.bind(scene))
    this.meshSphere.parent = this.arrow
    this.minSpeed = this.currentSpeed = 0
    this.setEnabled(false)
  }

  step() {
    super.step()
    // TODO: Advance the explosion animation
  }

  explode(x: number, y: number, z: number, w: number) {
    console.log('BOOM ', this.id, x, y, z, w, this.meshSphere)
    this.setQ(x, y, z, w)
    this.setEnabled(true)
  }

  private setEnabled(enabled: boolean) {
    this.meshSphere.setEnabled(enabled)
  }
}
