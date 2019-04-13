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

  minSpeed = 0.0025
  maxSpeed = 0.02
  currentSpeed = 0 // 0.02

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
    let dturn = 0
    if (this.yaw === Yaw.Left) {
      dturn += -0.04
    }
    if (this.yaw === Yaw.Right) {
      dturn += 0.04
    }

    if (this.acceleration === Acceleration.Increase) {
      this.currentSpeed += 0.0005
    } else if (this.acceleration === Acceleration.Decrease) {
      this.currentSpeed -= 0.001 // Braking is faster
    }
    // Clamp
    if (this.currentSpeed < this.minSpeed) {
      this.currentSpeed = this.minSpeed
    } else if (this.currentSpeed > this.maxSpeed) {
      this.currentSpeed = this.maxSpeed
    }
    let dmove = this.currentSpeed

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
