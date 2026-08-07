// @ts-check
// Nuxt generates the flat-config base (Vue + TypeScript + stylistic) in
// .nuxt/eslint.config.mjs on `nuxt prepare`. We extend it with stricter,
// project-wide rules and opt application code into type-aware linting.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    // Native Capacitor projects and build output are not linted.
    ignores: ['android/**', 'ios/**', 'coverage/**', 'dist/**', '.output/**'],
  },
  {
    // Extra strictness applied everywhere (no type information required).
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    // Type-aware rules, scoped to application source so config files and
    // generated output are never pulled into the type-checking project.
    files: ['app/**/*.ts', 'app/**/*.vue'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/require-await': 'error',
    },
  },
  {
    // The logger is the single sanctioned place for direct console output.
    // Placed last so it wins over the project-wide no-console rule.
    files: ['app/shared/logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },
)
