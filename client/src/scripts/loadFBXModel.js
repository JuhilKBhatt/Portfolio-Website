// ./client/src/scripts/loadFBXModel.js

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

/**
 * Loads an FBX model into the scene.
 * @param {string} modelPath - Path to the FBX file.
 * @param {THREE.Vector3} location - Position to place the model.
 * @param {THREE.Scene} scene - The scene to add the model to.
 * @param {function} onLoaded - Callback(model, mixer) after loading.
 */
function loadFBXModel(modelPath, location, scene, onLoaded) {
  const loader = new FBXLoader();

  loader.load(
    modelPath,
    (object) => {
      object.position.copy(location);
      scene.add(object);

      // Set up animation mixer
      const mixer = new THREE.AnimationMixer(object);
      if (object.animations && object.animations.length > 0) {
        const action = mixer.clipAction(object.animations[0]);
        action.play();
      }

      if (onLoaded) {
        onLoaded(object, mixer);
      }

      console.log("FBX model loaded successfully:", modelPath);
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`FBX model ${modelPath} loading: ${percentComplete.toFixed(2)}%`);
      } else {
        console.log(`FBX model ${modelPath} loading...`);
      }
    },
    (error) => {
      console.error("Error loading FBX model:", modelPath, error);
    }
  );
}

export { loadFBXModel };