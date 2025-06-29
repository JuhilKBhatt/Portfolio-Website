// ./client/src/pages/home.jsx

import { useEffect, useRef } from "react";
import * as THREE from "../scripts/build/three.module.js";
import { OrbitControls } from "../scripts/build/OrbitControls.js";
import { loadFBXModel } from "../scripts/loadFBXModel.js";

export default function Home() {
  const containerRef = useRef();

  useEffect(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(5, 12, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Orbit Controls
    const controls = new OrbitControls(camera, containerRef.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xd5debf, 0.1);
    containerRef.current.appendChild(renderer.domElement);

    let mixer;

    loadFBXModel(
      "models/AvatarWaving.fbx",
      new THREE.Vector3(0, -1, 0),
      scene,
      (model, loadedMixer) => {
        model.scale.set(1, 1, 1);
        mixer = loadedMixer;
      }
    );

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      controls.update();

      if (mixer) {
        mixer.update(delta);
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