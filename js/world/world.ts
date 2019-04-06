import { Camera } from './camera'
import { HemisphericLight } from './hemispheric-light'
import { singleton } from 'tsyringe'
import { Skybox } from './skybox'
import { Player } from './player'
import { Bot } from './bot'
import { Loader } from 'js/gfx/loader'

@singleton()
export class World {
  bot: Bot

  constructor(
    private hemisphericLight: HemisphericLight,
    private skybox: Skybox,
    private camera: Camera,
    private player: Player,
    loader: Loader
  ) {
    this.bot = new Bot(loader)
  }

  start() {
    this.hemisphericLight.start()
    this.skybox.start()
    this.player.start()
    this.bot.start()
    this.camera.start()
  }

  step() {
    this.skybox.step()
    this.player.step()
    this.bot.step()
  }
}
