// # 12
// trackball rotation

// Helper function from:
// https://www.babylonjs-playground.com/#MYY6S#7
function asCartesianToRef(rho, phi, theta, ref) {
  // This is how it looks when +X is right, +Y is up, and +Z is forward:
  const x = rho * Math.cos(theta) * Math.sin(phi)
  const y = rho * Math.cos(phi)
  const z = rho * Math.sin(theta) * Math.sin(phi)
  ref.set(x, y, z)
}

var createScene = function () {
  console.clear()

  var scene = new BABYLON.Scene(engine);

  // Keyboard input
  const map = {} //object for multiple key presses
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
  }))
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
      map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
  }))

  // Uninteresting light source
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // World
  var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16 }, scene);
  sphere.scaling = new BABYLON.Vector3(2, 2, 2)
  sphere.bakeCurrentTransformIntoVertices()
  var sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', scene);
  sphereMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.25, 1);
  sphereMaterial.wireframe = true;
  sphere.material = sphereMaterial;

  // // Starting position
  // var rho = 1
  // var phi = 2 * Math.random() * Math.PI // 0 <=   phi <= 2PI
  // var theta = Math.random() * Math.PI // 0 <= theta <=  PI
  // let myAngle = 0
  // // var dphi = -Math.cos(myAngle) // Should match code in loop
  // // var dtheta = -Math.sin(myAngle) // Should match code in loop
  // asCartesianToRef(rho, phi, theta, ship.position)

  // Origin box at 0, 0, 0
  var origin = BABYLON.MeshBuilder.CreateBox('origin', {}, scene);
  origin.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  origin.bakeCurrentTransformIntoVertices()
  origin.rotationQuaternion = new BABYLON.Quaternion()

  // The "visible ship", a cone arrow
  const arrow = BABYLON.MeshBuilder.CreateCylinder('arrow', { diameterTop: 0 }, scene)
  arrow.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  arrow.rotate(BABYLON.Axis.X, Math.PI / 2)
  arrow.bakeCurrentTransformIntoVertices()
  arrow.parent = origin
  arrow.position.y = 1

  // Point toward front of arrow
  var ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var rayHelper = new BABYLON.RayHelper(ray);
  rayHelper.show(scene);
  rayHelper.attachToMesh(
      arrow,
      new BABYLON.Vector3(0, 0, 1), // direction in local mesh
      new BABYLON.Vector3(0, 0, 0.04), // origin in local mesh
      0.3 // length
  )

  // Satellite cam
  var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-2, 1.4, 1.4), scene);
  // var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-3, 0, 0), scene);
  camera.speed = 0.25
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  // // 3rd person view cam
  // const camera = new BABYLON.UniversalCamera(
  //   'camera',
  //   new BABYLON.Vector3(0, 0, 0),
  //   scene
  // )
  // camera.attachControl(canvas, true)
  // camera.parent = arrow
  // camera.position.x = 0
  // camera.position.y = 1
  // camera.position.z = -1
  // camera.setTarget(new BABYLON.Vector3(0, 0, 0))

  // Draw visualization: line from origin to arrow
  var originToArrowRay = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var originToArrowRayHelper = new BABYLON.RayHelper(originToArrowRay)
  originToArrowRayHelper.show(scene)
  // Draw visualization of oAxis - initially in the direction of the +x axis
  var oAxisRay = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var oAxisRayHelper = new BABYLON.RayHelper(oAxisRay)
  oAxisRayHelper.show(scene, new BABYLON.Color3(0, 0.5, 1)) // skyblue
  // Draw negative direction
  var oAxisRayN = new BABYLON.Ray(new BABYLON.Vector3(1, 0, 0), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var oAxisRayNHelper = new BABYLON.RayHelper(oAxisRayN)
  oAxisRayNHelper.show(scene, new BABYLON.Color3(1, 0.5, 0)) // orange

  // "movement" rotation for origin box
  const oAxis = new BABYLON.Vector3(1, 0, 0)
  let oAngle = 0.6 // 0
  // "facing" rotation for origin box
  const fAxis = new BABYLON.Vector3()
  let fAngle = -0.8 // 0

  const turnSpeed = 0.05
  const moveSpeed = 0.05

  // Cache variables for beforeRender callback, use with caution
  const q1cache = new BABYLON.Quaternion()
  const q2cache = new BABYLON.Quaternion()
  const v1cache = new BABYLON.Vector3()
  const v2cache = new BABYLON.Vector3()
  const v3cache = new BABYLON.Vector3()
  const m1cache = new BABYLON.Matrix()

  scene.beforeRender = () => {
      if (map['a']) {
          fAngle -= turnSpeed // TODO: mod under 0?
      }
      if (map['d']) {
          fAngle += turnSpeed // TODO: mod past 2pi?
      }
      if (map['w']) {
          oAngle += moveSpeed
      }
      if (map['s']) {
          oAngle -= moveSpeed
      }

      // BABYLON.Vector3.TransformCoordinatesToRef(arrow.position, arrow.parent.getWorldMatrix(), fAxis)
      // BABYLON.Quaternion.RotationAxisToRef(fAxis, fAngle, v1cache)
      // origin.rotationQuaternion.copyFrom(v1cache)

      // TODO: Use fAngle and fAxis to rotate the oAxis a certain amount
      // Get arrow location in world space
      // BABYLON.Vector3.TransformCoordinatesToRef(arrow.position, arrow.parent.getWorldMatrix(), v1cache)
      // BABYLON.Quaternion.RotationAxisToRef(oAxis, oAngle, quaternion)

      // BABYLON.Vector3.TransformCoordinatesToRef(arrow.position, arrow.parent.getWorldMatrix(), v1cache)
      // BABYLON.Quaternion.RotationAxisToRef(v1cache, fAngle, q1cache)
      // BABYLON.Quaternion.RotationAxisToRef(oAxis, oAngle, q2cache)
      // q1cache.multiplyToRef(q2cache, origin.rotationQuaternion) // <-- order matters

      // Visualize the line from origin to ship
      originToArrowRayHelper.attachToMesh(
          origin,
          new BABYLON.Vector3(0, 1, 0), // direction in local mesh
          new BABYLON.Vector3(0, 0, 0), // origin in local mesh
          1 // length
      )
      // Visualize the oAxis
      oAxisRayHelper.attachToMesh(
          origin,
          oAxis,                        // direction in local mesh
          new BABYLON.Vector3(0, 0, 0), // origin in local mesh
          2 // length
      )
      oAxis.scaleToRef(-1, v1cache)
      oAxisRayNHelper.attachToMesh(
          origin,
          v1cache,                      // direction in local mesh
          new BABYLON.Vector3(0, 0, 0), // origin in local mesh
          2 // length
      )
  }
  scene.afterRender = () => {
  }

  return scene;
};
