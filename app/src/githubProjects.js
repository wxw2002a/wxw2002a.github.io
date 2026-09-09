// Curated from the owner's six pinned public repositories, checked 2026-09-09.
// Repository evidence and demo limitations are documented in docs/github-projects.md.
const projectOrder = [
  "cineflow",
  "arts-generation-platform",
  "second-hand-hub",
  "ic-fa",
  "Bitcoin-project",
  "LowPassFilter_Tool",
];

export const githubProjects = [
  {
    id: "arts-generation-platform",
    title: "Arts Generation Platform",
    category: "products",
    affiliation: "IPMD",
    label: { en: "GENERATIVE AI", zh: "生成式 AI" },
    description: {
      en: "IPMD artwork platform connecting visual cards, text, and reference images to Qwen and Stable Diffusion, with a Dockerized React/Express stack validated on Azure.",
      zh: "IPMD 艺术生成平台，将视觉卡片、文字及参考图片连接到 Qwen 与 Stable Diffusion，采用 React/Express 技术栈，并完成 Docker 容器化及 Azure 验证。",
    },
    tech: ["React", "TypeScript", "Express", "Qwen", "Stable Diffusion"],
    caseStudy:
      "https://github.com/wxw2002a/arts-generation-platform/blob/main/docs/CASE_STUDY.md",
    demo: "https://wxw2002a.github.io/arts-generation-platform/",
    note: {
      en: "Public demo: prompt building and sample outputs, not live inference.",
      zh: "公开演示包含提示词构建与样例作品，不执行实时模型推理。",
    },
    caseId: "ai-image-platform",
  },
  {
    id: "Bitcoin-project",
    title: "Bitcoin Project",
    category: "tools",
    label: { en: "SYSTEMS · LEARNING PROTOTYPE", zh: "系统 · 学习原型" },
    description: {
      en: "A Java Bitcoin/RPC learning prototype with bitcoinj block and hash validation, Apache Thrift client/server scaffolding, and a local calibration program.",
      zh: "Java Bitcoin/RPC 学习原型，包含 bitcoinj 区块与哈希校验、Apache Thrift 客户端/服务端框架及本地校准程序。",
    },
    tech: ["Java", "Apache Thrift", "bitcoinj", "RPC"],
  },
  {
    id: "cineflow",
    title: "CineFlow",
    category: "products",
    label: { en: "FULL-STACK · AI", zh: "全栈 · AI" },
    description: {
      en: "A Spring Boot booking system with transactional seat ownership and idempotent requests, paired with a trained PyTorch recommender. Explore the reservation invariants, model experiments, and reproducible verification.",
      zh: "使用 Spring Boot 事务管理座位归属，以幂等请求处理重试，并结合实际训练的 PyTorch 推荐器。项目提供预订一致性设计、模型实验和可复现验证。",
    },
    tech: ["React", "Spring Boot", "PyTorch", "MySQL", "Docker"],
    caseStudy:
      "https://github.com/wxw2002a/cineflow/blob/main/docs/CASE_STUDY.md",
    note: {
      en: "Synthetic screenings and simulated payment. Model evaluation is offline.",
      zh: "使用模拟场次与模拟付款；模型评估为离线实验。",
    },
  },
  {
    id: "ic-fa",
    title: "ic-fa / PenPad",
    category: "tools",
    label: { en: "INTERACTIVE TOOLS", zh: "交互工具" },
    description: {
      en: "A local-first drawing workspace for tracing, dot-to-dot, color filling, and free drawing. Captures supported stylus pressure and motion, with task metrics and JSON export.",
      zh: "本地优先的浏览器绘画工具，支持连点、描摹、填色及自由绘画，记录可用的触笔压力与轨迹，并导出任务指标与 JSON 数据。",
    },
    tech: ["JavaScript", "Canvas 2D", "Pointer Events", "JSON Schema"],
    demo: "https://wxw2002a.github.io/ic-fa/",
    note: {
      en: "Experimental task observations, not diagnostic assessments.",
      zh: "用于实验性任务观察，不用于诊断评估。",
    },
  },
  {
    id: "second-hand-hub",
    title: "Second Hand Hub",
    category: "products",
    label: { en: "FULL-STACK · REAL-TIME", zh: "全栈 · 实时通信" },
    description: {
      en: "A second-hand marketplace with persistent buyer–seller chat, listing drafts, and simulated checkout. Transactional message storage, duplicate-send protection, and reconnect recovery keep conversations reliable.",
      zh: "二手交易平台，支持买卖双方聊天、商品草稿及模拟结算；消息通过事务保存，并提供重复发送防护与断线恢复。",
    },
    tech: ["React", "Express", "Prisma", "SQLite", "Socket.IO"],
    caseStudy:
      "https://github.com/wxw2002a/second-hand-hub/blob/main/docs/CASE_STUDY.md",
  },
  {
    id: "LowPassFilter_Tool",
    title: "Low-Pass Filter Tool",
    category: "tools",
    label: { en: "SCIENTIFIC COMPUTING", zh: "科学计算" },
    description: {
      en: "An interactive Python tool for exploring Lp-based filter step responses. Adjust input signals and parameters, then compare plotted outputs across different Lp values.",
      zh: "探索 Lp 滤波器阶跃响应的 Python 工具，支持自定义输入信号和参数，并绘制不同 Lp 值的滤波结果对比。",
    },
    tech: ["Python", "NumPy", "Matplotlib", "Signal Processing"],
  },
]
  .sort((a, b) => projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id))
  .map((project) => ({
    ...project,
    repo: `https://github.com/wxw2002a/${project.id}`,
  }));
