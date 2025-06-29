// ./client/src/scripts/LoadFBXModel.js

import * as THREE from './build/three.module.js';
import { FBXLoader } from './build/FBXLoader.js';

/**
 * @param {string} modelPath
 * @param {THREE.Vector3} location
 * @param {THREE.Scene} scene
 * @param {function} onLoaded
 */

function loadFBXModel(modelPath, location, scene, onLoaded) {
    const loader = new FBXLoader();

    loader.load(
        modelPath,
        (object) => {
            object.position.copy(location);
            scene.add(object);

            const mixer = new THREE.AnimationMixer(object);
            if (object.animations.length > 0) {
                const action = mixer.clipAction(object.animations[0]);
                action.play();
            }

            if (onLoaded) {
                onLoaded(object, mixer);
            }
            console.log('FBX model loaded successfully:', modelPath);
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(`FBX model ${modelPath} loading: ${percentComplete.toFixed(2)}% loaded`);
            } else {
                console.log(`FBX model ${modelPath} loading: loading...`);
            }
        },
        (error) => {
            console.error('Error loading FBX model:', modelPath, error);
        }
    );
}

export { loadFBXModel };