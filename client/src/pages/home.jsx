// ./client/src/pages/home.jsx

import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { loadFBXModel } from "../scripts/loadFBXModel.js";
import "../styles/customHomePage.css";
import { addDefaultLights } from "../scripts/addDefaultLights.js";

export default function Home() {
  const containerRef = useRef();
  const [canvasPosition, setCanvasPosition] = useState({
    top: "90px",
    left: "200px",
  });

  useEffect(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(14, 50, 200);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xd5debf, 0);
    containerRef.current.appendChild(renderer.domElement);

    let mixer;

    loadFBXModel(
      "models/AvatarWavingGesture.fbx",
      new THREE.Vector3(10, -50, 0),
      scene,
      (model, loadedMixer) => {
        model.scale.set(0.5, 0.5, 0.5);
        mixer = loadedMixer;
      }
    );

    // LIGHTING SETUP
    addDefaultLights(scene);

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

    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const updateCanvasPosition = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCanvasPosition({ top: "90px", left: "calc(60% - 150px)" }); // Center-ish for mobile
      } else if (width < 1024) {
        setCanvasPosition({ top: "90px", left: "150px" });
      } else {
        setCanvasPosition({ top: "90px", left: "200px" }); // Desktop default
      }
    };

    updateCanvasPosition(); // Initial call
    window.addEventListener("resize", updateCanvasPosition);

    return () => {
      window.removeEventListener("resize", updateCanvasPosition);
    };
  }, []);

  return (
    <div className="home-container">
      {/* Text behind canvas */}
      <div className="home-text-box">
        <p>
          Hi, I'm <strong>Juhil Kalpeshkumar Bhatt</strong>.
          <br />
          Welcome to my portfolio — explore the projects to see what I've been building and experimenting with.
        </p>
      </div>

      {/* 3D canvas above the text */}
      <div 
        ref={containerRef}
        style={{
          top: canvasPosition.top,
          left: canvasPosition.left,
        }}
        className="home-canvas" />
    </div>
  );
}