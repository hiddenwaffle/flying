import { singleton } from 'tsyringe'
import { Keyboard, Key } from './keyboard'
import { Direction } from 'js/world/projectile'
import { EventBus } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'

@singleton()
export class Controller {
  private prevDirection = Direction.Idle

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
    const up    = this.keyboard.isDown(Key.Up)
    const down  = this.keyboard.isDown(Key.Down)
    const left  = this.keyboard.isDown(Key.Left)
    const right = this.keyboard.isDown(Key.Right)

    let nextDirection = Direction.Idle

    if (up && !down) {
      nextDirection = Direction.Forward
      if (left && !right) {
        nextDirection = Direction.ForwardLeft
      }
      if (!left && right) {
        nextDirection = Direction.ForwardRight
      }
    }

    if (!up && down) {
      nextDirection = Direction.Backward
      if (left && !right) {
        nextDirection = Direction.BackwardLeft
      }
      if (!left && right) {
        nextDirection = Direction.BackwardRight
      }
    }

    if (nextDirection === Direction.Idle) {
      if (left && !right) {
        nextDirection = Direction.Left
      }
      if (!left && right) {
        nextDirection = Direction.Right
      }
    }

    if (this.prevDirection !== nextDirection) {
      this.prevDirection = nextDirection
      this.eventBus.fire(new PlayerMoveEvent(nextDirection))
    }
  }
}
