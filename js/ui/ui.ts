import './main.css'
import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'

const CONTAINER_ASPECT_WIDTH = 16;
const CONTAINER_ASPECT_HEIGHT = 9;

/**
 * Determine how much to scale the given logical rectangle
 * into the actual rectangle, while preserving the logical
 * rectangle's aspect ratio.
 *
 * Credit to: https://codepen.io/anthdeldev/pen/PGPmVm
 */
function calculateScaleFactor(
  actualWidth: number, actualHeight: number,
  logicalWidth: number, logicalHeight: number,
): number {
  const scaleFactor = Math.min(
    actualWidth / logicalWidth,
    actualHeight / logicalHeight,
  );
  return scaleFactor;
}

function scaleContainer(canvas: HTMLCanvasElement, scaleFactor: number) {
  const newWidth = Math.ceil(CONTAINER_ASPECT_WIDTH * scaleFactor);
  const newHeight = Math.ceil(CONTAINER_ASPECT_HEIGHT * scaleFactor);
  canvas.width = newWidth;
  canvas.height = newHeight;
}

function resizeHandler(canvas: HTMLCanvasElement, engine: any) {
  const containerScaleFactor = calculateScaleFactor(
    window.innerWidth,
    window.innerHeight,
    CONTAINER_ASPECT_WIDTH,
    CONTAINER_ASPECT_HEIGHT
  )
  scaleContainer(canvas, containerScaleFactor);
  engine.resize()
}

@singleton()
export class Ui {
  private canvas: HTMLCanvasElement
  private engine: any

  constructor(babylonWrapper: BabylonWrapper) {
    this.canvas = babylonWrapper.canvas
    this.engine = babylonWrapper.engine
  }

  start() {
    const rh = () => {
      resizeHandler(this.canvas, this.engine)
    }
    window.addEventListener('resize', rh);
    rh()
  }
}
