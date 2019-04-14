import { EventType, AbstractEvent } from './event-bus'

export class JoinedEvent extends AbstractEvent {
  getType() {
    return EventType.JoinedEvent
  }
}
