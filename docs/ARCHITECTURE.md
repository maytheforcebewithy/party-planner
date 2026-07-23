# Architecture

Frontend-only Nuxt 4 application for a party & event planning product.
It is a **mobile app for Android and iOS**, delivered as a Capacitor webview.
Nuxt is used purely as the frontend; there is **no public website** and **no
backend** in this repository. The backend is a separate REST API, consumed
later through typed services.

## Rendering & Capacitor

- `ssr: false` — the app is a client-rendered SPA. There is no server runtime.
- `npm run generate` produces static assets that Capacitor packages into the
  native Android/iOS shells. Native projects (`/android`, `/ios`) are generated
  outside this repo and are gitignored.

## Directory structure

```
src/
├── assets/css/        # variables.css → reset.css → base.css (global, cascade order)
├── components/        # global, app-wide components (App*) — auto-imported
├── composables/       # global composition functions
├── features/          # self-contained feature modules
│   └── <feature>/
│       ├── components/    # UI owned by the feature (imported explicitly)
│       ├── composables/   # feature logic / view models
│       ├── services/      # REST calls & data mapping
│       ├── stores/        # feature-scoped Pinia state
│       └── types/         # feature-scoped types
├── layouts/           # page shells (default = header/main/footer)
├── pages/             # route entry points; compose features only
├── plugins/           # Nuxt plugins
├── stores/            # global Pinia stores
├── shared/            # cross-feature building blocks
│   ├── api/           # HTTP client + shared REST infrastructure
│   ├── components/    # reusable presentational components
│   ├── layout/        # reusable layout building blocks
│   ├── types/         # reusable domain / DTO types
│   └── utils/         # shared, possibly domain-aware helpers
├── types/             # app-wide / ambient types & module augmentation
└── utils/             # generic, dependency-free pure helpers
```

## Dependency rules

- Flow: `pages → features → shared → utils/types`.
- Features never import from other features; they share through `shared/`.
- Components never call the API directly. Data access lives in `services/`
  (per feature) or `shared/api`; components talk to composables/stores.
- Pages contain no business logic — they only assemble features and layout.

## Quality gates

All must stay green at the highest level:

- `npm run lint` — ESLint flat config (Vue + TypeScript, stylistic + type-aware
  rules on `src`), zero warnings.
- `npm run typecheck` — strict `nuxi typecheck` (extra strict compiler flags).
- `npm run test:coverage` — Vitest, 100% coverage on the code where it makes
  sense (components/pages today; composables/services/stores/utils as they land).
