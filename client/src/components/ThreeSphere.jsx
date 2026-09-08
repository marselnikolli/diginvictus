import React, { useEffect, useRef } from "react";

const DOT_COLOR = "150, 225, 240"; // soft ice-blue particles
const DOT_COUNT = 1000;
const SPHERE_MIN = 450;
const SPHERE_SPREAD = 10; // radius = 450 + random*10 → thin shell
const CAMERA_Z = 900;
const FOV_DEG = 75;
const PARALLAX = 0.05;
const BASE_Y = 200;

export default function ThreeSphere({ enabled = true, className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!enabled || !mountRef.current) return undefined;

    const mount = mountRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    mount.appendChild(canvas);

    let width = window.innerWidth;
    let height = window.innerHeight;

    function setSize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }
    setSize();

    // 1000 points on a thin shell sphere (radius 450–460), same as original sphere.js
    const px = new Float32Array(DOT_COUNT);
    const py = new Float32Array(DOT_COUNT);
    const pz = new Float32Array(DOT_COUNT);
    for (let i = 0; i < DOT_COUNT; i++) {
      let x = Math.random() * 2 - 1;
      let y = Math.random() * 2 - 1;
      let z = Math.random() * 2 - 1;
      const len = Math.sqrt(x * x + y * y + z * z);
      const r = SPHERE_MIN + Math.random() * SPHERE_SPREAD;
      px[i] = (x / len) * r;
      py[i] = (y / len) * r;
      pz[i] = (z / len) * r;
    }

    let mouseX = 0;
    let mouseY = 0;
    const cam = { x: 0, y: 0, z: CAMERA_Z };

    function onMouseMove(e) {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    }

    function onResize() {
      setSize();
    }

    document.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("resize", onResize, false);

    const k = height / 2 / Math.tan((FOV_DEG * Math.PI) / 360);
    const sxArr = new Float32Array(DOT_COUNT);
    const syArr = new Float32Array(DOT_COUNT);
    const depthArr = new Float32Array(DOT_COUNT);
    const radArr = new Float32Array(DOT_COUNT);
    const order = Array.from({ length: DOT_COUNT }, (_, i) => i);

    let raf;
    function frame() {
      raf = requestAnimationFrame(frame);

      // Parallax — same easing as the original
      cam.x += PARALLAX * (mouseX - cam.x);
      cam.y += PARALLAX * (BASE_Y - mouseY - cam.y);

      // View basis: camera looks from (cam) toward origin, up = (0,1,0)
      let fwdX = -cam.x;
      let fwdY = -cam.y;
      let fwdZ = -cam.z;
      const fl = Math.sqrt(fwdX * fwdX + fwdY * fwdY + fwdZ * fwdZ);
      fwdX /= fl;
      fwdY /= fl;
      fwdZ /= fl;

      let rightX = -fwdZ;
      let rightZ = fwdX;
      const rl = Math.sqrt(rightX * rightX + rightZ * rightZ) || 1;
      rightX /= rl;
      rightZ /= rl;

      // up = cross(right, fwd)
      const upX = -rightZ * fwdY;
      const upY = rightZ * fwdX - rightX * fwdZ;
      const upZ = rightX * fwdY;

      const halfW = width / 2;
      const halfH = height / 2;

      for (let i = 0; i < DOT_COUNT; i++) {
        const dx = px[i] - cam.x;
        const dy = py[i] - cam.y;
        const dz = pz[i] - cam.z;
        const cz = dx * fwdX + dy * fwdY + dz * fwdZ;
        depthArr[i] = cz;
        if (cz <= 0) {
          sxArr[i] = -9999;
          continue;
        }
        const cx = dx * rightX + dz * rightZ;
        const cy = dx * upX + dy * upY + dz * upZ;
        sxArr[i] = (cx * k) / cz + halfW;
        syArr[i] = halfH - (cy * k) / cz;
        radArr[i] = k / cz; // world radius 1 → pixels (sprite scale 2 → diameter 2, radius 1)
      }

      // Draw far-to-near (depth sort, same as CanvasRenderer sprite sorting)
      order.sort((a, b) => depthArr[b] - depthArr[a]);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgb(${DOT_COLOR})`;
      for (let n = 0; n < DOT_COUNT; n++) {
        const i = order[n];
        if (sxArr[i] < -9000) continue;
        ctx.beginPath();
        ctx.arc(sxArr[i], syArr[i], radArr[i], 0, Math.PI * 2);
        ctx.fill();
      }
    }

    frame();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (canvas.parentNode === mount) {
        mount.removeChild(canvas);
      }
    };
  }, [enabled]);

  return <div ref={mountRef} className={`hero-threejs ${className}`} aria-hidden="true" />;
}
