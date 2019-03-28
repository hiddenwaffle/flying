// Movement via


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

    // Camera stationed outside
    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-2, 1.4, 1.4), scene);
    // var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-3, 0, 0), scene);
    camera.speed = 0.25
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

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

    // The box with the ray facing front
    var ship = BABYLON.MeshBuilder.CreateBox('ship', {}, scene);
    ship.scaling = new BABYLON.Vector3(0.1, 0.02, 0.1)
    ship.bakeCurrentTransformIntoVertices()
    // Ensure that quaternions are used for rotations (going to use for rotations around y-axis)
    ship.rotationQuaternion = new BABYLON.Quaternion()
    var shipMaterial = new BABYLON.StandardMaterial('shipMaterial', scene)
    shipMaterial.alpha = 0.95
    ship.material = shipMaterial
    // "top"
    var top = BABYLON.MeshBuilder.CreateBox('top', {}, scene)
    top.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
    top.position.y = 0.05 / 2
    top.bakeCurrentTransformIntoVertices()
    top.parent = ship

    // Starting position
    let rho = 1
    let phi = 2 * Math.random() * Math.PI // 0 <=   phi <= 2PI
    let theta = Math.random() * Math.PI // 0 <= theta <=  PI
    let myAngle = 0
    asCartesianToRef(rho, phi, theta, ship.position)

    // Origin sphere at 0, 0, 0
    var origin = BABYLON.MeshBuilder.CreateSphere('origin', { segments: 16 }, scene);
    origin.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
    origin.bakeCurrentTransformIntoVertices()
    origin.rotationQuaternion = new BABYLON.Quaternion()

    // Cache variables for beforeRender callback, use with caution
    const q1cache = new BABYLON.Quaternion()
    const q2cache = new BABYLON.Quaternion()
    const v1cache = new BABYLON.Vector3()
    const v2cache = new BABYLON.Vector3()
    const v3cache = new BABYLON.Vector3()
    const m1cache = new BABYLON.Matrix()
    const zaxis = new BABYLON.Vector3(0, 0, 1)

    const turnSpeed = 0.05
    const moveSpeed = 0.05

    scene.beforeRender = () => {
        if (map['a']) {
        }
        if (map['d']) {
        }
        if (map['w']) {
        }
    }
    scene.afterRender = () => {
    }

    return scene;
};
