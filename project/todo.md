# 项目 TODO 列表（同步至最新需求与现状）

说明：本清单基于 requirements.md 与 current_state.md。状态：Done / In Progress / Todo / Blocked。

- 配色与品牌色落地（CSS 变量与组件绑定）
  - 扩展色板变量（--primary/-hover/-active/-contrast、--focus-ring、状态色）并替换交互引用（a:hover、.btn、.global-nav） — Done
  - 验收：主色改动一处，全站 hover/active/focus 联动；对比度 AA；全局导航与按钮围绕主色 — In Progress（等待人工验收）
- 多语言：加入日语与 Noto Sans JP — Done
- 聊天功能（前端对接/后端代理） — Done
  - 已完成：基础聊天 UI（输入、发送、清空、消息列表），前端连接后端 REST（POST /api/chat/completions），错误与状态提示
  - 前端配置：assets/config.json（后端地址、模型、温度、是否流式） — Done
  - 待优化：SSE 流式渲染（端到端）、运行时配置面板（模型/温度等）、消息持久化/会话管理（可选）
- 后端（backend/，Flask + MySQL，/api/health, /api/chat/completions） — In Progress
  - 已完成：Flask 最小服务（/api/health、/api/config/public、/api/chat/completions），CORS、统一错误；配置文件 backend/config.json（含 example）并自动加载 — Done
  - 待办：对接火山引擎正式签名与鉴权、SSE 端到端验证、限流与结构化日志完善、MySQL 初始化与持久化（可选）、后端 pytest 覆盖更多路径 — Todo
- 测试：前端 Mocha+Chai 已全通过；后端 pytest（按 BACKEND_URL 启用） — Frontend: Done / Backend: Blocked
- 文档：requirements.md 已更新配色规范；current_state.md 已补充测试与结构更新 — Done