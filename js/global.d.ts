declare const BABYLON: any

// Must declare these to prevent TypeScript TS2307 error when importing:
// https://github.com/webpack-contrib/raw-loader/issues/56#issuecomment-423640398
// And use import * ... as ... to import images:
// https://github.com/webpack-contrib/url-loader/issues/161#issuecomment-448569184
declare module '*.png'
declare module '*.jpg'
// Use .babylon.json instead of .babylon so that default MIME types for
// webpack-dev-server can be used on the HTTP headers.
declare module '*.babylon.json'
declare module '*.json'
