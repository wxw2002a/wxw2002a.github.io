import { useEffect, useId, useRef, useState } from "react";

/** A floating modular cube, lit locally without textures or remote assets. */
export default function SculptureScene({
  paused = false,
  reducedMotion = false,
}) {
  const hostRef = useRef(null);
  const settingsRef = useRef({ paused, reducedMotion });
  const reconcileRef = useRef(null);
  const [rendererType, setRendererType] = useState("fallback");
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    settingsRef.current = { paused, reducedMotion };
    reconcileRef.current?.();
  }, [paused, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let disposed = false;
    let teardown = () => {};

    async function createScene() {
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/addons/environments/RoomEnvironment.js"),
        ]);
        if (disposed) return;

        // Checking the context first avoids Three.js logging an error on
        // browsers which deliberately disable WebGL, such as battery savers.
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          premultipliedAlpha: true,
        });
        if (!context) return;

        let renderer;
        let environmentTarget;
        let environmentRoom;
        let pmrem;
        let resizeObserver;
        let intersectionObserver;
        let frameId = 0;
        let failed = false;
        let lastTime = 0;
        let elapsed = 0;
        let visible = true;
        let pageVisible = !document.hidden;
        let dragging = false;
        let capturedPointer = null;
        let previousX = 0;
        let previousY = 0;
        let dragX = 0;
        let dragY = 0;
        let pointerX = 0;
        let pointerY = 0;
        let smoothX = 0;
        let smoothY = 0;
        let scrollAmount = 0;
        const disposables = new Set();
        const removers = [];
        const scene = new THREE.Scene();

        const own = (resource) => {
          disposables.add(resource);
          return resource;
        };
        const listen = (target, type, handler, options) => {
          target.addEventListener(type, handler, options);
          removers.push(() =>
            target.removeEventListener(type, handler, options),
          );
        };
        const stop = () => {
          cancelAnimationFrame(frameId);
          frameId = 0;
          lastTime = 0;
          host.dataset.motion = "paused";
        };
        teardown = () => {
          stop();
          reconcileRef.current = null;
          resizeObserver?.disconnect();
          intersectionObserver?.disconnect();
          removers.forEach((remove) => remove());
          if (
            capturedPointer !== null &&
            host.hasPointerCapture(capturedPointer)
          ) {
            host.releasePointerCapture(capturedPointer);
          }
          host.style.cursor = "";
          scene.environment = null;
          disposables.forEach((resource) => resource.dispose());
          environmentTarget?.dispose();
          environmentRoom?.dispose();
          pmrem?.dispose();
          renderer?.dispose();
          renderer?.forceContextLoss();
          canvas.remove();
        };

        renderer = new THREE.WebGLRenderer({
          canvas,
          context,
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x09090b, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText =
          "position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;";

        // Broad local reflection panels softly light the brushed-metal planes.
        environmentRoom = new RoomEnvironment();
        environmentRoom.traverse((object) => {
          if (object.material?.isMeshStandardMaterial) {
            object.material.color.set(0x35363b);
          }
        });
        pmrem = new THREE.PMREMGenerator(renderer);
        environmentTarget = pmrem.fromScene(environmentRoom, 0.04);
        scene.environment = environmentTarget.texture;
        scene.environmentIntensity = 1.1;
        environmentRoom.dispose();
        environmentRoom = undefined;
        pmrem.dispose();
        pmrem = undefined;

        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
        const sculpture = new THREE.Group();
        scene.add(sculpture);

        const silver = own(
          new THREE.MeshPhysicalMaterial({
            color: 0x75808a,
            metalness: 0.85,
            roughness: 0.36,
            clearcoat: 0.12,
            clearcoatRoughness: 0.5,
            envMapIntensity: 0.85,
          }),
        );
        const accent = own(
          new THREE.MeshStandardMaterial({
            color: 0xe6ff7b,
            metalness: 0.1,
            roughness: 0.5,
            emissive: 0x667b13,
            emissiveIntensity: 0.2,
          }),
        );
        const frameMaterial = own(
          new THREE.LineBasicMaterial({
            color: 0xe6ff7b,
            transparent: true,
            opacity: 0.48,
          }),
        );
        const edgeMaterial = own(
          new THREE.LineBasicMaterial({
            color: 0xe2e8f0,
            transparent: true,
            opacity: 0.25,
          }),
        );
        const moduleGeometry = own(new THREE.BoxGeometry(1.08, 1.08, 1.08));
        const moduleEdges = own(new THREE.EdgesGeometry(moduleGeometry));
        const modules = [];
        for (const x of [-1, 1]) {
          for (const y of [-1, 1]) {
            for (const z of [-1, 1]) {
              const block = new THREE.Mesh(moduleGeometry, silver);
              block.userData.direction = new THREE.Vector3(x, y, z);
              block.position
                .copy(block.userData.direction)
                .multiplyScalar(0.59);
              block.add(new THREE.LineSegments(moduleEdges, edgeMaterial));
              sculpture.add(block);
              modules.push(block);
            }
          }
        }

        // A precise construction cage frames the eight independent modules.
        const cageGeometry = own(new THREE.BoxGeometry(3.25, 3.25, 3.25));
        const cageEdges = own(new THREE.EdgesGeometry(cageGeometry));
        sculpture.add(new THREE.LineSegments(cageEdges, frameMaterial));
        const anchorGeometry = own(new THREE.BoxGeometry(0.065, 0.065, 0.065));
        for (const x of [-1, 1]) {
          for (const y of [-1, 1]) {
            for (const z of [-1, 1]) {
              const anchor = new THREE.Mesh(anchorGeometry, accent);
              anchor.position.set(x * 1.625, y * 1.625, z * 1.625);
              sculpture.add(anchor);
            }
          }
        }
        const marker = new THREE.Mesh(
          own(new THREE.BoxGeometry(0.36, 0.035, 0.035)),
          accent,
        );
        marker.position.set(0.59, 1.155, 1.12);
        sculpture.add(marker);

        const keyLight = new THREE.DirectionalLight(0xf5f3e9, 2.5);
        keyLight.position.set(-3, 5, 4);
        scene.add(keyLight);
        const edgeLight = new THREE.DirectionalLight(0xe6ffb5, 2);
        edgeLight.position.set(4, -0.5, -3);
        scene.add(edgeLight);
        const fillLight = new THREE.DirectionalLight(0xc4d0e8, 0.8);
        fillLight.position.set(-4, -2, 2);
        scene.add(fillLight);

        const canAnimate = () =>
          !disposed &&
          !failed &&
          visible &&
          pageVisible &&
          !settingsRef.current.paused &&
          !settingsRef.current.reducedMotion;

        const render = () => {
          if (disposed || failed || !renderer) return;
          try {
            renderer.render(scene, camera);
          } catch {
            failed = true;
            stop();
            canvas.style.visibility = "hidden";
            if (!disposed) setRendererType("fallback");
          }
        };

        const pose = (delta) => {
          const easing = 1 - Math.exp(-delta * 4.5);
          smoothX += (pointerX * 0.16 + dragX - smoothX) * easing;
          smoothY += (pointerY * 0.09 + dragY - smoothY) * easing;
          sculpture.rotation.set(
            0.32 + smoothY + Math.sin(elapsed * 0.2) * 0.025,
            -0.52 +
              smoothX +
              Math.sin(elapsed * 0.16) * 0.065 +
              scrollAmount * 0.14,
            -0.04,
          );
          sculpture.position.y = Math.sin(elapsed * 0.5) * 0.045;
          const spacing = 0.59 + (1 + Math.sin(elapsed * 0.4)) * 0.012;
          modules.forEach((block) => {
            block.position
              .copy(block.userData.direction)
              .multiplyScalar(spacing);
          });
        };

        const tick = (now) => {
          frameId = 0;
          if (!canAnimate()) {
            lastTime = 0;
            return;
          }
          const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
          lastTime = now;
          elapsed += delta;
          pose(delta);
          render();
          if (canAnimate()) frameId = requestAnimationFrame(tick);
        };

        const reconcile = () => {
          if (canAnimate()) {
            host.dataset.motion = "running";
            host.style.cursor = dragging ? "grabbing" : "grab";
            if (!frameId) frameId = requestAnimationFrame(tick);
          } else {
            stop();
            dragging = false;
            host.style.cursor = "";
          }
        };
        reconcileRef.current = reconcile;

        const resize = () => {
          if (disposed || failed) return;
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          // Fit the narrow dimension as well as the height, so a portrait
          // mobile viewport keeps all eight construction-cage corners intact.
          const angle = Math.atan(
            Math.tan(THREE.MathUtils.degToRad(17.5)) *
              Math.min(camera.aspect, 1),
          );
          camera.position.set(0, 0.1, 2.95 / Math.sin(angle));
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
          render();
        };

        const pointerMove = (event) => {
          if (event.pointerType !== "mouse" || !canAnimate()) return;
          pointerX = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
          pointerY = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
          if (!dragging) return;
          dragX += (event.clientX - previousX) * 0.007;
          dragY = THREE.MathUtils.clamp(
            dragY + (event.clientY - previousY) * 0.004,
            -0.7,
            0.7,
          );
          previousX = event.clientX;
          previousY = event.clientY;
        };

        const pointerDown = (event) => {
          if (
            event.pointerType !== "mouse" ||
            event.button !== 0 ||
            !canAnimate()
          )
            return;
          dragging = true;
          previousX = event.clientX;
          previousY = event.clientY;
          capturedPointer = event.pointerId;
          host.setPointerCapture(event.pointerId);
          host.style.cursor = "grabbing";
          event.preventDefault();
        };

        const pointerUp = () => {
          dragging = false;
          if (
            capturedPointer !== null &&
            host.hasPointerCapture(capturedPointer)
          ) {
            host.releasePointerCapture(capturedPointer);
          }
          capturedPointer = null;
          host.style.cursor = canAnimate() ? "grab" : "";
        };

        const readScroll = () => {
          scrollAmount = Math.min(
            window.scrollY / Math.max(window.innerHeight, 1),
            2,
          );
        };

        listen(window, "pointermove", pointerMove, { passive: true });
        listen(host, "pointerdown", pointerDown);
        listen(host, "pointerup", pointerUp);
        listen(host, "pointercancel", pointerUp);
        listen(host, "lostpointercapture", pointerUp);
        listen(window, "blur", pointerUp);
        listen(window, "scroll", readScroll, { passive: true });
        listen(document, "visibilitychange", () => {
          pageVisible = !document.hidden;
          reconcile();
        });
        listen(canvas, "webglcontextlost", (event) => {
          event.preventDefault();
          failed = true;
          stop();
          canvas.style.visibility = "hidden";
          if (!disposed) setRendererType("fallback");
        });

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        if ("IntersectionObserver" in window) {
          const bounds = host.getBoundingClientRect();
          visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
          intersectionObserver = new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              reconcile();
            },
            { threshold: 0.01 },
          );
          intersectionObserver.observe(host);
        }

        host.appendChild(canvas);
        readScroll();
        pose(0);
        resize();
        if (!failed) setRendererType("webgl");
        reconcile();
      } catch {
        // The still artwork also covers unavailable GPU drivers, dynamic
        // import failures, and browser memory constraints without a blank hero.
        teardown();
        teardown = () => {};
        if (!disposed) setRendererType("fallback");
      }
    }

    createScene();
    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="sculpture-scene"
      data-artwork="modular-cube"
      data-renderer={rendererType}
      data-motion="paused"
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        touchAction: "pan-y",
      }}
    >
      <svg
        className="sculpture-fallback"
        viewBox="0 0 700 700"
        fill="none"
        focusable="false"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: rendererType === "webgl" ? 0 : 1,
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient
            id={`${gradientId}-top`}
            x1="180"
            y1="130"
            x2="520"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e5e8eb" />
            <stop offset="1" stopColor="#aab4be" />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-left`}
            x1="180"
            y1="225"
            x2="350"
            y2="520"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8f9ca9" />
            <stop offset="1" stopColor="#4c5863" />
          </linearGradient>
          <linearGradient id={`${gradientId}-right`}>
            <stop stopColor="#46515c" />
            <stop offset="1" stopColor="#242c34" />
          </linearGradient>
        </defs>
        <path
          d="M350 60 602 205 350 350 98 205Z M98 205V495L350 640 602 495V205 M350 350V640 M350 60V350"
          stroke="#e6ff7b"
          strokeOpacity=".4"
        />
        <g data-cube-faces="true" stroke="#cad2da" strokeWidth="1">
          <polygon
            points="350,130 520,225 350,320 180,225"
            fill={`url(#${gradientId}-top)`}
          />
          <polygon
            points="180,225 350,320 350,520 180,425"
            fill={`url(#${gradientId}-left)`}
          />
          <polygon
            points="350,320 520,225 520,425 350,520"
            fill={`url(#${gradientId}-right)`}
          />
        </g>
        <path
          d="M265 177.5 435 272.5V472.5 M435 177.5 265 272.5V472.5 M180 325 350 420 520 325"
          stroke="#11181f"
          strokeWidth="7"
        />
        <path d="M397 275 430 257" stroke="#e6ff7b" strokeWidth="5" />
        {[
          [350, 60],
          [602, 205],
          [98, 205],
          [98, 495],
          [350, 640],
          [602, 495],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x - 3}
            y={y - 3}
            width="6"
            height="6"
            fill="#e6ff7b"
          />
        ))}
      </svg>
    </div>
  );
}
