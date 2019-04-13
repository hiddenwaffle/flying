import { Camera } from './camera'
import { HemisphericLight } from './hemispheric-light'
import { singleton } from 'tsyringe'
import { Skybox } from './skybox'
import { Player } from './player'
import { Bot } from './bot'
import { Loader } from 'js/gfx/loader'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { MissilePool } from './missile-pool'

@singleton()
export class World {
  bots: Array<Bot>

  constructor(
    private hemisphericLight: HemisphericLight,
    private skybox: Skybox,
    private camera: Camera,
    private player: Player,
    private missilePool: MissilePool,
    loader: Loader,
    babylonWrapper: BabylonWrapper
  ) {
    this.bots = []
    const numBots = 16
    for (let i = 0; i < numBots; i++) {
      const bot = new Bot(
        loader,
        babylonWrapper.scene,
        true,
        missilePool
      )
      this.bots.push(bot)
    }
  }

  start() {
    this.hemisphericLight.start()
    this.skybox.start()
    this.player.start()
    this.bots.forEach((bot) => {
      bot.start()
    })
    this.camera.start()
  }

  step() {
    this.skybox.step()
    this.player.step()
    this.bots.forEach((bot) => {
      bot.step()
    })
    this.missilePool.step()
  }
}
