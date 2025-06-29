// ./client/src/pages/home.jsx
import {useEffect, useRef} from "react";
import { Layout } from "antd";
import * as THREE from "three";
import { loadFBXModel } from "../scripts/LoadFBXModel";

export default function Home() {
  const containerRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.set(0, 1, 3);

    // Load FBX Model
    loadFBXModel("/Portfolio-Website/assets/models/whiteFlower.fbx", new THREE.Vector3(0, 0, 0), scene, 1)
      .then((model) => {
        console.log("Model loaded:", model);
      })
      .catch((err) => {
        console.error("Model loading failed:", err);
      });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}