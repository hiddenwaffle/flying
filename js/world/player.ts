import { singleton } from 'tsyringe'
import { Spaceship } from './spaceship'
import { EventBus, EventType } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'
import { Loader } from 'js/gfx/loader'
import { generateId } from 'js/math'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { PlayerAttackEvent } from 'js/event/player-attack-event'
import { MissilePool } from './missile-pool'
import { RemoteEventBus } from 'js/event/remote-event-bus'

@singleton()
export class Player {
  readonly id: number
  readonly spaceship: Spaceship
  private signalChange = false

  constructor(
    loader: Loader,
    eventBus: EventBus,
    babylonWrapper: BabylonWrapper,
    missilePool: MissilePool,
    private readonly remoteEventBus: RemoteEventBus
  ) {
    this.id = generateId()
    this.spaceship = new Spaceship(
      this.id,
      false,
      loader,
      babylonWrapper.scene,
      missilePool
    )
    eventBus.register(EventType.PlayerMoveEvent, (event: PlayerMoveEvent) => {
      this.spaceship.yaw = event.yaw
      this.spaceship.acceleration = event.acceleration
      this.signalChange = true
    })
    eventBus.register(EventType.PlayerAttackEvent, (event: PlayerAttackEvent) => {
      this.spaceship.fireMissile()
    })
    eventBus.register(EventType.RemoteConnected, () => {
      this.remoteEventBus.fire({
        type: 'joined'
      })
      this.createPositionAndHeadingEvent()
    })
    eventBus.register(EventType.JoinedEvent, () => {
      this.createPositionAndHeadingEvent()
    })
  }

  private createPositionAndHeadingEvent() {
    this.remoteEventBus.fire({
      type: 'position-and-heading',
      id: this.id,
      yaw: this.spaceship.yaw,
      acceleration: this.spaceship.acceleration,
      x: this.spaceship.q.x,
      y: this.spaceship.q.y,
      z: this.spaceship.q.z,
      w: this.spaceship.q.w,
      speed: this.spaceship.currentSpeed
    })
  }

  start() {
    this.spaceship.start()
  }

  step() {
    this.spaceship.step()
    if (this.signalChange) {
      this.signalChange = false
      this.createPositionAndHeadingEvent()
    }
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
