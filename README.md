# 传统文化智能体（二十四节气 · 古诗词）

为秒哒站点 https://app-c2zk70llophd.appmiaoda.com 配套的传统文化智能体项目。

**核心架构**：DeepSeek 当大脑（对话/赏析/意图路由），智谱免费模型当画笔（CogView-3-Flash 生图、CogVideoX-Flash 生视频），自建诗词/节气知识库当记忆（RAG，杜绝信息污染）。

| 文件/目录 | 内容 |
|---|---|
| [app-c2zk70llophd/](./app-c2zk70llophd/) | **网站源码（秒哒导出的 React + Supabase 工程）+ 已实现的智能体代码** |
| [传统文化智能体规划方案.md](./传统文化智能体规划方案.md) | 完整规划（v2 已按真实源码修订）：架构、知识库、生成 pipeline、成本、路线图、合规 |
| [prompts/](./prompts/) | 智能体系统提示词 + 场景风格模板（设计参考） |
| [examples/](./examples/) | 独立部署备选方案（FastAPI 代理 + iframe 挂件），已被站内实现取代 |

## 智能体已实现的部分（在 `app-c2zk70llophd/` 中）

- `supabase/functions/deepseek-chat/` — DeepSeek 云函数（流式 + JSON 模式）
- `src/data/poetryLibrary.ts` — 20 首精选古诗知识库（原文锚定）
- `src/services/cultureAgent.ts` — 智能体服务：RAG 注入、意图识别、场景要素抽取、3 套画风、文生图 + 图生视频管线
- `src/pages/CultureAgentPage.tsx` + `src/routes.tsx` — 新页面「知节 · AI文化伙伴」（路由 `/culture`）

## 上线步骤

1. 在 [platform.deepseek.com](https://platform.deepseek.com) 注册，创建 API Key（新账号送 500 万 token）。
2. 在秒哒/Supabase 后台给 Edge Functions 添加环境变量 `DEEPSEEK_API_KEY`。
3. 部署 `supabase/functions/deepseek-chat`（与现有函数同样方式）。
4. 构建发布前端，导航栏会自动出现「AI文化伙伴」入口。
