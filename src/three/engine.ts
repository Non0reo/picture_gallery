// import * as THREE from 'three/webgpu';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import { CustomWindow } from '../windows';
import { positionUV, mainMonitor } from '../utils/monitor';

export default class ThreeEngine {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  debugOrbit?: OrbitControls;

  private _dracoLoader = new DRACOLoader();
  private _gltfLoader = new GLTFLoader()
  private _attachedWindow?: CustomWindow;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, mainMonitor.size.width / mainMonitor.size.height, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // this.renderer.setViewport(0, 0, mainMonitor.size.width / 200, mainMonitor.size.height);
    // console.log(this.renderer.getScissor(new THREE.Vector4()));
    // this.renderer.set
    // this.renderer.setScissorTest( true );

    this.scene.background = new THREE.Color('red');
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
    this.debugScene()
  }

  attachWindow(customWindow: CustomWindow) {
    this._attachedWindow = customWindow;
  }

  debugScene() {
    const sphere = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({ wireframe: true, color: 'blue' })
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



    // this.scene.position.z = -10
  }

  render() {


    

    if (this._attachedWindow) {

      // const uv = positionUV( this._attachedWindow.center ) ;
      // console.log(uv.x, uv.y)

      // const amplitude = 20;
      // this.camera.position.set(
      //   uv.x * amplitude - amplitude / 2,
      //  -( uv.y * amplitude - amplitude / 2),
      //   5
      // )

      // console.log(this.camera.position)

      // const { x, y } = this._attachedWindow.position.toLogical(mainMonitor.scaleFactor);
      // const { width, height } = this._attachedWindow.size.toLogical(mainMonitor.scaleFactor);
      const { x, y } = this._attachedWindow.position;
      const { width, height } = this._attachedWindow.size;

      // this.renderer.setScissor(-x, 0, x + width, y + height);
      // this.renderer.setScissor(x, y, width, y + height);
      // this.renderer.setScissor(0, 0, width, height)

      this.camera.setViewOffset(mainMonitor.size.width, mainMonitor.size.height, x, y, width, height)
      // console.log(this.renderer.getScissor(new THREE.Vector4()))
      
    }
    

    
    

    // console.log(this.render)
    this.renderer.render(this.scene, this.camera);
    if (this.debugOrbit) this.debugOrbit.update()
  }

}