# 传统文化智能体（二十四节气 · 古诗词）

为秒哒站点 https://app-c2zk70llophd.appmiaoda.com 配套的传统文化智能体项目。

**核心架构**：DeepSeek 当大脑（对话/赏析/意图路由），智谱免费模型当画笔（CogView-3-Flash 生图、CogVideoX-Flash 生视频），自建诗词/节气知识库当记忆（RAG，杜绝信息污染）。

| 文件/目录 | 内容 |
|---|---|
| [app-c2zk70llophd/](./app-c2zk70llophd/) | **网站源码（秒哒导出的 React + Supabase 工程）+ 已实现的智能体代码** |
| [传统文化智能体规划方案.md](./传统文化智能体规划方案.md) | 完整规划（v2 已按真实源码修订）：架构、知识库、生成 pipeline、成本、路线图、合规 |
| [prompts/](./prompts/) | 智能体系统提示词 + 场景风格模板（设计参考） |
| [examples/](./examples/) | 独立部署备选方案（FastAPI 代理 + iframe 挂件），已被站内实现取代 |

**🌐 效果演示（可直接打开）**：https://claude.ai/code/artifact/40dc9fec-5221-4fe5-b439-b5c089bc63d9
（离线演示版：双语对话、500 首诗词知识库浏览与检索、朗读示意；生产版按下方步骤部署）

## 智能体已实现的部分（在 `app-c2zk70llophd/` 中）

- `supabase/functions/deepseek-chat/` — DeepSeek 云函数（流式 + JSON 模式）
- `src/data/poetryLibrary.ts` — 20 首精选诗库（人工校准：原文+拼音+英译三重锚定）
- `src/data/basePoetry.json` + `basePoetry.ts` — 底层库 480 首唐诗宋词元曲（源自开源 chinese-poetry，懒加载）
- `src/services/cultureAgent.ts` — 智能体服务：RAG 注入、意图识别、场景要素抽取、3 套画风、文生图 + 图生视频管线
- `src/pages/CultureAgentPage.tsx` + `src/routes.tsx` — 新页面「知节 · AI文化伙伴」（路由 `/culture`）

## 🌾 把智能体嵌入线上网站（悬浮聊天球）

**最快路径（今天就能用）**：复制 `app-c2zk70llophd/embed/一键嵌入代码.html` 全部内容 → 粘贴进秒哒「自定义 HTML」组件 → 发布。右下角出现聊天球，开箱即用（文心对话 + 内置精选知识库 + 配画/视频/朗读）。

**知识库入库（500 首进数据库）**：在 Supabase SQL 编辑器执行 `supabase/migrations/00005_create_culture_poems.sql` 和 `00006_seed_culture_poems.sql`，挂件与站内页面自动共用数据库检索。配好 `DEEPSEEK_API_KEY` 并部署 `culture-agent-chat` 后自动升级为 DeepSeek 完全体。详见 [embed/嵌入指南.md](./app-c2zk70llophd/embed/嵌入指南.md)。

## 上线步骤

1. 在 [platform.deepseek.com](https://platform.deepseek.com) 注册，创建 API Key（新账号送 500 万 token）。
2. 在秒哒/Supabase 后台给 Edge Functions 添加环境变量 `DEEPSEEK_API_KEY`。
3. 部署 `supabase/functions/deepseek-chat`（与现有函数同样方式）。
4. 构建发布前端，导航栏会自动出现「AI文化伙伴」入口。
