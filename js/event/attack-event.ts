import { EventType, AbstractEvent } from './event-bus'

export class AttackEvent extends AbstractEvent {
  readonly id: number

  constructor(obj: any) {
    super()
    this.id = obj.id
  }

  getType() {
    return EventType.Attack
  }
}
