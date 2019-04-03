import { EventType, AbstractEvent } from './event-bus'
import { Direction } from 'js/world/player'

export class PlayerMoveEvent extends AbstractEvent {
  direction: Direction

  constructor(
    direction: Direction
  ) {
    super()
    this.direction = direction
  }

  getType() {
    return EventType.PlayerMoveEvent
  }

}