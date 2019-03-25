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

    const camera = new BABYLON.UniversalCamera(
      'camera',
      new BABYLON.Vector3(0, 0, 0),
      scene
    )
    camera.attachControl(this.canvasTmp)
    const sphere0 = BABYLON.MeshBuilder.CreateSphere('sphere0', { }, scene)
    sphere0.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    sphere0.position.y = 42.5
    // camera.lockedTarget = sphere0
    camera.parent = sphere0
    camera.position.x = 0 // TODO: Make dynamic
    camera.position.y = 100
    camera.position.z = -60 // TODO: Make dynamic
    camera.setTarget(new BABYLON.Vector3(0, 0, 40))

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
        mesh.scaling = new BABYLON.Vector3(2, 2, 2)
        mesh.parent = sphere0
      }
    }
    spaceshipAddMeshTask.onError = (task: any, message: string, exception: any) => {
      console.log('ERROR', message, exception)
    }


    const sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', { }, scene)
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

    // sphere0.position = new BABYLON.Vector3(0, -42.5, 0)
    // sphere0.lookAt(sphere1.position)
    sphere0.parent = sphere1

    let axis = new BABYLON.Vector3(1, 0, 0)
    let angle = 0 // -Math.PI / 8
    sphere1.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(axis, angle)

    let yaxis = new BABYLON.Vector3(0, 1, 0)
    let yangle = 0
    sphere0.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(yaxis, yangle)

    // const inbetween = BABYLON.MeshBuilder.CreateSphere('inbetween', { }, scene)
    // var inbetweenMaterial = new BABYLON.StandardMaterial('inbetweenMaterial', scene);
    // inbetweenMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 1);
    // inbetweenMaterial.alpha = 0.3
    // inbetween.material = inbetweenMaterial;

    // var angle = Math.acos(BABYLON.Vector3.Dot(v1, v2));
    // var axis = BABYLON.Vector3.Cross(v1,v2);
    // var quaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
    // var matrix = BABYLON.Matrix.Identity();
    // BABYLON.Matrix.FromQuaternionToRef(quaternion, matrix);

    scene.registerBeforeRender(() => {
      const cameraWorldPosition = BABYLON.Vector3.TransformCoordinates(camera.position, camera.parent.getWorldMatrix())
      const sphere0WorldPosition = BABYLON.Vector3.TransformCoordinates(sphere0.position, sphere0.parent.getWorldMatrix())
      // inbetween.position = cameraWorldPosition.add(sphere0WorldPosition).scale(0.5)
      console.clear()
      console.log('camera   ', cameraWorldPosition)
      // console.log('inbetween', inbetween.position)
      console.log('sphere0  ', sphere0WorldPosition)
      console.log('---')
      // const diff = cameraWorldPosition.subtract(sphere0WorldPosition)
      // console.log('diff     ', diff)
      console.log('sphere1.rotationQuaternion', sphere1.rotationQuaternion)
      console.log('---')
      console.log('axis ', axis)
      console.log('angle', angle)

      if (map['a']) {
        // TODO: I think what this actually needs to do is rotate the "axis" variable
        // in such a way that it represents rotatin the axis around the current normal
        // of the spaceship above the origin
        // But where does a quaternion start its rotation?
        yangle -= 0.01
        BABYLON.Quaternion.RotationAxisToRef(yaxis, yangle, sphere0.rotationQuaternion)
        // Try to reset the main quaternion starting from the current position...
        axis = BABYLON.Vector3.Cross(cameraWorldPosition, sphere0WorldPosition)
        // angle = 0 // TODO: Where does angle 0 start?
        BABYLON.Quaternion.RotationAxisToRef(axis, angle, sphere1.rotationQuaternion)
      }
      if (map['d']) {
      }
      if (map['w']) {
        angle += 0.01
        BABYLON.Quaternion.RotationAxisToRef(axis, angle, sphere1.rotationQuaternion)
      }
    })

    // TODO: Try rotating world around and using that to store position?

    this.engine.runRenderLoop(() => {
      scene.render()
    })
  }
}
