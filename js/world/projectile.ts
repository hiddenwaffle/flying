export enum Yaw {
  Straight,
  Left,
  Right
}

export enum Acceleration {
  None,
  Increase,
  Decrease
}

export abstract class Projectile {
  /**
   * Direction the projectile is heading, relative to its current position.
   */
  yaw = Yaw.Straight
  acceleration = Acceleration.None

  /**
   * Center of Rotation for the arrow.
   */
  cot: any

  /**
   * "Points" in the current direction. Acts as a parent to the mesh.
   */
  arrow: any

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

    if (this.yaw === Yaw.Left) {
      dturn += -0.04
    }
    if (this.yaw === Yaw.Right) {
      dturn += 0.04
    }

    // TODO: Do something with acceleration

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

  isTurningLeft(): boolean {
    return this.yaw === Yaw.Left
  }

  isTurningRight(): boolean {
    return this.yaw === Yaw.Right
  }
}
