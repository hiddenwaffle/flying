import { Projectile } from './projectile'
import { Bot } from './bot'

export class Missile extends Projectile {
  private ttl = 0
  spaceshipId: number

  constructor(
    id: number,
    private readonly meshLeft: any,
    private readonly meshRight: any,
    scene: any,
    private readonly returnToPool: (id: number) => void
  ) {
    super(id, scene.getAnimationRatio.bind(scene))
    this.meshLeft.position.x = -1
    this.meshRight.position.x = 1
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

  checkCollision(bots: Array<Bot>) {
    for (let bot of bots) {
      for (let mesh of bot.spaceship.meshInstances) {
        if ((this.meshLeft.intersectsMesh(mesh, false) ||
            (this.meshRight.intersectsMesh(mesh, false)))) {
          // TODO: Signal
        }
      }
    }
  }

  fire(spaceshipId: number, rotationQuaternion: any) {
    this.ttl = 400 // milliseconds
    this.spaceshipId = spaceshipId
    this.copyRotationQuaterionFrom(rotationQuaternion)
    this.setEnabled(true)
  }

  private setEnabled(enabled: boolean) {
    this.meshLeft.setEnabled(enabled)
    this.meshRight.setEnabled(enabled)
  }
}
