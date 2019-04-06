import { Camera } from './camera'
import { HemisphericLight } from './hemispheric-light'
import { singleton } from 'tsyringe'
import { Skybox } from './skybox'
import { Player } from './player'
import { Bot } from './bot'
import { Loader } from 'js/gfx/loader'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'

@singleton()
export class World {
  bots: Array<Bot>

  constructor(
    private hemisphericLight: HemisphericLight,
    private skybox: Skybox,
    private camera: Camera,
    private player: Player,
    loader: Loader,
    babylonWrapper: BabylonWrapper
  ) {
    this.bots = []
    for (let i = 0; i < 16; i++) {
      const bot = new Bot(
        loader,
        i < 8 ? true : false,
        babylonWrapper.scene.getAnimationRatio.bind(babylonWrapper.scene)
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
  }
}
