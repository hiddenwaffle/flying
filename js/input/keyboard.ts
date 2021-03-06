import { singleton } from 'tsyringe'

export const enum Key {
  ThrottleUp  = 1,
  Brake       = 2,
  Left        = 3,
  Right       = 4,
  Fire        = 5,
  Cancel      = 100,
  // Rest of these are special directives
  Other       = 7,
  Ignore      = 8,
  Prevent     = 9,
}

const enum State {
  Down,
  Up,
  Handling,
}

@singleton()
export class Keyboard {
  private keyState: Map<Key, State>

  constructor() {
    this.keyState = new Map()
  }

  start() {
    window.addEventListener('keydown', (event) => {
      this.eventToState(event, State.Down)
    })
    window.addEventListener('keyup', (event) => {
      this.eventToState(event, State.Up)
    })
    // Prevent "stuck" key if held down and window loses focus.
    window.addEventListener('blur', () => {
      this.keyState.clear()
    })
  }

  stop() {
    //
  }

  step() {
    // Currently nothing to do.
  }

  /**
   * Return if given key is 'Down'.
   */
  isDown(key: Key): boolean {
    return this.keyState.get(key) === State.Down
  }

  /**
   * Return if given key is 'down'. Also sets the key from 'Down' to 'Handling'.
   */
  isDownAndUnhandled(key: Key): boolean {
    if (this.isDown(key)) {
      this.keyState.set(key, State.Handling)
      return true
    } else {
      return false // TODO: This wasn't set in mazing need to see why.
    }
  }

  /**
   * Returns if any key is 'down'. Also set all 'Down' keys to 'Handling'.
   */
  isAnyKeyDownAndUnhandled() {
    let anyKeyDown = false
    this.keyState.forEach((state: State, key: Key) => {
      if (state === State.Down) {
        this.keyState.set(key, State.Handling)
        anyKeyDown = true
      }
    })
    return anyKeyDown
  }

  private eventToState(event: KeyboardEvent, state: State) {
    const key = this.keyCodeToKey(event.keyCode)
    this.keyToState(key, state, event)
  }

  private keyCodeToKey(keyCode: number): Key {
    let key = Key.Other

    switch (keyCode) {
      // Directionals --------------------------------------------------
      case 65: // 'a'
      case 37: // left
        key = Key.Left
        break
      case 87: // 'w'
      case 38: // up
        key = Key.ThrottleUp
        break
      case 68: // 'd'
      case 39: // right
        key = Key.Right
        break
      case 83: // 's'
      case 40: // down
        key = Key.Brake
        break

      // Actions ---------------------------------------------------------
      case 32:    // space
      case 16:    // shift
      case 13:    // enter
      case 17:    // ctrl
      case 69:    // 'e'
      case 81:    // 'q'
      case 90:    // 'z'
      case 88:    // 'x'
      case 67:    // 'c'
      case 49:    // '1'
      case 50:    // '2'
      case 51:    // '3'
        key = Key.Fire
        break

      case 27:    // esc
        key = Key.Cancel
        break

      // Ignore certain keys -------------------------------------------
      case 82:    // 'r'
      case 18:    // alt
      case 16:    // shift
      case 224:   // apple command (firefox)
      case 17:    // apple command (opera)
      case 91:    // apple command, left (safari/chrome)
      case 93:    // apple command, right (safari/chrome)
      case 84:    // 't' (i.e., open a new tab)
      case 78:    // 'n' (i.e., open a new window)
      case 219:   // left brackets
      case 221:   // right brackets
        key = Key.Ignore
        break

      // Prevent some unwanted behaviors -------------------------------
      case 191:   // forward slash (page find)
      case 9:     // tab (can lose focus)
        key = Key.Prevent
        break

      // All other keys ------------------------------------------------
      default:
        key = Key.Other
    }

    return key
  }

  private keyToState(key: Key, state: State, event: KeyboardEvent) {
    let preventDefault = false

    switch (key) {
      case Key.Left:
        this.setState(Key.Left, state)
        preventDefault = true
        break
      case Key.ThrottleUp:
        this.setState(Key.ThrottleUp, state)
        // event.preventDefault() - commented for if the user wants to cmd+w or ctrl+w
        break
      case Key.Right:
        this.setState(Key.Right, state)
        preventDefault = true
        break
      case Key.Brake:
        this.setState(Key.Brake, state)
        preventDefault = true
        break
      case Key.Cancel:
        this.setState(Key.Cancel, state)
        preventDefault = true
        break
      case Key.Fire:
        this.setState(Key.Fire, state)
        preventDefault = true
        break
      // TODO: Maybe add a debug key here ('f')
      case Key.Ignore:
        break
      case Key.Prevent:
        preventDefault = true
        break
      case Key.Other:
      default:
        this.setState(Key.Other, state)
        break
    }

    if (event != null && preventDefault === true) {
      event.preventDefault()
    }
  }

  private setState(key: Key, state: State, force = false) {
    // Always set 'up'
    if (state === State.Up) {
      this.keyState.set(key, state)
      // Only set 'down' if it is not already handled
    } else if (state === State.Down) {
      if (this.keyState.get(key) !== State.Handling || force === true) {
        this.keyState.set(key, state)
      }
    }
  }
}
