import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { singleton } from 'tsyringe'
import { Spaceship } from './spaceship'

@singleton()
export class Player extends Spaceship {
  private mesh: any

  constructor(
    babylonWrapper: BabylonWrapper
  ) {
    super(babylonWrapper)
  }

  async start() {
    await super.start()
  }
}
