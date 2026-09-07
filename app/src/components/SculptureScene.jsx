import { useEffect, useId, useRef, useState } from "react";

/** A self-lit studio sculpture. It does not request textures or other assets. */
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

        // Broad white reflection panels give the chrome its photographed,
        // liquid-metal contours. PMREM is generated entirely on the device.
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

        const chrome = own(
          new THREE.MeshPhysicalMaterial({
            color: 0xd9dce0,
            metalness: 1,
            roughness: 0.16,
            clearcoat: 1,
            clearcoatRoughness: 0.14,
            envMapIntensity: 1.2,
          }),
        );
        const lacquer = own(
          new THREE.MeshPhysicalMaterial({
            color: 0xe6ff7b,
            metalness: 0.22,
            roughness: 0.25,
            clearcoat: 1,
            clearcoatRoughness: 0.15,
            emissive: 0x667b13,
            emissiveIntensity: 0.09,
          }),
        );
        const graphite = own(
          new THREE.MeshPhysicalMaterial({
            color: 0x282a30,
            metalness: 0.95,
            roughness: 0.28,
            clearcoat: 0.7,
          }),
        );

        const knot = new THREE.Mesh(
          own(new THREE.TorusKnotGeometry(1.18, 0.365, 240, 40, 2, 3)),
          chrome,
        );
        knot.rotation.set(0.4, -0.25, -0.42);
        sculpture.add(knot);

        const ringPivot = new THREE.Group();
        ringPivot.rotation.set(1.08, 0.4, -0.3);
        const ring = new THREE.Mesh(
          own(new THREE.TorusGeometry(2.14, 0.072, 24, 180)),
          lacquer,
        );
        ringPivot.add(ring);

        // A small graphite clasp grounds the acid-yellow ring as a physical
        // object, and supplies a deliberate asymmetry as the sculpture turns.
        const clasp = new THREE.Mesh(
          own(new THREE.TorusGeometry(2.14, 0.084, 16, 18, 0.14)),
          graphite,
        );
        clasp.rotation.z = 1.15;
        ringPivot.add(clasp);
        sculpture.add(ringPivot);

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
            0.15 + smoothY + Math.sin(elapsed * 0.23) * 0.055,
            -0.24 + elapsed * 0.105 + smoothX + scrollAmount * 0.27,
            -0.12 + Math.sin(elapsed * 0.19) * 0.045,
          );
          sculpture.position.y = Math.sin(elapsed * 0.65) * 0.085;
          ringPivot.rotation.y = 0.4 + Math.sin(elapsed * 0.3) * 0.15;
          ringPivot.rotation.z = -0.3 + Math.sin(elapsed * 0.2) * 0.1;
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
          // mobile viewport keeps both the knot and outer ring intact.
          const angle = Math.atan(
            Math.tan(THREE.MathUtils.degToRad(17.5)) *
              Math.min(camera.aspect, 1),
          );
          camera.position.set(0, 0.1, 2.48 / Math.sin(angle));
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
            id={`${gradientId}-chrome`}
            x1="150"
            y1="130"
            x2="545"
            y2="475"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f2f3f0" />
            <stop offset=".13" stopColor="#a6acaf" />
            <stop offset=".29" stopColor="#34373d" />
            <stop offset=".38" stopColor="#e4e7e8" />
            <stop offset=".55" stopColor="#858d92" />
            <stop offset=".68" stopColor="#1e2128" />
            <stop offset=".83" stopColor="#adb6ba" />
            <stop offset="1" stopColor="#f0f2ed" />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-acid`}
            x1="150"
            y1="150"
            x2="560"
            y2="550"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#edffa5" />
            <stop offset=".55" stopColor="#e6ff7b" />
            <stop offset="1" stopColor="#727d3e" />
          </linearGradient>
          <radialGradient id={`${gradientId}-glow`}>
            <stop stopColor="#e6ff7b" stopOpacity=".06" />
            <stop offset="1" stopColor="#e6ff7b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="350" cy="350" r="300" fill={`url(#${gradientId}-glow)`} />
        <g transform="translate(0 36)">
          <ellipse
            cx="350"
            cy="310"
            rx="243"
            ry="112"
            transform="rotate(-37 350 310)"
            stroke={`url(#${gradientId}-acid)`}
            strokeWidth="9"
          />
          <path
            d="M354 158C442 54 576 105 565 240C555 357 377 385 256 318C139 253 179 103 313 134C440 164 489 376 394 458C298 538 155 457 201 325C250 181 444 169 514 281C600 418 458 526 348 445C229 356 268 245 354 158Z"
            stroke="#111216"
            strokeWidth="76"
            strokeLinejoin="round"
          />
          <path
            d="M354 158C442 54 576 105 565 240C555 357 377 385 256 318C139 253 179 103 313 134C440 164 489 376 394 458C298 538 155 457 201 325C250 181 444 169 514 281C600 418 458 526 348 445C229 356 268 245 354 158Z"
            stroke={`url(#${gradientId}-chrome)`}
            strokeWidth="65"
            strokeLinejoin="round"
          />
          <path
            d="M107 310A243 112 0 0 0 593 310"
            transform="rotate(-37 350 310)"
            stroke={`url(#${gradientId}-acid)`}
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
