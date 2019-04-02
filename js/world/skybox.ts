import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Ui } from 'js/ui/ui'
import { Player } from './player'

import * as skyNx from 'js/gfx/textures/TropicalSunnyDay_nx.jpg'
import * as skyNy from 'js/gfx/textures/TropicalSunnyDay_ny.jpg'
import * as skyNz from 'js/gfx/textures/TropicalSunnyDay_nz.jpg'
import * as skyPx from 'js/gfx/textures/TropicalSunnyDay_px.jpg'
import * as skyPy from 'js/gfx/textures/TropicalSunnyDay_py.jpg'
import * as skyPz from 'js/gfx/textures/TropicalSunnyDay_pz.jpg'

@singleton()
export class Skybox {
  private readonly cot: any
  private readonly scene: any

  constructor(
    player: Player,
    babylonWrapper: BabylonWrapper
  ) {
    this.cot = player.cot
    this.scene = babylonWrapper.scene
  }

  start() {
    const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000 }, this.scene)
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
    skybox.material = skyboxMaterial
    skybox.parent = this.cot
    skybox.rotate(BABYLON.Axis.X, 0.75) // Align to horizon
  }
}
