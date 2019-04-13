import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { generateId } from 'js/math'
import { Missile } from './missile'

@singleton()
export class MissilePool {
  private readonly scene: any
  private readonly missiles: Array<Missile>

  constructor(babylonWrapper: BabylonWrapper) {
    this.scene = babylonWrapper.scene
    this.missiles = []
  }

  step() {
    this.missiles.forEach((missile) => {
      missile.step()
    })
  }

  fire(spaceshipId: number, rotationQuaternion: any) {
    const missile = new Missile(spaceshipId, generateId(), this.scene)
    missile.start(rotationQuaternion)
    this.missiles.push(missile)
  }
}
