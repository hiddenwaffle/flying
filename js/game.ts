import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Controller } from 'js/input/controller'
import { singleton } from 'tsyringe'
import { Ui } from 'js/ui/ui'
import { World } from 'js/world/world'
import { Loader } from './gfx/loader'
import { RemoteEventBus } from './event/remote-event-bus'

@singleton()
export class Game {
  private engine: any
  private scene: any

  constructor(
    private ui: Ui,
    private controller: Controller,
    private world: World,
    private loader: Loader,
    babylonWrapper: BabylonWrapper,
    private remoteEventBus: RemoteEventBus
  ) {
    this.engine = babylonWrapper.engine
    this.scene = babylonWrapper.scene
  }

  async start() {
    await this.loader.start()
    this.remoteEventBus.start()
    this.ui.start()
    this.controller.start()
    this.world.start()
    this.scene.registerBeforeRender(this.step.bind(this))
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  step() {
    this.controller.step()
    this.world.step()
  }
}
