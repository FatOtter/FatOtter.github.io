# 项目 TODO 列表（同步至最新需求与现状）

说明：本清单基于 requirements.md 与 current_state.md。状态：Done / In Progress / Todo / Blocked。

- 配色与品牌色落地（CSS 变量与组件绑定）
  - 扩展色板变量（--primary/-hover/-active/-contrast、--focus-ring、状态色）并替换交互引用（a:hover、.btn、.global-nav） — Done
  - 验收：主色改动一处，全站 hover/active/focus 联动；对比度 AA；全局导航与按钮围绕主色 — In Progress（等待人工验收）
- 多语言：加入日语与 Noto Sans JP — Done
- 聊天功能（前端对接/后端代理） — Todo
- 后端（backend/，Flask + MySQL，/api/health, /api/chat/completions） — Todo
- 测试：前端 Mocha+Chai 已全通过；后端 pytest（按 BACKEND_URL 启用） — Frontend: Done / Backend: Blocked
- 文档：requirements.md 已更新配色规范；current_state.md 已补充测试与结构更新 — Done