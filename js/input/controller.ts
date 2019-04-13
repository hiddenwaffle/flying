import { singleton } from 'tsyringe'
import { Keyboard, Key } from './keyboard'
import { Yaw, Acceleration } from 'js/world/projectile'
import { EventBus } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'
import { PlayerAttackEvent } from 'js/event/player-attack-event'

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
    this.interpretInput()
  }

  private interpretInput() {
    const throttleUp  = this.keyboard.isDown(Key.ThrottleUp)
    const brake       = this.keyboard.isDown(Key.Brake)
    const left        = this.keyboard.isDown(Key.Left)
    const right       = this.keyboard.isDown(Key.Right)
    const fire        = this.keyboard.isDownAndUnhandled(Key.Fire)

    let nextYaw = Yaw.Straight
    if (left && !right) {
      nextYaw = Yaw.Left
    } else if (!left && right) {
      nextYaw = Yaw.Right
    }

    let nextAcceleration = Acceleration.None
    if (throttleUp && !brake) {
      nextAcceleration = Acceleration.Increase
    } else if (!throttleUp && brake) {
      nextAcceleration = Acceleration.Decrease
    }

    if ((this.prevYaw !== nextYaw) ||
        (this.prevAcceleration !== nextAcceleration)) {
      this.prevYaw = nextYaw
      this.prevAcceleration = nextAcceleration
      this.eventBus.fire(new PlayerMoveEvent(nextYaw, nextAcceleration))
    }

    if (fire) {
      this.eventBus.fire(new PlayerAttackEvent())
    }
  }
}
