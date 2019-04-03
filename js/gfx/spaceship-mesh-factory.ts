
import * as spaceshipFile from 'js/gfx/models/spaceship.babylon.json'
import { singleton } from 'tsyringe'
import { BabylonWrapper } from './babylon-wrapper';

class SpaceshipMesh {
  readonly meshes: Array<any> = []

  async start(assetsManager: any) {
    const spaceshipAddMeshTask = assetsManager.addMeshTask(
      'spaceshipMesh',
      '',
      '',
      spaceshipFile
    )
    return new Promise((resolve, reject) => {
      spaceshipAddMeshTask.onSuccess = (task: any) => {
        for (const mesh of task.loadedMeshes) {
          this.meshes.push(mesh)
          mesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2)
          // mesh.parent = arrow // <--- TODO: Move into instance
        }
        resolve()
      }
      spaceshipAddMeshTask.onError = (task: any, message: string, exception: any) => {
        console.log('ERROR', message, exception)
        reject()
      }
    })
  }

  setColor(color: any) {
    this.meshes[0].material.diffuseColor = color
  }
}

@singleton()
export class SpaceshipMeshInstanceFactory {
  private assetsManager: any
  private redMesh: any
  private blueMesh: any

  constructor(
    babylonWrapper: BabylonWrapper
  ) {
    this.assetsManager = babylonWrapper.assetsManager
  }

  async start() {
    this.redMesh = new SpaceshipMesh()
    await this.redMesh.start(this.assetsManager)
    this.redMesh.setColor(new BABYLON.Color3(1, 0.5, 0.25))

    this.blueMesh = this.redMesh.clone()
    this.blueMesh.setColor(new BABYLON.Color3(0.25, 0.5, 1))
  }

  getInstance(id: number, red: boolean, arrow: any): any {
    if (red) {
      return this.redMesh.createInstance(`spaceship-red-${id}`)
    } else {
      return this.blueMesh.createInstance(`spaceship-blue-${id}`)
    }
  }
}
