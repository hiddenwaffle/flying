import { singleton } from 'tsyringe'
import { Spaceship } from './spaceship'
import { EventBus, EventType } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'
import { Loader } from 'js/gfx/loader'

function generateId(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

@singleton()
export class Player extends Spaceship {
  id: number

  constructor(
    loader: Loader,
    eventBus: EventBus
  ) {
    super(true, loader) // TODO: Make red/blue dynamic
    eventBus.register(EventType.PlayerMoveEvent, (event: PlayerMoveEvent) => {
      this.direction = event.direction
    })
  }

  start() {
    this.id = generateId()
    super.start()
  }

  step() {
    super.step()
  }
}
