import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Color & material mappings for Crust, Sauce, Cheese
const CRUST_STYLES = {
  'Thin Crust': { radius: 2.5, rimRadius: 0.22, height: 0.12, color: 0xcca472, rough: 0.8 },
  'Thick Crust': { radius: 2.5, rimRadius: 0.38, height: 0.28, color: 0xb88648, rough: 0.85 },
  'Cheese Burst': { radius: 2.55, rimRadius: 0.42, height: 0.32, color: 0xd99b43, rough: 0.75 },
  'Whole Wheat': { radius: 2.5, rimRadius: 0.26, height: 0.18, color: 0x8a5d3b, rough: 0.9 },
  'Gluten-Free': { radius: 2.45, rimRadius: 0.2, height: 0.14, color: 0xdeb887, rough: 0.82 },
  default: { radius: 2.5, rimRadius: 0.28, height: 0.2, color: 0xc4965a, rough: 0.8 }
};

const SAUCE_STYLES = {
  'Marinara': { color: 0xb91c1c, rough: 0.3, metal: 0.1 },
  'Peri-Peri': { color: 0xea580c, rough: 0.35, metal: 0.1 },
  'Alfredo': { color: 0xfef08a, rough: 0.45, metal: 0.05 },
  'BBQ': { color: 0x451a03, rough: 0.25, metal: 0.2 },
  'Pesto': { color: 0x15803d, rough: 0.4, metal: 0.1 },
  default: { color: 0xb91c1c, rough: 0.3, metal: 0.1 }
};

const CHEESE_STYLES = {
  'Mozzarella': { color: 0xfef9c3, rough: 0.4, emissive: 0x221a00 },
  'Cheddar': { color: 0xf59e0b, rough: 0.45, emissive: 0x221200 },
  'Parmesan': { color: 0xfef08a, rough: 0.6, emissive: 0x111100 },
  'Vegan Cheese': { color: 0xfef3c7, rough: 0.5, emissive: 0x111100 },
  default: { color: 0xfef08a, rough: 0.45, emissive: 0x221a00 }
};

export default function PizzaCanvas3D({
  base = 'Thin Crust',
  sauce = 'Marinara',
  cheese = 'Mozzarella',
  veggies = [],
  mode = 'builder', // 'hero' or 'builder'
  className = '',
  height = '380px'
}) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // References to keep Three.js entities alive across prop updates
  const sceneRef = useRef(null);
  const pizzaGroupRef = useRef(null);
  const crustMeshRef = useRef(null);
  const rimMeshRef = useRef(null);
  const sauceMeshRef = useRef(null);
  const cheeseMeshRef = useRef(null);
  const toppingsGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Generate procedural leopard-spotted baked crust texture
  const createCrustTexture = (baseColorHex) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base color
    ctx.fillStyle = '#' + new THREE.Color(baseColorHex).getHexString();
    ctx.fillRect(0, 0, 512, 512);

    // Warm golden baked variations
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 2 + Math.random() * 8;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(160, 82, 45, 0.25)' : 'rgba(255, 215, 0, 0.15)';
      ctx.fill();
    }

    // Woodfire oven char marks (leopard spotting)
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 1.5 + Math.random() * 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 20, 10, 0.45)';
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  };

  // Generate cheese melted texture with toasted spots
  const createCheeseTexture = (cheeseColorHex) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#' + new THREE.Color(cheeseColorHex).getHexString();
    ctx.fillRect(0, 0, 512, 512);

    // Melted bubble highlights
    for (let i = 0; i < 250; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 4 + Math.random() * 12;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();
    }

    // Golden baked cheese blisters
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 3 + Math.random() * 9;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180, 83, 9, 0.35)';
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const heightPx = container.clientHeight || 380;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    if (mode === 'hero') {
      camera.position.set(0, 3.2, 5.2);
    } else {
      camera.position.set(0, 4.0, 4.2);
    }
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting setup for Light & Comfy Pizzeria Theme
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    keyLight.position.set(4, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Ember Orange rim light (Woodfire Ember theme)
    const rimLight = new THREE.DirectionalLight(0xf97316, 2.0);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Warm hearth fill light for depth
    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.7);
    fillLight.position.set(0, -4, 3);
    scene.add(fillLight);

    // Floating Ember Particle System in background
    const particleCount = mode === 'hero' ? 65 : 35;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      particleSpeeds.push({
        y: 0.005 + Math.random() * 0.015,
        x: (Math.random() - 0.5) * 0.004,
        rot: (Math.random() - 0.5) * 0.02
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xfb923c,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Main Pizza Root Group
    const pizzaGroup = new THREE.Group();
    pizzaGroupRef.current = pizzaGroup;
    if (mode === 'hero') {
      pizzaGroup.rotation.x = 0.55;
      pizzaGroup.rotation.z = -0.15;
    } else {
      pizzaGroup.rotation.x = 0.75;
    }
    scene.add(pizzaGroup);

    // Toppings Group
    const toppingsGroup = new THREE.Group();
    toppingsGroupRef.current = toppingsGroup;
    pizzaGroup.add(toppingsGroup);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (autoRotateRef.current && !isDraggingRef.current) {
        pizzaGroup.rotation.y += mode === 'hero' ? 0.008 : 0.005;
      }

      // Gentle floating hover wave
      if (mode === 'hero') {
        pizzaGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      } else {
        pizzaGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.06;
      }

      // Animate floating embers
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i].y;
        positions[i * 3] += particleSpeeds[i].x;
        if (positions[i * 3 + 1] > 4) {
          positions[i * 3 + 1] = -3;
          positions[i * 3] = (Math.random() - 0.5) * 8;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse / Touch Interaction (Orbit & Drag)
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      pizzaGroup.rotation.y += deltaX * 0.012;
      pizzaGroup.rotation.x = Math.max(0.1, Math.min(1.4, pizzaGroup.rotation.x + deltaY * 0.008));

      previousMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.0025;
      camera.position.z = Math.max(2.8, Math.min(7.5, camera.position.z + e.deltaY * zoomSpeed));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Touch Support for Mobile / Tablets
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      pizzaGroup.rotation.y += deltaX * 0.015;
      pizzaGroup.rotation.x = Math.max(0.1, Math.min(1.4, pizzaGroup.rotation.x + deltaY * 0.01));

      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 380;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [mode]);

  // Update 3D Crust, Rim, Sauce, Cheese when state changes
  useEffect(() => {
    if (!pizzaGroupRef.current) return;
    const group = pizzaGroupRef.current;

    // 1. Remove old base components if exist
    if (crustMeshRef.current) group.remove(crustMeshRef.current);
    if (rimMeshRef.current) group.remove(rimMeshRef.current);
    if (sauceMeshRef.current) group.remove(sauceMeshRef.current);
    if (cheeseMeshRef.current) group.remove(cheeseMeshRef.current);

    const crustConfig = CRUST_STYLES[base] || CRUST_STYLES.default;
    const sauceConfig = SAUCE_STYLES[sauce] || SAUCE_STYLES.default;
    const cheeseConfig = CHEESE_STYLES[cheese] || CHEESE_STYLES.default;

    // A. Crust Base Disc
    const crustGeo = new THREE.CylinderGeometry(
      crustConfig.radius,
      crustConfig.radius * 0.96,
      crustConfig.height,
      48
    );
    const crustTexture = createCrustTexture(crustConfig.color);
    const crustMat = new THREE.MeshStandardMaterial({
      color: crustConfig.color,
      map: crustTexture,
      roughness: crustConfig.rough,
      metalness: 0.05
    });
    const crustMesh = new THREE.Mesh(crustGeo, crustMat);
    crustMesh.position.y = 0;
    crustMesh.receiveShadow = true;
    group.add(crustMesh);
    crustMeshRef.current = crustMesh;

    // B. Puffy Outer Crust Rim (Torus for authentic woodfired puffy edge)
    const rimGeo = new THREE.TorusGeometry(
      crustConfig.radius - crustConfig.rimRadius * 0.5,
      crustConfig.rimRadius,
      20,
      50
    );
    const rimMat = new THREE.MeshStandardMaterial({
      color: crustConfig.color,
      map: crustTexture,
      roughness: crustConfig.rough,
      metalness: 0.05
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = crustConfig.height * 0.45;
    rimMesh.castShadow = true;
    rimMesh.receiveShadow = true;
    group.add(rimMesh);
    rimMeshRef.current = rimMesh;

    // C. Sauce Layer
    const sauceRadius = crustConfig.radius - crustConfig.rimRadius * 0.85;
    const sauceGeo = new THREE.CylinderGeometry(sauceRadius, sauceRadius, 0.04, 42);
    const sauceMat = new THREE.MeshStandardMaterial({
      color: sauceConfig.color,
      roughness: sauceConfig.rough,
      metalness: sauceConfig.metal,
      bumpScale: 0.05
    });
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    sauceMesh.position.y = crustConfig.height * 0.5 + 0.02;
    sauceMesh.receiveShadow = true;
    group.add(sauceMesh);
    sauceMeshRef.current = sauceMesh;

    // D. Melted Cheese Layer
    const cheeseRadius = sauceRadius * 0.97;
    const cheeseGeo = new THREE.CylinderGeometry(cheeseRadius, cheeseRadius, 0.05, 42);
    const cheeseTexture = createCheeseTexture(cheeseConfig.color);
    const cheeseMat = new THREE.MeshStandardMaterial({
      color: cheeseConfig.color,
      map: cheeseTexture,
      roughness: cheeseConfig.rough,
      metalness: 0.02,
      emissive: cheeseConfig.emissive,
      emissiveIntensity: 0.15
    });
    const cheeseMesh = new THREE.Mesh(cheeseGeo, cheeseMat);
    cheeseMesh.position.y = crustConfig.height * 0.5 + 0.045;
    cheeseMesh.receiveShadow = true;
    group.add(cheeseMesh);
    cheeseMeshRef.current = cheeseMesh;
  }, [base, sauce, cheese]);

  // Update Procedural 3D Toppings when `veggies` array changes
  useEffect(() => {
    if (!toppingsGroupRef.current) return;
    const toppingsGroup = toppingsGroupRef.current;

    // Clear old toppings
    while (toppingsGroup.children.length > 0) {
      toppingsGroup.remove(toppingsGroup.children[0]);
    }

    const crustConfig = CRUST_STYLES[base] || CRUST_STYLES.default;
    const surfaceY = crustConfig.height * 0.5 + 0.07;
    const maxRadius = crustConfig.radius * 0.76;

    // Helper to generate distributed positions on the circular pizza surface
    const getDistributedPositions = (count) => {
      const positions = [];
      for (let i = 0; i < count; i++) {
        // Golden ratio spiral distribution for natural placement
        const angle = i * 2.39996 + Math.random() * 0.3;
        const dist = Math.sqrt((i + 1) / (count + 1)) * maxRadius;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;
        positions.push({ x, z, rot: Math.random() * Math.PI * 2 });
      }
      return positions;
    };

    // If hero mode and no custom veggies specified, add a rich artisan assortment
    const activeVeggies = (mode === 'hero' && veggies.length === 0)
      ? ['Mushrooms', 'Black Olives', 'Bell Peppers', 'Fresh Basil', 'Diced Tomatoes']
      : veggies;

    // Topping 1: Pepperoni / Artisan Chorizo (featured in Hero or when requested)
    if (mode === 'hero') {
      const pepPositions = getDistributedPositions(9);
      const pepGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.04, 24);
      const pepMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.4,
        metalness: 0.1
      });
      pepPositions.forEach((pos) => {
        const pep = new THREE.Mesh(pepGeo, pepMat);
        pep.position.set(pos.x, surfaceY + 0.015, pos.z);
        pep.rotation.y = pos.rot;
        pep.castShadow = true;
        toppingsGroup.add(pep);
      });
    }

    // Topping 2: Mushrooms
    if (activeVeggies.includes('Mushrooms')) {
      const positions = getDistributedPositions(8);
      const capGeo = new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const stemGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.15, 12);
      const mushMat = new THREE.MeshStandardMaterial({ color: 0xd6c6b2, roughness: 0.8 });
      const stemMat = new THREE.MeshStandardMaterial({ color: 0xede4d8, roughness: 0.85 });

      positions.forEach((pos) => {
        const mushGroup = new THREE.Group();
        const cap = new THREE.Mesh(capGeo, mushMat);
        cap.position.y = 0.08;
        cap.rotation.x = Math.PI + (Math.random() - 0.5) * 0.4;
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.04;

        mushGroup.add(stem);
        mushGroup.add(cap);
        mushGroup.position.set(pos.x, surfaceY, pos.z);
        mushGroup.rotation.y = pos.rot;
        mushGroup.scale.set(0.85, 0.85, 0.85);
        mushGroup.castShadow = true;
        toppingsGroup.add(mushGroup);
      });
    }

    // Topping 3: Black Olives (Glossy black rings)
    if (activeVeggies.includes('Black Olives')) {
      const positions = getDistributedPositions(10);
      const oliveGeo = new THREE.TorusGeometry(0.14, 0.055, 12, 20);
      const oliveMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.25,
        metalness: 0.2
      });

      positions.forEach((pos) => {
        const olive = new THREE.Mesh(oliveGeo, oliveMat);
        olive.position.set(pos.x, surfaceY + 0.02, pos.z);
        olive.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
        olive.rotation.y = pos.rot;
        olive.castShadow = true;
        toppingsGroup.add(olive);
      });
    }

    // Topping 4: Bell Peppers (Vibrant green curved strips)
    if (activeVeggies.includes('Bell Peppers')) {
      const positions = getDistributedPositions(9);
      const pepperGeo = new THREE.TorusGeometry(0.24, 0.045, 8, 16, Math.PI * 0.7);
      const pepperMat = new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.3,
        metalness: 0.1
      });

      positions.forEach((pos) => {
        const pepper = new THREE.Mesh(pepperGeo, pepperMat);
        pepper.position.set(pos.x, surfaceY + 0.02, pos.z);
        pepper.rotation.x = Math.PI / 2;
        pepper.rotation.z = pos.rot;
        pepper.castShadow = true;
        toppingsGroup.add(pepper);
      });
    }

    // Topping 5: Red Onions (Purple curved slivers)
    if (activeVeggies.includes('Red Onions')) {
      const positions = getDistributedPositions(8);
      const onionGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 16, Math.PI * 0.6);
      const onionMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.35,
        metalness: 0.15
      });

      positions.forEach((pos) => {
        const onion = new THREE.Mesh(onionGeo, onionMat);
        onion.position.set(pos.x, surfaceY + 0.02, pos.z);
        onion.rotation.x = Math.PI / 2;
        onion.rotation.z = pos.rot;
        onion.castShadow = true;
        toppingsGroup.add(onion);
      });
    }

    // Topping 6: Jalapenos (Fiery olive-green rings)
    if (activeVeggies.includes('Jalapenos')) {
      const positions = getDistributedPositions(8);
      const jalGeo = new THREE.TorusGeometry(0.18, 0.05, 10, 18);
      const jalMat = new THREE.MeshStandardMaterial({
        color: 0x4d7c0f,
        roughness: 0.3,
        metalness: 0.1
      });

      positions.forEach((pos) => {
        const jal = new THREE.Mesh(jalGeo, jalMat);
        jal.position.set(pos.x, surfaceY + 0.025, pos.z);
        jal.rotation.x = Math.PI / 2;
        jal.rotation.z = pos.rot;
        jal.castShadow = true;
        toppingsGroup.add(jal);
      });
    }

    // Topping 7: Fresh Basil (Organic green curved leaves)
    if (activeVeggies.includes('Fresh Basil')) {
      const positions = getDistributedPositions(7);
      const leafGeo = new THREE.ConeGeometry(0.16, 0.42, 6);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.45,
        metalness: 0.05
      });

      positions.forEach((pos) => {
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(pos.x, surfaceY + 0.03, pos.z);
        leaf.rotation.x = Math.PI / 2 + 0.3;
        leaf.rotation.z = pos.rot;
        leaf.scale.set(1.1, 0.25, 1);
        leaf.castShadow = true;
        toppingsGroup.add(leaf);
      });
    }

    // Topping 8: Diced Tomatoes (Rich red juicy chunks)
    if (activeVeggies.includes('Diced Tomatoes')) {
      const positions = getDistributedPositions(10);
      const tomGeo = new THREE.BoxGeometry(0.14, 0.1, 0.14);
      const tomMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.2,
        metalness: 0.15
      });

      positions.forEach((pos) => {
        const tom = new THREE.Mesh(tomGeo, tomMat);
        tom.position.set(pos.x, surfaceY + 0.02, pos.z);
        tom.rotation.y = pos.rot;
        tom.castShadow = true;
        toppingsGroup.add(tom);
      });
    }
  }, [veggies, base, mode]);

  const resetView = () => {
    if (!pizzaGroupRef.current || !cameraRef.current) return;
    if (mode === 'hero') {
      pizzaGroupRef.current.rotation.set(0.55, 0, -0.15);
      cameraRef.current.position.set(0, 3.2, 5.2);
    } else {
      pizzaGroupRef.current.rotation.set(0.75, 0, 0);
      cameraRef.current.position.set(0, 4.0, 4.2);
    }
  };

  return (
    <div
      className={`pizza-3d-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: '24px',
        overflow: 'hidden',
        background: mode === 'hero'
          ? 'transparent'
          : 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.06) 0%, rgba(247, 241, 234, 0.7) 80%)',
        border: mode === 'hero' ? 'none' : '1px solid rgba(180, 83, 9, 0.14)',
        boxShadow: mode === 'hero' ? 'none' : '0 8px 25px rgba(60, 35, 15, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Three.js Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDraggingRef.current ? 'grabbing' : 'grab'
        }}
      />

      {/* 3D Controls only in Builder Mode */}
      {mode === 'builder' && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            padding: '0.35rem 0.6rem',
            borderRadius: '10px',
            border: '1px solid rgba(180, 83, 9, 0.2)',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(60, 35, 15, 0.08)'
          }}
        >
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              background: autoRotate ? 'rgba(234, 88, 12, 0.15)' : 'transparent',
              border: autoRotate ? '1px solid #ea580c' : '1px solid transparent',
              color: autoRotate ? '#c2410c' : '#736456',
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '700'
            }}
            title="Toggle Auto Rotation"
          >
            {autoRotate ? '⟳ Spin: ON' : '⏸ Spin: OFF'}
          </button>

          <button
            type="button"
            onClick={resetView}
            style={{
              background: 'transparent',
              border: '1px solid rgba(180, 83, 9, 0.2)',
              color: '#241c16',
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
            title="Reset Camera View"
          >
            ↺ Reset
          </button>
        </div>
      )}

      {/* Subtle Hint only in builder mode */}
      {mode === 'builder' && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            fontSize: '0.75rem',
            color: 'rgba(78, 60, 48, 0.65)',
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.2s'
          }}
        >
          Drag to orbit • Scroll to zoom
        </div>
      )}
    </div>
  );
}
