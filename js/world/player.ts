import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { singleton } from 'tsyringe'
import { Spaceship } from './spaceship'
import { EventBus, EventType } from 'js/event/event-bus'
import { PlayerMoveEvent } from 'js/event/player-move-event'
import { Mob } from './mob'

export enum Direction {
  Idle,
  Forward,
  ForwardLeft,
  ForwardRight,
  Backward,
  BackwardLeft,
  BackwardRight,
  Left,
  Right
}

const forwardDirections       = [Direction.Forward, Direction.ForwardLeft, Direction.ForwardRight]
const backwardDirections      = [Direction.Backward, Direction.BackwardLeft, Direction.BackwardRight]
export const leftDirections   = [Direction.Left, Direction.ForwardLeft, Direction.BackwardLeft]
export const rightDirections  = [Direction.Right, Direction.ForwardRight, Direction.BackwardRight]

function generateId(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

@singleton()
export class Player extends Spaceship implements Mob {
  id: number
  private direction = Direction.Idle

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
    // TODO: This is a slight idle effect, could be better dynamic:
    this.cot.rotate(BABYLON.Axis.X, 0.0004)

    if (forwardDirections.includes(this.direction)) {
      this.cot.rotate(BABYLON.Axis.X, 0.02)
    }
    if (backwardDirections.includes(this.direction)) {
      this.cot.rotate(BABYLON.Axis.X, -0.0075)
    }
    if (leftDirections.includes(this.direction)) {
      this.cot.rotate(BABYLON.Axis.Y, -0.04)
    }
    if (rightDirections.includes(this.direction)) {
      this.cot.rotate(BABYLON.Axis.Y, 0.04)
    }
  }

  setDirection(direction: Direction) {
    this.direction = direction
  }

  isTurningLeft(): boolean {
    return leftDirections.includes(this.direction)
  }

  isTurningRight(): boolean {
    return rightDirections.includes(this.direction)
  }
}
