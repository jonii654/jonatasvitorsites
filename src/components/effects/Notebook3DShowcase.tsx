import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useDeviceTier } from '@/hooks/use-device-tier';

/**
 * ASUS-style 3D notebook (vanilla three.js).
 * Ported from the standalone HTML/JS prototype: gray chassis, full keyboard,
 * trackpad, ports, lid with opening animation, auto-rotate until user interacts.
 */
export function Notebook3DShowcase() {
  const tier = useDeviceTier();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ============ Texturas procedurais ============
    function createScreenTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#020205';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = -100;
      const cy = canvas.height / 2;
      for (let i = 0; i < 300; i++) {
        const radius = 200 + i * 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (i > 150 && i < 180) {
          ctx.strokeStyle = `rgba(150, 255, 255, ${Math.random() * 0.8 + 0.2})`;
          ctx.lineWidth = Math.random() * 3 + 1;
        } else {
          ctx.strokeStyle = `rgba(0, ${100 + Math.random() * 150}, 255, ${Math.random() * 0.3})`;
          ctx.lineWidth = Math.random() * 1.5;
        }
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    function createLidTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#8a8d91';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.font = '900 120px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText('ASUS', 512, 516);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('ASUS', 512, 510);
      ctx.fillStyle = '#6a6d71';
      ctx.fillText('ASUS', 512, 512);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    function createBezelTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.fillStyle = '#888888';
      ctx.font = 'bold 30px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ASUS', 512, 980);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    const keyCache: Record<string, THREE.CanvasTexture> = {};
    function getKeyTexture(label: string) {
      if (keyCache[label]) return keyCache[label];
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#111315';
      ctx.fillRect(0, 0, 64, 64);
      if (label) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = label.length > 2 ? '600 12px Arial' : '600 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 32, 32);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      keyCache[label] = tex;
      return tex;
    }

    function createBottomTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#7a7d81';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(300, 200, 424, 250);
      ctx.fillStyle = '#0f172a';
      for (let y = 210; y < 440; y += 12) {
        for (let x = 310; x < 710; x += 8) {
          ctx.fillRect(x, y, 4, 8);
        }
      }
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(350, 500, 120, 60);
      ctx.fillRect(550, 500, 150, 80);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // ============ Setup three.js ============
    const scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 200);
    camera.position.set(0, 10, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'light' ? 1.3 : 2));
    renderer.shadowMap.enabled = tier === 'full';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 40;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    // Environment map procedural (subtle reflections)
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 256;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d')!;
    const grd = envCtx.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(1, '#475569');
    envCtx.fillStyle = grd;
    envCtx.fillRect(0, 0, 256, 256);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTex;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = tier === 'full';
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // ============ Notebook ============
    const laptopGroup = new THREE.Group();

    const screenTex = createScreenTexture();
    const lidTex = createLidTexture();
    const bezelTex = createBezelTexture();
    const bottomTex = createBottomTexture();

    const grayMat = new THREE.MeshStandardMaterial({ color: 0x8a8d91, metalness: 0.6, roughness: 0.3 });
    const lidMat = new THREE.MeshStandardMaterial({ map: lidTex, metalness: 0.6, roughness: 0.3 });
    const blackPlasticMat = new THREE.MeshStandardMaterial({ color: 0x111315, metalness: 0.2, roughness: 0.7 });
    const bezelMat = new THREE.MeshStandardMaterial({ map: bezelTex, metalness: 0.1, roughness: 0.8 });
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const portMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 });
    const bottomMat = new THREE.MeshStandardMaterial({ map: bottomTex, metalness: 0.4, roughness: 0.6 });

    const disposables: Array<{ dispose: () => void }> = [
      screenTex, lidTex, bezelTex, bottomTex, envTex,
      grayMat, lidMat, blackPlasticMat, bezelMat, screenMat, portMat, bottomMat,
    ];

    const baseW = 13.0;
    const baseD = 8.5;
    const baseH = 0.25;

    // Base
    const baseGeo = new THREE.BoxGeometry(baseW, baseH, baseD);
    disposables.push(baseGeo);
    const base = new THREE.Mesh(baseGeo, grayMat);
    base.position.y = baseH / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    laptopGroup.add(base);

    // Bottom
    const bottomGeo = new THREE.PlaneGeometry(baseW - 0.2, baseD - 0.2);
    disposables.push(bottomGeo);
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.rotation.x = Math.PI / 2;
    bottom.position.y = -0.01;
    laptopGroup.add(bottom);

    // Feet
    const footGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 16);
    disposables.push(footGeo);
    [
      [-baseW / 2 + 1, -0.04, -baseD / 2 + 1],
      [baseW / 2 - 1, -0.04, -baseD / 2 + 1],
      [-baseW / 2 + 1, -0.04, baseD / 2 - 1],
      [baseW / 2 - 1, -0.04, baseD / 2 - 1],
    ].forEach((pos) => {
      const foot = new THREE.Mesh(footGeo, blackPlasticMat);
      foot.position.set(pos[0], pos[1], pos[2]);
      laptopGroup.add(foot);
    });

    // Ports
    const leftPorts = [
      { geo: new THREE.CylinderGeometry(0.04, 0.04, 0.2), z: -3 },
      { geo: new THREE.BoxGeometry(0.1, 0.06, 0.4), z: -2 },
      { geo: new THREE.BoxGeometry(0.1, 0.04, 0.2), z: -1.2 },
      { geo: new THREE.BoxGeometry(0.1, 0.04, 0.2), z: -0.7 },
    ];
    leftPorts.forEach((p) => {
      disposables.push(p.geo);
      const port = new THREE.Mesh(p.geo, portMat);
      if (p.geo.type === 'CylinderGeometry') port.rotation.z = Math.PI / 2;
      port.position.set(-baseW / 2, baseH / 2, p.z);
      laptopGroup.add(port);
    });

    const rightPorts = [
      { geo: new THREE.BoxGeometry(0.1, 0.05, 0.3), z: -1 },
      { geo: new THREE.BoxGeometry(0.1, 0.02, 0.5), z: 0 },
      { geo: new THREE.CylinderGeometry(0.03, 0.03, 0.2), z: 1.5 },
    ];
    rightPorts.forEach((p) => {
      disposables.push(p.geo);
      const port = new THREE.Mesh(p.geo, portMat);
      if (p.geo.type === 'CylinderGeometry') port.rotation.z = Math.PI / 2;
      port.position.set(baseW / 2, baseH / 2, p.z);
      laptopGroup.add(port);
    });

    // Keyboard indent
    const kbIndentMat = new THREE.MeshStandardMaterial({ color: 0x6a6d71, roughness: 0.7 });
    const kbIndentGeo = new THREE.PlaneGeometry(11.8, 4.0);
    disposables.push(kbIndentGeo, kbIndentMat);
    const kbIndent = new THREE.Mesh(kbIndentGeo, kbIndentMat);
    kbIndent.rotation.x = -Math.PI / 2;
    kbIndent.position.set(-0.1, baseH + 0.005, -1.0);
    laptopGroup.add(kbIndent);

    const keysMain = [
      ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Del'],
      ["'", '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Bksp'],
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç', '~', 'Enter', ''],
      ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', ';', '/', 'Shift', ''],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl', '<', '>'],
    ];

    const keysNum = [
      ['Num', '/', '*', '-'],
      ['7', '8', '9', '+'],
      ['4', '5', '6', ''],
      ['1', '2', '3', 'Ent'],
      ['0', '', 'Del', ''],
    ];

    const keyW = 0.55;
    const keyD = 0.5;
    const keyGap = 0.08;
    const startX = -5.5;
    const startZ = -2.7;

    const keyMaterials: THREE.Material[] = [];
    const keyGeometries: THREE.BufferGeometry[] = [];

    keysMain.forEach((row, r) => {
      let currentX = startX;
      row.forEach((label) => {
        if (label === '') return;
        let kw = keyW;
        if (['Bksp', 'Tab', 'Caps', 'Enter', 'Shift'].includes(label)) kw = keyW * 1.6;
        if (label === 'Space') kw = 3.7;
        const topMat = new THREE.MeshStandardMaterial({
          map: getKeyTexture(label === 'Space' ? '' : label),
          roughness: 0.8,
        });
        keyMaterials.push(topMat);
        const materials = [blackPlasticMat, blackPlasticMat, topMat, blackPlasticMat, blackPlasticMat, blackPlasticMat];
        const geo = new THREE.BoxGeometry(kw, 0.03, keyD);
        keyGeometries.push(geo);
        const key = new THREE.Mesh(geo, materials);
        key.position.set(currentX + kw / 2, baseH + 0.015, startZ + r * (keyD + keyGap));
        laptopGroup.add(key);
        currentX += kw + keyGap;
      });
    });

    const numStartX = 3.6;
    keysNum.forEach((row, r) => {
      let currentX = numStartX;
      row.forEach((label) => {
        if (label === '') return;
        let kw = keyW;
        if (label === '0') kw = keyW * 2 + keyGap;
        const topMat = new THREE.MeshStandardMaterial({ map: getKeyTexture(label), roughness: 0.8 });
        keyMaterials.push(topMat);
        const materials = [blackPlasticMat, blackPlasticMat, topMat, blackPlasticMat, blackPlasticMat, blackPlasticMat];
        const geo = new THREE.BoxGeometry(kw, 0.03, keyD);
        keyGeometries.push(geo);
        const key = new THREE.Mesh(geo, materials);
        key.position.set(currentX + kw / 2, baseH + 0.015, startZ + r * (keyD + keyGap));
        laptopGroup.add(key);
        currentX += kw + keyGap;
      });
    });

    disposables.push(...keyMaterials, ...keyGeometries, ...Object.values(keyCache));

    // Trackpad
    const trackpadBorderMat = new THREE.MeshStandardMaterial({ color: 0x5a5d61, roughness: 1 });
    const trackpadBorderGeo = new THREE.PlaneGeometry(3.68, 2.48);
    disposables.push(trackpadBorderMat, trackpadBorderGeo);
    const trackpadBorder = new THREE.Mesh(trackpadBorderGeo, trackpadBorderMat);
    trackpadBorder.rotation.x = -Math.PI / 2;
    trackpadBorder.position.set(-1.0, baseH + 0.008, 1.8);
    laptopGroup.add(trackpadBorder);

    const trackpadMat = new THREE.MeshStandardMaterial({ color: 0x7a7d81, metalness: 0.5, roughness: 0.3 });
    const trackpadGeo = new THREE.PlaneGeometry(3.6, 2.4);
    disposables.push(trackpadMat, trackpadGeo);
    const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(-1.0, baseH + 0.01, 1.8);
    laptopGroup.add(trackpad);

    // Lid
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, baseH, -baseD / 2 + 0.2);

    const hingeGeo = new THREE.CylinderGeometry(0.12, 0.12, 9);
    disposables.push(hingeGeo);
    const hinge = new THREE.Mesh(hingeGeo, blackPlasticMat);
    hinge.rotation.z = Math.PI / 2;
    lidGroup.add(hinge);

    const lidGeometry = new THREE.BoxGeometry(baseW, baseD - 0.2, 0.1);
    disposables.push(lidGeometry);
    const lidMaterials = [grayMat, grayMat, grayMat, grayMat, grayMat, lidMat];
    const lid = new THREE.Mesh(lidGeometry, lidMaterials);
    lid.position.set(0, (baseD - 0.2) / 2, 0.05);
    lid.castShadow = true;
    lidGroup.add(lid);

    const bezelGeo = new THREE.PlaneGeometry(baseW - 0.1, baseD - 0.3);
    disposables.push(bezelGeo);
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, (baseD - 0.2) / 2, 0.101);
    lidGroup.add(bezel);

    const displayGeo = new THREE.PlaneGeometry(baseW - 0.8, baseD - 1.2);
    disposables.push(displayGeo);
    const display = new THREE.Mesh(displayGeo, screenMat);
    display.position.set(0, (baseD - 0.2) / 2 + 0.1, 0.102);
    lidGroup.add(display);

    laptopGroup.add(lidGroup);

    // Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(40, 40);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    disposables.push(shadowGeo, shadowMat);
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.1;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    scene.add(laptopGroup);

    // ============ Animação ============
    lidGroup.rotation.x = Math.PI / 2;
    laptopGroup.rotation.y = -Math.PI / 5;

    let autoRotate = true;
    let opening = true;
    let rafId = 0;

    const stopAuto = () => {
      autoRotate = false;
    };
    container.addEventListener('mousedown', stopAuto);
    container.addEventListener('touchstart', stopAuto, { passive: true });
    container.addEventListener('wheel', stopAuto, { passive: true });

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (opening) {
        lidGroup.rotation.x -= 0.025;
        if (lidGroup.rotation.x <= -0.15) opening = false;
      }
      if (autoRotate && !opening) {
        laptopGroup.rotation.y += 0.002;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', stopAuto);
      container.removeEventListener('touchstart', stopAuto);
      container.removeEventListener('wheel', stopAuto);
      controls.dispose();
      disposables.forEach((d) => {
        try {
          d.dispose();
        } catch {
          /* noop */
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [tier]);

  return (
    <div className="relative w-full max-w-[880px] mx-auto select-none">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-3xl"
        style={{
          height: 'min(72vh, 560px)',
          minHeight: 380,
          background:
            'linear-gradient(180deg, #2a1a4a 0%, #1a0d2e 50%, #0a0512 100%)',
          touchAction: 'none',
        }}
      />
    </div>
  );
}
