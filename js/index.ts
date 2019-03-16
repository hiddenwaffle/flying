import { db } from './database'
import { environment } from './environment'

// TODO: Something else with this
import './ui'
// import * as tmp from './index.html'

window.addEventListener('DOMContentLoaded', () => {
  db.doIt()
  console.log('Hello World (from index)', environment)
})

// TODO: Use this for client ID
const arr = new Uint32Array(2)
crypto.getRandomValues(arr)
console.log('64-bit Random ID:', `${arr[0]}${arr[1]}`)
