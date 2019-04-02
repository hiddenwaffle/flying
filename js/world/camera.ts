import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper';
import { Player } from './player'

@singleton()
export class Camera {
  private canvas: HTMLCanvasElement
  private scene: any

  constructor(
    private player: Player,
    babylonWrapper: BabylonWrapper
  ) {
    this.canvas = babylonWrapper.canvas
    this.scene = babylonWrapper.scene
  }

  start() {
    // Flip 'thirdPersonCamera' to false to observe motion from off-world:
    const thirdPersonCamera = true
    let camera: any
    if (thirdPersonCamera) {
        // 3rd person view cam, behind the arrow:
        camera = new BABYLON.UniversalCamera(
        'camera',
        new BABYLON.Vector3(0, 11.5, -4),
        this.scene
        )
        camera.parent = this.player.arrow
        camera.setTarget(new BABYLON.Vector3(0, 1, 3))
    } else {
        camera = new BABYLON.UniversalCamera(
          'camera',
          new BABYLON.Vector3(-2, 1.4, 1.4),
          this.scene
        )
        camera.setTarget(new BABYLON.Vector3(0, 0, 0))
    }
    camera.attachControl(this.canvas, true)
  }
}
