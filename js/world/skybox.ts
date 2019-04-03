import * as skyNx from 'js/gfx/textures/TropicalSunnyDay_nx.jpg'
import * as skyNy from 'js/gfx/textures/TropicalSunnyDay_ny.jpg'
import * as skyNz from 'js/gfx/textures/TropicalSunnyDay_nz.jpg'
import * as skyPx from 'js/gfx/textures/TropicalSunnyDay_px.jpg'
import * as skyPy from 'js/gfx/textures/TropicalSunnyDay_py.jpg'
import * as skyPz from 'js/gfx/textures/TropicalSunnyDay_pz.jpg'

import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Player } from './player'

@singleton()
export class Skybox {
  private readonly playerCot: any
  private readonly scene: any
  private mesh: any

  constructor(
    private readonly player: Player,
    babylonWrapper: BabylonWrapper
  ) {
    this.playerCot = player.cot
    this.scene = babylonWrapper.scene
  }

  start() {
    this.mesh = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000 }, this.scene)
    const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.reflectionTexture = BABYLON.CubeTexture.CreateFromImages(
      [
        skyPx,
        skyPy,
        skyPz,
        skyNx,
        skyNy,
        skyNz
      ],
      this.scene
    )
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    this.mesh.material = skyboxMaterial
    this.mesh.parent = this.playerCot
    this.mesh.rotate(BABYLON.Axis.X, 0.75) // Align to horizon
  }

  step() {
    // Move clouds slightly when player is idle:
    this.mesh.rotate(BABYLON.Axis.Y, -0.0004)

    // Rotate along with player turning
    if (this.player.isTurningLeft()) {
      this.mesh.rotate(BABYLON.Axis.Y, 0.05)
    }
    if (this.player.isTurningRight()) {
      this.mesh.rotate(BABYLON.Axis.Y, -0.05)
    }
  }
}
