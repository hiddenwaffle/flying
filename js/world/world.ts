import { Camera } from './camera'
import { HemisphericLight } from './hemispheric-light'
import { singleton } from 'tsyringe'
import { Skybox } from './skybox'
import { Player } from './player'
import { Projectile } from './projectile'

@singleton()
export class World {
  constructor(
    private hemisphericLight: HemisphericLight,
    private skybox: Skybox,
    private camera: Camera,
    private player: Player
  ) { }

  start() {
    this.hemisphericLight.start()
    this.skybox.start()
    this.player.start()
    this.camera.start()
  }

  step() {
    this.skybox.step()
    this.player.step()
  }
}
