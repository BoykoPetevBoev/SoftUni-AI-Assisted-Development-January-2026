import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.stories.*',
        '**/*.d.ts',
        '**/index.ts',
        'src/main.tsx',
        'src/App.tsx',
        'src/setupTests.ts',
        'src/styles/**',
        'src/types/**',
        'storybook-static/**',
      ],
    },
  },
})
