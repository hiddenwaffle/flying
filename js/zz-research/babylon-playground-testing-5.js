// Use great circle

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
  const map = { } //object for multiple key presses
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
  }))
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown'
  }))

  // Look at sphere from the negative x-axis so that spherical coordinates are more intuitive:
  //  North Pole                = ( <anything>       ,       0       )
  //  South Pole                = ( <anything>       , Math.PI       )
  //  (Prime Meridian, Equator) = ( 0 or 2PI     , Math.PI * 1/2 ) <-- away from camera
  //  (   "Left Side", Equator) = (       PI / 2 , Math.PI * 1/2 )
  //  (Prime Meridian, Equator) = (       PI     , Math.PI * 1/2 ) <-- facing camera
  //  (  "Right Side", Equator) = (      3PI / 2 , Math.PI * 1/2 )
  var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-3, 0, 0), scene);
  camera.speed = 0.25
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // The world sphere
  var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16 }, scene);
  sphere.scaling = new BABYLON.Vector3(2, 2, 2)
  sphere.bakeCurrentTransformIntoVertices()
  var sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', scene);
  sphereMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.25, 1);
  sphereMaterial.wireframe = true;
  sphere.material = sphereMaterial;

  // The box with the ray facing front
  var ship = BABYLON.MeshBuilder.CreateBox('ship', { }, scene);
  ship.scaling = new BABYLON.Vector3(0.1, 0.02, 0.1)
  ship.bakeCurrentTransformIntoVertices()
  // Ensure that quaternions are used for rotations (going to use for rotations around y-axis)
  ship.rotationQuaternion = new BABYLON.Quaternion()
  var shipMaterial = new BABYLON.StandardMaterial('shipMaterial', scene)
  shipMaterial.alpha = 0.95
  ship.material = shipMaterial
  // "top"
  var top = BABYLON.MeshBuilder.CreateBox('top', { }, scene)
  top.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  top.position.y = 0.05 / 2
  top.bakeCurrentTransformIntoVertices()
  top.parent = ship

  // Point toward front of ship
  var ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var rayHelper = new BABYLON.RayHelper(ray);
  rayHelper.show(scene);
  rayHelper.attachToMesh(
      ship,
      new BABYLON.Vector3(0, 0, 1), // direction in local mesh
      new BABYLON.Vector3(0, 0, 0.04), // origin in local mesh
      0.3 // length
  )

  // Starting position
  asCartesianToRef(
      1,                           // rho
      2 * Math.random() * Math.PI, // phi
      Math.random() * Math.PI,     // theta
      ship.position
  )

  // Origin sphere at 0, 0, 0
  var origin = BABYLON.MeshBuilder.CreateSphere('halfway', { segments: 16 }, scene);
  origin.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  origin.bakeCurrentTransformIntoVertices()
  origin.rotationQuaternion = new BABYLON.Quaternion()

  // "guide" sphere
  var guide = BABYLON.MeshBuilder.CreateSphere('halfway', { segments: 16 }, scene);
  guide.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  guide.bakeCurrentTransformIntoVertices()
  guide.parent = origin
  var guideMaterial = new BABYLON.StandardMaterial('guideMaterial', scene)
  guideMaterial.diffuseColor = new BABYLON.Color3(0.75, 0.25, 0.5)
  guideMaterial.alpha = 0.8
  guide.material = guideMaterial

  // Set origin rotation direction to go towards dest
  const axisM = new BABYLON.Vector3()
  let angleM = 0

  // Ranndom junk TODO: sort this out in the real implementation
  let myAngle = 0
  const myAxis = new BABYLON.Vector3()
  const scratch = new BABYLON.Quaternion()
  const scratch2 = new BABYLON.Quaternion()
  const scratchVector = new BABYLON.Vector3()
  let moveForward = false

  const straightenShip = () => {
      // Combine straightening the ship AND the ship's rotation => ship's rotation quaternion.
      // This is not movement rotation. This is local to the ship.
      // TODO: Can move this into space bar only?
      ship.position.normalizeToRef(myAxis) // TODO: Does copy matter? And does normalization matter?
      ship.alignWithNormal(myAxis)
      scratch2.copyFrom(ship.rotationQuaternion)
      BABYLON.Quaternion.RotationAxisToRef(myAxis, myAngle, scratch)
      scratch.multiplyToRef(scratch2, ship.rotationQuaternion)
  }
  straightenShip()

  const recomputeGreatCircle = () => {
      // Set guide sphere directly in front of ship
      ship.getDirectionToRef(BABYLON.Axis.Z, scratchVector)
      scratchVector.scaleInPlace(0.01)
      ship.position.addToRef(scratchVector, guide.position)

      // Determine the axis for movement rotation
      BABYLON.Vector3.CrossToRef(ship.position, guide.position, axisM)
      axisM.normalize()
      angleM = 0
  }
  setTimeout(() => {
      recomputeGreatCircle()
  }, 0) // TODO: (Make better) Cannot compute the great circle until at least one frame has been rendered

  scene.beforeRender = () => {
      // Have q, e, and space be the rotational controls for now
      if (map['q']) {
          myAngle -= 0.05
          recomputeGreatCircle()
      }
      if (map['e']) {
          myAngle += 0.05
          recomputeGreatCircle()
      }
      if (map[' ']) {
          moveForward = true
          ship.parent = origin
          // Move the guide along the great circle
          angleM += 0.01
          BABYLON.Quaternion.RotationAxisToRef(axisM, angleM, origin.rotationQuaternion)

          // Follow the guide
          BABYLON.Vector3.TransformCoordinatesToRef(guide.position, guide.parent.getWorldMatrix(), scratchVector)
          // ship.lookAt(scratchVector)
          // ship.translate(BABYLON.Axis.X, 0.01)
      }
      straightenShip()
  }
  scene.afterRender = () => {
      if (moveForward) {
          BABYLON.Vector3.TransformCoordinatesToRef(ship.position, ship.parent.getWorldMatrix(), scratchVector)
          ship.parent = null
          ship.position.copyFrom(scratchVector)
          angleM = 0
          moveForward = false
      }
  }

  return scene;
};
