import './styles.css';
import * as THREE from 'three';
import { WindowsManager } from './windows';
import { invoke } from '@tauri-apps/api/core';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 5;

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight)
});


let mousePosition: [number, number] | null = null;

renderer.setAnimationLoop(time => {
  invoke('mouse_pos').then(value => mousePosition = value as [number, number]);
  invoke('subscribe_to_mouse_events');
  // windowManager.

  renderer.render( scene, camera );
});


const windowManager = new WindowsManager();
const addWindowButton = document.querySelector('.addWindow') as HTMLButtonElement;
const closeWindowsButton = document.querySelector('.closeAll') as HTMLButtonElement;

addWindowButton?.addEventListener('click', () => {
  windowManager.addWindow()
})


closeWindowsButton?.addEventListener('click', () => {
  windowManager.removeAll()
});


// if (import.meta.hot) {
//   console.log('test')
//   windowManager.removeAll()
// }



