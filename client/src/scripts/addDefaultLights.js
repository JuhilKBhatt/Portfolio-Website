// ./client/src/scripts/addDefaultLights.js
import * as THREE from 'three';

/**
 * Adds a standard lighting setup to the scene.
 * @param {THREE.Scene} scene
 */
export function addDefaultLights(scene) {
  // Main directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  // Backlight
  const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
  backLight.position.set(-5, 5, -5);
  scene.add(backLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(0, 2, -5);
  scene.add(fillLight);
}