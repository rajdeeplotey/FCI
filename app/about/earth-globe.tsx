"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type * as Three from "three";
import canadaBoundary from "./canada-boundary.geo.json";

type Coordinate = [number, number];
type Polygon = Coordinate[][];

const VIEW_SIZE = 960;
const VIEW_CENTER_LONGITUDE = -100;
const VIEW_CENTER_LATITUDE = 25;
const VIEW_RADIUS = 420;
const EARTH_RADIUS = 1.3;
const VERTICAL_LIMIT = 1.05;

function parseCoordinate(point: number[]): Coordinate {
  return [point[0], point[1]];
}

const canadaPolygons: Polygon[] = canadaBoundary.features[0].geometry.coordinates.map(
  (polygon) => polygon.map((ring) => ring.map(parseCoordinate)),
);

function projectToStaticView([longitude, latitude]: Coordinate) {
  const lambda = ((longitude - VIEW_CENTER_LONGITUDE) * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;
  const centerPhi = (VIEW_CENTER_LATITUDE * Math.PI) / 180;
  const depth =
    Math.sin(centerPhi) * Math.sin(phi) +
    Math.cos(centerPhi) * Math.cos(phi) * Math.cos(lambda);

  return {
    x: VIEW_SIZE / 2 + VIEW_RADIUS * Math.cos(phi) * Math.sin(lambda),
    y:
      VIEW_SIZE / 2 -
      VIEW_RADIUS *
        (Math.cos(centerPhi) * Math.sin(phi) -
          Math.sin(centerPhi) * Math.cos(phi) * Math.cos(lambda)),
    visible: depth >= 0,
  };
}

function toStaticPath(polygons: Polygon[]) {
  return polygons.map((polygon) =>
    polygon
      .map((ring) => {
        const points = ring.map(projectToStaticView);
        if (points.some((point) => !point.visible)) return "";
        return (
          points
            .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
            .join("") + "Z"
        );
      })
      .join("")
  );
}

function roundStaticPoint(point: ReturnType<typeof projectToStaticView>) {
  return { ...point, x: Number(point.x.toFixed(2)), y: Number(point.y.toFixed(2)) };
}

const staticCanadaPaths = toStaticPath(canadaPolygons);
const staticMarker = roundStaticPoint(projectToStaticView([-79.3832, 43.6532]));
const staticLabel = roundStaticPoint(projectToStaticView([-104, 58]));

function drawCanadaTexture(THREE: typeof import("three")) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the Canada map texture.");

  for (const polygon of canadaPolygons) {
    context.beginPath();
    for (const ring of polygon) {
      ring.forEach(([longitude, latitude], index) => {
        const x = ((longitude + 180) / 360) * canvas.width;
        const y = ((90 - latitude) / 180) * canvas.height;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
    }
    context.fillStyle = "rgba(181, 31, 44, 0.66)";
    context.fill("evenodd");
    context.lineWidth = 2.2;
    context.strokeStyle = "rgba(255, 133, 143, 0.96)";
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function surfacePosition(
  THREE: typeof import("three"),
  longitude: number,
  latitude: number,
  radius: number
) {
  const theta = ((longitude + 180) / 360) * Math.PI * 2;
  const phi = ((90 - latitude) / 180) * Math.PI;
  return new THREE.Vector3(
    -Math.cos(theta) * Math.sin(phi) * radius,
    Math.cos(phi) * radius,
    Math.sin(theta) * Math.sin(phi) * radius
  );
}

function makeCanadaLabel(THREE: typeof import("three")) {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 86;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "rgba(9, 25, 39, 0.92)";
  context.fillRect(2, 2, 296, 82);
  context.strokeStyle = "rgba(255, 133, 143, 0.9)";
  context.lineWidth = 3;
  context.strokeRect(2, 2, 296, 82);
  context.fillStyle = "#ffffff";
  context.font = "600 38px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("CANADA", 150, 44);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const label = new THREE.Sprite(material);
  label.scale.set(0.48, 0.14, 1);
  return { label, material, texture };
}

export default function EarthGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let disposed = false;
    let renderer: Three.WebGLRenderer | null = null;
    let camera: Three.PerspectiveCamera | null = null;
    let scene: Three.Scene | null = null;
    let globe: Three.Group | null = null;
    let cloudLayer: Three.Mesh | null = null;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let lastPointerTime = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let dragging = false;
    let isVisible = true;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeListener: (() => void) | null = null;
    let cleanupInteractions = () => {};
    const geometries: Three.BufferGeometry[] = [];
    const materials: Three.Material[] = [];
    const textures: Three.Texture[] = [];

    const stopAnimation = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrameTime = 0;
    };

    const runFrame = (time: number) => {
      animationFrame = 0;
      if (disposed || !renderer || !scene || !camera || !globe || !isVisible || document.hidden) {
        return;
      }

      const delta = lastFrameTime ? Math.min(time - lastFrameTime, 40) : 16.67;
      lastFrameTime = time;
      if (!dragging) {
        globe.rotation.y += velocityX * delta + 0.000035 * delta;
        globe.rotation.x = Math.max(
          -VERTICAL_LIMIT,
          Math.min(VERTICAL_LIMIT, globe.rotation.x + velocityY * delta)
        );
        const decay = Math.pow(0.94, delta / 16.67);
        velocityX *= decay;
        velocityY *= decay;
        if (Math.abs(velocityX) < 0.00002) velocityX = 0;
        if (Math.abs(velocityY) < 0.00002) velocityY = 0;
      }
      if (cloudLayer) cloudLayer.rotation.y += 0.000008 * delta;

      renderer.render(scene, camera);
      if (!disposed && isVisible && !document.hidden) {
        animationFrame = requestAnimationFrame(runFrame);
      }
    };

    const requestFrame = () => {
      if (!animationFrame && isVisible && !document.hidden) {
        animationFrame = requestAnimationFrame(runFrame);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation();
      else requestFrame();
    };

    const initialize = async () => {
      try {
        const THREE = await import("three");
        if (disposed) return;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.domElement.setAttribute("aria-label", "Interactive 3D Earth. Drag to rotate or use the arrow keys when focused.");
        renderer.domElement.setAttribute("role", "application");
        renderer.domElement.setAttribute("tabindex", "0");
        renderer.domElement.setAttribute("data-earth-canvas", "true");
        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
        camera.position.set(0, 0, 4.75);

        scene.add(new THREE.AmbientLight(0x8daecc, 1.7));
        const keyLight = new THREE.DirectionalLight(0xfff1d8, 2.2);
        keyLight.position.set(-3, 2.5, 4);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0x5a84c1, 0.58);
        fillLight.position.set(3, -1, 2);
        scene.add(fillLight);

        globe = new THREE.Group();
        globe.rotation.set(0.95, 0.17, 0);
        scene.add(globe);

        const loader = new THREE.TextureLoader();
        const earthTexture = await loader.loadAsync("/about-earth-texture-bright.jpg");
        if (disposed) {
          earthTexture.dispose();
          return;
        }
        textures.push(earthTexture);
        earthTexture.colorSpace = THREE.SRGBColorSpace;
        earthTexture.wrapS = THREE.RepeatWrapping;
        earthTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

        const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 88, 64);
        geometries.push(earthGeometry);
        const earthMaterial = new THREE.MeshBasicMaterial({
          map: earthTexture,
        });
        earthMaterial.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `#include <map_fragment>
            float oceanLuminance = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
            float oceanBlueBias = diffuseColor.b - max(diffuseColor.r, diffuseColor.g) * 1.15;
            float oceanMask = smoothstep(0.0008, 0.008, oceanBlueBias) *
              (1.0 - smoothstep(0.08, 0.3, oceanLuminance));
            vec3 richerOcean = diffuseColor.rgb * vec3(1.25, 2.2, 3.2) +
              vec3(0.001, 0.006, 0.025);
            diffuseColor.rgb = mix(diffuseColor.rgb, richerOcean, oceanMask * 0.9);`
          );
        };
        materials.push(earthMaterial);
        globe.add(new THREE.Mesh(earthGeometry, earthMaterial));

        const countryTexture = drawCanadaTexture(THREE);
        textures.push(countryTexture);
        const countryGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.003, 88, 64);
        geometries.push(countryGeometry);
        const countryMaterial = new THREE.MeshBasicMaterial({
          map: countryTexture,
          transparent: true,
          depthWrite: false,
          side: THREE.FrontSide,
        });
        materials.push(countryMaterial);
        globe.add(new THREE.Mesh(countryGeometry, countryMaterial));

        try {
          const cloudsTexture = await loader.loadAsync("/about-earth-clouds.png");
          if (disposed) {
            cloudsTexture.dispose();
            return;
          }
          textures.push(cloudsTexture);
          cloudsTexture.colorSpace = THREE.SRGBColorSpace;
          cloudsTexture.wrapS = THREE.RepeatWrapping;
          cloudsTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
          const cloudsGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.011, 80, 56);
          geometries.push(cloudsGeometry);
          const cloudsMaterial = new THREE.MeshBasicMaterial({
            map: cloudsTexture,
            color: 0xe5eff8,
            depthWrite: false,
            opacity: 0.82,
            transparent: true,
          });
          materials.push(cloudsMaterial);
          cloudLayer = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
          globe.add(cloudLayer);
        } catch {
          // The Earth and geographic highlight remain usable without clouds.
        }

        const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.045, 64, 48);
        geometries.push(atmosphereGeometry);
        const atmosphereMaterial = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewDirection;
            void main() {
              vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
              vNormal = normalize(normalMatrix * normal);
              vViewDirection = normalize(-viewPosition.xyz);
              gl_Position = projectionMatrix * viewPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vViewDirection;
            void main() {
              float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDirection))), 3.2);
              gl_FragColor = vec4(0.19, 0.48, 0.82, rim * 0.42);
            }
          `,
        });
        materials.push(atmosphereMaterial);
        globe.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));

        const labelData = makeCanadaLabel(THREE);
        if (labelData) {
          materials.push(labelData.material);
          textures.push(labelData.texture);
          labelData.label.position.copy(surfacePosition(THREE, -104, 58, EARTH_RADIUS * 1.035));
          globe.add(labelData.label);
        }

        const resize = () => {
          if (!renderer || !camera || !container) return;
          const { width, height } = container.getBoundingClientRect();
          if (!width || !height) return;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          requestFrame();
        };

        const ResizeObserverConstructor = Reflect.get(window, "ResizeObserver") as
          | typeof ResizeObserver
          | undefined;
        if (ResizeObserverConstructor) {
          resizeObserver = new ResizeObserverConstructor(resize);
          resizeObserver.observe(container);
        } else {
          resizeListener = resize;
          window.addEventListener("resize", resizeListener);
        }
        resize();

        if ("IntersectionObserver" in window) {
          intersectionObserver = new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
              if (isVisible) requestFrame();
              else stopAnimation();
            },
            { rootMargin: "120px" }
          );
          intersectionObserver.observe(container);
        }

        const canvas = renderer.domElement;
        const onPointerDown = (event: PointerEvent) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          event.preventDefault();
          dragging = true;
          velocityX = 0;
          velocityY = 0;
          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          lastPointerTime = event.timeStamp;
          canvas.classList.add("is-dragging");
          canvas.setPointerCapture(event.pointerId);
          requestFrame();
        };
        const onPointerMove = (event: PointerEvent) => {
          if (!dragging || !globe) return;
          const dx = event.clientX - lastPointerX;
          const dy = event.clientY - lastPointerY;
          const elapsed = Math.max(8, event.timeStamp - lastPointerTime);
          const angularX = -dx * 0.0052;
          const angularY = dy * 0.0052;
          globe.rotation.y += angularX;
          globe.rotation.x = Math.max(
            -VERTICAL_LIMIT,
            Math.min(VERTICAL_LIMIT, globe.rotation.x + angularY)
          );
          velocityX = angularX / elapsed;
          velocityY = angularY / elapsed;
          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          lastPointerTime = event.timeStamp;
          requestFrame();
        };
        const onPointerUp = (event: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          canvas.classList.remove("is-dragging");
          if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
          requestFrame();
        };
        const onKeyDown = (event: KeyboardEvent) => {
          if (!globe) return;
          const step = 0.09;
          if (event.key === "ArrowLeft") globe.rotation.y += step;
          else if (event.key === "ArrowRight") globe.rotation.y -= step;
          else if (event.key === "ArrowUp") globe.rotation.x = Math.max(-VERTICAL_LIMIT, globe.rotation.x - step);
          else if (event.key === "ArrowDown") globe.rotation.x = Math.min(VERTICAL_LIMIT, globe.rotation.x + step);
          else return;
          event.preventDefault();
          requestFrame();
        };
        const onContextLost = (event: Event) => {
          event.preventDefault();
          setIsReady(false);
          stopAnimation();
        };

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);
        canvas.addEventListener("keydown", onKeyDown);
        canvas.addEventListener("webglcontextlost", onContextLost);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        cleanupInteractions = () => {
          canvas.removeEventListener("pointerdown", onPointerDown);
          canvas.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerup", onPointerUp);
          canvas.removeEventListener("pointercancel", onPointerUp);
          canvas.removeEventListener("keydown", onKeyDown);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        };

        setIsReady(true);
        requestFrame();
      } catch {
        stopAnimation();
        if (renderer) {
          renderer.dispose();
          renderer.domElement.remove();
          renderer = null;
        }
        for (const geometry of geometries) geometry.dispose();
        for (const material of materials) material.dispose();
        for (const texture of textures) texture.dispose();
        if (!disposed) setIsReady(false);
      }
    };

    void initialize();

    return () => {
      disposed = true;
      stopAnimation();
      cleanupInteractions();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (resizeListener) window.removeEventListener("resize", resizeListener);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      for (const texture of textures) texture.dispose();
      renderer?.dispose();
      if (renderer?.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      aria-label="Earth centered on North America, with Canada highlighted in red"
      className={`about-globe-renderer${isReady ? " is-ready" : ""}`}
      ref={containerRef}
      role="group"
    >
      <Image
        alt=""
        className="about-globe-poster"
        fill
        sizes="(min-width: 900px) 46vw, 90vw"
        src="/about-earth.jpg"
        unoptimized
      />
      <svg
        aria-hidden={isReady}
        className="about-globe-static-map"
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      >
        {staticCanadaPaths.map((path, index) => (
          <path d={path} fillRule="evenodd" key={index} />
        ))}
        <circle cx={staticMarker.x} cy={staticMarker.y} r="9" />
        <circle cx={staticMarker.x} cy={staticMarker.y} r="18" />
        <text x={staticLabel.x} y={staticLabel.y}>
          CANADA
        </text>
      </svg>
      <span className="sr-only" aria-live="polite">
        {isReady
          ? "Interactive globe ready. Drag in any direction or focus the globe and use the arrow keys to rotate."
          : "Static globe view showing Canada highlighted in red."}
      </span>
    </div>
  );
}
