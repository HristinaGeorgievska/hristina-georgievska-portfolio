# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript portfolio site. Application code lives in `src/`: `main.tsx` boots the app, `App.tsx` defines routes/layout, `pages/` contains route-level screens, `components/` contains reusable UI and feature sections, `components/ui/` holds shadcn/Radix-style primitives, `hooks/` stores custom hooks, `lib/` stores shared helpers, and `assets/` stores bundled media. Static files that must be served unchanged, such as favicons, manifests, `robots.txt`, `sitemap.xml`, and Open Graph images, belong in `public/`. Tests and shared test setup currently live in `src/test/`.

## Build, Test, and Development Commands

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist/`.
- `npm run build:dev` builds with Vite development mode for debugging build output.
- `npm run preview` serves the built `dist/` locally.
- `npm run lint` runs ESLint across the repository.
- `npm test` runs Vitest once; `npm run test:watch` starts Vitest in watch mode.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Name component files in PascalCase, for example `MasonryGallery.tsx`; hooks should use `useSomething` naming. Prefer named exports for shared utilities and keep route/page concerns in `src/pages/`. Follow the existing two-space indentation style, Tailwind utility classes for styling, and shadcn/Radix composition patterns for UI primitives. Run `npm run lint` before opening a PR.

## Testing Guidelines

Vitest is configured with `jsdom` and Testing Library setup in `src/test/setup.ts`. Place focused unit or component tests near the relevant feature or in `src/test/`, using `*.test.ts` or `*.test.tsx` naming. Cover new helper logic, route behavior, and interactive UI states when they change. Run `npm test` before submitting changes.

## Commit & Pull Request Guidelines

Recent history uses short, imperative commit subjects, sometimes with a conventional prefix such as `feat:`. Keep commits scoped and descriptive, for example `feat: add collection detail gallery` or `fix: stabilize lightbox keyboard navigation`. Pull requests should include a concise summary, testing performed, linked issue if available, and screenshots or screen recordings for visual changes.

## Security & Configuration Tips

Keep secrets in `.env` and never commit production credentials. Document any required environment variables in the PR description when adding integrations such as Contentful or Sentry. Do not edit generated output in `dist/`; update source files and rebuild instead.
