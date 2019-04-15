import { EventType, AbstractEvent } from './event-bus'

export class ExplosionEvent extends AbstractEvent {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z: number,
    readonly w: number
  ) {
    super()
  }

  getType() {
    return EventType.Explosion
  }
}
