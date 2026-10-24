import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Warm Culinary Lighting (Saffron gold & warm terracotta ambient)
    const ambientLight = new THREE.AmbientLight(0xFFF6E5, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xF59E0B, 2.0); // Warm amber
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xE25C34, 1.2); // Warm terracotta
    dirLight2.position.set(-10, -10, 5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xFFD700, 3, 25); // Golden culinary glow
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    // 3D Floating Culinary Elements Group
    const culinaryGroup = new THREE.Group();
    scene.add(culinaryGroup);

    // Materials with warm culinary palettes
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      roughness: 0.25,
      metalness: 0.8,
    });

    const sageMaterial = new THREE.MeshStandardMaterial({
      color: 0x5F805B,
      roughness: 0.5,
      metalness: 0.1,
    });

    const terracottaMaterial = new THREE.MeshStandardMaterial({
      color: 0xE25C34,
      roughness: 0.4,
      metalness: 0.2,
    });

    const ivoryMaterial = new THREE.MeshStandardMaterial({
      color: 0xFAF7EE,
      roughness: 0.3,
      metalness: 0.1,
    });

    const items = [];

    // 1. Floating Spiced Spheres / Golden Peppercorns
    for (let i = 0; i < 14; i++) {
      const radius = 0.3 + Math.random() * 0.4;
      const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
      const mat = i % 3 === 0 ? goldMaterial : (i % 3 === 1 ? terracottaMaterial : sageMaterial);
      const mesh = new THREE.Mesh(sphereGeo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );

      mesh.userData = {
        speedX: (Math.random() - 0.5) * 0.008,
        speedY: (Math.random() - 0.5) * 0.008,
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        initialY: mesh.position.y,
        floatOffset: Math.random() * Math.PI * 2,
      };

      culinaryGroup.add(mesh);
      items.push(mesh);
    }

    // 2. Floating Star Anise / Spiced Torus Rings
    for (let i = 0; i < 6; i++) {
      const torusGeo = new THREE.TorusGeometry(0.7, 0.25, 16, 32);
      const torus = new THREE.Mesh(torusGeo, i % 2 === 0 ? goldMaterial : terracottaMaterial);

      torus.position.set(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );

      torus.userData = {
        speedX: (Math.random() - 0.5) * 0.005,
        speedY: (Math.random() - 0.5) * 0.005,
        rotX: (Math.random() - 0.5) * 0.03,
        rotY: (Math.random() - 0.5) * 0.03,
        initialY: torus.position.y,
        floatOffset: Math.random() * Math.PI * 2,
      };

      culinaryGroup.add(torus);
      items.push(torus);
    }

    // 3. Floating Herb Leaf Geometries (Dodecahedrons / Polyhedrons)
    for (let i = 0; i < 7; i++) {
      const leafGeo = new THREE.DodecahedronGeometry(0.65, 0);
      const leaf = new THREE.Mesh(leafGeo, sageMaterial);

      leaf.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 8
      );

      leaf.userData = {
        speedX: (Math.random() - 0.5) * 0.006,
        speedY: (Math.random() - 0.5) * 0.006,
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        initialY: leaf.position.y,
        floatOffset: Math.random() * Math.PI * 2,
      };

      culinaryGroup.add(leaf);
      items.push(leaf);
    }

    // 4. Subtle Aromatic Golden Steam Particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      particleSpeeds.push({
        y: 0.005 + Math.random() * 0.015,
        x: (Math.random() - 0.5) * 0.005,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xF5B718,
      size: 0.22,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      culinaryGroup.rotation.y = targetX * 0.4 + elapsedTime * 0.05;
      culinaryGroup.rotation.x = -targetY * 0.3;

      // Animate floating culinary items
      items.forEach((item) => {
        item.rotation.x += item.userData.rotX;
        item.rotation.y += item.userData.rotY;
        item.position.y = item.userData.initialY + Math.sin(elapsedTime * 1.5 + item.userData.floatOffset) * 0.4;
      });

      // Animate aromatic particles rising gently like warm culinary steam
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleSpeeds[i].y;
        pos[i * 3] += Math.sin(elapsedTime + i) * 0.003;

        // Reset if drifted above top
        if (pos[i * 3 + 1] > 9) {
          pos[i * 3 + 1] = -9;
          pos[i * 3] = (Math.random() - 0.5) * 30;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      style={{ height: '100%', width: '100%' }}
    />
  );
}
