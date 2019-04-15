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
    this.setEnabled(false)
  }

  explode(rotationQuaternion: any) {
    this.copyRotationQuaterionFrom(rotationQuaternion)
    this.setEnabled(true)
  }

  private setEnabled(enabled: boolean) {
    this.meshSphere.setEnabled(enabled)
  }
}
