// # 13
// It works completely

var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
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

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  var sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', scene);
  sphereMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.25, 1);
  sphereMaterial.wireframe = true;
  sphere.material = sphereMaterial;

  var cot = new BABYLON.TransformNode('cot')

  // The "visible ship", a cone arrow
  const arrow = BABYLON.MeshBuilder.CreateCylinder('arrow', { diameterTop: 0 }, scene)
  arrow.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05)
  arrow.rotate(BABYLON.Axis.X, Math.PI / 2)
  arrow.bakeCurrentTransformIntoVertices()
  arrow.position.y = 1
  arrow.parent = cot

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

  // // Satellite cam
  // var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-2, 1.4, 1.4), scene);
  // camera.speed = 0.25
  // camera.setTarget(BABYLON.Vector3.Zero());
  // camera.attachControl(canvas, true);

  // 3rd person view cam
  const camera = new BABYLON.UniversalCamera(
    'camera',
    new BABYLON.Vector3(0, 0, 0),
    scene
  )
  camera.attachControl(canvas, true)
  camera.parent = arrow
  camera.position.x = 0
  camera.position.y = 1
  camera.position.z = -1
  camera.setTarget(new BABYLON.Vector3(0, 0, 0))

  scene.beforeRender = () => {
      if (map['w']) {
          cot.rotate(BABYLON.Axis.X, 0.02)
      }
      if (map['a']) {
          cot.rotate(BABYLON.Axis.Y, -0.04)
      }
      if (map['d']) {
          cot.rotate(BABYLON.Axis.Y, 0.04)
      }
  }

  return scene;
};
