import { injectable } from 'tsyringe'
import { EngineWrapper } from './engine-wrapper'
import { Ui } from 'js/ui/ui'

import * as skyNx from './textures/TropicalSunnyDay_nx.jpg'
import * as skyNy from './textures/TropicalSunnyDay_ny.jpg'
import * as skyNz from './textures/TropicalSunnyDay_nz.jpg'
import * as skyPx from './textures/TropicalSunnyDay_px.jpg'
import * as skyPy from './textures/TropicalSunnyDay_py.jpg'
import * as skyPz from './textures/TropicalSunnyDay_pz.jpg'

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

    // Keyboard input
    const map: any = { } //object for multiple key presses
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt: any) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
    }))
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt: any) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
    }))

    // This mesh's quaternion represents the currnt position and direction of the arrow:
    const cot = new BABYLON.TransformNode('cot')
    cot.rotationQuaternion = new BABYLON.Quaternion()

    // Invisible "Arrow" pointing in the direction we want to go:
    const arrow = new BABYLON.TransformNode('arrow')
    arrow.position.y = 45
    arrow.parent = cot

    // Flip 'thirdPersonCamera' to false to observe motion from off-world:
    const thirdPersonCamera = true
    let camera: any
    if (thirdPersonCamera) {
        // 3rd person view cam, behind the arrow:
        camera = new BABYLON.UniversalCamera(
        'camera',
        new BABYLON.Vector3(0, 10, -5.5),
        scene
        )
        camera.parent = arrow
    } else {
        camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-2, 1.4, 1.4), scene)
    }
    camera.attachControl(this.canvasTmp, true)
    // const cameraTarget = new BABYLON.Vector3(1, 0, 0)
    camera.setTarget(new BABYLON.Vector3(0, 1, 2))

    const assetsManager = new BABYLON.AssetsManager(scene)

    const spaceshipAddMeshTask = assetsManager.addMeshTask(
      'spaceshipMesh',
      '',
      '',
      spaceshipFile
    )
    let spaceshipMeshes: any;
    spaceshipAddMeshTask.onSuccess = (task: any) => {
      spaceshipMeshes = task.loadedMeshes
      task.loadedMeshes[0].material.diffuseColor = new BABYLON.Color3(0.25, 0.5, 1)
      for (const mesh of task.loadedMeshes) {
        mesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2)
        mesh.parent = arrow
      }
    }
    spaceshipAddMeshTask.onError = (task: any, message: string, exception: any) => {
      console.log('ERROR', message, exception)
    }

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
        // mesh.position = new BABYLON.Vector3(0, 0, 0)
      }
    }
    planetMeshAddMeshTask.onError = (task: any, message: string, exception: any) => {
      console.log('ERROR', message, exception)
    }

    assetsManager.load()

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(-1, 1, -1), // TODO: Align with skybox sun?
      scene
    )

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
    skybox.parent = cot

    skybox.rotate(BABYLON.Axis.X, 0.75)
    scene.registerBeforeRender(() => {
      if (map['w']) {
          cot.rotate(BABYLON.Axis.X, 0.02)
      }
      if (map['s']) {
          cot.rotate(BABYLON.Axis.X, -0.005)
      }
      if (map['a']) {
          cot.rotate(BABYLON.Axis.Y, -0.04)
          skybox.rotate(BABYLON.Axis.Y, 0.05)
      }
      if (map['d']) {
          cot.rotate(BABYLON.Axis.Y, 0.04)
          skybox.rotate(BABYLON.Axis.Y, -0.05)
      }
    })

    // TODO: Try rotating world around and using that to store position?

    this.engine.runRenderLoop(() => {
      scene.render()
    })
  }
}
