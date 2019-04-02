import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Projectile } from './projectile'
import { singleton } from 'tsyringe'

import * as spaceshipFile from 'js/gfx/models/spaceship.babylon.json'

export class Spaceship extends Projectile {
  private assetsManager: any

  constructor(
    babylonWrapper: BabylonWrapper
  ) {
    super()
    this.assetsManager = babylonWrapper.assetsManager
  }

  start(): Promise<void> {
    const spaceshipAddMeshTask = this.assetsManager.addMeshTask(
      'spaceshipMesh',
      '',
      '',
      spaceshipFile
    )
    return new Promise((resolve, reject) => {
      spaceshipAddMeshTask.onSuccess = (task: any) => {
        task.loadedMeshes[0].material.diffuseColor = new BABYLON.Color3(0.25, 0.5, 1)
        for (const mesh of task.loadedMeshes) {
          mesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2)
          mesh.parent = this.arrow
        }
        resolve()
      }
      spaceshipAddMeshTask.onError = (task: any, message: string, exception: any) => {
        console.log('ERROR', message, exception)
        reject()
      }
    })
  }
}
