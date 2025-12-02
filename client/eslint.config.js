import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
import unicorn from 'eslint-plugin-unicorn'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),


  // Основная конфигурация для исходного кода
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.config.{ts,js}', 'vite.config.ts', 'tailwind.config.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
       parser: tseslint.parser,
        parserOptions: {
          project: './tsconfig.app.json',
          tsconfigRootDir: import.meta.dirname,
        },
    },
    plugins: {
      boundaries,
       unicorn,
    },
    rules: {
      'no-unused-vars': 'off', // Отключаем базовое правило
      '@typescript-eslint/no-unused-vars': ['error'], // Включаем правило из плагина typescript

      
      // Разрешаем require в конфигах
      '@typescript-eslint/no-require-imports': ['error', {
        allow: ['/tailwind\\.config\\.(js|ts)$/', '/vite\\.config\\.(js|ts)$/']
      }],
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**/*' },
        { type: 'pages', pattern: 'src/pages/**/*' },
        { type: 'widgets', pattern: 'src/widgets/**/*' },
        { type: 'features', pattern: 'src/features/**/*' },
        { type: 'entities', pattern: 'src/entities/**/*' },
        { type: 'shared', pattern: 'src/shared/**/*' },
      ],
      'boundaries/ignore': [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
      ],
      react: { version: 'detect' },
      // Enable resolution of TypeScript path aliases (tsconfig "paths": { "@/*": ["./src/*"] })
      // so eslint-plugin-boundaries and other rules can resolve imports like "@/shared/...".
      'import/resolver': {
        typescript: {
          // Point to the project tsconfig(s) so the resolver knows alias mappings
          project: ['./tsconfig.json', './tsconfig.app.json'],
        },
      },
    },
  },


])