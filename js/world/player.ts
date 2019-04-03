import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { singleton } from 'tsyringe'
import { Spaceship } from './spaceship'
import { EventBus, EventType } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'

function generateId(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

@singleton()
export class Player extends Spaceship {
  id: number

  constructor(
    babylonWrapper: BabylonWrapper,
    eventBus: EventBus
  ) {
    super(babylonWrapper)
    eventBus.register(EventType.PlayerMoveEvent, (event: PlayerMoveEvent) => {
      this.direction = event.direction
    })
  }

  async start() {
    this.id = generateId()
    await super.start()
  }

  step() {
    super.step()
  }
}
