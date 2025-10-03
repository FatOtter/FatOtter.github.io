# FatOtter.github.io

A pure front-end personal homepage that includes multilingual support (zh/en/ja), resume content, and testing scaffolds. Optional backend (Flask) is planned for Volcengine chat proxy.

## Project Structure
- index.html — main page
- css/style.css — styles
- script/app.js — scripts
- assets/ — static assets (e.g., resume.md, images)
- project/ — product docs
  - requirements.md — canonical requirements checklist
  - current_state.md — current implementation status (non-archive)
  - todo.md — task list derived from requirements vs. current state
- test/
  - frontend/ — Mocha + Chai browser-run tests
  - backend/ — pytest integration tests (for backend when available)
- archive/ — old materials (excluded from current implementation status)

## Run
- Frontend: open index.html in a modern browser.
- Frontend tests: open test/frontend/index.html in a browser.
- Backend tests: set BACKEND_URL and run pytest (requires a backend to exist).

## How to contribute
This repository follows a documentation-driven workflow centered on the project folder.

1) Update requirements
- Edit project/requirements.md to reflect requested features and constraints only (as a checklist).
- Keep it concise and implementation-agnostic.

2) Compare and list TODO
- Read project/current_state.md to understand what’s already implemented (exclude archive/).
- Derive all gaps by comparing requirements.md vs. current_state.md.
- Add every task to project/todo.md with clear status:
  - Status values: Todo / In Progress / Done / Blocked
  - Prefer small, verifiable items

3) Implement code
- Make minimal, targeted changes; follow existing patterns and code style.
- Keep the front-end stack pure (HTML/CSS/JS). If a backend is needed, expose a configurable REST URL (do not hardcode secrets).
- Respect the project structure (css/, script/, test/, project/).
- For i18n: use data-zh/data-en/data-ja attributes and localStorage to persist language.

4) Run tests
- Frontend: run test/frontend/index.html in a browser; ensure all tests pass.
- Backend (if present): run pytest under test/backend/.
- Add or update tests to cover new logic where reasonable.

5) Update project docs
- Update project/current_state.md to reflect the latest implementation state.
- Update project/todo.md to set accurate statuses (mark completed items Done).
- Ensure requirements.md stays the single source of truth for requirements.

6) Commit
- Commit code and doc updates together in a single coherent change set.
- Do not include secrets. Use environment variables/config for runtime settings.

## Coding Guidelines
- Accessibility: visible focus, adequate contrast (WCAG AA), semantic HTML.
- Style: all colors via CSS variables; interactive states (hover/active/focus) derive from --primary.
- Security: rel="noopener noreferrer" on external target=_blank links; never commit keys.
- Config: support runtime-injected configs (e.g., window.RUNTIME_CONFIG or a config.json).