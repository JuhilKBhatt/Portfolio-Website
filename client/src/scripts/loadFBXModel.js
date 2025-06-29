// ./client/src/scripts/LoadFBXModel.js

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

// Cache for storing the promise
const rawModelLoadPromises = new Map();

/**
 * Loads and adds an FBX model to a scene at a given position and scale.
 *
 * @param {string} modelPath - Path to the FBX model file (relative to /public or static assets).
 * @param {THREE.Vector3} location - Position to place this instance of the model.
 * @param {THREE.Scene} scene - The scene to add this instance of the model to.
 * @param {number} [scale=0.0005] - Uniform scale factor for this instance of the model.
 * @returns {Promise<THREE.Object3D>} A promise that resolves with the configured model instance.
 */
export function loadFBXModel(modelPath, location, scene, scale = 0.0005) {
  let rawModelPromise;

  if (rawModelLoadPromises.has(modelPath)) {
    rawModelPromise = rawModelLoadPromises.get(modelPath);
  } else {
    rawModelPromise = new Promise((resolve, reject) => {
      const loader = new FBXLoader();
      loader.load(
        modelPath,
        (loadedObject) => {
          resolve(loadedObject);
        },
        undefined,
        (error) => {
          console.error(`Error loading model ${modelPath}:`, error);
          rawModelLoadPromises.delete(modelPath);
          reject(error);
        }
      );
    });
    rawModelLoadPromises.set(modelPath, rawModelPromise);
  }

  return rawModelPromise.then(rawModel => {
    const modelInstance = rawModel.clone();
    modelInstance.position.copy(location);
    modelInstance.scale.set(scale, scale, scale);
    scene.add(modelInstance);
    return modelInstance;
  });
}