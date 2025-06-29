// ./client/src/pages/home.jsx

import { useEffect, useRef } from "react";
import { Layout } from "antd";
import * as THREE from "../scripts/build/three.module.js";
import { loadFBXModel } from "../scripts/loadFBXModel.js"; // Import FBXLoader if needed

export default function Home() {
  const containerRef = useRef();

  useEffect(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.5, 1000);
    camera.position.set(5, 12, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // White Flower Model
    loadFBXModel(
      "public/models/whiteFlower.fbx",
      new THREE.Vector3(0, -1, 0),
      scene,
      (model) => {
        model.scale.set(0.05, 0.05, 0.05);
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
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
  );
}