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
  {
    date: "2026-04-06",
    chapter: "33",
    color: "#f97316",
    title: "Discord 多智能体系统上线",
    subtitle: "Gemma4 本地模型 + YouTube 全自动流水线",
    messages: [
      {
        role: "user",
        content: "Discord 这里可否不用 Anthropic API 而是用本地模型 Gemma4 代替？同时把 YouTube 自动化也接进来。",
      },
      {
        role: "ai",
        header: "🧠 三层 AI 金字塔确认",
        type: "success",
        content: "完全可行。Discord DALI 全面切换为 Gemma4 本地调用（零 API 费用），Claude 只保留终端核心决策。频道路由：策略讨论 / 市场信号 / 系统状态 / youtube-发布，每个频道独立 system prompt，Bot 无需 @ 即自动回复。",
        box: {
          label: "模型分工",
          lines: ["Discord DALI → Gemma4 (Ollama 本地, 免费)", "YouTube 标题/描述 → Gemma4 生成", "终端对话 / 核心决策 → Claude"],
          highlight: -1,
        },
      },
      {
        role: "user",
        content: "我是不是可以把视频文件直接丢给 Discord？标题和描述也让他帮我做，直接 public。多个视频按 YouTube TOS 设定时间间隔。",
      },
      {
        role: "ai",
        header: "🎥 YouTube 全自动流水线",
        type: "success",
        content: "流程已实现：Discord #youtube-发布 收到视频附件 → 自动下载到队列 → Gemma4 生成「标题：xxx / 描述：xxx」→ youtube_auto.py 上传。多视频策略：首个立即 public，后续每隔 4 小时 scheduled，符合 TOS 最佳实践。",
        box: {
          label: "上传规则",
          lines: ["1 个视频 → 立即 public", "2+ 视频 → 首个立即，后续 +4h / +8h ...", "TOS 合规：间隔发布防止限流"],
          highlight: 1,
        },
      },
      {
        role: "user",
        content: "launchd 用了吗？Railway 和 Fly.io 都搞不定。",
      },
      {
        role: "ai",
        header: "⚙️ launchd 本地 24/7 部署",
        content: "Railway OAuth 过期、Fly.io 需要信用卡，云端全部放弃。改用 macOS launchd：com.onetenquant.dali-bot.plist 配置 KeepAlive=true，开机自动启动，崩溃自动重启，日志写入 /tmp/dali-bot.log。比云端更稳，零成本。",
        box: {
          label: "服务状态",
          lines: ["launchd: ✅ KeepAlive + RunAtLoad", "Discord Bot: ✅ 在线，响应所有频道", "Ollama gemma4: ✅ 9.6 GB loaded"],
          highlight: -1,
        },
      },
      {
        role: "ai",
        header: "📋 日志自动生成部署",
        type: "success",
        content: "daily_log_gen.py 修复 JS 数组逗号 bug（messages 对象间缺逗号导致 PARSE_ERROR），并成功运行：读取 ~/.claude 对话 JSONL → Gemma4 提炼 → 追加 src/data.js → git push → Netlify 自动部署。今日构建日志即为本脚本产物。",
      },
      {
        role: "user",
        content: "层级关系是什么？谁的权限更大？Discord DALI 是你的 sub agent 还是完全独立的？他也在终端跑吗？",
      },
      {
        role: "ai",
        header: "🏗️ 系统层级架构",
        content: "两个独立进程，不存在从属关系。Claude Code（终端）权限最高：读写所有文件、执行命令、改代码、部署，你通过 Telegram 直接控制，是真正的大脑 + 执行者。Discord DALI Bot 是 launchd 守护的 Python 脚本，调用本地 Gemma4，只能做脚本里写好的事——收消息、生成回复、触发上传，无终端权限。Claude Code 可以控制 DALI（改脚本、重启），DALI 不知道 Claude Code 存在。",
        box: {
          label: "权限对比",
          lines: ["Claude Code → 文件系统 + 终端 + 部署（最高）", "Discord DALI → Discord 消息 + Gemma4 调用（受限）", "关系：Claude Code 单向控制 DALI，反向不成立"],
          highlight: 2,
        },
      },
      {
        role: "user",
        content: "那他消耗谁的 token？",
      },
      {
        role: "ai",
        header: "💰 Token 计费隔离",
        content: "Discord DALI 现已切换 Gemma4 本地运行，零 token 消耗。之前用 Anthropic API 时走的是单独的 discord-dali API key，与 Claude Code 的计费完全隔离、互不影响。要控制用量，可限制哪些频道触发回复——现在设置是专属频道内所有消息都响应。",
      },
    ],
  },
  {
    date: "2026-04-06",
    chapter: "33",
    color: "#a855f7",
    title: "系统核心能力跑通",
    subtitle: "完成了从本地调试到云部署，再到多API集成的全流程构建。",
    messages: [
    {
      role: "ai",
      header: "✅ Bot功能上线",
      content: "Bot 重启后已收到消息，确认功能在线。修正了 `on_ready` 未触发的 Python 输出缓冲问题，重启加 `-u` 参数解决。",
      type: "success",
    },
    {
      role: "ai",
      header: "☁️ 云环境API升级",
      content: "云端部署要求 Bot 切换到直接调用 Anthropic API，而非本地的 claude CLI。已更新配置并实现云就绪的结构。",
      type: "success",
    },
    {
      role: "ai",
      header: "🏠 部署方案锁定",
      content: "放弃了复杂的云服务（如 Railway/Fly.io），决定使用 Mac 本地的 `launchd` 方案，实现24/7持久运行，降低了部署难度。",
      type: "success",
    },
    {
      role: "ai",
      header: "🎬 第三方API集成",
      content: "完成了 YouTube 自动发布流程的 OAuth 授权。明确了所需的 `youtube.upload` 权限，并更新了 `launchd` plist 实现定时脚本自动运行。",
      type: "success",
    },
    ],
  },
  {
    date: "2026-04-07",
    chapter: "33",
    color: "#a855f7",
    title: "智能视频系统构建规范",
    subtitle: "确立VN风格自动化视频生成全流程规范与维护手册",
    messages: [
    {
      role: "user",
      content: "第一步，先为系统搭建基础的VN（Visual Novel）视频模板。必须定义好固定参数，包括尺寸、背景、角色、配音和对话框的精确位置，以实现最高稳定性。",
    },
    {
      role: "ai",
      header: "核心模板参数固化",
      content: "模版固定参数（Template Settings）:\n- **尺寸/比例**: 标准屏幕比例。\n- **资源**: 关联角色/场景素材库。\n- **输入**: 文本内容（需预处理）\n- **输出**: 完整的带字幕/动画序列。\n- **记录**: 详细的生成日志与时间戳。",
    },
    {
      role: "AI",
      content: "角色/角色动画管理：确保所有角色的情绪、动作（Animation）与对话的同步性。使用关键帧技术确保流畅过渡。",
    },
    {
      role: "AI",
      content: "自动化流程优化：实现从文本输入到视频输出的完全自动化流程。关键步骤包括：文本清洗 -> 情感分析/时长分配 -> 角色动作匹配 -> 语音生成 -> 渲染渲染。",
    },
    {
      role: "AI",
      content: "维护日志与优化：系统运行过程中，必须记录所有失败的尝试、使用的模型版本、以及每次运行的系统资源消耗，用于故障排查和模型迭代。",
    },
    ],
  },
  {
    date: "2026-04-08",
    chapter: "34",
    color: "#22c55e",
    title: "Trail Guard — 利润保护策略上线",
    subtitle: "期权持仓自动追踪止损 · 部分批量出货 · 强制收盘前平仓",
    messages: [
      {
        role: "user",
        content: "我的 NVDA 期权已经涨了 +236%，有没有办法在保护利润的同时还能继续跑？",
      },
      {
        role: "ai",
        header: "🎯 Trail Guard 策略设计",
        type: "success",
        content: "设计了独立监控策略 trail_guard：不嵌入单个策略，而是覆盖所有期权持仓。核心逻辑：追踪历史最高价，回撤超过阈值就部分平仓（卖出总量 - 2 张），保留 2 张无止损拿到收盘，实现「锁定大部分利润 + 保留无限上涨空间」双目标。",
        box: {
          label: "分级追踪止损",
          lines: [
            "盈利 >200% → 回撤 10% 触发",
            "盈利 >100% → 回撤 12% 触发",
            "盈利 >50%  → 回撤 15% 触发",
            "其他持仓  → 回撤 20% 触发",
          ],
          highlight: 0,
        },
      },
      {
        role: "user",
        content: "彩票仓位（midday_lotto）不应该被包含进来吧？",
      },
      {
        role: "ai",
        header: "🎰 彩票仓位自动排除",
        content: "正确。trail_guard 读取 LOTTO_STATE 文件，自动识别并跳过 midday_lotto 策略下的持仓。彩票策略设计目标是 5x，中间的波动不应触发追踪止损，两套逻辑互不干扰。",
      },
      {
        role: "user",
        content: "留两张不设止损拿到收盘——那自动行权怎么办？",
      },
      {
        role: "ai",
        header: "⚠️ 强制收盘前平仓",
        type: "success",
        content: "到期日当天 15:30 ET，trail_guard 会强制平掉所有剩余持仓（包括那 2 张保留张），避免 ITM 期权自动行权买入正股。自动行权意味着用期权杠杆买入大量正股，资金占用极大且非预期。强制平仓 = 最大化期权溢价收益，绝不让行权发生。",
        box: {
          label: "到期日流程",
          lines: [
            "≤ 15:30 ET → 正常追踪止损运行",
            "= 15:30 ET → 强制平仓全部剩余张数",
            "目的：避免 ITM 自动行权买入正股",
          ],
          highlight: 1,
        },
      },
      {
        role: "user",
        content: "这个策略能有效保护利润，还是会错过更大的涨幅？",
      },
      {
        role: "ai",
        header: "📊 利润保护 vs 上涨空间",
        content: "两者都要：卖出大部分（总量 - 2 张）锁定已实现利润，剩余 2 张继续享受无限上涨。高盈利档位（>200%）只用 10% 回撤触发，给足空间继续跑。相比于全部持有等反转，或者全部卖出踏空后续涨幅，部分出货是更均衡的选择。5 分钟 cron 监控，市场时间全覆盖。",
      },
    ],
  },
  {
    date: '2026-04-08',
    chapter: '35',
    color: '#3b82f6',
    title: '构建日志 2026-04-08 21:39',
    subtitle: 'Build Log via #build-log',
    messages: [
      {
        role: 'ai',
        header: '对话内容提取',
        content: '**用户：** 说啥呀?',
      },
      {
        role: 'ai',
        header: 'Grok',
        content: '你说啊',
      },
      {
        role: 'user',
        content: '你说，哪两个?',
      },
      {
        role: 'ai',
        header: 'Grok',
        content: '好，两个问题。',
      },
      {
        role: 'user',
        content: '阿ppa那个交易平台在做期权交易，用API在用这个呢Cloud Code做策略，用API在用这自动化交易去做，量化交易工具去去做对吧? 然后我想说就是现在就是把那个交易记录都调出来，然后我想看哪个策略能够怎么样，然后现在就是说看到上面只有那个TradesViz这个工具这个网上站它提供全篇的vog量什什么的，对吧?',
      },
      {
        role: 'user',
        content: '你说对了，TradesViz对期权策略盘确实很强，尤其是Greeks分析、期权流、模拟器这些功能，市面上少有能比的。它直接支持Alpaca白自动导入，用API能上后台每天自动同步交易记录。',
      },
      {
        role: 'user',
        content: '你说，哪两个?',
      }
    ],
  },
  {
    date: '2026-04-08',
    chapter: '36',
    color: '#00f0ff',
    title: '构建日志 2026-04-08 21:39',
    subtitle: 'Build Log via #build-log',
    messages: [
      {
        role: 'ai',
        header: '对话内容提取',
        content: '**用户：** 说啥呀?',
      },
      {
        role: 'ai',
        header: 'Grok',
        content: '你说啊',
      },
      {
        role: 'user',
        content: '你说，哪两个?',
      },
      {
        role: 'ai',
        header: 'Grok',
        content: '好，两个问题。',
      },
      {
        role: 'user',
        content: '阿ppa那个交易平台在做期权交易，用API在用这个呢Cloud Code做策略，用API在用这自动化交易去做，量化交易工具去去做对吧? 然后我想说就是现在就是把那个交易记录都调出来，然后我想看哪个策略能够怎么样，然后现在就是说看到上面只有那个TradesViz这个工具这个网上站它提供全篇的vog量什什么的，对吧?',
      },
      {
        role: 'user',
        content: '你说对了，TradesViz对期权策略盘确实很强，尤其是Greeks分析、期权流、模拟器这些功能，市面上少有能比的。它直接支持Alpaca白自动导入，用API能上后台每天自动同步交易记录。',
      },
      {
        role: 'user',
        content: '你说，哪两个?',
      }
    ],
  },
  {
    date: '2026-04-08',
    chapter: '37',
    color: '#a855f7',
    title: '构建日志 2026-04-08 22:30',
    subtitle: 'Build Log via #build-log',
    messages: [
      {
        role: 'user',
        content: '现在 Unreal Engine 还有用吗？我是说 AI 视频工具这么发达，有没有在 UE 上做 3D 建模？',
      },
      {
        role: 'ai',
        header: 'DALI',
        content: '这是一个非常深刻且处于行业前沿的问题。到 2026 年，AI 视频工具（如 Veo 3.1、Kling 等）确实能生成极具震撼的视觉效果，甚至致使像 Sora 2 这样的一代霸主因运营成本和版权问题在今年 3 月正式停服。',
      },
      {
        role: 'ai',
        header: 'DALI',
        content: '简单直接的回答是：不仅有必要，而且 Unreal Engine (UE) 依然是专业创作的“定海神针”。AI 负责的是“生成”，而 UE 负责的是“掌控”。',
      },
      {
        role: 'ai',
        header: 'DALI',
        content: '以下是万能点位，在 2026 年，你依然需要 UE 以及手动建模的几个核心逻辑：',
      },
      {
        role: 'ai',
        header: 'AI 视频',
        content: '现在的 AI 视频本质上是“抽卡”。即使提示词 (Prompt) 再精准，你也很难让 AI 连续生成 10 个镜头，并保证镜头的人物长相、衣服褶皱、光影位置完全一致。',
      },
      {
        role: 'ai',
        header: 'UE 建模',
        content: '在 UE 中，模型是资产，灯光是参数。你建好一个 3D 模型，无论镜头怎么切，它的几何结构、纹理、缩放状态都是 100% 确定的。对于需要多镜头的、长篇叙事的作品，UE 的确定性无可替代。',
      }
    ],
  },
  {
    date: '2026-04-08',
    chapter: '38',
    color: '#f59e0b',
    title: '构建日志 2026-04-08 22:30',
    subtitle: 'Build Log via #build-log',
    messages: [
      {
        role: 'user',
        content: '现在 Unreal Engine 还有用吗？我是说 AI 视频工具这么发达，有没有在 UE 上做 3D 建模？',
      },
      {
        role: 'ai',
        header: 'DALI',
        content: '这是一个非常深刻且处于行业前沿的问题。到 2026 年，AI 视频工具（如 Veo 3.1、Kling 等）确实能生成极具震撼的视觉效果，甚至致使像 Sora 2 这样的一代霸主因运营成本和版权问题在今年 3 月正式停服。',
      },
      {
        role: 'ai',
        header: 'DALI',
        content: '简单直接的回答是：不仅有必要，而且 Unreal Engine (UE) 依然是专业创作的“定海神针”。AI 负责的是“生成”，而 UE 负责的是“掌控”。',
      },
      {
        role: 'ai',
        header: 'DALI',
        content: '以下是万能点位，在 2026 年，你依然需要 UE 以及手动建模的几个核心逻辑：',
      },
      {
        role: 'ai',
        header: 'AI 视频',
        content: '现在的 AI 视频本质上是“抽卡”。即使提示词 (Prompt) 再精准，你也很难让 AI 连续生成 10 个镜头，并保证镜头的人物长相、衣服褶皱、光影位置完全一致。',
      },
      {
        role: 'ai',
        header: 'UE 建模',
        content: '在 UE 中，模型是资产，灯光是参数。你建好一个 3D 模型，无论镜头怎么切，它的几何结构、纹理、缩放状态都是 100% 确定的。对于需要多镜头的、长篇叙事的作品，UE 的确定性无可替代。',
      }
    ],
  }
];