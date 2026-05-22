import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  vertexShader,
  fluidFragmentShader,
  displayFragmentShader,
} from "./shaders";

const SIM_SIZE = 512;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const base = import.meta.env.BASE_URL;
    const topUrl = `${base}top.png`;
    const bottomUrl = `${base}bottom.png`;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };

    let rtA = new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, rtOptions);

    const loader = new THREE.TextureLoader();
    const topTexture = loader.load(topUrl, (t) => {
      fluidMaterial; // noop
      displayMaterial.uniforms.uTopTextureSize.value.set(
        t.image.width,
        t.image.height,
      );
    });
    const bottomTexture = loader.load(bottomUrl, (t) => {
      displayMaterial.uniforms.uBottomTextureSize.value.set(
        t.image.width,
        t.image.height,
      );
    });
    for (const tex of [topTexture, bottomTexture]) {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    }

    const initialResolution = new THREE.Vector2(
      container.clientWidth * dpr,
      container.clientHeight * dpr,
    );

    const fluidMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fluidFragmentShader,
      uniforms: {
        uPrevTrails: { value: rtA.texture },
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uPrevMouse: { value: new THREE.Vector2(-1, -1) },
        uResolution: { value: initialResolution.clone() },
        uDecay: { value: 0.96 },
        uIsMoving: { value: false },
      },
    });

    const displayMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: displayFragmentShader,
      uniforms: {
        uFluid: { value: rtA.texture },
        uTopTexture: { value: topTexture },
        uBottomTexture: { value: bottomTexture },
        uResolution: { value: initialResolution.clone() },
        uDpr: { value: dpr },
        uTopTextureSize: { value: new THREE.Vector2(0, 0) },
        uBottomTextureSize: { value: new THREE.Vector2(0, 0) },
      },
    });

    const simMesh = new THREE.Mesh(geometry, fluidMaterial);
    const displayMesh = new THREE.Mesh(geometry, displayMaterial);
    const simScene = new THREE.Scene();
    simScene.add(simMesh);
    scene.add(displayMesh);

    const mouse = new THREE.Vector2(-1, -1);
    const prevMouse = new THREE.Vector2(-1, -1);
    let isMoving = false;
    let movingTimeout: number | null = null;
    let hasMouse = false;

    const setMouseFromClient = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height;
      if (!hasMouse) {
        mouse.set(x, y);
        prevMouse.set(x, y);
        hasMouse = true;
      } else {
        prevMouse.copy(mouse);
        mouse.set(x, y);
      }
      isMoving = true;
      if (movingTimeout !== null) window.clearTimeout(movingTimeout);
      movingTimeout = window.setTimeout(() => {
        isMoving = false;
      }, 50);
    };

    const onMouseMove = (e: MouseEvent) => {
      setMouseFromClient(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouseFromClient(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      const res = new THREE.Vector2(w * dpr, h * dpr);
      fluidMaterial.uniforms.uResolution.value.copy(res);
      displayMaterial.uniforms.uResolution.value.copy(res);
    };
    window.addEventListener("resize", onResize);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      fluidMaterial.uniforms.uPrevTrails.value = rtA.texture;
      fluidMaterial.uniforms.uMouse.value.copy(mouse);
      fluidMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
      fluidMaterial.uniforms.uIsMoving.value = isMoving && hasMouse;

      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);
      renderer.setRenderTarget(null);

      displayMaterial.uniforms.uFluid.value = rtB.texture;
      renderer.render(scene, camera);

      const tmp = rtA;
      rtA = rtB;
      rtB = tmp;

      prevMouse.copy(mouse);
      if (isMoving === false) {
        // keep prevMouse synced
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if (movingTimeout !== null) window.clearTimeout(movingTimeout);
      renderer.dispose();
      geometry.dispose();
      fluidMaterial.dispose();
      displayMaterial.dispose();
      rtA.dispose();
      rtB.dispose();
      topTexture.dispose();
      bottomTexture.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="hero-root">
      <div ref={containerRef} className="hero-canvas" />
      <div className="hero-text">
        <div>CLARK</div>
        <div>KENT</div>
      </div>
      <a href="#contact" className="contact-btn rounded-tl-[1px] rounded-tr-[1px] rounded-br-[1px] rounded-bl-[1px]">
        <span className="contact-btn-corner top-left"></span>
        <span className="contact-btn-corner top-right"></span>
        <span className="contact-btn-text">Get in touch</span>
        <span className="contact-btn-corner bottom-left"></span>
        <span className="contact-btn-corner bottom-right"></span>
      </a>
    </div>
  );
}
