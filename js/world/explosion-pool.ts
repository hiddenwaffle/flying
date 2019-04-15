import { BabylonWrapper } from 'js/gfx/babylon-wrapper'
import { Explosion } from './explosion'
import { generateId } from 'js/math'
import { EventBus, EventType } from 'js/event/event-bus'
import { ExplosionEvent } from 'js/event/explosion-event'
import { singleton } from 'tsyringe';

const POOL_SIZE = 20

@singleton()
export class ExplosionPool {
  private readonly meshSphere: any

  private readonly waiting: Array<Explosion>
  private readonly active: Map<number, Explosion>

  constructor(
    babylonWrapper: BabylonWrapper,
    eventBus: EventBus
  ) {
    this.waiting = []
    this.active = new Map()
    this.meshSphere = BABYLON.MeshBuilder.CreateSphere(
      'explosion-meshSphere',
      { segments: 8 },
      babylonWrapper.scene
    )
    const material = new BABYLON.StandardMaterial('explosionMesh-material')
    material.emissiveColor = new BABYLON.Color3(1, 1, 1)
    this.meshSphere.material = material
    for (let i = 0; i < POOL_SIZE; i++) {
      const id = generateId()
      const instance = this.meshSphere.createInstance(`explosion-meshSphere-${id}`)
      const explosion = new Explosion(
        id,
        instance,
        babylonWrapper.scene,
        this.returnToPool.bind(this)
      )
      this.waiting.push(explosion)
    }
    eventBus.register(EventType.Explosion, (event: ExplosionEvent) => {
      console.log('BOOM', event.x, event.y, event.z, event.w)
    })
  }

  step() {
    for (let explosion of this.active.values()) {
      explosion.step()
    }
  }

  explode(rotationQuaternion: any) {
    if (this.waiting.length === 0) {
      // Handle when there are none available, pick arbitrary one to reset
      const randomId = this.active.keys().next().value
      this.returnToPool(randomId)
    }
    let explosion = this.waiting.pop()
    explosion.explode(rotationQuaternion)
    this.active.set(explosion.id, explosion)
  }

  returnToPool(id: number) {
    const explosion = this.active.get(id)
    if (explosion) {
      this.active.delete(id)
      this.waiting.push(explosion)
    }
  }
}
