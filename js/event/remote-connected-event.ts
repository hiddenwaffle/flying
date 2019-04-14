import { EventType, AbstractEvent } from './event-bus'

export class RemoteConnectedEvent extends AbstractEvent {
  getType() {
    return EventType.RemoteConnected
  }
}
