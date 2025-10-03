# 当前工程实现现状（Current State）

说明：本文件仅总结当前工程的实际实现状态，排除 archive 目录内容。

## 1. 仓库与文件结构（非归档部分）
- 根目录
  - index.html（首页，个人主页）
  - css/style.css（样式，已从 index.html 抽离）
  - script/app.js（脚本，已从 index.html 抽离）
  - assets/（资源：protrait.png、resume.md）
  - project/
    - requirements.md（需求清单，已多轮更新）
    - current_state.md（当前文档）
    - todo.md（任务列表）
  - test/
    - frontend/
      - index.html（前端测试运行器）
      - app.spec.js（前端 JS 单元测试用例）
    - backend/
      - test_api.py（后端 pytest 集成测试骨架，依赖 BACKEND_URL）

## 2. 前端实现状态
- 页面结构：单页首页（About / Projects / Skills / Publications / Footer），布局与样式均已实现；可直接在浏览器打开运行。
- 样式与脚本拆分：已将原内联 style/script 抽离到 css/style.css 与 script/app.js，并在 index.html 正确引用。
- 交互功能：
  - 语言切换：支持中/英/日三语切换（data-zh / data-en / data-ja + localStorage 记忆），按钮高亮状态随切换更新，并含默认语言自动识别（含 ja）。
  - 滚动锚点高亮：为锚点链接在滚动时设置高亮样式。
  - 测试友好接口：在 app.js 暴露 window.__app.i18n 与 window.__app.scroll，便于单测直接调用。
- 字体与图标：通过 CDN 引入 Google Fonts（Inter、Noto Sans SC、Noto Sans JP）与 Font Awesome 6.5.x；Noto Sans JP 已接入。
- 配色与设计基调：
  - 现状：深色、冷静基调已具备；使用一组冷色渐变与阴影风格。
  - 需求对齐：requirements.md 已增加“颜色方案设计”规范（核心主色 --primary 及派生变量与交互映射）。样式变量尚未完全按新规范重构联动（见“差距”）。

## 3. 简历信息映射
- 页面已覆盖简历核心信息（姓名、联系方式、教育、经历、项目、技能、著作等）。
- 方式：静态编排。未实现运行时解析 assets/resume.md 自动渲染。

## 4. 多语言状态
- 已实现：中文/英文/日文完整切换（data-zh/en/ja，UI 含“日本語”按钮），支持浏览器默认语言识别（含 ja）与 localStorage 记忆，按钮高亮联动。
- 字体：已接入 Noto Sans JP，确保日文显示效果。

## 5. 聊天功能与后端
- 前端：尚未有聊天 UI 组件与调用逻辑。
- 后端：backend/ 目录尚未创建；Flask + MySQL、/api/health、/api/chat/completions 等接口未实现。
- 要求已在 requirements.md 明确（代理火山引擎、配置、限流、日志、持久化），当前为空白。

## 6. 测试设计与现状（新增）
- 测试总体策略（已落地于 requirements.md，并部分实现）：
  - 目录规范：根级 test/，前端与后端测试分离。
  - 覆盖目标：关键交互（i18n、滚动高亮）、基础接口（健康检查与聊天代理）与最小持久化路径。
- 前端测试（已实现可运行，已通过）：
  - 运行方式：浏览器打开 test/frontend/index.html（Mocha 10.2 + Chai 4.3 UMD）。
  - 用例文件：test/frontend/app.spec.js。
  - 被测脚本：直接加载 ../../script/app.js；通过 window.__app 导出接口进行单测。
  - 用例覆盖：
    - i18n 语言切换：默认中文、切换至英文并持久化、回切中文并校验按钮样式。
    - 滚动高亮：使用 setActiveByY 基于 DOM offsetTop 稳定断言 nav-a/nav-b 高亮。
  - 当前结果：全部用例通过（5/5）。
- 后端测试（骨架已就绪，待服务即可运行）：
  - 运行方式：设置 BACKEND_URL 后，pytest 执行 test/backend/test_api.py。
  - 覆盖内容：/api/health 成功；/api/chat/completions 成功或明确错误码（未配置上游时可接受 4xx/5xx）；自动跳过未配置环境的场景。
  - 现状：后端未实现，处于 Blocked。

## 7. 文档结构更新（新增）
- requirements.md：多轮更新，已包含
  - 完整功能与约束（前端结构、三语、多语言字体、聊天、后端 Flask+MySQL、测试与质量）
  - 新增“前端项目结构规范”（拆分 css/script，根含 index.html）
  - 新增“颜色方案设计”规范（核心主色 --primary，交互态映射、可访问性与主题化要求）
  - 新增“测试与质量”规范（test/ 目录、前端 Mocha+Chai、后端 pytest 与最低覆盖）
- current_state.md：本文件，已补齐“测试设计与现状”“文档结构更新”。
- todo.md：根据 requirements 与 current_state 差异生成，含最新测试事项与实现状态（前端测试 Done；后端测试 Blocked）。

## 8. 与需求的差距（重点待办）
- 多语言：已完成三语支持；可继续打磨术语与行文一致性（可选）。
- 聊天与后端：未创建 backend/；未实现 /api/health 与 /api/chat/completions；未接入 MySQL 与配置管理；未做 CORS/限流/日志/统一错误。
- 配色方案：尚未将 css/style.css 完整重构为“核心主色驱动、变量联动”的实现（需梳理 --primary 系列变量并统一交互态）。
- 配置与可观测性：前端运行时配置通道（window.RUNTIME_CONFIG 或 config.json）未接入；调试日志开关未实现。
- 可访问性与性能：ARIA/焦点可见性/对比度与首屏体积等仍需检查与优化。
- 部署与文档：后端启动与配置示例、数据库初始化脚本说明尚缺。

## 9. 运行与验证
- 运行：直接打开根目录下 index.html，即可浏览页面。
- 前端测试：打开 test/frontend/index.html 即可查看测试结果（当前全部通过）。
- 后端测试：待 backend 实现后，设置 BACKEND_URL 后运行 pytest。