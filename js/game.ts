import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Controller } from 'js/input/controller'
import { singleton } from 'tsyringe'
import { Ui } from 'js/ui/ui'
import { World } from 'js/world/world'

@singleton()
export class Game {
  private canvas: HTMLCanvasElement
  private engine: any
  private scene: any

  constructor(
    private ui: Ui,
    private controller: Controller,
    private world: World,
    babylonWrapper: BabylonWrapper
  ) {
    this.canvas = babylonWrapper.canvas
    this.engine = babylonWrapper.engine
    this.scene = babylonWrapper.scene
  }

  start() {
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
