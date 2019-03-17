import './main.css'
import { wrapper } from '../old/wrapper'

const CONTAINER_ASPECT_WIDTH = 16;
const CONTAINER_ASPECT_HEIGHT = 9;

const linkToSource = <HTMLImageElement> document.getElementById('link-to-source')

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

function scaleContainer(canvas, scaleFactor) {
  const newWidth = Math.ceil(CONTAINER_ASPECT_WIDTH * scaleFactor);
  const newHeight = Math.ceil(CONTAINER_ASPECT_HEIGHT * scaleFactor);
  canvas.width = newWidth;
  canvas.height = newHeight;
}

function resizeHandler() {
  const containerScaleFactor = calculateScaleFactor(
    window.innerWidth,
    window.innerHeight,
    CONTAINER_ASPECT_WIDTH,
    CONTAINER_ASPECT_HEIGHT
  )
  scaleContainer(wrapper.canvas, containerScaleFactor);
  wrapper.engine.resize()
}

class Ui {
  constructor() { }

  doIt() {
    window.addEventListener('resize', () => { resizeHandler() });
    resizeHandler()
  }
}

export const ui = new Ui()
