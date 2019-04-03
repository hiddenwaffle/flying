import { Camera } from './camera'
import { HemisphericLight } from './hemispheric-light'
import { Planet } from './planet'
import { singleton } from 'tsyringe'
import { Skybox } from './skybox'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Player } from './player'
import { Mob } from './mob'

@singleton()
export class World {
  private readonly assetsManager: any
  private readonly mobs: Map<number, Mob>

  constructor(
    private hemisphericLight: HemisphericLight,
    private skybox: Skybox,
    private planet: Planet,
    private camera: Camera,
    private player: Player,
    babylonWrapper: BabylonWrapper
  ) {
    this.assetsManager = babylonWrapper.assetsManager
    this.mobs = new Map()
    this.mobs.set(player.id, player)
  }

  start() {
    this.hemisphericLight.start()
    this.skybox.start()
    this.player.start()
    this.planet.start()
    this.camera.start()

    return new Promise((resolve, reject) => {
      this.assetsManager.load()
    })
  }

  step() {
    this.skybox.step()
    this.mobs.forEach((mob) => {
      mob.step()
    })
  }
}
