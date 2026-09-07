import { useEffect, useId, useRef, useState } from "react";

/** A floating modular cube, lit locally without textures or remote assets. */
export default function SculptureScene({
  paused = false,
  reducedMotion = false,
  exploded = false,
}) {
  const hostRef = useRef(null);
  const settingsRef = useRef({ paused, reducedMotion, exploded });
  const reconcileRef = useRef(null);
  const [rendererType, setRendererType] = useState("fallback");
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    settingsRef.current = { paused, reducedMotion, exploded };
    if (reconcileRef.current) reconcileRef.current();
    else if (hostRef.current) {
      hostRef.current.dataset.explosion = exploded ? "1.00" : "0.00";
    }
  }, [paused, reducedMotion, exploded]);

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
        let hovered = false;
        let framesRendered = 0;
        let lastFrameReport = 0;
        let appliedExploded = settingsRef.current.exploded;
        let introElapsed =
          settingsRef.current.paused || settingsRef.current.reducedMotion
            ? 2
            : 0;
        let explosion = introElapsed === 0 || appliedExploded ? 1 : 0;
        let lastFit = -1;
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

        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
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
        const cage = new THREE.Group();
        sculpture.add(cage);
        const cageGeometry = own(new THREE.BoxGeometry(3.25, 3.25, 3.25));
        const cageEdges = own(new THREE.EdgesGeometry(cageGeometry));
        cage.add(new THREE.LineSegments(cageEdges, frameMaterial));
        const anchorGeometry = own(new THREE.BoxGeometry(0.065, 0.065, 0.065));
        for (const x of [-1, 1]) {
          for (const y of [-1, 1]) {
            for (const z of [-1, 1]) {
              const anchor = new THREE.Mesh(anchorGeometry, accent);
              anchor.position.set(x * 1.625, y * 1.625, z * 1.625);
              cage.add(anchor);
            }
          }
        }
        const marker = new THREE.Mesh(
          own(new THREE.BoxGeometry(0.36, 0.035, 0.035)),
          accent,
        );
        marker.position.set(0, 0.565, 0.53);
        modules[modules.length - 1].add(marker);

        // A travelling line and three packets reveal the construction paths.
        // They stay attached to the cage: no confetti and no orbiting object.
        const energyMaterial = own(
          new THREE.MeshBasicMaterial({ color: 0xe6ff7b }),
        );
        const packetGeometry = own(new THREE.BoxGeometry(0.075, 0.075, 0.075));
        const circuit = [
          [-1, -1, -1],
          [1, -1, -1],
          [1, 1, -1],
          [-1, 1, -1],
          [-1, 1, 1],
          [1, 1, 1],
          [1, -1, 1],
          [-1, -1, 1],
          [-1, -1, -1],
        ].map((point) => new THREE.Vector3(...point).multiplyScalar(1.625));
        const packets = Array.from({ length: 3 }, () => {
          const packet = new THREE.Mesh(packetGeometry, energyMaterial);
          cage.add(packet);
          return packet;
        });
        const scanMaterial = own(
          new THREE.LineBasicMaterial({
            color: 0xe6ff7b,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
          }),
        );
        const scan = new THREE.LineLoop(
          own(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(-1.2, 0, -1.2),
              new THREE.Vector3(1.2, 0, -1.2),
              new THREE.Vector3(1.2, 0, 1.2),
              new THREE.Vector3(-1.2, 0, 1.2),
            ]),
          ),
          scanMaterial,
        );
        sculpture.add(scan);
        const core = new THREE.Mesh(
          own(new THREE.BoxGeometry(0.24, 0.24, 0.24)),
          energyMaterial,
        );
        sculpture.add(core);

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

        const render = (report = false) => {
          if (disposed || failed || !renderer) return;
          try {
            renderer.render(scene, camera);
            framesRendered += 1;
            const now = performance.now();
            if (report || now - lastFrameReport >= 200) {
              host.dataset.frame = String(framesRendered);
              host.dataset.explosion = explosion.toFixed(2);
              lastFrameReport = now;
            }
          } catch {
            failed = true;
            stop();
            canvas.style.visibility = "hidden";
            if (!disposed) setRendererType("fallback");
          }
        };

        const fitCamera = () => {
          // The exploded state has a larger silhouette. A modest dolly-out
          // keeps the far corners in frame, including on narrow mobile screens.
          const fit = Math.round(explosion * 1000) / 1000;
          if (fit === lastFit) return;
          lastFit = fit;
          const angle = Math.atan(
            Math.tan(THREE.MathUtils.degToRad(17.5)) *
              Math.min(camera.aspect, 1),
          );
          camera.position.set(0, 0.1, (2.95 + fit * 0.6) / Math.sin(angle));
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
        };

        const pose = (delta, immediate = false) => {
          const easing = immediate ? 1 : 1 - Math.exp(-delta * 4.5);
          smoothX += (pointerX * 0.16 + dragX - smoothX) * easing;
          smoothY += (pointerY * 0.09 + dragY - smoothY) * easing;
          const introProgress = THREE.MathUtils.clamp(
            introElapsed / 1.85,
            0,
            1,
          );
          const intro = 1 - THREE.MathUtils.smoothstep(introProgress, 0, 1);
          // A deliberate mechanical breath separates the modules every five
          // seconds; orientation stays composed instead of continuously spinning.
          const breath =
            Math.pow(Math.sin(Math.max(0, elapsed - 2.1) * 0.62), 6) * 0.25;
          const requested = settingsRef.current.exploded
            ? 1
            : Math.max(
                intro,
                breath,
                hovered ? 0.28 : 0,
                Math.min(scrollAmount * 0.85, 0.85),
              );
          explosion = immediate
            ? settingsRef.current.exploded
              ? 1
              : 0
            : THREE.MathUtils.lerp(
                explosion,
                requested,
                1 - Math.exp(-delta * 7),
              );
          explosion = THREE.MathUtils.clamp(explosion, 0, 1);
          sculpture.rotation.set(
            0.32 + smoothY,
            -0.52 + smoothX + scrollAmount * 0.1,
            -0.04,
          );
          sculpture.position.y = immediate
            ? 0
            : Math.sin(elapsed * 0.8) * 0.045;
          const spacing = 0.59 + explosion * 0.72;
          modules.forEach((block, index) => {
            block.position
              .copy(block.userData.direction)
              .multiplyScalar(spacing);
            // Each block settles from a slightly different initial attitude.
            const settle = immediate ? 0 : intro * 0.16;
            const recoil = immediate
              ? 0
              : Math.sin(Math.max(0, introElapsed - 1.05) * 12 + index * 0.18) *
                Math.exp(-Math.max(0, introElapsed - 1.05) * 5) *
                THREE.MathUtils.smoothstep(introElapsed, 0.8, 1.1) *
                0.035;
            block.rotation.set(
              (settle + recoil) * block.userData.direction.y,
              settle * block.userData.direction.x,
              settle * block.userData.direction.z,
            );
          });
          cage.scale.setScalar(1 + explosion * 0.12);
          packets.forEach((packet, index) => {
            const progress = (elapsed * 0.75 + (index * 8) / 3) % 8;
            const segment = Math.floor(progress);
            packet.position.lerpVectors(
              circuit[segment],
              circuit[segment + 1],
              progress - segment,
            );
          });
          scan.scale.setScalar(1 + explosion * 0.59);
          scan.position.y = (1.17 + explosion * 0.72) * Math.cos(elapsed * 1.2);
          scanMaterial.opacity = 0.24 + (1 + Math.sin(elapsed * 1.2)) * 0.1;
          core.scale.setScalar(0.8 + explosion * 0.6);
          core.visible = explosion > 0.18;
          fitCamera();
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
          introElapsed += delta;
          pose(delta);
          render();
          if (canAnimate()) frameId = requestAnimationFrame(tick);
        };

        const reconcile = () => {
          const changedExplosion =
            appliedExploded !== settingsRef.current.exploded;
          appliedExploded = settingsRef.current.exploded;
          if (settingsRef.current.reducedMotion || changedExplosion)
            introElapsed = 2;
          if (failed) {
            host.dataset.explosion = settingsRef.current.exploded
              ? "1.00"
              : "0.00";
            return;
          }
          if (canAnimate()) {
            host.dataset.motion = "running";
            host.style.cursor = dragging ? "grabbing" : "grab";
            if (!frameId) frameId = requestAnimationFrame(tick);
          } else {
            stop();
            dragging = false;
            if (
              capturedPointer !== null &&
              host.hasPointerCapture(capturedPointer)
            ) {
              host.releasePointerCapture(capturedPointer);
              capturedPointer = null;
            }
            host.style.cursor = "";
            // Explicit state controls still work when animations are disabled.
            // A pause otherwise preserves the exact current pose and frame.
            if (changedExplosion || settingsRef.current.reducedMotion) {
              pose(0, true);
              render(true);
            }
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
          lastFit = -1;
          fitCamera();
          render(true);
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
        listen(host, "pointerenter", (event) => {
          if (event.pointerType === "mouse" && canAnimate()) hovered = true;
        });
        listen(host, "pointerleave", () => {
          hovered = false;
          if (!dragging) {
            pointerX = 0;
            pointerY = 0;
          }
        });
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
        pose(
          0,
          settingsRef.current.paused || settingsRef.current.reducedMotion,
        );
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
            x1="-81"
            y1="-94"
            x2="81"
            y2="1"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e5e8eb" />
            <stop offset="1" stopColor="#aab4be" />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-left`}
            x1="-81"
            y1="-46"
            x2="0"
            y2="94"
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
        <g data-cube-faces="true" stroke="#cad2da" strokeWidth="1.2">
          {[-1, 1]
            .flatMap((x) =>
              [-1, 1].flatMap((y) => [-1, 1].map((z) => ({ x, y, z }))),
            )
            .sort((a, b) => a.x + a.y + a.z - b.x - b.y - b.z)
            .map(({ x, y, z }) => {
              const spacing = exploded ? 1.31 : 0.59;
              const cx = 350 + (x - z) * 75 * spacing;
              const cy = 350 + ((x + z) * 44 - y * 86) * spacing;
              return (
                <g
                  key={`${x}-${y}-${z}`}
                  style={{
                    transform: `translate(${cx}px, ${cy}px)`,
                    transition:
                      paused || reducedMotion
                        ? "none"
                        : "transform 850ms cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  <polygon
                    points="0,-93.96 81,-46.44 0,1.08 -81,-46.44"
                    fill={`url(#${gradientId}-top)`}
                  />
                  <polygon
                    points="-81,-46.44 0,1.08 0,93.96 -81,46.44"
                    fill={`url(#${gradientId}-left)`}
                  />
                  <polygon
                    points="0,1.08 81,-46.44 81,46.44 0,93.96"
                    fill={`url(#${gradientId}-right)`}
                  />
                  {x === 1 && y === 1 && z === 1 && (
                    <path d="M30 -17 58 -33" stroke="#e6ff7b" strokeWidth="5" />
                  )}
                </g>
              );
            })}
        </g>
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
