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

export abstract class Projectile {
  /**
   * Direction the projectile is heading, relative to its current position.
   */
  direction = Direction.Idle

  /**
   * Center of Rotation for the arrow.
   */
  cot: any

  /**
   * "Points" in the current direction. Acts as a parent to the mesh.
   */
  arrow: any

  // These are for calculating turning, forward, and backward movement.
  accx: number
  accy: number
  maxaccx: number
  maxaccy: number
  velx: number
  vely: number
  maxvelx: number
  maxvely: number

  constructor() {
    this.cot = new BABYLON.TransformNode('cot')
    // Ensure quaternion rotation.
    this.cot.rotationQuaternion = new BABYLON.Quaternion()

    this.arrow = new BABYLON.TransformNode('arrow')
    // Default height to be slightly above the surface.
    this.arrow.position.y = 45
    this.arrow.parent = this.cot
  }

  step() {
    // TODO: This is a slight idle effect, could be better dynamic:
    this.move(0.0004)

    if (forwardDirections.includes(this.direction)) {
      this.move(0.02)
    }
    if (backwardDirections.includes(this.direction)) {
      this.move(-0.0075)
    }
    if (leftDirections.includes(this.direction)) {
      this.turn(-0.04)
    }
    if (rightDirections.includes(this.direction)) {
      this.turn(0.04)
    }
  }

  /**
   * Negative angle is back,
   * positive angle is forward.
   */
  move(angle: number) {
    this.cot.rotate(BABYLON.Axis.X, angle)
  }
  /**
   * Negative angle is left,
   * positive angle is right.
   */
  turn(angle: number) {
    this.cot.rotate(BABYLON.Axis.Y, angle)
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
