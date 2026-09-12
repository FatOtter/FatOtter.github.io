# Rex — Digital & AI Delivery Portfolio

A client-facing, monochrome portfolio for Liyue Shen (Rex), built with plain HTML, CSS and JavaScript. Chinese, English and Japanese are supported. The page includes current expertise, anonymized recent work, six historical cases, professional experience, education, skills, four publications and direct contact links.

## Run

Open `index.html` directly, or serve it locally:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8080`. There is no build step, CDN, analytics, model API or backend request. Without JavaScript, the Chinese content, native case disclosures and contact links remain usable. The résumé link opens the complete Chinese résumé.

## Structure

- `index.html`: static content; translations use `data-zh/en/ja` attributes.
- `css/style.css`: responsive monochrome design, CSS color variables, focus and reduced-motion support.
- `script/app.js`: language selection/persistence, metadata and navigation state.
- `assets/resume.md`: full public résumé, with current anonymized experience.
- `project/`: requirements, actual implementation state, task status and verification record.
- `test/frontend/`: dependency-free browser tests against the actual page.
- `archive/`, `script/game.js`, `css/game.css`, other existing assets and `backend/`: retained historical/independent material. The homepage does not load the game or backend. Backend operation was not evaluated as part of the portfolio redesign.

## Validate

While serving locally, open `http://127.0.0.1:8080/test/frontend/index.html`. The test page reports 12 checks, including all three languages, metadata, saved preference, fallbacks, navigation, native disclosures, retained content and external links. It requires no test libraries or network access.

The additional browser review is recorded in `project/verification.md`. It covers desktop/mobile layouts, keyboard interaction, storage failures and JavaScript-disabled operation. Automated accessibility checks complement visual review; they are not a formal accessibility certification.

## Contribution workflow

1. Update `project/requirements.md` with requested behavior and constraints.
2. Compare it with `project/current_state.md`, and update `project/todo.md`.
3. Make focused changes within the existing HTML/CSS/JS structure.
4. Run the browser tests and relevant layout checks.
5. Update state, TODO and verification records. Commit code and documentation together.

Preserve public historical information; describe recent engagements only using approved generalized business contexts and responsibilities. Do not add identifiable client details or claim unverified outcomes. Ensure external tabs use `rel="noopener noreferrer"`. Publication and deployment require owner review; the redesign is prepared locally first.
