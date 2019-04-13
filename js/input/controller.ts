import { singleton } from 'tsyringe'
import { Keyboard, Key } from './keyboard'
import { Yaw, Acceleration } from 'js/world/projectile'
import { EventBus } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'

@singleton()
export class Controller {
  private prevYaw = Yaw.Straight
  private prevAcceleration = Acceleration.None

  constructor(
    private keyboard: Keyboard,
    private eventBus: EventBus
  ) { }

  start() {
    this.keyboard.start()
  }

  step() {
    this.handleKeyboard()
  }

  private handleKeyboard() {
    this.keyboard.step()
    this.interpretInputAsMovement()
  }

  private interpretInputAsMovement() {
    const accelerate  = this.keyboard.isDown(Key.Accelerate)
    const decelerate  = this.keyboard.isDown(Key.Decelerate)
    const left        = this.keyboard.isDown(Key.Left)
    const right       = this.keyboard.isDown(Key.Right)

    let nextYaw = Yaw.Straight
    if (left && !right) {
      nextYaw = Yaw.Left
    } else if (!left && right) {
      nextYaw = Yaw.Right
    }

    let nextAcceleration = Acceleration.None
    if (accelerate && !decelerate) {
      nextAcceleration = Acceleration.Increase
    } else if (!accelerate && decelerate) {
      nextAcceleration = Acceleration.Decrease
    }

    if ((this.prevYaw !== nextYaw) ||
        (this.prevAcceleration !== nextAcceleration)) {
      this.prevYaw = nextYaw
      this.prevAcceleration = nextAcceleration
      this.eventBus.fire(new PlayerMoveEvent(nextYaw, nextAcceleration))
    }
  }
}
