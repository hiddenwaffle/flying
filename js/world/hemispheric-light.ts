import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'

@singleton()
export class HemisphericLight {
  private scene: any
  private light: any

  constructor(
    babylonWrapper: BabylonWrapper
  ) {
    this.scene = babylonWrapper.scene
  }

  start() {
    this.light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(-1, 1, -1), // TODO: Align with skybox sun?
      this.scene
    )
  }
}
