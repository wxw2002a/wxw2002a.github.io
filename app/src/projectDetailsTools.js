// Reviewed against the owner's public README files and implementation on 2026-09-08.
// README wording is retained in the introductions; implementation notes are curated.
export const projectDetailsTools = {
  "Bitcoin-project": {
    sourceUrl:
      "https://github.com/wxw2002a/Bitcoin-project/blob/main/Client.java",
    sourceKind: "code",
    overview: {
      en: "A Java learning prototype exploring Bitcoin block validation and remote procedure calls. A bitcoinj client constructs a candidate block, requests a nonce through Apache Thrift, and checks the returned hash against the difficulty target. The repository includes front-end and back-end server scaffolding, a service definition, and a local calibration program.",
      zh: "一个探索比特币区块校验与远程过程调用的 Java 学习原型。客户端使用 bitcoinj 构造候选区块，通过 Apache Thrift 请求 nonce，并检查返回结果的哈希是否满足难度目标。仓库包含前端与后端服务框架、服务接口定义，以及本地校准程序。",
    },
    sections: [
      {
        title: { en: "Block validation workflow", zh: "区块校验流程" },
        bullets: {
          en: [
            "Builds a candidate block from its version, previous-block hash, Merkle root, timestamp, difficulty, and nonce using bitcoinj.",
            "Sends block-header fields to a remote mineBlock call and applies the returned nonce to the local block.",
            "Prints the block hash and target, then reports whether the returned result satisfies the proof-of-work difficulty check.",
          ],
          zh: [
            "使用 bitcoinj，根据版本号、前一区块哈希、Merkle 根、时间戳、难度与 nonce 构造候选区块。",
            "通过远程 mineBlock 调用发送区块头字段，并将返回的 nonce 应用到本地区块。",
            "输出区块哈希和目标值，检查返回结果是否满足工作量证明的难度要求。",
          ],
        },
      },
      {
        title: { en: "RPC and local tooling", zh: "RPC 与本地工具" },
        bullets: {
          en: [
            "Defines mineBlock and cancel operations in a Thrift interface, with generated Java bindings used by the client and servers.",
            "Uses framed transport and a binary protocol; separate front-end and back-end entry points start simple Thrift servers.",
            "Includes build and launch scripts plus a calibration program that searches for a valid nonce and prints local timing calculations.",
          ],
          zh: [
            "在 Thrift 接口中定义 mineBlock 和 cancel 操作，客户端与服务端使用生成的 Java 绑定。",
            "采用帧式传输和二进制协议，通过独立的前端、后端入口启动简单的 Thrift 服务。",
            "提供构建、启动脚本，以及搜索有效 nonce 并输出本地计时计算结果的校准程序。",
          ],
        },
      },
      {
        title: { en: "Prototype scope", zh: "原型范围" },
        bullets: {
          en: [
            "The public mining handler currently returns a fixed nonce of 43; it does not implement a distributed nonce search.",
            "The cancel operation is a placeholder, and the server scaffolding does not demonstrate worker coordination or job scheduling.",
            "This is a learning and integration prototype, not a production mining pool; the repository has no README or validated performance results.",
          ],
          zh: [
            "公开的挖矿处理器目前固定返回 nonce 43，尚未实现分布式 nonce 搜索。",
            "cancel 操作仍为空实现，现有服务框架也未展示工作节点协调或任务调度。",
            "项目定位为学习与接口联调原型，而非生产矿池；仓库暂无 README 或经过验证的性能结果。",
          ],
        },
      },
    ],
  },
  "ic-fa": {
    sourceUrl: "https://github.com/wxw2002a/ic-fa/blob/main/README.md",
    sourceKind: "readme",
    overview: {
      en: "A local-first clinical measurement workspace for four browser-based visuomotor activities: Dot-to-dot, Tracing, Color filling, and Free drawing. Its interpretation framework produces factual, task-level observations for clinician-led review only. It does not apply normative comparisons, diagnostic labels, or risk classifications.",
      zh: "一个本地优先的临床测量工作空间，包含四类基于浏览器的视觉运动活动：连点、描摹、填色与自由绘画。其解读框架仅生成客观的任务级观察，供临床专业人员审阅，不使用常模比较、诊断标签或风险分类。",
    },
    sections: [
      {
        title: { en: "Four drawing activities", zh: "四类绘画活动" },
        bullets: {
          en: [
            "Dot-to-dot records ordered connections, path deviation, sequencing errors, pauses, and completion time.",
            "Tracing supports circles, squares, triangles, stars, and flowers, with path, motion, similarity, and stroke measurements.",
            "Color filling offers palette and brush controls while recording coverage, boundary violations, color sequence, and accuracy.",
            "Free drawing supports pen, touch, or mouse input with undo/redo, available pressure, speed, pauses, and spatial coverage.",
          ],
          zh: [
            "连点活动记录连接顺序、路径偏差、顺序错误、停顿及完成时间。",
            "描摹支持圆形、方形、三角形、星形与花形，记录路径、运动、相似度及笔画测量数据。",
            "填色提供调色板与画笔控制，并记录覆盖情况、越界、颜色顺序及准确度。",
            "自由绘画支持触笔、触摸及鼠标输入，提供撤销与重做，并记录可用的压力、速度、停顿及空间覆盖。",
          ],
        },
      },
      {
        title: { en: "Capture and export", zh: "采集与导出" },
        bullets: {
          en: [
            "Pointer Events capture supported stylus pressure, tilt, contact geometry, and coalesced samples; pressure can change stroke width.",
            "Separates timestamped raw data, direct and computed measurements, derived metrics, constructs, and observation objectives.",
            "Version 4 JSON exports keep each activity in its own raw-data packet, including pen motion, task interactions, events, and computed measurements.",
          ],
          zh: [
            "通过 Pointer Events 采集设备支持的触笔压力、倾斜角、接触几何与合并采样数据，并可用压力控制笔画宽度。",
            "分层呈现带时间戳的原始数据、直接及计算测量、派生指标、构念与观察目标。",
            "第 4 版 JSON 导出为每类活动保留独立原始数据包，包含触笔运动、任务交互、事件及计算测量。",
          ],
        },
      },
      {
        title: { en: "Local-first safeguards", zh: "本地优先与使用边界" },
        bullets: {
          en: [
            "Activity data stays in the current browser tab unless the user explicitly exports a JSON session.",
            "Pressure-dependent measurements remain unavailable when the browser supplies only its fixed no-sensor fallback; real Pencil sensors require real-device testing.",
            "Scores are experimental behavioral estimates, not medical or psychological assessments. The four activities do not infer working memory or provide diagnoses.",
          ],
          zh: [
            "除非用户主动导出 JSON 会话，活动数据始终保留在当前浏览器标签页中。",
            "浏览器仅提供固定的无传感器回退值时，压力相关测量显示为不可用；真实 Pencil 传感器仍需真机测试。",
            "分数属于实验性行为估计，不是医学或心理评估；这四类活动不推断工作记忆，也不提供诊断。",
          ],
        },
      },
    ],
  },
  LowPassFilter_Tool: {
    sourceUrl:
      "https://github.com/wxw2002a/LowPassFilter_Tool/blob/main/README.md",
    sourceKind: "readme",
    overview: {
      en: "This project implements an LP (Lp norm-based) filter to process a step signal. It is recommended that the input data size be limited to around 200 samples for optimal performance. While the program does not enforce a limit on the size of the input data, using very long data arrays may result in slow performance due to the algorithm processing each sample.",
      zh: "该项目实现了一个基于 Lp 范数的 LP 滤波器，用于处理阶跃信号。为获得较好的性能，建议将输入数据控制在约 200 个采样点。程序不强制限制输入规模，但由于算法需要逐个处理采样点，较长的数据数组可能导致运行变慢。",
    },
    sections: [
      {
        title: { en: "Explore the response", zh: "探索滤波响应" },
        bullets: {
          en: [
            "Interactive mode accepts a custom signal as comma-separated or whitespace-separated numbers.",
            "Adjusts the time constant T, Lp value, initial output, candidate increment, local adjustment step, and sampling step.",
            "Plots the original input alongside the filtered output to make the effect of parameter choices visible.",
          ],
          zh: [
            "交互模式支持输入以逗号或空白分隔的自定义数值信号。",
            "可调节时间常数 T、Lp 值、初始输出、候选增量、局部调整步长及采样步长。",
            "将原始输入与滤波输出绘制在同一张图中，直观展示参数选择带来的变化。",
          ],
        },
      },
      {
        title: { en: "Numerical implementation", zh: "数值实现" },
        bullets: {
          en: [
            "Uses NumPy for exponential sample weighting and Lp-based output calculations within a sliding input window.",
            "Estimates each update through quadratic interpolation of candidate outputs, then refines it with a local search.",
            "A built-in test reproduces the documented step-signal case and compares seven Lp values from 2 to 1.02 in Matplotlib.",
          ],
          zh: [
            "使用 NumPy，在滑动输入窗口内计算指数采样权重和基于 Lp 的输出。",
            "通过候选输出的二次插值估计更新值，再使用局部搜索进行细化。",
            "内置测试复现文档中的阶跃信号案例，并在 Matplotlib 中对比从 2 到 1.02 的七个 Lp 值。",
          ],
        },
      },
      {
        title: { en: "Running the tool", zh: "运行方式与范围" },
        bullets: {
          en: [
            "Runs as a local Python script with a display-capable environment for the generated plots.",
            "Offers a command-line choice between custom interactive input and the fixed comparison test.",
            "Designed for numerical experimentation with short signals, not a deployed web service or a real-time signal-processing pipeline.",
          ],
          zh: [
            "以本地 Python 脚本运行，需要支持图形显示的环境来查看生成的图表。",
            "通过命令行选择自定义交互输入或固定参数的对比测试。",
            "适用于较短信号的数值实验，而非已部署的网页服务或实时信号处理流程。",
          ],
        },
      },
    ],
  },
};
