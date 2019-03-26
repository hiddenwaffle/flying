// Helper function from:
// https://www.babylonjs-playground.com/#MYY6S#7
// TODO: Is this left-handed or right-handed? Because z = r * sin instead of r * cos...
function getCartToRef(radius, theta, phi, ref) {
	var lat = theta;
	var lon = phi;
	var x = radius * Math.cos(lat) * Math.cos(lon);
	var y = radius * Math.cos(lat) * Math.sin(lon);
	var z = radius * Math.sin(lat);
	return ref.set(x, y, z);
}

// // Helper function from:
// // http://www.html5gamedevs.com/topic/7599-convert-global-coordinates-to-local-coordinates/
// function globalToLocal(vector, mesh) {
//     var m = new BABYLON.Matrix();
//     mesh.getWorldMatrix().invertToRef(m);
//     return BABYLON.Vector3.TransformCoordinates(vector, m);
// }

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

    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 2, -3), scene);
    camera.speed = 0.25
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // World sphere
    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16 }, scene);
    sphere.scaling = new BABYLON.Vector3(2, 2, 2)
    sphere.bakeCurrentTransformIntoVertices()
    var sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', scene);
    sphereMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.25, 1);
    sphereMaterial.wireframe = true;
    sphere.material = sphereMaterial;

    // Origin sphere at 0, 0, 0
    var origin = BABYLON.MeshBuilder.CreateSphere('origin', { segments: 16 }, scene);
    origin.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
    origin.bakeCurrentTransformIntoVertices()
    origin.rotationQuaternion = new BABYLON.Quaternion()

    // "Ship" - the box with the ray facing front
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

    // Ship's starting position
    var radius = 1
    var theta = Math.random() * 2 * Math.PI
    var phi = Math.acos(Math.random() * 2 - 1)
    getCartToRef(radius, theta, phi, ship.position)

    // "guide" sphere
    var guide = BABYLON.MeshBuilder.CreateSphere('halfway', { segments: 16 }, scene);
    guide.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
    guide.bakeCurrentTransformIntoVertices()
    var guideMaterial = new BABYLON.StandardMaterial('guideMaterial', scene)
    guideMaterial.diffuseColor = new BABYLON.Color3(0.75, 0.25, 0.5)
    guideMaterial.alpha = 0.8
    guide.material = guideMaterial

    let originAngle = 0
    let originAxis = new BABYLON.Vector3()

    let myAngle = 0
    const scratch = new BABYLON.Quaternion()
    const scratch2 = new BABYLON.Quaternion()
    const scratchVector = new BABYLON.Vector3()

    scene.afterRender = () => {
        if (map['a'] || map['d']) {
            if (map['a']) {
                myAngle -= 0.05
            }
            if (map['d']) {
                myAngle += 0.05
            }

            // "Bake" ( I think that is the term?) position of where the ship was rotated to
            if (ship.parent) {
                // Bake the current ship position
                BABYLON.Vector3.TransformCoordinatesToRef(ship.position, ship.parent.getWorldMatrix(), scratchVector)
                ship.parent = null
                ship.position.copyFrom(scratchVector)
                // TODO: Bake the rotation...?
            }

            // Starting from this position, calculate the turn
            originAngle = 0
            // Reset guide sphere to be in front of the ship, but also still on the sphere
            guide.position.copyFrom(ship.position)
            ship.getDirectionToRef(BABYLON.Axis.Z, scratchVector)
            scratchVector.scaleInPlace(0.3) // Only to be able to see it well when debug is on, could remove this
            guide.position.addInPlace(scratchVector)
            // Set origin rotation direction to go towards dest
            BABYLON.Vector3.CrossToRef(ship.position, guide.position, originAxis)
            originAxis.normalize()
            ship.parent = origin
            BABYLON.Quaternion.RotationAxisToRef(originAxis, originAngle, origin.rotationQuaternion)
        }
        // Multiply rotation around origin to ship ("turning") and the one that
        // "straightened" the ship top to be out from origin (alignWithNormal call)

        // Ensure that the ship is straight
        ship.position.normalizeToRef(ship.position) // TODO: Does copy matter? And does normalization matter?
        ship.alignWithNormal(ship.position)
        scratch2.copyFrom(ship.rotationQuaternion)
        // Combine both quaternions into the ship's quaternion
        BABYLON.Quaternion.RotationAxisToRef(ship.position, myAngle, scratch)
        scratch.multiplyToRef(scratch2, ship.rotationQuaternion)

        if (map['w']) {
            console.log('w', ship.getDirection(BABYLON.Axis.Z))
            originAngle += 0.05
            BABYLON.Quaternion.RotationAxisToRef(originAxis, originAngle, origin.rotationQuaternion)
        }
    }
    // scene.afterRender = () => {
    //     if (map['a'] || map['d']) {
    //         BABYLON.Vector3.TransformCoordinatesToRef(ship.position, ship.parent.getWorldMatrix(), scratchVector)
    //         ship.parent = null
    //         ship.position.copyFrom(scratchVector)
    //     }
    // }

    return scene;
};
