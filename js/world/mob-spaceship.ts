import { Spaceship } from './spaceship'
import { Mob } from './mob'
import { injectable } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'

@injectable()
export class MobSpaceship extends Spaceship implements Mob {
  id: number

  constructor(
    babylonWrapper: BabylonWrapper
  ) {
    super(babylonWrapper)
  }

  step() {
  }
}
