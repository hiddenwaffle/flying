import * as grassPng from './grass2.png'
import { wrapper } from './wrapper'
import { ui } from '../ui/ui'

function doTheThing() {
  const createScene = function () {
    var scene = new BABYLON.Scene(wrapper.engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
    // const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene)
    // camera.setTarget(BABYLON.Vector3.Zero());
    // camera.attachControl(wrapper.canvas, true);

    //Light direction is up and left
    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 0, 0);
    light.specular = new BABYLON.Color3(0, 1, 0);
    light.groundColor = new BABYLON.Color3(0, 1, 0);

    var grass0 = new BABYLON.StandardMaterial("grass0", scene);
    grass0.diffuseTexture = new BABYLON.Texture(grassPng, scene);

    var grass1 = new BABYLON.StandardMaterial("grass1", scene);
    grass1.emissiveTexture = new BABYLON.Texture(grassPng, scene);

    var grass2 = new BABYLON.StandardMaterial("grass2", scene);
    grass2.ambientTexture = new BABYLON.Texture(grassPng, scene);
    grass2.diffuseColor = new BABYLON.Color3(1, 0, 0);

    // Left Sphere
    var sphere0 = BABYLON.MeshBuilder.CreateSphere("sphere0", {}, scene);
    sphere0.position.x = -1.5;
    sphere0.material = grass0;

    // Middle
    var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {}, scene);
    sphere1.setParent(sphere0)
    sphere1.position.x = 1.5
    sphere1.material = grass1;
    sphere1.wireframe = true

    // Right
    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {}, scene);
    sphere2.setParent(sphere0)
    sphere2.position.x = 2.5
    sphere2.material = grass2;
    // sphere2.position.x = 1.5;

    // Rotation Animation Example:
    const testAnim = new BABYLON.Animation(
      'testAnim',
      'rotation.y',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    )
    testAnim.setKeys([
      { frame: 0,
        value: 0 },
      { frame: 60,
        value: Math.PI * 2.0 }
    ])
    sphere0.animations.push(testAnim)
    scene.beginAnimation(
      sphere0,
      0,
      120,
      true
    )
    const easingFunction = new BABYLON.SineEase()
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN)
    testAnim.setEasingFunction(easingFunction)

    const myRay = new BABYLON.Ray(
      new BABYLON.Vector3(1.1, 0, 1),
      new BABYLON.Vector3(0, 0, -2),
      1
    )
    // console.log('myRay', myRay)
    // console.log('0 intersect?', myRay.intersectsMesh(sphere0))
    // console.log('1 intersect?', myRay.intersectsMesh(sphere1))
    // console.log('2 intersect?', myRay.intersectsMesh(sphere2))
    // BABYLON.RayHelper.CreateAndShow(myRay, scene, new BABYLON.Color3(1, 1, 0.1))
    setTimeout(() => {
      const rayHelper = new BABYLON.RayHelper(myRay)
      rayHelper.show(scene)
      const hit = scene.pickWithRay(myRay)
      console.log('hit info:', hit.hit, hit.pickedMesh && hit.pickedMesh.id)
      console.log('more hit info:', hit)
      console.log('parent:', hit.pickedMesh && hit.pickedMesh.parent)
    }, 0)

    return scene;
  }
  const scene = createScene()
  wrapper.engine.runRenderLoop(() => {
    scene.render()
  })
}

class Gfx {
  doIt() {
    ui.doIt()
    doTheThing()
  }
}

export const gfx = new Gfx()
