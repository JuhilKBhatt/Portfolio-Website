// ./client/src/pages/home.jsx

import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { loadFBXModel } from "../scripts/loadFBXModel.js";

export default function Home() {
  const containerRef = useRef();

  useEffect(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(14, 120, 200);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xd5debf, 0.1);
    containerRef.current.appendChild(renderer.domElement);

    let mixer;

    loadFBXModel(
      "models/AvatarWavingGesture.fbx",
      new THREE.Vector3(10, 0, 0),
      scene,
      (model, loadedMixer) => {
        model.scale.set(0.5, 0.5, 0.5);
        mixer = loadedMixer;
      }
    );

    // LIGHTING SETUP
    // Main light (soft)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(3, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ambient light (overall soft light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Backlight for better outline
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Fill light from the side
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(0, 2, -5);
    scene.add(fillLight);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta / 1.5);
      }
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Text behind canvas */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          zIndex: 0,
          maxWidth: "500px",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          lineHeight: "1.6",
          color: "#222",
        }}
      >
        <p style={{ fontSize: "20px", margin: 0 }}>
          Hi, I'm <strong>Juhil Kalpeshkumar Bhatt</strong>.
          <br />
          Welcome to my portfolio — explore the projects I've been building and experimenting with.
        </p>
      </div>

      {/* 3D canvas above the text */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}