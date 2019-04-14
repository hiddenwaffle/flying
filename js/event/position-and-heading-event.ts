import { EventType, AbstractEvent } from './event-bus'

export class PositionAndHeadingEvent extends AbstractEvent {
  readonly id: number
  readonly x: number
  readonly y: number
  readonly z: number
  readonly w: number
  readonly speed: number

  constructor(obj: any) {
    super()
    this.id = obj.id
    this.x = obj.x
    this.y = obj.y
    this.z = obj.z
    this.w = obj.w
    this.speed = obj.speed
  }

  getType() {
    return EventType.PositionAndHeading
  }
}
