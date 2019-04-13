import { EventType, AbstractEvent } from './event-bus'

export class PlayerAttackEvent extends AbstractEvent {
  constructor() {
    super()
  }

  getType() {
    return EventType.PlayerAttackEvent
  }
}
