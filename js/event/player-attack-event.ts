import { EventType, AbstractEvent } from './event-bus'

export class PlayerAttackEvent extends AbstractEvent {
  getType() {
    return EventType.PlayerAttackEvent
  }
}
