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

/**
 * FLYING_ARCHITECTURE - "Player's Spaceship" Component
 */
@singleton()
export class Player {
  readonly id: number
  readonly spaceship: Spaceship
  private signalMovement = false
  private signalAttack = false
  private lastUpdate = Date.now()

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
      this.signalMovement = true
    })
    eventBus.register(EventType.PlayerAttackEvent, (event: PlayerAttackEvent) => {
      this.spaceship.fireMissile()
      this.signalAttack = true
    })
    eventBus.register(EventType.RemoteConnected, () => {
      this.remoteEventBus.fire({
        type: 'joined'
      })
      this.firePositionAndHeadingEvent()
    })
    eventBus.register(EventType.JoinedEvent, () => {
      this.firePositionAndHeadingEvent()
    })
  }

  start() {
    this.spaceship.start()
  }

  step() {
    this.spaceship.step()
    if (this.signalMovement) {
      this.signalMovement = false
      this.firePositionAndHeadingEvent()
    }
    if (this.signalAttack) {
      this.signalAttack = false
      this.firePositionAndHeadingEvent()
      this.remoteEventBus.fire({
        type: 'attack',
        id: this.id
      })
    }
    const now = Date.now()
    if (now - this.lastUpdate > 2000) { // See world.ts to double check interval
      this.lastUpdate = now
      this.firePositionAndHeadingEvent()
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

  private firePositionAndHeadingEvent() {
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
}
