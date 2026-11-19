// import * as THREE from 'three/webgpu';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class ThreeEngine {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  debugOrbit?: OrbitControls;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.scene.background = new THREE.Color('red');
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    this.camera.position.z = 5;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight)
    });

    // this.debugOrbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.debugScene()
  }

  debugScene() {
    const sphere = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ wireframe: true, color: 'blue' })
    );
    this.scene.add(sphere);

    // this.scene.position.z = -10
  }

  render() {
    // console.log(this.render)
    this.renderer.render(this.scene, this.camera);
    if (this.debugOrbit) this.debugOrbit.update()
  }

}