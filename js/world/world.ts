import { Camera } from './camera'
import { HemisphericLight } from './hemispheric-light'
import { singleton } from 'tsyringe'
import { Skybox } from './skybox'
import { Player } from './player'
import { Bot } from './bot'
import { Loader } from 'js/gfx/loader'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { MissilePool } from './missile-pool'
import { EventBus, EventType } from 'js/event/event-bus'
import { PositionAndHeadingEvent } from 'js/event/position-and-heading-event';

@singleton()
export class World {
  bots: Map<number, Bot>

  constructor(
    private hemisphericLight: HemisphericLight,
    private skybox: Skybox,
    private camera: Camera,
    private player: Player,
    private missilePool: MissilePool,
    loader: Loader,
    babylonWrapper: BabylonWrapper,
    eventBus: EventBus
  ) {
    this.bots = new Map()
    eventBus.register(EventType.PositionAndHeading, (event: PositionAndHeadingEvent) => {
      let bot = this.bots.get(event.id)
      if (!bot) {
        bot = new Bot(loader, babylonWrapper.scene, missilePool)
        this.bots.set(event.id, bot)
        bot.start()
      }
      bot.setQ(event.x, event.y, event.z, event.w)
      bot.setSpeed(event.speed)
    })
  }

  start() {
    this.hemisphericLight.start()
    this.skybox.start()
    this.player.start()
    this.camera.start()
  }

  step() {
    this.skybox.step()
    this.player.step()
    this.bots.forEach((bot) => {
      bot.step()
    })
    this.missilePool.step()
  }
}
