import { singleton } from 'tsyringe'
import { EventBus } from 'js/event/event-bus'
import { RemoteConnectedEvent } from 'js/event/remote-connected-event';

@singleton()
export class RemoteEventBus {
  private ws: WebSocket

  constructor(
    private readonly eventBus: EventBus
  ) { }

  start() {
    this.ws = new WebSocket('ws://localhost:3000')
    const ws = this.ws
    ws.onmessage = (msg) => {
      console.log('received:', msg.data)
    }
    ws.onopen = () => {
      this.eventBus.fire(new RemoteConnectedEvent())
    }
    ws.onerror = (e) => {
      console.log(e)
    }
  }

  fire(obj: any) {
    if (this.ws.readyState === this.ws.OPEN) {
      try {
        this.ws.send(JSON.stringify(obj))
      } catch (e) {
        console.log(e)
      }
    }
  }
}
