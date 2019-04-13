import { singleton } from 'tsyringe'

@singleton()
export class BabylonWrapper {
  canvas: HTMLCanvasElement
  engine: any
  scene: any
  assetsManager: any

  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById('renderCanvas')
    this.engine = new BABYLON.Engine(this.canvas, true)
    this.scene = new BABYLON.Scene(this.engine)
    new BABYLON.GlowLayer('glow', this.scene)
    this.assetsManager = new BABYLON.AssetsManager(this.scene)
  }
}
