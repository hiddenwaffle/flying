// Title:
//   Traverse Around a Sphere by Using mesh.rotate()
//
// Description:
//   This demonstrates how to traverse a sphere by using mesh.rotate().
//   It might be useful to know for a Super Mario Galaxy kind of game.
//
// It was not obvious to me how this could be done until I found
// how mesh.rotate() works vs manipulating mesh.rotation or mesh.rotationQuaternion
// directly.
//
// I made this because using polar coordinates, I had a lot of with direction
// flipping at the poles, as well as whirlpooling into into them when
// using mesh.alignWithNormal() while attempting to move straight.
// This was the only way I could do turning + moving forward always moving along the orthodromes.
//
// Controls:
//   W - forward
//   A - turn left
//   D - turn right
//
// Around line 69 there is an option to toggle from 3rd-person cam to a free moving cam.

var createScene = function () {
  // This block of code is just setting the scene up:
  const scene = new BABYLON.Scene(engine)
  const map = {}
  scene.actionManager = new BABYLON.ActionManager(scene)
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
  }))
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
  }))
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  // The sphere to traverse:
  const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene)
  const sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', scene)
  sphereMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.25, 1)
  sphereMaterial.wireframe = true
  sphere.material = sphereMaterial

  // This mesh's quaternion represents the currnt position and direction of the arrow:
  const cot = new BABYLON.TransformNode('cot')
  cot.rotationQuaternion = new BABYLON.Quaternion()

  // Arrow pointing in the direction we want to go
  const arrow = BABYLON.MeshBuilder.CreateCylinder('arrow', { diameterTop: 0 }, scene)
  arrow.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  arrow.rotate(BABYLON.Axis.X, Math.PI / 2)
  arrow.bakeCurrentTransformIntoVertices()
  arrow.position.y = 1
  arrow.parent = cot

  // More pointing, from the front of the arrow
  const ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1) // Values do not seem to matter when attached to mesh?
  const rayHelper = new BABYLON.RayHelper(ray)
  rayHelper.show(scene)
  rayHelper.attachToMesh(
      arrow,
      new BABYLON.Vector3(0, 0, 1),    // direction in local mesh
      new BABYLON.Vector3(0, 0, 0.04), // origin in local mesh
      0.2                              // length
  )

  // Flip 'thirdPersonCamera' to false to observe motion from off-world:
  const thirdPersonCamera = true
  let camera
  if (thirdPersonCamera) {
      // 3rd person view cam, behind the arrow:
      camera = new BABYLON.UniversalCamera(
      'camera',
      new BABYLON.Vector3(0, 0, 0),
      scene
      )
      camera.parent = arrow
      camera.position.x = 0
      camera.position.y = 1
      camera.position.z = -1
  } else {
      camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-2, 1.4, 1.4), scene)
      camera.speed = 0.25
      camera.attachControl(canvas, true)
  }
  camera.setTarget(BABYLON.Vector3.Zero())

  scene.beforeRender = () => {
      if (map['w']) {
          cot.rotate(BABYLON.Axis.X, 0.02)
      }
      if (map['s']) {
          cot.rotate(BABYLON.Axis.X, -0.02)
      }
      if (map['a']) {
          cot.rotate(BABYLON.Axis.Y, -0.04)
      }
      if (map['d']) {
          cot.rotate(BABYLON.Axis.Y, 0.04)
      }
      // Uncomment this to see the position and heading of the arrow in the JS console:
      // console.log(cot.rotationQuaternion)
  }

  return scene
}
