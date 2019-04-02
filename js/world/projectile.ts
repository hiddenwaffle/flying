export abstract class Projectile {
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
}
