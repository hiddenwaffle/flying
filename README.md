# flying

#### CSE-7319 | Software Architecture and Design | Southern Methodist University | Spring 2019

## Development
```
# Clojure
lein run

# JS (in another session)
yarn run dev
```

## Production
```
# Clojure
lein uberjar

# JS
rm -rf docs
yarn run build
mv dist docs
```

## Notes

This is based on a simple spherical movement concept that I experimented with here: https://playground.babylonjs.com/#GSZYZL

The mathematics behind the movement are located here: https://github.com/BabylonJS/Babylon.js/blob/a001298124c04e3610ed06dc31d075ba799d047f/src/Meshes/transformNode.ts#L796

The gist is that for the given mesh, calculate a quaterion based on the given axis and angle, then multiply it by the mesh's current quaternion to get the new quaternion for the mesh's center of rotation.

## Assignment Notes

To find the component-to-class** mappings, search the project source for the text *FLYING_ARCHITECTURE*.

**Classes in TypeScript/ES2015+ are actually syntactic sugar on top of prototypical OOP.

## Credits

Skybox
* Apache-2.0
* https://doc.babylonjs.com/resources/playground_textures#cubetextures

Spaceship
* CC0
* https://quaternius.itch.io/lowpoly-spaceships

Planet
* GNU GPL v3.0
* from: https://motherboardmage.itch.io/low-poly-planets
