class Wrapper {
  canvas: HTMLCanvasElement
  engine: any

  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById('renderCanvas')
    this.engine = new BABYLON.Engine(this.canvas, true)
  }
}

export const wrapper = new Wrapper()
