import { injectable } from 'tsyringe'

@injectable()
export class EngineWrapper {
  canvas: HTMLCanvasElement
  engine: any

  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById('renderCanvas')
    this.engine = new BABYLON.Engine(this.canvas, true)
  }
}
