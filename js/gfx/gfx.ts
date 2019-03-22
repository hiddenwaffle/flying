import { injectable } from 'tsyringe'
import { EngineWrapper } from './engine-wrapper'
import { Ui } from 'js/ui/ui'

import * as skyNx from './textures/TropicalSunnyDay_nx.jpg'
import * as skyNy from './textures/TropicalSunnyDay_ny.jpg'
import * as skyNz from './textures/TropicalSunnyDay_nz.jpg'
import * as skyPx from './textures/TropicalSunnyDay_px.jpg'
import * as skyPy from './textures/TropicalSunnyDay_py.jpg'
import * as skyPz from './textures/TropicalSunnyDay_pz.jpg'

import * as fieldsImage from './textures/fields.jpg'

@injectable()
export class Gfx {
  private engine: any
  private canvasTmp: HTMLCanvasElement

  constructor(
    private ui: Ui,
    engineWrapper: EngineWrapper
  ) {
    this.engine = engineWrapper.engine
    this.canvasTmp = engineWrapper.canvas
  }

  start() {
    this.ui.start()

    const scene = new BABYLON.Scene(this.engine)
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      0, // -Math.PI / 2, // lon (e-w)
      Math.PI / 2, // Math.PI / 4, // lat (n-s)
      5,
      new BABYLON.Vector3(0, 1, 0), // BABYLON.Vector3.Zero(),
      scene
    )
    camera.attachControl(this.canvasTmp)
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, 1, 0), scene)

    const ground = BABYLON.MeshBuilder.CreateGround('ground', { height: 1000, width: 1000 }, scene)
    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene)
    groundMaterial.diffuseTexture = new BABYLON.Texture(fieldsImage, scene)
    groundMaterial.diffuseTexture.uScale = 20
    groundMaterial.diffuseTexture.vScale = 20
    ground.material = groundMaterial

    const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000 }, scene)
    const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', scene)
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
      scene
    )
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    skybox.material = skyboxMaterial

    const sphere0 = BABYLON.MeshBuilder.CreateSphere('sphere0', { }, scene)

    const building0 = BABYLON.MeshBuilder.CreateBox(
      'building0',
      {
        height: 10,
        width: 2
      }
    )

    this.engine.runRenderLoop(() => {
      scene.render()
    })
  }
}