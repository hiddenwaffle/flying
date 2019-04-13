import { EventType, AbstractEvent } from './event-bus'
import { Yaw, Acceleration } from 'js/world/projectile'

export class PlayerMoveEvent extends AbstractEvent {
  constructor(
    readonly yaw: Yaw,
    readonly acceleration: Acceleration
  ) {
    super()
  }

  getType() {
    return EventType.PlayerMoveEvent
  }
}
