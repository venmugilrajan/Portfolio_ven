import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ChipScene = ({ scrollProgress = 0, activeChapter = 0 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const chipGroupRef = useRef(null);
  const pillarsGroupRef = useRef(null);
  const tilesRef = useRef({});
  const particlesRef = useRef(null);

  // Targets for animation based on scrollProgress
  const targetState = useRef({
    rotX: 0.85,
    rotY: -0.45,
    rotZ: 0.35,
    posX: 1.2,
    posY: -0.2,
    posZ: 0,
    elevateTiles: 0, // 0 to 1 elevation of compute/graphics/npu tiles
    pinPillars: 0,
    glowIntensity: 0.5,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff3e0, 2.8);
    dirLight1.position.set(5, 8, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight2.position.set(-6, -4, 3);
    scene.add(dirLight2);

    const orangeAccentLight = new THREE.PointLight(0xf97316, 3.5, 8);
    orangeAccentLight.position.set(1.5, 1.2, 1.5);
    scene.add(orangeAccentLight);

    // 3. Main Chip Hierarchy
    const mainChip = new THREE.Group();
    chipGroupRef.current = mainChip;
    scene.add(mainChip);

    // A. Motherboard / Substrate Board (Large green-tinted silicon PCB)
    const boardWidth = 6.2;
    const boardHeight = 2.9;
    const boardDepth = 0.12;

    const boardGeo = new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x182622,
      roughness: 0.55,
      metalness: 0.45,
    });
    const pcbBoard = new THREE.Mesh(boardGeo, boardMat);
    pcbBoard.position.z = -boardDepth / 2;
    mainChip.add(pcbBoard);

    // B. Motherboard Gold Contacts / Traces & Edge Ribbon Connector
    const ribbonGeo = new THREE.BoxGeometry(0.5, 0.6, 0.08);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.8,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(boardWidth / 2 + 0.15, 0.3, 0);
    mainChip.add(ribbon);

    // Flexible amber circuit cable ribbon tail
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(boardWidth / 2 + 0.3, 0.3, 0),
      new THREE.Vector3(boardWidth / 2 + 1.2, 0.7, 0.3),
      new THREE.Vector3(boardWidth / 2 + 2.0, 0.9, 0.1),
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.15, 8, false);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4, metalness: 0.5 });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    mainChip.add(cableMesh);

    // Tiny SMD capacitors & resistors scattered in array on the right side of the PCB
    const smdGroup = new THREE.Group();
    const smdGeo = new THREE.BoxGeometry(0.06, 0.09, 0.06);
    const smdMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 });
    const smdGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.85 });

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 12; c++) {
        const smd = new THREE.Mesh(smdGeo, (r + c) % 3 === 0 ? smdGoldMat : smdMat);
        smd.position.set(0.6 + c * 0.18 + (Math.random() - 0.5) * 0.04, -1.0 + r * 0.25, 0.04);
        smdGroup.add(smd);
      }
    }
    mainChip.add(smdGroup);

    // C. Foveros Base Die (Dark reflective interposer silicon)
    const baseDieGeo = new THREE.BoxGeometry(3.0, 2.3, 0.14);
    const baseDieMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.15,
      metalness: 0.9,
    });
    const baseDie = new THREE.Mesh(baseDieGeo, baseDieMat);
    baseDie.position.set(-1.1, 0, 0.08);
    mainChip.add(baseDie);

    // D. Vertical Micro-Pillars under tiles (Foveros interconnect pins)
    const pillarsGroup = new THREE.Group();
    pillarsGroupRef.current = pillarsGroup;
    mainChip.add(pillarsGroup);

    const pinGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.6, 6);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.2 });

    // Populate micro pillars under the compute & graphics tiles
    for (let x = -2.3; x <= -0.1; x += 0.12) {
      for (let y = -0.9; y <= 0.9; y += 0.12) {
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.rotation.x = Math.PI / 2;
        pin.position.set(x, y, 0.1);
        pillarsGroup.add(pin);
      }
    }

    // E. Raised Modular Tiles (Compute, Graphics, SoC/NPU, IO)
    // 1) Compute Tile (6P + 8E cores - CPU)
    const computeGeo = new THREE.BoxGeometry(1.3, 0.85, 0.12);
    const computeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.85,
    });
    const computeTile = new THREE.Mesh(computeGeo, computeMat);
    computeTile.position.set(-1.8, 0.5, 0.22);
    mainChip.add(computeTile);
    tilesRef.current.compute = computeTile;

    // Grid lines on Compute Tile
    const coreGrid = new THREE.Group();
    const coreBoxGeo = new THREE.BoxGeometry(0.24, 0.24, 0.03);
    const coreBoxMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8 });
    for (let cx = -0.45; cx <= 0.45; cx += 0.3) {
      for (let cy = -0.25; cy <= 0.25; cy += 0.28) {
        const cbox = new THREE.Mesh(coreBoxGeo, coreBoxMat);
        cbox.position.set(cx, cy, 0.07);
        coreGrid.add(cbox);
      }
    }
    computeTile.add(coreGrid);

    // 2) Graphics Tile (8 Xe Cores - Arc iGPU)
    const graphicsGeo = new THREE.BoxGeometry(1.0, 1.8, 0.12);
    const graphicsMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.9,
    });
    const graphicsTile = new THREE.Mesh(graphicsGeo, graphicsMat);
    graphicsTile.position.set(-0.4, 0.05, 0.22);
    mainChip.add(graphicsTile);
    tilesRef.current.graphics = graphicsTile;

    // Xe Cores micro pattern
    const xeGrid = new THREE.Group();
    const xeBoxGeo = new THREE.BoxGeometry(0.38, 0.34, 0.03);
    const xeBoxMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.9 });
    for (let gy = -0.65; gy <= 0.65; gy += 0.44) {
      for (let gx = -0.22; gx <= 0.22; gx += 0.44) {
        const gbox = new THREE.Mesh(xeBoxGeo, xeBoxMat);
        gbox.position.set(gx, gy, 0.07);
        xeGrid.add(gbox);
      }
    }
    graphicsTile.add(xeGrid);

    // 3) SoC Tile (NPU + 2 LP E-cores)
    const socGeo = new THREE.BoxGeometry(1.3, 0.85, 0.12);
    const socMat = new THREE.MeshStandardMaterial({
      color: 0x134e4a,
      roughness: 0.2,
      metalness: 0.8,
    });
    const socTile = new THREE.Mesh(socGeo, socMat);
    socTile.position.set(-1.8, -0.5, 0.22);
    mainChip.add(socTile);
    tilesRef.current.soc = socTile;

    // Glowing NPU neural block
    const npuCoreGeo = new THREE.BoxGeometry(0.65, 0.5, 0.04);
    const npuCoreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
    });
    const npuCore = new THREE.Mesh(npuCoreGeo, npuCoreMat);
    npuCore.position.set(0, 0, 0.07);
    socTile.add(npuCore);

    // F. Golden corner accent indicator triangle
    const cornerShape = new THREE.Shape();
    cornerShape.moveTo(0, 0);
    cornerShape.lineTo(0.3, 0);
    cornerShape.lineTo(0, 0.3);
    cornerShape.closePath();
    const cornerGeo = new THREE.ShapeGeometry(cornerShape);
    const cornerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const cornerMesh = new THREE.Mesh(cornerGeo, cornerMat);
    cornerMesh.position.set(-boardWidth / 2 + 0.15, -boardHeight / 2 + 0.15, 0.08);
    mainChip.add(cornerMesh);

    // G. Ambient floating data particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      positions[p] = (Math.random() - 0.5) * 8;
      positions[p + 1] = (Math.random() - 0.5) * 6;
      positions[p + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xf97316, size: 0.035, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 4. Initial orientation matching Vineeth's starting isometric view
    mainChip.rotation.set(targetState.current.rotX, targetState.current.rotY, targetState.current.rotZ);
    mainChip.position.set(targetState.current.posX, targetState.current.posY, targetState.current.posZ);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = nx * 0.15;
      mouseY = ny * 0.12;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Render Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp chip rotation and position toward scroll target + mouse parallax
      const cur = targetState.current;
      mainChip.rotation.x += (cur.rotX + mouseY - mainChip.rotation.x) * 0.06;
      mainChip.rotation.y += (cur.rotY + mouseX - mainChip.rotation.y) * 0.06;
      mainChip.rotation.z += (cur.rotZ - mainChip.rotation.z) * 0.06;

      mainChip.position.x += (cur.posX - mainChip.position.x) * 0.06;
      mainChip.position.y += (cur.posY - mainChip.position.y) * 0.06;
      mainChip.position.z += (cur.posZ - mainChip.position.z) * 0.06;

      // Animate tile elevation (exploding/lifting off the Foveros interposer on scroll)
      const targetElev = cur.elevateTiles;
      if (tilesRef.current.compute) {
        tilesRef.current.compute.position.z += (0.22 + targetElev * 0.45 - tilesRef.current.compute.position.z) * 0.08;
      }
      if (tilesRef.current.graphics) {
        tilesRef.current.graphics.position.z += (0.22 + targetElev * 0.55 - tilesRef.current.graphics.position.z) * 0.08;
      }
      if (tilesRef.current.soc) {
        tilesRef.current.soc.position.z += (0.22 + targetElev * 0.35 - tilesRef.current.soc.position.z) * 0.08;
      }

      // Pillars scale height to meet elevated tiles
      if (pillarsGroupRef.current) {
        const pillarScale = 1 + targetElev * 2.8;
        pillarsGroupRef.current.scale.set(1, 1, pillarScale);
        pillarsGroupRef.current.position.z = 0.1 + (targetElev * 0.15);
      }

      // Gentle floating oscillation
      mainChip.position.y += Math.sin(elapsedTime * 1.5) * 0.001;

      // Animate point light pulse
      orangeAccentLight.intensity = 2.5 + Math.sin(elapsedTime * 3) * 0.8;

      // Particle rotation
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
      }

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

  // Update target coordinates when scrollProgress or activeChapter changes
  useEffect(() => {
    // 3 Key Camera/Orientation States corresponding to Vineeth's chapters:
    // Chapter 0: 01 / The engineer -> Isometric overview, tiles flat, chip at rest
    // Chapter 1: 02 / Flat-out -> Tilts upward, tiles elevate revealing golden micro-pillars, NPU glows
    // Chapter 2: 03 / A live camera -> Focus camera right into the graphics/NPU tiles, angled dynamic view
    if (activeChapter === 0) {
      targetState.current = {
        rotX: 0.92,
        rotY: -0.42,
        rotZ: 0.32,
        posX: 1.3,
        posY: -0.15,
        posZ: 0,
        elevateTiles: 0.0, // flat
        pinPillars: 0.0,
        glowIntensity: 0.4,
      };
    } else if (activeChapter === 1) {
      // Chapter 2: Exploded view / Flat-out -> Tiles lift up!
      targetState.current = {
        rotX: 1.15,
        rotY: -0.35,
        rotZ: 0.25,
        posX: 1.1,
        posY: -0.05,
        posZ: 0.4,
        elevateTiles: 1.0, // elevated!
        pinPillars: 1.0,
        glowIntensity: 1.2,
      };
    } else {
      // Chapter 3: A live camera -> Close-up perspective
      targetState.current = {
        rotX: 0.78,
        rotY: -0.62,
        rotZ: 0.42,
        posX: 0.8,
        posY: -0.1,
        posZ: 0.9,
        elevateTiles: 0.6,
        pinPillars: 0.6,
        glowIntensity: 1.5,
      };
    }
  }, [scrollProgress, activeChapter]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default ChipScene;

