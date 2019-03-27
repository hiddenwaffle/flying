//-----------------------------------------------------------------//
//
// Must figure out how to parent the ship to an origin sphere,
// rotate the sphere in such a way that it expresses the direction
// that the ship is traveling.
//
// One quaternion would represent the location of the ship on
// the world sphere.
// That quaternion's axis must be recalculated each time the ship changes
// direction (a or d key). The angle would be reset to 0.
// (why wasn't something like this working before? was it a ship facing issue?)
//
// Perhaps it did not work because when the movement rotation is going,
// the angle of the facing rotation is still the old angle.
// For each movement rotation, the facing rotation axis must be recomputed
// with the cross product of the ship and the guide from the origin.
// And then the facing rotation angle must be set to 0.
// The facing axis vector is the same as the ship position (in world space?)
//
//-----------------------------------------------------------------//

// Helper function from:
// http://www.html5gamedevs.com/topic/15079-rotating-a-vector/
// https://www.babylonjs-playground.com/#FY4Q8
function rotateVectorToRef(vect, quat, ref) {
  const matr = new BABYLON.Matrix()
  quat.toRotationMatrix(matr)
  BABYLON.Vector3.TransformCoordinatesToRef(vect, matr, ref)
}

// Helper function from:
// http://www.html5gamedevs.com/topic/21494-keep-childs-world-position-when-parenting/
// https://www.babylonjs-playground.com/#28IXSE#13
function parentMesh(child, parent) {
var rotation = BABYLON.Quaternion.Identity();
var position = BABYLON.Vector3.Zero();
var m1 = BABYLON.Matrix.Identity();
var m2 = BABYLON.Matrix.Identity();

parent.getWorldMatrix().decompose(BABYLON.Vector3.Zero(), rotation, position);
rotation.toRotationMatrix(m1);
m2.setTranslation(position);
m2.multiplyToRef(m1, m1);
var invParentMatrix = BABYLON.Matrix.Invert(m1);
var m = child.getWorldMatrix().multiply(invParentMatrix);
m.decompose(BABYLON.Vector3.Zero(), child.rotationQuaternion, position);
invParentMatrix = BABYLON.Matrix.Invert(parent.getWorldMatrix());
var m = child.getWorldMatrix().multiply(invParentMatrix);
m.decompose(BABYLON.Vector3.Zero(), BABYLON.Quaternion.Identity(), position);

child.position.x = position.x * parent.scaling.x;
child.position.y = position.y * parent.scaling.y;
child.position.z = position.z * parent.scaling.z;

if (parent.scaling.x != 1 || parent.scaling.y != 1 || parent.scaling.z != 1) {
  var children = parent.getChildren();
  var scaleFixMesh;
  for (var i = 0; i < children.length; i++) {
    if (children[i].name == 'scaleFixMesh') {
      scaleFixMesh = children[i];
      //alert("found");
      break;
    }
  }
  if (scaleFixMesh == undefined) {
    scaleFixMesh = new BABYLON.Mesh('scaleFixMesh', parent.getScene());
    scaleFixMesh.parent = parent;
  }
  scaleFixMesh.scaling.x = 1 / parent.scaling.x;
  scaleFixMesh.scaling.y = 1 / parent.scaling.y;

  child.parent = scaleFixMesh;
} else {
  child.parent = parent;
}
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

  // Look at the sphere from an angle to see the rotation better
  var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(1.75, 1.75, -1.75), scene);
  camera.speed = 0.25
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // Globe
  var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16 }, scene);
  sphere.scaling = new BABYLON.Vector3(2, 2, 2)
  sphere.bakeCurrentTransformIntoVertices()
  var sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', scene);
  sphereMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.25, 1);
  sphereMaterial.wireframe = true;
  sphere.material = sphereMaterial;

  // Origin box at 0, 0, 0
  var origin = BABYLON.MeshBuilder.CreateBox('origin', { }, scene);
  origin.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  origin.bakeCurrentTransformIntoVertices()
  origin.rotationQuaternion = new BABYLON.Quaternion()

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

  // Place ship at north pole
  ship.parent = origin
  ship.position.y = 1

  // Line from origin to ship
  var originToShipRay = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var originToShipRayHelper = new BABYLON.RayHelper(originToShipRay)
  originToShipRayHelper.show(scene)
  originToShipRayHelper.attachToMesh(
      origin,
      new BABYLON.Vector3(0, 1, 0), // direction in local mesh
      new BABYLON.Vector3(0, 0, 0), // origin in local mesh
      1 // length
  )

  // "movement" rotation for origin box
  oAxis = new BABYLON.Vector3(1, 0, 0)
  oAngle = 0

  // Draw visualization of oAxis - initially in the direction of the +x axis
  var oAxisRay = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var oAxisRayHelper = new BABYLON.RayHelper(oAxisRay)
  oAxisRayHelper.show(scene, new BABYLON.Color3(0, 0.5, 1)) // skyblue
  // Draw negative direction
  var oAxisRayN = new BABYLON.Ray(new BABYLON.Vector3(1, 0, 0), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
  var oAxisRayNHelper = new BABYLON.RayHelper(oAxisRayN)
  oAxisRayNHelper.show(scene, new BABYLON.Color3(1, 0.5, 0)) // orange

  // // "facing" rotation for origin box (axis is origin to ship)
  var fAxis = new BABYLON.Vector3(0, 1, 0)
  var fAngle = 0

  // Cache variables for beforeRender callback, use with caution
  const q1cache = new BABYLON.Quaternion()
  const q2cache = new BABYLON.Quaternion()
  const v1cache = new BABYLON.Vector3()
  const m1cache = new BABYLON.Matrix()

  let doAfterRender = false
  scene.beforeRender = () => {
      // Compute movement rotation
      if (map['w']) {
          oAngle += 0.02
      }
      if (map['s']) {
          oAngle -= 0.02
      }
      if (map['a'] || map['d']) {
          let rotation
          if (map['a']) {
              fAngle -= 0.02
              rotation = -0.02
          }
          if (map['d']) {
              fAngle += 0.02
              rotation = 0.02
          }

          // Get ship location in world space
          BABYLON.Vector3.TransformCoordinatesToRef(ship.position, ship.parent.getWorldMatrix(), v1cache)
          // Create a quaternion to rotate <rotation> degrees around the vector, then do the rotation
          console.log('v1cache', v1cache, 'oAxis', oAxis)
          BABYLON.Quaternion.RotationAxisToRef(v1cache, rotation, q1cache)
          rotateVectorToRef(oAxis, q1cache, oAxis)
          oAxis.normalize()
      }
      // Apply the rotation of oAxis and oAngle to do forward "movement'"
      BABYLON.Quaternion.RotationAxisToRef(oAxis, oAngle, origin.rotationQuaternion)

      // Visualize the oAxis
      // TODO: Why is rotation of oAxis, at north pole for example, moving faster than box?
      // TODO: Why is oAxis moving when pushin W only increasing the oAngle?
      // TODO: Ok to do this every frame?
      oAxisRayHelper.attachToMesh(
          origin,
          oAxis,                        // direction in local mesh
          new BABYLON.Vector3(0, 0, 0), // origin in local mesh
          2 // length
      )
      oAxis.scaleToRef(-1, v1cache)
      oAxisRayNHelper.attachToMesh(
          origin,
          v1cache,               // direction in local mesh
          new BABYLON.Vector3(0, 0, 0), // origin in local mesh
          2 // length
      )
  }
  scene.afterRender = () => {
      if (doAfterRender) {
          doAfterRender = false
      }
  }

  return scene;
};
