# Repository Guidelines

## Core Principles

### No Temporary or Cached Files
Never read, edit, or use temporary or cached files.
Always operate on the current working files in the repo.

### Backup Before Change
Before making any edits, copy the target file into a `backup/` folder at the root of the project.
Backups should preserve the same folder structure for easy restoration.
Never overwrite existing backups; append a timestamp if necessary.

### Clarify Ambiguities
If instructions are unclear, incomplete, or conflict with this file, pause and ask for clarification before taking action.

### Atomic Changes Only
Make one logical change at a time.
Include descriptive commit messages so changes are traceable.

### No Data Loss
Never delete or truncate files unless explicitly instructed.
Avoid any action that risks reverting to old versions of the code.

### Fail-Safe Editing
Edits must be surgical, preserving unrelated sections of the code.
Default to non-destructive methods: comment out rather than delete when possible.

## Project Structure & Module Organization
- `src/`: Application code. Components in `src/components/`, data in `src/data/`, utilities in `src/lib/`, entrypoints `main.jsx` and `App.jsx`.
- `public/`: Static assets and static HTML (e.g., `privacy.html`, `terms.html`, images, audio under `public/beats/`).
- `docs/` and `dist/`: Built output. Do not edit directly; source lives in `src/` and `public/`.
- Root config: `index.html`, `vite.config.js`, `eslint.config.js`, `package.json`.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start Vite dev server with React fast-refresh.
- `npm run build`: Create production build to `dist/`.
- `npm run preview`: Serve the production build locally.
- `npm run lint`: Run ESLint on the project.

## Coding Style & Naming Conventions
- JavaScript/JSX (ES Modules); prefer 2-space indent, single quotes, and semicolons.
- ESLint: `recommended`, React Hooks, and Vite React Refresh; `dist/` ignored.
- Components: PascalCase files (e.g., `HexGallery.jsx`); co-locate styles (e.g., `BeatStore.css`).
- Data: JSON in `src/data/` (kebab-case file names), import into components.

## Testing Guidelines
- No test framework configured yet. Preferred: Vitest + React Testing Library.
- Naming: `ComponentName.test.jsx` beside components or under `src/__tests__/`.
- Add `npm test` script when tests are introduced; aim for coverage on core components and utilities.

## Commit & Pull Request Guidelines
- Use clear, imperative messages; Conventional Commits encouraged: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- One logical change per PR. Include description, linked issues, and screenshots for UI changes.
- For deploy previews, include `npm run build` output summary and `npm run preview` steps if relevant.

## Security & Configuration Tips
- Do not commit secrets. Use Vite env files (`.env.local`) for local-only values accessed via `import.meta.env.*`.
- Never modify `docs/` or `dist/` by hand—rebuild via `npm run build`.
