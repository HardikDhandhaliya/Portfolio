/* ============================================
   THREE.JS HERO SCENE
   ============================================ */

class HeroScene {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas || typeof THREE === 'undefined') return;

    this.mouse    = { x: 0, y: 0 };
    this.target   = { x: 0, y: 0 };
    this.clock    = new THREE.Clock();

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initLights();
    this._buildOrb();
    this._buildParticles();
    this._buildRings();
    this._buildStarField();
    this._bindEvents();
    this._animate();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._resize();
  }

  _initScene() {
    this.scene = new THREE.Scene();
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(52, this.W / this.H, 0.1, 120);
    this.camera.position.set(0, 0, 6);
  }

  _initLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    const gold = new THREE.PointLight(0xc8a97e, 3.5, 10);
    gold.position.set(3, 2, 4);
    this.scene.add(gold);

    const teal = new THREE.PointLight(0x4db8b0, 1.8, 10);
    teal.position.set(-3, -2, 2);
    this.scene.add(teal);

    const rim = new THREE.PointLight(0xc8a97e, 0.8, 8);
    rim.position.set(0, 4, -2);
    this.scene.add(rim);
  }

  _buildOrb() {
    this.orbGroup = new THREE.Group();
    // Right-of-center offset so it doesn't sit on text
    this.orbGroup.position.set(2.2, 0, 0);
    this.scene.add(this.orbGroup);

    // Inner glow sphere
    const iGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const iMat = new THREE.MeshPhongMaterial({
      color: 0x0b0a0d,
      emissive: 0xc8a97e,
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.85,
      shininess: 60,
    });
    this.innerSphere = new THREE.Mesh(iGeo, iMat);
    this.orbGroup.add(this.innerSphere);

    // Wireframe icosahedron layer 1
    const w1Geo = new THREE.IcosahedronGeometry(1.45, 2);
    const w1Mat = new THREE.MeshBasicMaterial({
      color: 0xc8a97e,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    this.wire1 = new THREE.Mesh(w1Geo, w1Mat);
    this.orbGroup.add(this.wire1);

    // Wireframe icosahedron layer 2
    const w2Geo = new THREE.IcosahedronGeometry(1.72, 1);
    const w2Mat = new THREE.MeshBasicMaterial({
      color: 0x4db8b0,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
    });
    this.wire2 = new THREE.Mesh(w2Geo, w2Mat);
    this.orbGroup.add(this.wire2);

    // Outer haze sphere
    const oGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const oMat = new THREE.MeshPhongMaterial({
      color: 0xc8a97e,
      emissive: 0xc8a97e,
      emissiveIntensity: 0.04,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
    });
    this.orbGroup.add(new THREE.Mesh(oGeo, oMat));
  }

  _buildParticles() {
    // Two layers: orbital shell + scattered cloud
    this._addParticleShell(1800, 2.3, 0.18, 0xc8a97e, 0.018, 0.75);
    this._addParticleShell(600,  3.2, 0.6,  0x4db8b0, 0.014, 0.45);
  }

  _addParticleShell(count, radius, spread, color, size, opacity) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r     = radius + (Math.random() - 0.5) * spread;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size, transparent: true, opacity, sizeAttenuation: true,
    });
    const pts = new THREE.Points(geo, mat);
    this.orbGroup.add(pts);
    if (!this.particleSystems) this.particleSystems = [];
    this.particleSystems.push(pts);
  }

  _buildRings() {
    this.rings = [];
    const configs = [
      { r: 1.95, tube: 0.005, color: 0xc8a97e, opacity: 0.22, rx: Math.PI / 2,       rz: 0 },
      { r: 2.1,  tube: 0.003, color: 0xc8a97e, opacity: 0.12, rx: Math.PI / 2 + 0.5, rz: 0.4 },
      { r: 2.28, tube: 0.003, color: 0x4db8b0, opacity: 0.08, rx: 0.3,               rz: 0.8 },
    ];
    configs.forEach(cfg => {
      const geo = new THREE.TorusGeometry(cfg.r, cfg.tube, 2, 128);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color, transparent: true, opacity: cfg.opacity,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = cfg.rx;
      ring.rotation.z = cfg.rz;
      this.orbGroup.add(ring);
      this.rings.push(ring);
    });
  }

  _buildStarField() {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xf2ede4, size: 0.025,
      transparent: true, opacity: 0.28, sizeAttenuation: true,
    });
    this.scene.add(new THREE.Points(geo, mat));
  }

  _resize() {
    const parent = this.canvas.parentElement;
    this.W = parent.clientWidth;
    this.H = parent.clientHeight;
    this.renderer.setSize(this.W, this.H);
    if (this.camera) {
      this.camera.aspect = this.W / this.H;
      this.camera.updateProjectionMatrix();
    }
  }

  _bindEvents() {
    document.addEventListener('mousemove', e => {
      this.target.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      this.target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('resize', () => this._resize());
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    const t  = this.clock.getElapsedTime();
    const dt = 0.06;

    // Smooth mouse lerp
    this.mouse.x += (this.target.x - this.mouse.x) * dt;
    this.mouse.y += (this.target.y - this.mouse.y) * dt;

    // Orb group tilt follows mouse
    this.orbGroup.rotation.y = t * 0.08 + this.mouse.x * 0.25;
    this.orbGroup.rotation.x = this.mouse.y * 0.18;

    // Inner wireframes counter-rotate for layered feel
    this.wire1.rotation.y =  t * 0.14;
    this.wire1.rotation.z =  t * 0.06;
    this.wire2.rotation.y = -t * 0.09;
    this.wire2.rotation.x =  t * 0.11;

    // Inner sphere pulse
    const pulse = 1 + Math.sin(t * 1.1) * 0.025;
    this.innerSphere.scale.setScalar(pulse);

    // Emissive breathe
    this.innerSphere.material.emissiveIntensity = 0.12 + Math.sin(t * 0.9) * 0.05;

    // Rings rotate at different speeds
    this.rings[0].rotation.z += 0.0025;
    this.rings[1].rotation.z -= 0.0018;
    this.rings[2].rotation.y += 0.002;

    // Particle shells counter-drift
    if (this.particleSystems) {
      this.particleSystems[0].rotation.y =  t * 0.03 - this.mouse.x * 0.06;
      this.particleSystems[1].rotation.y = -t * 0.05 + this.mouse.x * 0.04;
    }

    // Camera parallax
    this.camera.position.x += (this.mouse.x * 0.4  - this.camera.position.x) * 0.04;
    this.camera.position.y += (-this.mouse.y * 0.25 - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => { new HeroScene(); });
