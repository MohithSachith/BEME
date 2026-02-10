import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    let scene, camera, renderer, points;
    const particleCount = 8000; 
    const mountNode = mountRef.current;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 12; 
      colors[i] = i % 3 === 0 ? 0.3 : 0.1; 
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = new THREE.Vector2();
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0005; 
      points.rotation.x += (mouse.y * 0.02 - points.rotation.x) * 0.05;
      points.rotation.y += (mouse.x * 0.02 - points.rotation.y) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountNode && renderer.domElement) { mountNode.removeChild(renderer.domElement); }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="lp-wrapper dark-setup">
      <div ref={mountRef} className="lp-canvas-container" />
      
      <div className="lp-content">
        <header className="lp-header-minimal">
          <div className="logo">BEME<span>.PRO</span></div>
          <p className="lp-tagline">BEHAVIORAL ENGINEERING SYSTEM</p>
        </header>

        <div className="lp-action-grid">
          <button className="lp-command-btn" onClick={() => onEnter('dashboard')}>
            <span className="btn-label">01</span>
            <div className="btn-main-info">
              <strong>MASTER DASHBOARD</strong>
              <small>HABITS, ANALYTICS & GOD-VIEW</small>
            </div>
            <span className="btn-arrow">→</span>
          </button>

          <button className="lp-command-btn" onClick={() => onEnter('notebook')}>
            <span className="btn-label">02</span>
            <div className="btn-main-info">
              <strong>NEURAL NOTEBOOK</strong>
              <small>DAILY REFLECTIONS & DEEP LOGS</small>
            </div>
            <span className="btn-arrow">→</span>
          </button>

          <button className="lp-command-btn" onClick={() => onEnter('alarm')}>
            <span className="btn-label">03</span>
            <div className="btn-main-info">
              <strong>SYSTEM ALARM</strong>
              <small>CIRCADIAN RHYTHMS & REMINDERS</small>
            </div>
            <span className="btn-arrow">→</span>
          </button>
          <button
  className="lp-command-btn pro-mode"
  onClick={() => onEnter("beme-pro")}
>
  <span className="btn-label">04</span>

  <div className="btn-main-info">
    <strong>BEME.PRO</strong>
    <small>WHERE HABITS BECOME COMMITMENTS</small>
    <span className="pro-sub">
      Alarm-bound · Auto-fail · No cheating
    </span>
  </div>

  <span className="btn-arrow">→</span>
</button>


         
        </div>
      </div>
    </div>
  );
};

export default LandingPage;