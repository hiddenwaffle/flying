import { singleton } from 'tsyringe'
import { Spaceship } from './spaceship'
import { EventBus, EventType } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'
import { Loader } from 'js/gfx/loader'
import { generateId } from 'js/math'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { PlayerAttackEvent } from 'js/event/player-attack-event';

@singleton()
export class Player {
  readonly id: number
  readonly spaceship: Spaceship

  constructor(
    loader: Loader,
    eventBus: EventBus,
    babylonWrapper: BabylonWrapper
  ) {
    this.id = generateId()
    this.spaceship = new Spaceship(
      this.id,
      false, // TODO: Make red/blue dynamic
      loader,
      babylonWrapper.scene
    )
    eventBus.register(EventType.PlayerMoveEvent, (event: PlayerMoveEvent) => {
      this.spaceship.yaw = event.yaw
      this.spaceship.acceleration = event.acceleration
    })
    eventBus.register(EventType.PlayerAttackEvent, (event: PlayerAttackEvent) => {
      this.spaceship.fireMissile()
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
