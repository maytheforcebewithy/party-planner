# Party Planner

Frontend for a party & event planning app. Built with Nuxt 4, Vue 3, TypeScript and Pinia.
Designed to run in the browser and, later, as a native Android/iOS app via Capacitor.

> This repository contains **only the frontend**. The backend is developed
> separately as a REST API and is not part of this repository.

## Tech Stack

- [Nuxt 4](https://nuxt.com/) / [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- TypeScript (strict)
- [Pinia](https://pinia.vuejs.org/) for state management
- [VueUse](https://vueuse.org/)
- ESLint (flat config, stylistic + type-aware)
- Vitest for unit tests
- Plain, hand-written CSS (no UI library, no Tailwind)

## Requirements

- Node.js `>= 20`
- npm `>= 10`

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the dev server                         |
| `npm run build`        | Build for production                         |
| `npm run generate`     | Generate a static SPA (used for Capacitor)   |
| `npm run preview`      | Preview the production build                 |
| `npm run lint`         | Lint the codebase                            |
| `npm run lint:fix`     | Lint and auto-fix                            |
| `npm run typecheck`    | Type-check the project                       |
| `npm run test`         | Run unit tests                               |
| `npm run test:coverage`| Run unit tests with coverage                 |

## Architecture

The project follows a feature-based clean architecture. See
[`.claude/CLAUDE.md`](./.claude/CLAUDE.md) for the binding coding standards
(that file lives only in the local dev environment and is not committed).
An overview also lives in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
