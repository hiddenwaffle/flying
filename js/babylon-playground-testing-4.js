// This is a continuation of testing #2

// Helper function from:
// https://www.babylonjs-playground.com/#MYY6S#7
function asCartesianToRef(rho, phi, theta, ref) {
    // This is how it looks when +X is right, +Y is up, and +Z is forward:
    const x = rho * Math.cos(theta) * Math.sin(phi)
    const y = rho * Math.cos(phi)
    const z = rho * Math.sin(theta) * Math.sin(phi)

    ref.set(x, y, z)
}

// Helper function from:
// http://www.geom.uiuc.edu/docs/reference/CRC-formulas/node42.html
function asSphericalToRef(x, y, z, ref) {
    // TODO: Prevent division by zero
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

    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 0, -3), scene);
    camera.speed = 0.25
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Params: name, subdivs, size, scene
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
    var rho = 1
    var phi   = 2 * Math.random() * Math.PI // 0 <=   phi <= 2PI
    var theta =     Math.random() * Math.PI // 0 <= theta <=  PI
    asCartesianToRef(rho, phi, theta, ship.position)

    let applyRotation = false
    let myAngle = 0
    let diffvec = null

    const scratch = new BABYLON.Quaternion()
    const scratch2 = new BABYLON.Quaternion()
    const scratchVector = new BABYLON.Vector3()
    const myAxis = new BABYLON.Vector3()

    function debug() {
        asCartesianToRef(rho, theta, phi, scratchVector)
        console.log('(', phi, ',', theta, ') vs:', scratchVector)
    }

    scene.beforeRender = () => {
        // TESTING HERE ---------
        if (map['a']) { phi -= 0.01   ; debug()}
        if (map['d']) { phi += 0.01   ; debug()}
        if (map['w']) { theta -= 0.01 ; debug()}
        if (map['s']) { theta += 0.01 ; debug()}
        asCartesianToRef(rho, theta, phi, ship.position)
        // NOTES:
        // ***Kinda like the sphere is rotated left 90 degrees
        //  North Pole                = ( <anything>       ,       0       )
        //  South Pole                = ( <anything>       , Math.PI       )
        //  (Prime Meridian, Equator) = (    Math.PI * 1/2 , Math.PI * 1/2 ) <-- away from camera
        //  (   "Left Side", Equator) = (    Math.PI       , Math.PI * 1/2 )
        //  (Prime Meridian, Equator) = (    Math.PI * 3/2 , Math.PI * 1/2 ) <-- facing camera
        //  (  "Right Side", Equator) = (    Math.PI * 2   , Math.PI * 1/2 )
        // TESTING HERE ---------

        // Multiply rotation around origin to ship ("turning") and the one that
        // "straightened" the ship top to be out from origin (alignWithNormal call)

        // Re-straighten the ship
        ship.position.normalizeToRef(myAxis) // TODO: Does copy matter? And does normalization matter?
        ship.alignWithNormal(myAxis)
        scratch2.copyFrom(ship.rotationQuaternion)

        // Combine the quaternions into the ship's quaternion
        BABYLON.Quaternion.RotationAxisToRef(myAxis, myAngle, scratch)
        scratch.multiplyToRef(scratch2, ship.rotationQuaternion)


        // Have q, e, and space be the rotational controls for now

        // if (map[' ']) {
        //     // Calculate moving in the current direction one frame (TODO: Use time)
        //     ship.translate(BABYLON.Axis.Z, 0.05, BABYLON.Space.LOCAL);
        //     // TODO: Instead of directly doing above, move the guide along the geodesic
        //     //       Then translate the ship to the guide
        //     //       Do not recompute the geodesic unless turning with A or D keys

        //     // "drop" the ship towards the origin so it is the expected distance away.
        //     // Good thing 1 is the distance used here, can just normalize...
        //     ship.position.normalize()
        //     // TODO: Possibility of rotating WITHOUT parenting by computing sin/cos of theta/phi changes
        //     // TODO: Quaternion slerping?
        //     // TODO: Maybe it is possible to get the axis of rotation, keep it constant, and
        //     //       update it only when turning? Angle mvmt/frame is fixed rather than accumulating
        // }
        // if (map['q']) {
        //     myAngle -= 0.05
        //     console.log('ship facing: ', myAngle)
        // }
        // if (map['e']) {
        //     myAngle += 0.05
        //     console.log('ship facing: ', myAngle)
        // }
    }

    return scene;
};
