import { singleton } from 'tsyringe'
import { Spaceship } from './spaceship'
import { EventBus, EventType } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'
import { Loader } from 'js/gfx/loader'
import { generateId } from 'js/math'

@singleton()
export class Player {
  readonly id: number
  readonly spaceship: Spaceship

  constructor(
    loader: Loader,
    eventBus: EventBus
  ) {
    this.id = generateId()
    this.spaceship = new Spaceship(this.id, true, loader) // TODO: Make red/blue dynamic
    eventBus.register(EventType.PlayerMoveEvent, (event: PlayerMoveEvent) => {
      this.spaceship.direction = event.direction
    })
  }

  start() {
    this.spaceship.start()
  }

  step() {
    this.spaceship.step()
  }

  isTurningLeft() {
    return this.spaceship.isTurningLeft()
  }

  isTurningRight() {
    return this.spaceship.isTurningRight()
  }

  get arrow() {
    return this.spaceship.arrow
  }

  get cot() {
    return this.spaceship.cot
  }
}
