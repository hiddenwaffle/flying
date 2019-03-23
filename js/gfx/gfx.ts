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

import * as spaceshipFile from './models/spaceship.babylon'
import * as planetFile from './models/planet.babylon'

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


    // const camera = new BABYLON.ArcRotateCamera(
    //   'camera',
    //   0, // -Math.PI / 2, // lon (e-w)
    //   Math.PI / 2, // Math.PI / 4, // lat (n-s)
    //   5,
    //   new BABYLON.Vector3(0, 1, 0), // BABYLON.Vector3.Zero(),
    //   scene
    // )
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI * (6/4), // -Math.PI / 2, // lon (e-w)
      Math.PI * (1/4), // Math.PI / 4, // lat (n-s)
      15,
      new BABYLON.Vector3(0, 0, 1), // BABYLON.Vector3.Zero(),
      scene
    )
    camera.attachControl(this.canvasTmp)
    const sphere0 = BABYLON.MeshBuilder.CreateSphere('sphere0', { }, scene)
    sphere0.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    sphere0.position.y = 42.5
    camera.lockedTarget = sphere0


    const assetsManager = new BABYLON.AssetsManager(scene)


    const spaceshipAddMeshTask = assetsManager.addMeshTask(
      'spaceshipMesh',
      '',
      '',
      spaceshipFile
    )
    spaceshipAddMeshTask.onSuccess = (task: any) => {
      task.loadedMeshes[0].material.diffuseColor = new BABYLON.Color3(0.25, 0.5, 1)
      for (const mesh of task.loadedMeshes) {
        mesh.scaling = new BABYLON.Vector3(2, 2, 2)
        mesh.parent = sphere0
        mesh.position = new BABYLON.Vector3(0, 0, -50)
      }
    }
    spaceshipAddMeshTask.onError = (task: any, message: string, exception: any) => {
      console.log('ERROR', message, exception)
    }


    const sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', { }, scene)
    console.log('POSITION', sphere1.position)
    const planetMeshAddMeshTask = assetsManager.addMeshTask(
      'planetMesh',
      '',
      '',
      planetFile
    )
    let planetMeshes: any;
    planetMeshAddMeshTask.onSuccess = (task: any) => {
      planetMeshes = task.loadedMeshes
      for (const mesh of task.loadedMeshes) {
        mesh.scaling = new BABYLON.Vector3(3, 3, 3)
        mesh.position = new BABYLON.Vector3(0, 0, 0)
      }
    }
    planetMeshAddMeshTask.onError = (task: any, message: string, exception: any) => {
      console.log('ERROR', message, exception)
    }

    assetsManager.load()


    // BABYLON.AbstractMesh.prototype.spin = function (axis: any, rads: any, speed: any) {
    //     var ease = new BABYLON.CubicEase();
    //     ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    //   BABYLON.Animation.CreateAndStartAnimation('at4', this, 'rotation.' + axis, speed, 120, this.rotation[axis], this.rotation[axis]+rads, 0, ease);
    // }
    // BABYLON.ArcRotateCamera.prototype.spin = function (property: any, rads: any, speed: any) {
    //     var ease = new BABYLON.CubicEase();
    //     ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    //   BABYLON.Animation.CreateAndStartAnimation('at4', this, property, speed, 120, this[property], this[property]+rads, 0, ease);
    // }
    // BABYLON.AbstractMesh.prototype.spinTo = function (unused: any, targetRot: any, speed: any) {
    //     var ease = new BABYLON.CubicEase();
    //     ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    //   BABYLON.Animation.CreateAndStartAnimation('at4', this, 'rotation', speed, 120, this.rotation, targetRot, 0, ease);
    // }
    // setTimeout(() => {
    //   sphere0.spin('y', Math.PI / 4, 50)
    //   camera.spin('alpha', -Math.PI / 4, 50)
    // }, 1000)

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(-1, 1, -1), // TODO: Align with skybox sun?
      scene
    )

    // const ground = BABYLON.MeshBuilder.CreateGround('ground', { height: 1000, width: 1000 }, scene)
    // const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene)
    // groundMaterial.diffuseTexture = new BABYLON.Texture(fieldsImage, scene)
    // groundMaterial.diffuseTexture.uScale = 10
    // groundMaterial.diffuseTexture.vScale = 10
    // groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0) // Prevent shininess
    // ground.material = groundMaterial


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
    // skybox.rotation.x = Math.PI * 2.2

    // const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000 }, scene)
    // const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', scene)
    // skyboxMaterial.backFaceCulling = false
    // // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    // skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0.25, 0.5)
    // skybox.material = skyboxMaterial


    // const building0 = BABYLON.MeshBuilder.CreateBox(
    //   'building0',
    //   {
    //     height: 10,
    //     width: 2
    //   }
    // )

    let meow = -0.005
    this.engine.runRenderLoop(() => {
      // sphere0.position.z += 0.05
      // skybox.rotation.x += 0.01
      if (planetMeshes) {
        for (const mesh of planetMeshes) {
          mesh.rotate(BABYLON.Axis.X, meow, BABYLON.Space.WORLD)
        }
      } else {
        console.log('wtf')
      }
      scene.render()
    })
  }
}
