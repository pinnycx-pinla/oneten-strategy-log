// ── ONETEN QUANT 构建日志 — 对话数据 ──────────────────────────────────────
// 每个条目 = 一天的日志，包含 4-5 段对话

// ── FX Demo page (remove after choosing a style) ────────────────────────
export const FX_DEMO = {
  date: '特效预览',
  chapter: 'FX',
  title: '对话框特效预览 — 选一个风格',
  subtitle: '四种赛博朋克效果对比',
  messages: [
    {
      role: 'ai',
      header: 'FX 1 · GLITCH 故障效果',
      fx: 'glitch',
      content: '标题文字会随机出现 RGB 色差偏移故障效果。适合高风险警报类消息，制造紧张感。',
    },
    {
      role: 'user',
      header: 'FX 2 · ANGULAR 斜角切割',
      fx: 'cyber',
      content: '对话框四角切成斜面，经典赛博朋克几何造型。背景更深，边框青色。',
    },
    {
      role: 'ai',
      header: 'FX 3 · SCANLINES 扫描线',
      fx: 'scanline',
      content: '对话框内叠加 CRT 显示器扫描线效果，像老式终端屏幕。微妙但有质感。',
    },
    {
      role: 'user',
      header: 'FX 4 · NEON PULSE 霓虹脉冲',
      fx: 'neon',
      content: '边框持续呼吸发光，霓虹青色脉冲。最显眼，适合重要消息或 DALI 的核心回复。',
    },
  ],
};

export const LOG_DAYS = [
  {
    date: '2026-04-02',
    chapter: '24-30',
    color: '#00f0ff',   // cyan
    title: '崩溃、清算与重建协议',
    subtitle: 'Paperclip 风暴后的反思',
    messages: [
      {
        role: 'user',
        header: '回顾 PAPERCLIP 进程',
        content: '之前是我让你设置的它，用来给 pinla 和 oneten 这两家公司设立部门。',
      },
      {
        role: 'ai',
        action: '记忆唤醒与追溯',
        content: 'Paperclip 是你用来给 PINLA 和 OneTen 建立虚拟部门架构的——它会跑多个"部门代理"，每个代理定期被唤醒继续工作。Operations 代理从3月31日开始，自动触发频率约6小时/次，一直跑到4月2日因触发限额停下。',
        box: {
          label: '① 从日志看',
          lines: ['Operations 代理从 3月31日 开始', '自动触发频率: 约 6 小时 / 次', '当前状态: 一直跑到 4月2日 今天才因为触发限额停下来。'],
          highlight: 2,
        },
      },
      {
        role: 'ai',
        header: 'TOKEN BURN ANALYSIS',
        content: '对，基本可以确定就是这个原因。Paperclip 里的 PinLA 公司架构就是那批疯狂消耗 Token 的脚本——它们每隔几小时就运行一次，每次都在调用 Claude API。',
        box: {
          label: '📉 消耗详情',
          lines: ['Dept Agents: 9 个并发部门', '轮询频率: 1440 mins / 240 mins (High Intensity)', '结果: 48小时内触碰 API 高压线。'],
          highlight: 2,
        },
      },
      {
        role: 'user',
        content: '我就在你不在的时候把 Paperclip 注销了。',
      },
      {
        role: 'ai',
        header: 'DAMAGE ASSESSMENT',
        type: 'danger',
        content: '整理完了，除了 GitHub 备份，本地几乎已经清空：',
        table: {
          headers: ['状态', '模块 / 文件'],
          rows: [
            ['✅ 已从 GitHub 恢复', 'instagram_auto.py, X_post.py, alpaca_trader.py'],
            ['❌ 彻底丢失', 'dept_finance.py, dept_legal.py, youtube_report.py'],
            ['⚠️ Token 失效', 'instagram_token.txt, pinterest_token.txt'],
          ],
        },
        footer: '根本原因：本地脚本没有及时同步到 GitHub 仓库。',
      },
    ],
  },
  {
    date: '2026-04-04',
    chapter: '31',
    color: '#a855f7',   // purple
    title: 'Token 优化：混合 AI 编排策略',
    subtitle: '从 Claude 独占到三层 AI 金字塔',
    messages: [
      {
        role: 'user',
        header: 'TOKEN 优化策略清单',
        content: '好，我把所有任务分析了一遍，这是最省 Claude token 的方案：',
        boxes: [
          { color: '#8cc152', label: '🟢 完全免费（纯 Python，零 AI）', lines: ['Instagram / Pinterest / X 发帖 — 模板轮换', 'Alpaca 交易策略 — 规则执行', '系统健康监控 — 数据采集+报警'] },
          { color: '#5d9cec', label: '🔵 Gemma 4（本地，完全免费）', lines: ['部门周报 HR / Finance / Legal / Marketing', 'dept_ops — 每6小时运营检查', 'security_check — 日志分析', 'youtube_report — 内容表现总结'] },
          { color: '#ffce54', label: '🟡 Google Gemini API（极便宜）', lines: ['YouTube 内容脚本生成', 'trending_utils — 趋势分析'] },
          { color: '#ed5565', label: '🔴 Claude（只用于核心决策）', lines: ['Telegram 对话', '策略开发和重要决策'] },
        ],
      },
      {
        role: 'ai',
        header: '⚡ SYSTEM SPECS CHECK ⚡',
        type: 'success',
        content: '明白，这是极其理性的"金字塔"AI编排策略。M4 MacBook Air 16GB 完全能跑本地模型。',
        box: {
          label: '⚡ 硬件自检完成',
          lines: ['Device: MacBook Air (M4 芯片)', 'Memory: 16 GB', 'Status: 完全能跑本地模型。'],
          highlight: 2,
        },
        footer: '最简单的部分我先开始改写，晚点对接复杂的部分。',
      },
      {
        role: 'ai',
        header: '✅ 执行结果',
        type: 'success',
        content: '所有 9 个缺失脚本已全部创建：system_health.py、djb_cleaning_auto.py 已测试通过；dept_hr/finance/legal/marketing/ops、security_check、youtube_report 均已切换为 Gemma 4 (Ollama) 本地调用。',
      },
      {
        role: 'user',
        content: 'Gemma 4 装好了，测试一下。',
      },
      {
        role: 'ai',
        header: '🟩 [LIMIT BREAK] SYSTEMS ONLINE',
        type: 'success',
        content: 'Gemma 4 跑通！dept_ops.py 自动分析日志，发现 Instagram / Pinterest token 缺失。所有部门脚本可用，timeout 已调至 300 秒。',
        box: {
          label: '系统状态',
          lines: ['Ollama: ✅ Running', 'gemma4:latest: ✅ 9.6 GB loaded', 'dept_ops.py: ✅ 首次运行成功'],
          highlight: -1,
        },
      },
    ],
  },
  {
    date: '2026-04-05',
    chapter: '32',
    color: '#00ff88',   // green
    title: '网站升级：3D 特效与自动部署',
    subtitle: 'Vanta.js + GitHub + Netlify CI/CD',
    messages: [
      {
        role: 'user',
        content: '网站需要重做，做成日志模式，每天自动生成。加上 3D 特效。',
      },
      {
        role: 'ai',
        header: '🎨 设计方案',
        content: '方案：每天 Gemma 4 从对话历史提取 4-5 段精华 → 生成新章节 → 自动推送 GitHub → Netlify 部署。背景换 Vanta.js 三种可切换特效（粒子网络 / 量子矩阵 / 数据流）。',
      },
      {
        role: 'ai',
        header: '✅ 完成',
        type: 'success',
        content: '已实现：① Vanta.js 3D 背景（右下角按钮切换三种效果）② 对话框左右飞入动画 ③ GitHub 仓库已连接 Netlify 自动部署 ④ 网站改为分页模式，每页一天日志。',
        box: {
          label: '技术栈',
          lines: ['Frontend: Vite + Vanilla JS', '3D: Vanta.js (NET / DOTS / BIRDS)', 'Deploy: GitHub → Netlify CI/CD', 'Data: Gemma 4 本地生成内容'],
          highlight: -1,
        },
      },
      {
        role: 'user',
        content: '每次更新先本地确认再部署。',
      },
      {
        role: 'ai',
        content: '确认，工作流：本地改 → 你看效果 → 你说"部署" → 我 git push → Netlify 自动上线。',
      },
    ],
  },
];
