import { injectable } from 'tsyringe'
import { Gfx } from 'js/gfx/gfx'

@injectable()
export class Game {
  constructor(
    private gfx: Gfx
  ) {
    console.log('in Game#constructor()')
  }

  start() {
    console.log('in Game#start()')
    this.gfx.start()
  }
}
