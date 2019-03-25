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

var createScene = function () {
    console.clear()

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 2, -3), scene);
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
    ship.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    ship.bakeCurrentTransformIntoVertices()
    var shipMaterial = new BABYLON.StandardMaterial('shipMaterial', scene)
    shipMaterial.alpha = 0.8
    ship.material = shipMaterial

    // Point toward front of ship
    var rayLength = 0.3
    var localMeshOrigin = new BABYLON.Vector3(0, 0, -0.04)
    var localMeshDirection = new BABYLON.Vector3(0, 0, 1)
    var ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), 1); // Values do not seem to matter when attached to mesh?
    var rayHelper = new BABYLON.RayHelper(ray);
    rayHelper.show(scene);
    rayHelper.attachToMesh(ship, localMeshDirection, localMeshOrigin, rayLength)

    // Destination
    var dest = BABYLON.MeshBuilder.CreateSphere('dest', { segments: 16 }, scene);
    dest.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    dest.bakeCurrentTransformIntoVertices()
    var destMaterial = new BABYLON.StandardMaterial('destMaterial', scene)
    destMaterial.diffuseColor = new BABYLON.Color3(1.0, 0, 1)
    destMaterial.alpha = 0.8
    dest.material = destMaterial

    // Starting position
    var radius = 1
    var theta = Math.random() * 2 * Math.PI
    var phi = Math.acos(Math.random() * 2 - 1)
    getCartToRef(radius, theta, phi, ship.position)

    // Starting direction
    var destTheta = Math.random() * 2 * Math.PI
    var destPhi = Math.acos(Math.random() * 2 - 1)
    getCartToRef(radius, destTheta, destPhi, dest.position)

    // Plane
    var sourcePlane = BABYLON.Plane.FromPoints(
        BABYLON.Vector3.Zero(),
        ship.position,
        dest.position
    )
    var plane = BABYLON.MeshBuilder.CreatePlane(
        'plane',
        { sourcePlane: sourcePlane, size: 2.5, updatable: true },
        scene
    )
    var planeMaterial = new BABYLON.StandardMaterial('planeMaterial', scene)
    planeMaterial.diffuseColor = new BABYLON.Color3(0.25, 1, 0.25)
    planeMaterial.alpha = 0.4
    planeMaterial.backFaceCulling = false
    plane.material = planeMaterial

    // Origin sphere at 0, 0, 0
    var origin = BABYLON.MeshBuilder.CreateSphere('halfway', { segments: 16 }, scene);
    origin.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
    origin.bakeCurrentTransformIntoVertices()
    origin.rotationQuaternion = new BABYLON.Quaternion()

    // Halfway point
    var halfway = BABYLON.MeshBuilder.CreateSphere('halfway', { segments: 16 }, scene);
    halfway.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
    halfway.bakeCurrentTransformIntoVertices()
    var halfwayMaterial = new BABYLON.StandardMaterial('halfwayMaterial', scene)
    halfwayMaterial.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5)
    halfwayMaterial.alpha = 0.8
    halfway.material = halfwayMaterial
    halfway.parent = origin

    // Start halfway at ship
    getCartToRef(radius, theta, phi, halfway.position)
    // Set origin rotation direction to go towards dest
    const axis = BABYLON.Vector3.Cross(ship.position, dest.position).normalize()
    let angle = 0

    // TODO: Have look the direction of the dest
    const halfwayPosition1 = BABYLON.Vector3.TransformCoordinates(halfway.position, halfway.parent.getWorldMatrix())
    console.log('before   ', halfwayPosition1)
    angle += 0.05
    BABYLON.Quaternion.RotationAxisToRef(axis, angle, origin.rotationQuaternion)
    setTimeout(() => {
        const halfwayPosition2 = BABYLON.Vector3.TransformCoordinates(halfway.position, halfway.parent.getWorldMatrix())
        console.log('after   ', halfwayPosition2)
        const diffvec = halfwayPosition2.subtract(halfwayPosition1).normalize()
        console.log('diffvec ', diffvec)

        // Show diff vector
        var diffRay = new BABYLON.Ray(ship.position, diffvec, 0.3)
        var diffRayHelper = new BABYLON.RayHelper(diffRay)
        diffRayHelper.show(scene, new BABYLON.Color3(1, 0, 1))
    }, 0)

    // TODO: The bottom of ship should face the origin
    // TODO: Then have ship rotate around axis from origin to cube, "a" and "d"
    // TODO: "w" and "s" have the ship move in that direction, and then be brought down the plane

    scene.beforeRender = () => {
        // Run the "halfway" sphere along the geodesic
        angle += 0.01
        BABYLON.Quaternion.RotationAxisToRef(axis, angle, origin.rotationQuaternion)

        // TODO: This ought to rotate in world space around the vector from origin to ship, but
        //       that depends on how the ship is being positioned at any given point. The bottom of
        //       the ship should face the origin before this line runs.
        ship.rotation.y += 0.01
    }

    return scene;
};
