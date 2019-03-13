import { db } from './database'
import { environment } from './environment'

// TODO: Something else with this
import './ui'
// import * as tmp from './index.html'

window.addEventListener('DOMContentLoaded', () => {
  db.doIt()
  console.log('Hello World (from index)', environment)
})
