// Owner-authored README introductions, checked against GitHub on 2026-09-08.
// English overviews retain complete source sentences; section bullets summarize
// the README. CineFlow's incomplete sentence fragment is intentionally omitted.
export const projectDetailsProducts = {
  "arts-generation-platform": {
    sourceUrl:
      "https://github.com/wxw2002a/arts-generation-platform/blob/main/README.md",
    sourceKind: "readme",
    overview: {
      en: "An AI artwork generation platform that combines visual cards, text, and optional reference images in a guided creative workflow. Built with React/TypeScript, Node.js/Express, Qwen/Gemini prompt-provider adapters, and an internal Stable Diffusion 1.5 inference pipeline. The full application was containerized with Docker and deployed on Microsoft Azure for cloud validation. The public portfolio uses a GitHub Pages interactive demo; the full backend, model services, tests, and deployment configuration remain available in this repository.",
      zh: "一个将视觉卡片、文字及可选参考图片结合起来，引导用户完成创作的 AI 艺术生成平台。采用 React/TypeScript、Node.js/Express、Qwen/Gemini 提示词提供方适配器，以及内部 Stable Diffusion 1.5 推理流程。完整应用通过 Docker 容器化，并部署到 Microsoft Azure 进行云端验证。公开作品集使用 GitHub Pages 交互演示；完整后端、模型服务、测试和部署配置均保留在仓库中。",
    },
    sections: [
      {
        title: { en: "IPMD creative workflow", zh: "IPMD 创作流程" },
        bullets: {
          en: [
            "Choose emotion, memory, imagination, style, and effect cards, add a subject, and optionally upload a reference image.",
            "Build positive and negative prompts from card metadata and text; route reference images to Stable Diffusion's image-to-image pipeline.",
            "Follow a queued generation job, use interactive mini-games while waiting, and view or download the resulting artwork.",
          ],
          zh: [
            "选择情绪、记忆、想象、风格及效果卡片，补充创作主题，并按需上传参考图片。",
            "将卡片元数据和文字整理为正向、负向提示词；参考图片则交由 Stable Diffusion 的图生图流程处理。",
            "跟踪排队中的生成任务，等待时体验互动小游戏，并查看或下载生成作品。",
          ],
        },
      },
      {
        title: { en: "Implementation", zh: "技术实现" },
        bullets: {
          en: [
            "The typed React interface calls an Express API; BullMQ and Redis coordinate asynchronous image generation with frontend progress polling.",
            "Qwen and Gemini use interchangeable server-side adapters, keeping provider credentials out of the browser.",
            "Separate Docker services package the frontend, API, prompt model, Stable Diffusion, and Redis for local and Azure deployment.",
          ],
          zh: [
            "类型化 React 界面调用 Express API；BullMQ 与 Redis 协调异步图片生成，前端轮询任务进度。",
            "Qwen 和 Gemini 使用可替换的服务端适配器，模型提供方凭据不会暴露给浏览器。",
            "前端、API、提示词模型、Stable Diffusion 和 Redis 分别容器化，用于本地及 Azure 部署。",
          ],
        },
      },
      {
        title: { en: "Demo and validation scope", zh: "演示与验证范围" },
        bullets: {
          en: [
            "The public GitHub Pages demo builds prompt briefs and displays sample artwork. It makes no backend requests and does not run live model inference.",
            "The README reports real Qwen and Stable Diffusion text-to-image and image-to-image checks on Azure; Gemini was covered by adapter tests.",
            "Optional accounts, credits, and Stripe adapters belong to the full backend. A restricted simulated checkout supports testing before connecting a merchant account.",
          ],
          zh: [
            "公开 GitHub Pages 演示可构建提示词并展示样例作品，不请求后端，也不执行实时模型推理。",
            "README 记录了 Azure 上真实 Qwen 推理、Stable Diffusion 文生图和图生图验证；Gemini 仅进行了适配器测试。",
            "可选账户、积分及 Stripe 适配器属于完整后端；受限的模拟结算用于接入商户账户前的测试。",
          ],
        },
      },
    ],
  },
  cineflow: {
    sourceUrl: "https://github.com/wxw2002a/cineflow/blob/main/README.md",
    sourceKind: "readme",
    overview: {
      en: "A cinema discovery and ticket-reservation application built with Java Spring Boot, a Python-trained recommender, grounded AI conversation, MySQL, Redis, PostgreSQL/pgvector, and Docker Compose. The interesting problem is the boundary between a slow, probabilistic assistant and a transaction that must never sell one seat twice. CineFlow keeps that boundary explicit: recommendations can degrade, while seat ownership stays in a MySQL transaction.",
      zh: "一个使用 Java Spring Boot、Python 训练的推荐模型、基于实际数据的 AI 对话、MySQL、Redis、PostgreSQL/pgvector 和 Docker Compose 构建的电影发现与票务预订应用。它关注的核心问题，是如何区分响应较慢、具有概率性的 AI 助手与绝不能将同一座位重复出售的交易。CineFlow 明确划分这条边界：推荐可以降级，而座位归属始终由 MySQL 事务管理。",
    },
    sections: [
      {
        title: { en: "Discovery to reservation", zh: "从选片到预订" },
        bullets: {
          en: [
            "Browse a classic-film catalog, save favorites, and ask the assistant for suggestions grounded in catalog records and available screenings.",
            "Select a screening and seats, place a five-minute hold, then confirm a simulated payment and view the reservation in My tickets.",
            "Use a PyTorch BPR recommender with a synthetic-data default, or train an optional MovieLens model with an explicit offline evaluation protocol.",
          ],
          zh: [
            "浏览经典影片目录、收藏喜爱的电影，并向助手获取基于目录记录和可用场次的建议。",
            "选择场次与座位，建立五分钟占座，再确认模拟付款并在 My tickets 中查看预订。",
            "使用默认基于合成数据训练的 PyTorch BPR 推荐器，或通过明确的离线评估流程训练可选的 MovieLens 模型。",
          ],
        },
      },
      {
        title: {
          en: "Correctness and service boundaries",
          zh: "一致性与服务边界",
        },
        bullets: {
          en: [
            "MySQL locks each screening before changing reservations; conditional seat updates and rollback keep each selection all-or-nothing.",
            "Session-scoped idempotency protects retries. Expiration, payment, and cancellation follow database-owned reservation state rather than Redis TTL.",
            "Spring Boot owns booking, FastAPI serves recommendation and retrieval, and pgvector stores film knowledge; live inventory and prices come from business queries, not AI output.",
          ],
          zh: [
            "MySQL 在修改预订前锁定对应场次；有条件的座位更新与事务回滚，确保一次选座要么全部成功，要么全部失败。",
            "会话级幂等机制处理重复请求；过期、支付和取消依据数据库中的预订状态，而不是 Redis TTL。",
            "Spring Boot 管理预订，FastAPI 提供推荐与检索，pgvector 保存影片知识；实时库存和价格来自业务查询，而非 AI 输出。",
          ],
        },
      },
      {
        title: { en: "Demonstration scope", zh: "演示范围" },
        bullets: {
          en: [
            "Schedules, venues, prices, payments, and session identities are synthetic. No real tickets are sold, and the session identifier is not a production login system.",
            "Without a configured model, the interface identifies its deterministic demo assistant. Optional local Qwen or a compatible hosted model provides real conversation but cannot make purchases.",
            "Knowledge retrieval currently uses deterministic hashed text vectors, not learned semantic embeddings; recommendation evaluation is offline, not measured website conversion.",
          ],
          zh: [
            "场次、影院、价格、付款与会话身份均为模拟数据；不出售真实电影票，会话标识也不等同于生产级登录系统。",
            "未配置模型时，界面会明确标识确定性的演示助手；可选本地 Qwen 或兼容的托管模型可提供真实对话，但不能执行购买。",
            "知识检索目前使用确定性哈希文本向量，并非学习得到的语义嵌入；推荐评估为离线测试，不代表网站转化率。",
          ],
        },
      },
    ],
  },
  "second-hand-hub": {
    sourceUrl:
      "https://github.com/wxw2002a/second-hand-hub/blob/main/README.md",
    sourceKind: "readme",
    overview: {
      en: "A full-stack marketplace with persistent buyer–seller messaging, listing drafts, personalized discovery, and a simulated purchase flow. Built with React, Express, Prisma, SQLite, and Socket.IO. This portfolio edition uses fictional demo accounts and sample inventory. Its strongest engineering focus is chat correctness: transactionally saved messages, idempotent sends, conversation ordering, recipient delivery tracking, and reconnect recovery.",
      zh: "一个提供持久化买卖双方消息、商品草稿、个性化发现和模拟购买流程的全栈交易平台，使用 React、Express、Prisma、SQLite 和 Socket.IO 构建。作品集版本使用虚构演示账户及样例库存。其重点是聊天的正确性：通过事务保存消息、幂等发送、会话排序、接收方送达跟踪与断线重连恢复。",
    },
    sections: [
      {
        title: { en: "Marketplace experience", zh: "交易平台体验" },
        bullets: {
          en: [
            "Search and filter listings, inspect related items, save favorites, and get recommendations from explicit category, text, cart, price, and recency scores.",
            "Create listings, save drafts, resume editing, and message sellers with persistent history, unread counts, typing indicators, and presence.",
            "Complete a simulated checkout, update inventory, inspect purchase and sales history, and leave reviews tied to transactions.",
          ],
          zh: [
            "搜索和筛选商品、查看相关商品、收藏商品，并根据类别、文字、购物车、价格和发布时间的明确评分规则获取推荐。",
            "发布商品、保存草稿并继续编辑；与卖家交流时保留历史消息、未读计数、输入状态和在线状态。",
            "完成模拟结算、更新库存、查看购买与销售记录，并提交关联交易的评价。",
          ],
        },
      },
      {
        title: { en: "Reliable chat implementation", zh: "可靠聊天实现" },
        bullets: {
          en: [
            "One database transaction allocates a conversation sequence number, stores the message, and creates recipient delivery records; a unique client key prevents duplicate writes.",
            "Recipient acknowledgements, a short retry, activity-triggered replay, and client merging by message ID recover missed deliveries after disconnects.",
            "Salted scrypt password hashes and verified JWT identities support REST and Socket.IO authorization, while focused React hooks separate chat loading, presence, and media behavior.",
          ],
          zh: [
            "在同一数据库事务中分配会话序号、保存消息并创建接收方送达记录；唯一客户端消息键防止重复写入。",
            "通过接收方确认、短暂重试、活动触发重放及按消息 ID 合并，恢复断线期间遗漏的消息。",
            "加盐 scrypt 密码哈希和验证后的 JWT 身份支持 REST 与 Socket.IO 授权；专门的 React hooks 将聊天加载、在线状态和媒体行为分离。",
          ],
        },
      },
      {
        title: { en: "Scope and tradeoffs", zh: "范围与取舍" },
        bullets: {
          en: [
            "Checkout is a simulation: no payment provider processes charges. Discovery uses explicit scoring rules rather than a learned recommendation model.",
            "Redis chat infrastructure and S3 signed media transfers are optional; the default application runs with a single backend and SQLite.",
            "The repository does not claim measured production scale or verified multi-node deployment. Browser chat tests use mocked APIs and do not prove end-to-end cloud behavior.",
          ],
          zh: [
            "结算为模拟流程，没有支付服务商实际扣款；个性化发现使用明确评分规则，而非训练出的推荐模型。",
            "Redis 聊天基础设施和 S3 签名媒体传输为可选功能；默认应用使用单个后端及 SQLite。",
            "仓库未声称经过生产规模测量或多节点部署验证；浏览器聊天测试使用模拟 API，不能证明云端端到端行为。",
          ],
        },
      },
    ],
  },
};
