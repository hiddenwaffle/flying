import { singleton } from 'tsyringe'
import { Keyboard, Key } from './keyboard'

@singleton()
export class Controller {
  constructor(
    private keyboard: Keyboard
  ) { }

  start() {
    this.keyboard.start()
  }

  step() {
    this.handleKeyboard()
  }

  private handleKeyboard() {
    this.keyboard.step()

    if (this.keyboard.isDown(Key.Up)) {
      console.log('up')
    }
  }
}
