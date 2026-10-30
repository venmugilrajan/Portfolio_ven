import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D High-Tech Vision / Neural Hologram Core
 * 
 * Recreates the exact premium aesthetic of Vineeth's portfolio:
 * - Beautiful isometric floating device & neural vision sensor core
 * - Dynamic 3D depth, circuit traces, volumetric holographic scan rings, and neural node network
 * - Smooth scroll-driven state changes:
 *   Stage 0: Overview & Isometric angle
 *   Stage 1: Multi-layer elevation / exploded neural tier stack
 *   Stage 2: Focused beam / sensor targeting perspective
 */

const NeuralHandScene = ({ scrollProgress = 0, activeChapter = 0 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const mainGroupRef = useRef(null);
  const layersGroupRef = useRef([]);
  const ringsRef = useRef([]);
  const laserBeamRef = useRef(null);

  const targetState = useRef({
    rotX: 0.95,
    rotY: -0.42,
    rotZ: 0.35,
    posX: 1.8,
    posY: -0.1,
    posZ: 0,
    layerSpread: 0,
    scanSpeed: 1,
    glowIntensity: 0.8,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0a101d, 3.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffedd5, 3.2);
    dirLight1.position.set(6, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const accentPointLight = new THREE.PointLight(0xf97316, 4.0, 10);
    accentPointLight.position.set(2, 1.5, 2);
    scene.add(accentPointLight);

    // 3. Main Rig Group
    const mainGroup = new THREE.Group();
    mainGroupRef.current = mainGroup;
    scene.add(mainGroup);

    mainGroup.position.set(targetState.current.posX, targetState.current.posY, targetState.current.posZ);
    mainGroup.rotation.set(targetState.current.rotX, targetState.current.rotY, targetState.current.rotZ);

    // ==========================================
    // LAYER 1: BASE SUBSTRATE CHASSIS (Dark Gunmetal Precision Board)
    // ==========================================
    const baseW = 4.6;
    const baseH = 3.2;
    const baseD = 0.14;

    const baseGeo = new THREE.BoxGeometry(baseW, baseH, baseD);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111620,
      roughness: 0.35,
      metalness: 0.85,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.z = -baseD / 2;
    mainGroup.add(baseMesh);

    // Gold circuit traces around edge
    const edgeTrimGeo = new THREE.BoxGeometry(baseW + 0.08, baseH + 0.08, 0.03);
    const edgeTrimMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.9 });
    const edgeTrim = new THREE.Mesh(edgeTrimGeo, edgeTrimMat);
    edgeTrim.position.z = -baseD / 2;
    mainGroup.add(edgeTrim);

    // ==========================================
    // LAYER 2: INTERMEDIATE NEURAL ACCELERATOR PLATFORM (Elevates on scroll)
    // ==========================================
    const layer2Group = new THREE.Group();
    mainGroup.add(layer2Group);
    layersGroupRef.current.push(layer2Group);

    // Smoked Glass / Silicon Interposer Die
    const interposerGeo = new THREE.BoxGeometry(3.6, 2.4, 0.12);
    const interposerMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.15,
      metalness: 0.92,
    });
    const interposer = new THREE.Mesh(interposerGeo, interposerMat);
    interposer.position.z = 0.12;
    layer2Group.add(interposer);

    // Golden Micro-Interconnect Pins connecting layers (visible when elevated)
    const pinsGroup = new THREE.Group();
    const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });

    for (let px = -1.5; px <= 1.5; px += 0.3) {
      for (let py = -0.9; py <= 0.9; py += 0.3) {
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.rotation.x = Math.PI / 2;
        pin.position.set(px, py, 0.05);
        pinsGroup.add(pin);
      }
    }
    mainGroup.add(pinsGroup);

    // ==========================================
    // LAYER 3: 3D VISION MATRIX & NEURAL CORE (Elevates higher)
    // ==========================================
    const layer3Group = new THREE.Group();
    mainGroup.add(layer3Group);
    layersGroupRef.current.push(layer3Group);

    // Central Neural Optical Core / Sensor Matrix
    const coreCylinderGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.18, 32);
    const coreCylinderMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.95,
    });
    const coreCylinder = new THREE.Mesh(coreCylinderGeo, coreCylinderMat);
    coreCylinder.rotation.x = Math.PI / 2;
    coreCylinder.position.set(-0.4, 0, 0.26);
    layer3Group.add(coreCylinder);

    // Glowing Holographic Lens / Retina Center
    const lensGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.05, 32);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.7,
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(-0.4, 0, 0.36);
    layer3Group.add(lens);

    // Surrounding Tensor Nodes Array (4×3 Modular Cores)
    const tensorGeo = new THREE.BoxGeometry(0.34, 0.34, 0.08);
    const tensorMatBlue = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.85, emissive: 0x0284c7, emissiveIntensity: 0.4 });
    const tensorMatOrange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.2, metalness: 0.85, emissive: 0xea580c, emissiveIntensity: 0.6 });

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const tensor = new THREE.Mesh(tensorGeo, (r + c) % 2 === 0 ? tensorMatOrange : tensorMatBlue);
        tensor.position.set(0.9 + c * 0.45, -0.75 + r * 0.5, 0.24);
        layer3Group.add(tensor);
      }
    }

    // ==========================================
    // LAYER 4: FLOATING HOLOGRAPHIC SCAN RINGS & LASER TARGETING
    // ==========================================
    const ringsGroup = new THREE.Group();
    ringsGroup.position.set(-0.4, 0, 0.45);
    layer3Group.add(ringsGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf97316, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });

    const ring1 = new THREE.Mesh(new THREE.RingGeometry(0.95, 0.98, 48), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.28, 48), ringMat2);
    const ring3 = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.52, 48), ringMat1);

    ringsGroup.add(ring1);
    ringsGroup.add(ring2);
    ringsGroup.add(ring3);
    ringsRef.current = [ring1, ring2, ring3];

    // Vertical Laser / Targeting Ray
    const rayGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.5, 8);
    const rayMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.8 });
    const laserRay = new THREE.Mesh(rayGeo, rayMat);
    laserRay.rotation.x = Math.PI / 2;
    laserRay.position.set(-0.4, 0, 1.4);
    layer3Group.add(laserRay);
    laserBeamRef.current = laserRay;

    // Corner Alignment Marker
    const markerShape = new THREE.Shape();
    markerShape.moveTo(0, 0);
    markerShape.lineTo(0.35, 0);
    markerShape.lineTo(0, 0.35);
    markerShape.closePath();
    const markerMesh = new THREE.Mesh(new THREE.ShapeGeometry(markerShape), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    markerMesh.position.set(-baseW / 2 + 0.15, -baseH / 2 + 0.15, 0.1);
    mainGroup.add(markerMesh);

    // ==========================================
    // FLOATING DATA PARTICLES
    // ==========================================
    const pCount = 90;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 8;
      pPos[i + 1] = (Math.random() - 0.5) * 6;
      pPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xf97316, size: 0.03, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = nx * 0.18;
      mouseY = ny * 0.14;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window Resize
    const handleResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const cur = targetState.current;

      // Smooth lerp orientation & position
      mainGroup.rotation.x += (cur.rotX + mouseY - mainGroup.rotation.x) * 0.06;
      mainGroup.rotation.y += (cur.rotY + mouseX - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.z += (cur.rotZ - mainGroup.rotation.z) * 0.06;

      mainGroup.position.x += (cur.posX - mainGroup.position.x) * 0.06;
      mainGroup.position.y += (cur.posY - mainGroup.position.y) * 0.06;
      mainGroup.position.z += (cur.posZ - mainGroup.position.z) * 0.06;

      // Exploded / Elevated layers animation on scroll
      const spread = cur.layerSpread;
      if (layer2Group) {
        layer2Group.position.z += (spread * 0.45 - layer2Group.position.z) * 0.08;
      }
      if (layer3Group) {
        layer3Group.position.z += (spread * 0.95 - layer3Group.position.z) * 0.08;
      }
      if (pinsGroup) {
        const pinScale = 1 + spread * 3.2;
        pinsGroup.scale.set(1, 1, pinScale);
        pinsGroup.position.z = spread * 0.25;
      }

      // Spin holographic rings
      ring1.rotation.z = elapsed * 0.6;
      ring2.rotation.z = -elapsed * 0.45;
      ring3.rotation.z = elapsed * 0.3;

      // Pulse lens light
      accentPointLight.intensity = 3.2 + Math.sin(elapsed * 3) * 1.0;
      lensMat.emissiveIntensity = 1.2 + Math.sin(elapsed * 4) * 0.5;

      // Floating gentle hover
      mainGroup.position.y += Math.sin(elapsed * 1.4) * 0.0012;

      particles.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update target coordinates per chapter
  useEffect(() => {
    if (activeChapter === 0) {
      // Stage 1: Resting isometric perspective
      targetState.current = {
        rotX: 0.92,
        rotY: -0.42,
        rotZ: 0.34,
        posX: 1.8,
        posY: -0.1,
        posZ: 0,
        layerSpread: 0.0, // flat
        scanSpeed: 1,
        glowIntensity: 0.8,
      };
    } else if (activeChapter === 1) {
      // Stage 2: Exploded / Elevated tiers showcasing micro-pillars & neural cores
      targetState.current = {
        rotX: 1.12,
        rotY: -0.32,
        rotZ: 0.22,
        posX: 1.6,
        posY: 0.05,
        posZ: 0.5,
        layerSpread: 1.0, // fully elevated!
        scanSpeed: 2,
        glowIntensity: 1.5,
      };
    } else {
      // Stage 3: Close-up angled focus on the sensor beam & real-time tensors
      targetState.current = {
        rotX: 0.82,
        rotY: -0.58,
        rotZ: 0.38,
        posX: 1.3,
        posY: -0.05,
        posZ: 0.9,
        layerSpread: 0.5,
        scanSpeed: 2.5,
        glowIntensity: 1.8,
      };
    }
  }, [scrollProgress, activeChapter]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default NeuralHandScene;
