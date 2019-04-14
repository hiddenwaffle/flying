import { singleton } from 'tsyringe'
import { EventBus } from 'js/event/event-bus'
import { RemoteConnectedEvent } from 'js/event/remote-connected-event'
import { PositionAndHeadingEvent } from './position-and-heading-event'
import { JoinedEvent } from './joined-event'
import { AttackEvent } from './attack-event'

@singleton()
export class RemoteEventBus {
  private ws: WebSocket
  private readonly serviceLocation: string

  constructor(
    private readonly eventBus: EventBus
  ) {
    if (location.hostname === 'localhost') {
      this.serviceLocation = 'ws://localhost:3000'
    } else {
      this.serviceLocation = 'wss://unremarkable-flying.herokuapp.com'
    }
  }

  start() {
    this.ws = new WebSocket(this.serviceLocation)
    const ws = this.ws
    ws.onmessage = (msg) => {
      this.deserializeAndFire(msg.data)
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
        // console.log(e)
      }
    }
  }

  private deserializeAndFire(raw: any) {
    let obj = null
    try {
      obj = JSON.parse(raw)
    } catch (e) {
      console.log(e)
    }
    if (obj) {
      switch (obj.type) {
        case 'joined':
          this.eventBus.fire(new JoinedEvent())
          break
        case 'position-and-heading':
          this.eventBus.fire(new PositionAndHeadingEvent(obj))
          break
        case 'attack':
          this.eventBus.fire(new AttackEvent(obj))
          break
        default:
          console.log('unknown', obj.type)
      }
    }
  }
}
