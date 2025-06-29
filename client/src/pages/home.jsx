// ./client/src/pages/home.jsx

import { useEffect, useRef } from "react";
import { Layout } from "antd";
import * as THREE from "../scripts/build/three.module.js";
import { OrbitControls } from "../scripts/build/OrbitControls.js";
import { loadFBXModel } from "../scripts/loadFBXModel.js"; // Import FBXLoader if needed

export default function Home() {
  const containerRef = useRef();

  useEffect(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(2, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // White Flower Model
    loadFBXModel(
      "public/models/whiteFlower.fbx",
      new THREE.Vector3(0, 0, 0),
      scene,
      (model) => {
        model.scale.set(0.01, 0.01, 0.01); // Adjust scale as needed
        console.log("White flower model loaded:", model);
      }
    );

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
  );
}