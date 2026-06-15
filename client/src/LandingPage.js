import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import "./LandingPage.css";

const LandingPage = ({ onEnter }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let scene, camera, renderer, points;
    const mountNode = mountRef.current;
    const particleCount = 8000;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 4;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    mountNode.appendChild(renderer.domElement);

    /* =====================================
       PARTICLES
    ===================================== */

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(
      particleCount * 3
    );

    const colors = new Float32Array(
      particleCount * 3
    );

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] =
        (Math.random() - 0.5) * 14;
      positions[i + 2] =
        (Math.random() - 0.5) * 14;

      colors[i] = 0.2;
      colors[i + 1] = 0.45;
      colors[i + 2] = 1;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(
        colors,
        3
      )
    );

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending:
        THREE.AdditiveBlending
    });

    points = new THREE.Points(
      geometry,
      material
    );

    scene.add(points);

    /* =====================================
       MOUSE
    ===================================== */

    const mouse = {
      x: 0,
      y: 0
    };

    const onMouseMove = (e) => {
      mouse.x =
        (e.clientX /
          window.innerWidth) *
          2 -
        1;

      mouse.y =
        -(e.clientY /
          window.innerHeight) *
          2 +
        1;
    };

    window.addEventListener(
      "mousemove",
      onMouseMove
    );

    /* =====================================
       ANIMATE
    ===================================== */

    const animate = () => {
      requestAnimationFrame(
        animate
      );

      points.rotation.y += 0.0005;

      points.rotation.x +=
        (mouse.y * 0.25 -
          points.rotation.x) *
        0.02;

      points.rotation.y +=
        (mouse.x * 0.25 -
          points.rotation.y) *
        0.02;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    /* =====================================
       RESIZE
    ===================================== */

    const handleResize = () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      if (
        mountNode &&
        renderer.domElement
      ) {
        mountNode.removeChild(
          renderer.domElement
        );
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="lp-wrapper dark-setup">
      <div
        ref={mountRef}
        className="lp-canvas-container"
      />

      <div className="lp-content">

        {/* ================= HEADER ================= */}

        <header className="lp-header-minimal">
          <h1 className="logo">
            BEME<span>.PRO</span>
          </h1>

          <p className="lp-tagline">
            BEHAVIORAL ENGINEERING SYSTEM
          </p>
        </header>

        {/* ================= HERO TEXT ================= */}

        <section className="lp-hero-quote">
          <h2>
            Discipline beats{" "}
            <span>motivation</span>
            <br />
            Repetition builds identity.
          </h2>

          <p>
            Track habits. Enforce action.
            Measure effort.
            Become unstoppable.
          </p>
        </section>

        {/* ================= BUTTONS ================= */}

        <div className="lp-action-grid">

          {/* 01 */}
          <button
            className="lp-command-btn analytics-mode"
            onClick={() =>
              onEnter("dashboard")
            }
          >
            <span className="btn-label">
              01
            </span>

            <div className="btn-main-info">
              <strong>
                MASTER DASHBOARD
              </strong>

              <small>
                HABITS • STREAKS •
                ANALYTICS
              </small>
            </div>

            <span className="btn-arrow">
              →
            </span>
          </button>

          {/* 02 */}
          <button
            className="lp-command-btn journal-mode"
            onClick={() =>
              onEnter("notebook")
            }
          >
            <span className="btn-label">
              02
            </span>

            <div className="btn-main-info">
              <strong>
                NEURAL NOTEBOOK
              </strong>

              <small>
                REFLECTIONS • FOCUS
                • CLARITY
              </small>
            </div>

            <span className="btn-arrow">
              →
            </span>
          </button>

          {/* 03 */}
          <button
            className="lp-command-btn alarm-mode"
            onClick={() =>
              onEnter("alarm")
            }
          >
            <span className="btn-label">
              03
            </span>

            <div className="btn-main-info">
              <strong>
                SYSTEM ALARM
              </strong>

              <small>
                WAKE • WORK • WIN
              </small>
            </div>

            <span className="btn-arrow">
              →
            </span>
          </button>

          {/* 04 */}
          <button
            className="lp-command-btn pro-mode"
            onClick={() =>
              onEnter("beme-pro")
            }
          >
            <span className="btn-label">
              04
            </span>

            <div className="btn-main-info">
              <strong>
                BEME.PRO CORE
              </strong>

              <small>
                COMMITMENTS OVER EXCUSES
              </small>

              <span className="pro-sub">
                Auto Fail • No Cheating
                • Pure Discipline
              </span>
            </div>

            <span className="btn-arrow">
              →
            </span>
          </button>
        </div>

        {/* ================= SLOGANS ================= */}

        <div className="lp-discipline-strip">
          <span>
            Consistency Wins
          </span>
          <span>
            Effort Every Day
          </span>
          <span>
            No Zero Days
          </span>
          <span>
            Build Yourself
          </span>
        </div>

        {/* ================= FOOTER ================= */}

        <footer className="lp-footer">
          BEME.PRO • SYSTEMIZE SUCCESS
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;