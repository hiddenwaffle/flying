import { Ui } from 'js/ui/ui'

export class World {
  constructor(
    private ui: Ui
  ) { }

  start() {
    this.ui.start()
  }
}
