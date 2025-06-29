import * as THREE from './build/three.module.js';
import { GLTFLoader } from './build/GLTFLoader.js';

/**
 * Loads a GLB model into the scene.
 * @param {string} modelPath - Path to the .glb file (relative to /public or imported path).
 * @param {THREE.Vector3} location - Position where the model will be placed.
 * @param {THREE.Scene} scene - The scene to which the model will be added.
 * @param {function} onLoaded - Optional callback to run when model is loaded.
 */
function loadGLBModel(modelPath, location, scene, onLoaded) {
  const loader = new GLTFLoader();

  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.position.copy(location);
      scene.add(model);

      if (onLoaded) {
        onLoaded(model);
      }

      console.log('GLB model loaded successfully:', modelPath);
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`GLB model ${modelPath} loading: ${percentComplete.toFixed(2)}%`);
      } else {
        console.log(`GLB model ${modelPath} loading...`);
      }
    },
    (error) => {
      console.error('Error loading GLB model:', modelPath, error);
    }
  );
}

export { loadGLBModel };