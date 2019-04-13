import * as spaceshipFile from 'js/gfx/models/spaceship.babylon.json'
import * as planetFile from 'js/gfx/models/planet.babylon.json'

import { singleton } from 'tsyringe'
import { BabylonWrapper } from './babylon-wrapper'

@singleton()
export class Loader {
  private readonly assetsManager: any
  private readonly redMeshes = []
  private readonly blueMeshes = []

  constructor(
    babylonWrapper: BabylonWrapper
  ) {
    this.assetsManager = babylonWrapper.assetsManager
  }

  async start() {
    const planetMeshAddMeshTask = this.assetsManager.addMeshTask(
      'planetMesh',
      '',
      '',
      planetFile
    )
    const planetPromise = new Promise((resolve, reject) => {
      planetMeshAddMeshTask.onSuccess = (task) => {
        for (const mesh of task.loadedMeshes) {
          mesh.scaling = new BABYLON.Vector3(3, 3, 3)
          // mesh.position = new BABYLON.Vector3(0, 0, 0)
        }
        resolve()
      }
      planetMeshAddMeshTask.onError = (task, message: string, exception) => {
        console.log('ERROR', message, exception)
        reject()
      }
    })
    const spaceshipAddMeshTask = this.assetsManager.addMeshTask(
      'spaceshipAddMeshTask',
      '',
      '',
      spaceshipFile
    )
    this.assetsManager.load()
    const spaceshipPromise = new Promise((resolve, reject) => {
      spaceshipAddMeshTask.onSuccess = (task) => {
        for (let i = 0; i < task.loadedMeshes.length; i++) {
          const mesh = task.loadedMeshes[i]
          mesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2)
          const redMesh = mesh.clone(`redMesh-${i}`).makeGeometryUnique()
          const blueMesh = mesh.clone(`blueMesh-${i}`).makeGeometryUnique()
          this.redMeshes.push(redMesh)
          this.blueMeshes.push(blueMesh)
        }
        // TODO: Not sure if this is the best way to ensure non-shared material
        //       between the red and blue meshes...
        this.redMeshes[0].material = this.redMeshes[0].material.clone('red-material-0')
        this.redMeshes[0].material.diffuseColor  = new BABYLON.Color3(0.80, 0.10, 0.20)
        this.blueMeshes[0].material = this.blueMeshes[0].material.clone('blue-material-0')
        this.blueMeshes[0].material.diffuseColor = new BABYLON.Color3(0.25, 0.50, 1.00)
        resolve()
      }
      spaceshipAddMeshTask.onError = (task: any, message: string, exception: any) => {
        console.log('ERROR', message, exception)
        reject()
      }
    })
    return Promise.all([planetPromise, spaceshipPromise])
  }

  createSpaceshipMeshInstances(id: number, red: boolean, parent: any): any[] {
    const baseMeshes = red ? this.redMeshes : this.blueMeshes
    const instances = []
    for (let i = 0; i < baseMeshes.length; i++) {
      const instance = baseMeshes[i].createInstance(`spaceship-${i}-${id}`)
      instance.parent = parent
      instances.push(instance)
    }
    return instances
  }
}
