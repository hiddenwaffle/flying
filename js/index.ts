import { db } from './old/database'
import { environment } from './environment'

// TODO: Something else with this
import './ui/ui'
// import * as tmp from './index.html'

window.addEventListener('DOMContentLoaded', () => {
  db.doIt()
  console.log('Hello World (from index)', environment)
})

// TODO: Use this for client ID
const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
console.log('Client ID:', id)
