import { Projectile } from './projectile'

export class Missile extends Projectile {
  private meshLeft: any
  private meshRight: any
  private ttl = 400 // milliseconds

  constructor(id: number, scene: any, getAnimationRatio: () => number) {
    super(id, getAnimationRatio)
    this.meshLeft = BABYLON.MeshBuilder.CreateCylinder(
      `missile-${this.id}`,
      {
        diameterTop: 0,
        diameterBottom: 0.25,
        tessellation: 8
      },
      scene
    )
    this.meshRight = this.meshLeft.clone()
    const material = new BABYLON.StandardMaterial(`missile-${this.id}-material`)
    material.emissiveColor = new BABYLON.Color3(1, 1, 1)
    for (let mesh of [this.meshLeft, this.meshRight]) {
      mesh.material = material
      mesh.rotate(BABYLON.Axis.X, Math.PI / 2)
      mesh.position.z = -1.25
      mesh.parent = this.arrow
    }
    this.meshLeft.position.x  = -1
    this.meshRight.position.x =  1
    this.maxSpeed = this.currentSpeed = 0.04
  }

  start(rotationQuaternion: any) {
    this.copyRotationQuaterionFrom(rotationQuaternion)
  }

  step() {
    super.step()
    this.ttl -= 16.66 * this.getAnimationRatio()
    if (this.ttl <= 0) {
      this.meshLeft.dispose()
      this.meshRight.dispose()
    }
  }
}
