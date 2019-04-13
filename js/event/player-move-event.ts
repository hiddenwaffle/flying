import { EventType, AbstractEvent } from './event-bus'
import { Direction } from 'js/world/projectile'

export class PlayerMoveEvent extends AbstractEvent {
  constructor(
    readonly direction: Direction,
    readonly boost: boolean
  ) {
    super()
  }

  getType() {
    return EventType.PlayerMoveEvent
  }
}
