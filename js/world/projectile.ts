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

  constructor(
    id: number,
    private getAnimationRatio: () => number
  ) {
    this.cot = new BABYLON.TransformNode(`cot-${id}`)
    // Ensure quaternion rotation.
    this.cot.rotationQuaternion = new BABYLON.Quaternion()

    this.arrow = new BABYLON.TransformNode(`arrow-${id}`)
    // Default height to be slightly above the surface.
    this.arrow.position.y = 45
    this.arrow.parent = this.cot
  }

  step() {
    let dmove = 0
    let dturn = 0

    // TODO: This is a slight idle effect, could be better dynamic:
    dmove += 0.0004

    if (forwardDirections.includes(this.direction)) {
      dmove += 0.02
    }
    if (backwardDirections.includes(this.direction)) {
      dmove += -0.0075
    }
    if (leftDirections.includes(this.direction)) {
      dturn += -0.04
    }
    if (rightDirections.includes(this.direction)) {
      dturn += 0.04
    }

    dmove *= this.getAnimationRatio()
    dturn *= this.getAnimationRatio()

    this.move(dmove)
    this.turn(dturn)
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

  /**
   * TODO: For x, y, and z, is it 2pi or 1pi or a mix of both?
   */
  teleportRandom() {
    BABYLON.Quaternion.RotationYawPitchRollToRef(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      this.cot.rotationQuaternion
    )
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
