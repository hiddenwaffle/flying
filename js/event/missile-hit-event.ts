import { EventType, AbstractEvent } from './event-bus'

export class MissileHitEvent extends AbstractEvent {
  readonly spaceshipId: number
  readonly x: number
  readonly y: number
  readonly z: number
  readonly w: number

  constructor(obj: any) {
    super()
    this.spaceshipId = obj.spaceshipId
    this.x = obj.x
    this.y = obj.y
    this.z = obj.z
    this.w = obj.w
  }

  getType() {
    return EventType.MissileHit
  }
}
