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
import { PositionAndHeadingEvent } from 'js/event/position-and-heading-event'
import { AttackEvent } from 'js/event/attack-event'
import { MissileHitEvent } from 'js/event/missile-hit-event'
import { ExplosionEvent } from 'js/event/explosion-event'
import { ExplosionPool } from './explosion-pool'

/**
 * FLYING_ARCHITECTURE - Environment Component
 */
@singleton()
export class World {
  private readonly scene: any

  /**
   * FLYING_ARCHITECTURE - "Other Spaceships" Component
   */
  bots: Map<number, Bot>

  constructor(
    private hemisphericLight: HemisphericLight,
    private skybox: Skybox,
    private camera: Camera,
    private player: Player,
    private missilePool: MissilePool,
    private explosionPool: ExplosionPool,
    private loader: Loader,
    babylonWrapper: BabylonWrapper,
    eventBus: EventBus
  ) {
    this.scene = babylonWrapper.scene
    this.bots = new Map()
    eventBus.register(EventType.PositionAndHeading, (event: PositionAndHeadingEvent) => {
      let bot = this.getOrCreateBot(event.id)
      bot.spaceship.yaw = event.yaw
      bot.spaceship.acceleration = event.acceleration
      bot.setQ(event.x, event.y, event.z, event.w)
      bot.setSpeed(event.speed)
    })
    eventBus.register(EventType.Attack, (event: AttackEvent) => {
      let bot = this.getOrCreateBot(event.id)
      bot.fire()
    })
    eventBus.register(EventType.MissileHit, (event: MissileHitEvent) => {
      // TODO: Do something score-related with the hit?
      eventBus.fire(new ExplosionEvent(event.x, event.y, event.z, event.w))
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
    this.missilePool.step([...this.bots.values()], this.player.id) // TODO: Use iterator to avoid array?
    this.explosionPool.step()
    this.stepReaper()
  }

  private getOrCreateBot(id: number) {
    let bot = this.bots.get(id)
    if (!bot) {
      bot = new Bot(id, this.loader, this.scene, this.missilePool)
      this.bots.set(id, bot)
      bot.start()
    }
    return bot
  }

  private stepReaper() {
    const now = Date.now()
    const ids: Array<number> = []
    this.bots.forEach((bot) => {
      if (now - bot.lastUpdate > 3000) { // See player.ts for interval (here should be higher)
        ids.push(bot.id)
      }
    })
    ids.forEach((id) => {
      let bot = this.bots.get(id)
      if (bot) {
        bot.stop()
        this.bots.delete(id)
      }
    })
  }
}
