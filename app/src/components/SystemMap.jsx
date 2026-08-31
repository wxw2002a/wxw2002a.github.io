import { motion, useReducedMotion } from "motion/react";

const ROUTES = [
  {
    id: "product-app",
    d: "M 162 200 C 177 200 190 200 205 200",
    packetX: [162, 176, 191, 205],
    packetY: [200, 200, 200, 200],
    duration: 2.35,
    delay: 0,
  },
  {
    id: "app-api",
    d: "M 347 200 C 362 200 375 200 390 200",
    packetX: [347, 361, 376, 390],
    packetY: [200, 200, 200, 200],
    duration: 2.35,
    delay: 0.7,
  },
  {
    id: "api-ai",
    d: "M 532 200 C 554 200 548 102 574 102",
    packetX: [532, 547, 552, 558, 574],
    packetY: [200, 195, 158, 116, 102],
    duration: 3.2,
    delay: 0.2,
    branch: true,
  },
  {
    id: "api-cloud",
    d: "M 532 200 C 554 200 548 298 574 298",
    packetX: [532, 547, 552, 558, 574],
    packetY: [200, 205, 242, 284, 298],
    duration: 3.2,
    delay: 1.45,
    branch: true,
  },
];

const NODES = [
  {
    id: "product",
    label: "Product",
    detail: "intent + craft",
    x: 20,
    y: 165,
    width: 142,
    height: 70,
    floatY: -4,
    driftX: -1,
    duration: 5.8,
    delay: 0,
  },
  {
    id: "app",
    label: "App",
    detail: "web + mobile",
    x: 205,
    y: 165,
    width: 142,
    height: 70,
    floatY: -6,
    driftX: 1,
    duration: 6.4,
    delay: 0.45,
  },
  {
    id: "api",
    label: "API",
    detail: "services + data",
    x: 390,
    y: 165,
    width: 142,
    height: 70,
    floatY: -4,
    driftX: -1,
    duration: 5.5,
    delay: 0.8,
  },
  {
    id: "ai",
    label: "AI",
    detail: "models + agents",
    x: 574,
    y: 66,
    width: 152,
    height: 72,
    floatY: -7,
    driftX: 2,
    duration: 6.8,
    delay: 0.2,
  },
  {
    id: "cloud",
    label: "Cloud",
    detail: "scale + reliability",
    x: 574,
    y: 262,
    width: 152,
    height: 72,
    floatY: -5,
    driftX: 2,
    duration: 6.1,
    delay: 1,
  },
];

const CONNECTORS = [
  { id: "product-out", x: 162, y: 200, delay: 0 },
  { id: "app-in", x: 205, y: 200, delay: 0.35 },
  { id: "app-out", x: 347, y: 200, delay: 0.7 },
  { id: "api-in", x: 390, y: 200, delay: 1.05 },
  { id: "api-hub", x: 532, y: 200, delay: 0.15 },
  { id: "ai-in", x: 574, y: 102, delay: 0.55 },
  { id: "cloud-in", x: 574, y: 298, delay: 0.95 },
];

function NodeIcon({ type, x, y }) {
  const left = x + 15;
  const top = y + 18;

  if (type === "product") {
    return (
      <g className="map-node-icon">
        <rect x={left + 7} y={top + 5} width="17" height="13" rx="2" />
        <path d={`M ${left + 12} ${top + 23} H ${left + 20}`} />
        <path d={`M ${left + 16} ${top + 18} V ${top + 23}`} />
      </g>
    );
  }

  if (type === "app") {
    return (
      <g className="map-node-icon">
        <rect x={left + 8} y={top + 3} width="16" height="24" rx="4" />
        <path d={`M ${left + 13} ${top + 7} H ${left + 19}`} />
        <circle cx={left + 16} cy={top + 23} r="1" />
      </g>
    );
  }

  if (type === "api") {
    return (
      <g className="map-node-icon">
        <path d={`M ${left + 12} ${top + 6} L ${left + 7} ${top + 15} L ${left + 12} ${top + 24}`} />
        <path d={`M ${left + 20} ${top + 6} L ${left + 25} ${top + 15} L ${left + 20} ${top + 24}`} />
        <path d={`M ${left + 18} ${top + 5} L ${left + 14} ${top + 25}`} />
      </g>
    );
  }

  if (type === "ai") {
    return (
      <g className="map-node-icon">
        <path d={`M ${left + 16} ${top + 2} C ${left + 16} ${top + 10}, ${left + 21} ${top + 15}, ${left + 29} ${top + 15} C ${left + 21} ${top + 15}, ${left + 16} ${top + 20}, ${left + 16} ${top + 28} C ${left + 16} ${top + 20}, ${left + 11} ${top + 15}, ${left + 3} ${top + 15} C ${left + 11} ${top + 15}, ${left + 16} ${top + 10}, ${left + 16} ${top + 2} Z`} />
        <circle cx={left + 27} cy={top + 5} r="2" />
      </g>
    );
  }

  return (
    <g className="map-node-icon">
      <path d={`M ${left + 8} ${top + 23} H ${left + 25} C ${left + 29} ${top + 23}, ${left + 31} ${top + 20}, ${left + 31} ${top + 17} C ${left + 31} ${top + 13}, ${left + 28} ${top + 10}, ${left + 24} ${top + 10} C ${left + 22} ${top + 5}, ${left + 18} ${top + 3}, ${left + 14} ${top + 4} C ${left + 9} ${top + 5}, ${left + 7} ${top + 9}, ${left + 7} ${top + 13} C ${left + 3} ${top + 14}, ${left + 2} ${top + 17}, ${left + 3} ${top + 20} C ${left + 4} ${top + 22}, ${left + 6} ${top + 23}, ${left + 8} ${top + 23} Z`} />
    </g>
  );
}

function MapNode({ node, reduceMotion }) {
  return (
    <motion.g
      className={`map-node map-node--${node.id}`}
      initial={false}
      animate={
        reduceMotion
          ? undefined
          : {
              x: [0, node.driftX, 0],
              y: [0, node.floatY, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: node.duration,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      <rect
        className="map-node-glow"
        x={node.x - 5}
        y={node.y - 5}
        width={node.width + 10}
        height={node.height + 10}
        rx="24"
      />
      <rect
        className="map-node-shell"
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx="18"
      />
      <rect
        className="map-node-icon-bg"
        x={node.x + 15}
        y={node.y + 17}
        width="36"
        height="36"
        rx="11"
      />
      <NodeIcon type={node.id} x={node.x} y={node.y} />
      <text className="map-label" x={node.x + 63} y={node.y + 31}>
        {node.label}
      </text>
      <text className="map-detail" x={node.x + 63} y={node.y + 50}>
        {node.detail}
      </text>
    </motion.g>
  );
}

/**
 * Decorative Product -> App -> API -> AI / Cloud topology for the hero.
 * The graphic is intentionally hidden from assistive technology because the
 * surrounding hero copy carries the same meaning.
 */
export function SystemMap({ className = "" }) {
  const reduceMotion = useReducedMotion();
  const rootClassName = ["system-map", className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName} aria-hidden="true">
      <svg
        className="system-map-svg"
        viewBox="0 0 760 400"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        aria-hidden="true"
      >
        <g className="map-grid">
          <rect className="map-frame" x="1" y="1" width="758" height="398" rx="32" />
          <path d="M 20 102 H 740 M 20 200 H 740 M 20 298 H 740" />
          <path d="M 94 24 V 376 M 278 24 V 376 M 462 24 V 376 M 646 24 V 376" />
        </g>

        <g className="map-orbit">
          <ellipse cx="516" cy="200" rx="111" ry="158" />
          <ellipse cx="516" cy="200" rx="72" ry="117" />
          <circle cx="516" cy="200" r="31" />
        </g>

        <g className="map-routes">
          {ROUTES.map((route) => (
            <g key={route.id}>
              <path
                className={`map-line map-line--base${route.branch ? " map-line--branch" : ""}`}
                d={route.d}
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                className={`map-line map-line--flow${route.branch ? " map-line--branch" : ""}`}
                d={route.d}
                vectorEffect="non-scaling-stroke"
                initial={false}
                animate={reduceMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -36] }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 1.25,
                        repeat: Infinity,
                        ease: "linear",
                      }
                }
              />
              <motion.circle
                className="map-particle"
                cx={route.packetX[0]}
                cy={route.packetY[0]}
                r="3.5"
                initial={false}
                animate={
                  reduceMotion
                    ? { opacity: 0.48 }
                    : {
                        cx: route.packetX,
                        cy: route.packetY,
                        opacity: [0, 1, 1, 1, 0],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: route.duration,
                        delay: route.delay,
                        repeat: Infinity,
                        repeatDelay: 0.55,
                        ease: "linear",
                      }
                }
              />
            </g>
          ))}
        </g>

        <g className="map-connectors">
          {CONNECTORS.map((connector) => (
            <g className="map-connector" key={connector.id}>
              <motion.circle
                className="map-connector-pulse"
                cx={connector.x}
                cy={connector.y}
                r="5"
                initial={false}
                animate={
                  reduceMotion
                    ? { opacity: 0.25, r: 7 }
                    : { opacity: [0.72, 0, 0.72], r: [4, 12, 4] }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 2.8,
                        delay: connector.delay,
                        repeat: Infinity,
                        ease: "easeOut",
                      }
                }
              />
              <circle className="map-connector-core" cx={connector.x} cy={connector.y} r="4" />
            </g>
          ))}
        </g>

        <g className="map-nodes">
          {NODES.map((node) => (
            <MapNode key={node.id} node={node} reduceMotion={reduceMotion} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default SystemMap;
