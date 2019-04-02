import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'

import * as planetFile from 'js/gfx/models/planet.babylon'

@singleton()
export class Planet {
  private readonly assetsManager: any

  constructor(
    babylonWrapper: BabylonWrapper
  ) {
    this.assetsManager = babylonWrapper.assetsManager
  }

  start(): Promise<void> {
    const planetMeshAddMeshTask = this.assetsManager.addMeshTask(
      'planetMesh',
      '',
      '',
      planetFile
    )
    return new Promise((resolve, reject) => {
      planetMeshAddMeshTask.onSuccess = (task: any) => {
        for (const mesh of task.loadedMeshes) {
          mesh.scaling = new BABYLON.Vector3(3, 3, 3)
          // mesh.position = new BABYLON.Vector3(0, 0, 0)
        }
        resolve()
      }
      planetMeshAddMeshTask.onError = (task: any, message: string, exception: any) => {
        console.log('ERROR', message, exception)
        reject()
      }
    })
  }
}
