# 人生旅途

AI 驱动的个人品牌网站生成器。上传简历，智能润色，一键生成现代个人主页。

[![Version](https://img.shields.io/badge/version-v1.0.0-teal)](https://github.com/qinchenox/life-journey/releases/tag/v1.0.0)

---

## 功能

### 核心流程
- **品牌首页** — 淡青渐变 Hero，Logo 动画，打字机轮播，鼠标视差交互
- **上传即解析** — 拖拽 PDF/DOCX，AI 提取并润色结构化信息
- **补充资料** — 编辑页右侧边栏上传项目文档/证书，AI 智能合并到简历
- **自由编辑** — 校对修正 AI 结果，增删调整各模块
- **一键发布** — 生成为自包含 HTML，离线可用；部署后扫码即可分享

### 智能体系统
5 个 AI Agent 风格：**技术极客** · **创意大师** · **商务精英** · **学术严谨** · **通用全能**

每个 Agent 有独立的优化原则和输出偏好，解析时选择不同风格获得差异化的润色效果。

### 项目成果生成
发布时 AI 自动生成 4 类专业报告：
- **项目案例** — STAR 格式（背景-任务-行动-成果），含量化数据
- **行业简报** — 行业/赛道分析，市场概况与技术趋势
- **工作白皮书** — 专业文档（摘要-方法论-关键发现-发展建议）
- **求职材料** — 求职信、演讲稿、LinkedIn 摘要

### 登录与存储
- 邮箱注册登录，SQLite 持久化
- 简历历史自动保存，切换设备可恢复

### 设计特性
- 柔和淡青色配色，暖白基调
- 时间线式工作经历，项目卡片网格
- 暗色模式自适应、打印样式、移动端适配
- 入场动画、滚动渐显、玻璃拟态

---

## 技术栈

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Zustand · SQLite · AI API

---

## 快速开始

```bash
npm install
cp .env.local.example .env.local  # 填入 LLM 配置
npm run dev
```

环境变量：

| 变量 | 说明 |
|---|---|
| `LLM_BASE_URL` | LLM API 地址（兼容 OpenAI 接口） |
| `ANTHROPIC_API_KEY` | API Key |
| `LLM_MODEL` | 模型名称，默认 `qwen-plus` |
| `JWT_SECRET` | JWT 签名密钥（生产环境务必修改） |

---

## 使用流程

1. 打开首页 → 选择 AI 风格 → 点击「开始创建」
2. 拖拽上传 PDF/DOCX → AI 解析润色 → 自动进入编辑页
3. 右侧边栏可上传补充材料，AI 实时合并
4. 预览页切换 Tab 查看主页效果，一键生成项目成果报告
5. 下载 HTML 或部署上线，扫码分享

---

## 项目结构

```
src/
├── app/                    # App Router
│   ├── page.tsx            # 品牌首页 + 上传弹窗
│   ├── edit/page.tsx       # 编辑页 + 补充资料侧栏
│   ├── preview/page.tsx    # 预览页 + Tab 报告
│   ├── login/page.tsx      # 登录注册
│   └── api/                # 9 个 API 路由
├── components/
│   ├── upload/             # 文件上传
│   ├── edit/               # 编辑表单 + 补充面板
│   ├── preview/            # 预览器 + 报告编辑器
│   └── layout/             # Header
├── templates/portfolio/    # 生成页模板（8 个 section）
├── lib/
│   ├── agents/             # 5 个 AI Agent 配置
│   ├── db/                 # SQLite 数据库
│   ├── auth.ts             # JWT + bcrypt
│   ├── claude-parser.ts    # AI 解析
│   ├── html-generator.ts   # HTML 生成（现代 CSS）
│   ├── themes.ts           # 主题系统
│   └── types.ts            # 类型定义
└── store/                  # Zustand 状态管理
```

## 部署

推荐 Vercel 一键部署，设置环境变量即可。也支持 Docker 或任意 Node.js 服务器。

## License

MIT
