import { gfx } from './gfx'

class Database {
  doIt() {
    console.log('Hello World (from Database)');
    gfx.doIt();
  }
}

export const db = new Database()