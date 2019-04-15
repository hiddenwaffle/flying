import { singleton } from 'tsyringe'
import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Missile } from './missile'
import { generateId } from 'js/math'
import { Bot } from './bot'
import { RemoteEventBus } from 'js/event/remote-event-bus'
import { EventBus } from 'js/event/event-bus'
import { ExplosionEvent } from 'js/event/explosion-event';

const POOL_SIZE = 20

@singleton()
export class MissilePool {
  private readonly meshLeft: any
  private readonly meshRight: any

  private readonly waiting: Array<Missile>
  private readonly active: Map<number, Missile>

  constructor(
    private readonly remoteEventBus: RemoteEventBus,
    private readonly eventBus: EventBus,
    babylonWrapper: BabylonWrapper
  ) {
    this.waiting = []
    this.active = new Map()
    this.meshLeft = BABYLON.MeshBuilder.CreateCylinder(
      'meshLeft',
      {
        diameterTop: 0,
        diameterBottom: 0.25,
        tessellation: 8
      },
      babylonWrapper.scene
    )
    this.meshRight = this.meshLeft.clone('meshRight').makeGeometryUnique()
    const missileMaterial = new BABYLON.StandardMaterial('missileMaterial')
    missileMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1)
    for (let mesh of [this.meshLeft, this.meshRight]) {
      mesh.material = missileMaterial
      mesh.rotate(BABYLON.Axis.X, Math.PI / 2)
      mesh.position.z = -1.25
    }
    for (let i = 0; i < POOL_SIZE; i++) {
      const id = generateId()
      const left  = this.meshLeft.createInstance(`missile-left-${id}`)
      const right = this.meshRight.createInstance(`missile-right-${id}`)
      const missile = new Missile(
        id,
        left,
        right,
        babylonWrapper.scene,
        this.returnToPool.bind(this)
      )
      this.waiting.push(missile)
    }
  }

  step(bots: Array<Bot>, playerId: number) {
    for (let missile of this.active.values()) {
      missile.step()
      // Check only own missile's collisions
      if (missile.spaceshipId === playerId) {
        missile.checkCollision(bots, this.signalHit.bind(this))
      }
    }
  }

  fire(spaceshipId: number, rotationQuaternion: any) {
    if (this.waiting.length === 0) {
      // Handle when there are none available, pick arbitrary one to reset
      const randomId = this.active.keys().next().value
      this.returnToPool(randomId)
    }
    let missile = this.waiting.pop()
    missile.fire(spaceshipId, rotationQuaternion)
    this.active.set(missile.id, missile)
  }

  returnToPool(id: number) {
    const missile = this.active.get(id)
    if (missile) {
      this.active.delete(id)
      this.waiting.push(missile)
    }
  }

  private signalHit(spaceshipId: number, q: any) {
    this.remoteEventBus.fire({
      type: 'missile-hit',
      spaceshipId,
      x: q.x,
      y: q.y,
      z: q.z,
      w: q.w
    })
    this.eventBus.fire(new ExplosionEvent(q.x, q.y, q.z, q.w))
  }
}
