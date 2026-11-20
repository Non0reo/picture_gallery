// import * as THREE from 'three/webgpu';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import { CustomWindow } from '../windows';
import mainMonitor from '../utils/monitor';

export default class ThreeEngine {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  debugOrbit?: OrbitControls;

  private _dracoLoader = new DRACOLoader();
  private _gltfLoader = new GLTFLoader()
  private _attachedWindow?: CustomWindow;
  private _isAttachedToMainInstance;

  constructor(representsMainInstance: boolean = false) {
    this._isAttachedToMainInstance = representsMainInstance;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, mainMonitor.size.width / mainMonitor.size.height, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // this.renderer.setScissorTest(true);
    // this.renderer.setViewport(0, 0, mainMonitor.size.width, mainMonitor.size.height);
    // this.renderer.setScissor(0, 0, mainMonitor.size.width, mainMonitor.size.height)

    // this.scene.background = new THREE.Color('red');
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    this.camera.position.z = 5;

    window.addEventListener('resize', () => {
      // this.camera.aspect = window.innerWidth / window.innerHeight;
      // this.camera.updateProjectionMatrix();
      this.camera.aspect = mainMonitor.size.width / mainMonitor.size.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight)
    });

    this._dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.9/');
    this._gltfLoader.setDRACOLoader(this._dracoLoader);

    // this.debugOrbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.debugScene();

    // this.renderer.setAnimationLoop(() => this.render())

    
  }

  attachWindow(customWindow: CustomWindow, isMainInstance: boolean = false) {
    this._attachedWindow = customWindow;
    this._isAttachedToMainInstance = isMainInstance;
  }

  debugScene() {
    if (this._isAttachedToMainInstance) this._natureScene();
    else this._digitalScene();
  }

  render() {

    if (this._attachedWindow) {

      const { x, y } = this._attachedWindow.position;
      const { width, height } = this._attachedWindow.size;

      this.camera.setViewOffset(mainMonitor.size.width, mainMonitor.size.height, x, y, width, height);
    }

    this.renderer.render(this.scene, this.camera);
    if (this.debugOrbit) this.debugOrbit.update()
  }

  private _digitalScene() {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshBasicMaterial({ wireframe: true, color: 'pink' })
    );
    this.scene.add(sphere);

    this._gltfLoader.load( 'models/TV.glb',
      gltf => {

        this.scene.add( gltf.scene );

      },
      undefined,
      error => {
        console.error(error)
      }
    );
  }

  private _natureScene() {
    const sphere = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ wireframe: true, color: 'yellow' })
    );
    this.scene.add(sphere);

    this._gltfLoader.load( 'models/TV.glb',
      gltf => {

        this.scene.add( gltf.scene );

      },
      undefined,
      error => {
        console.error(error)
      }
    );
  }

}