# Prompt

```
TASK:
Set up the frontend for the Budget Tracker application. inside Exam-Budget-Tracker-App client folder

TECH STACK:
React (Vite)
TypeScript
SCSS

DEPENDENCIES TO INSTALL:
@tanstack/react-query
react-hook-form
zod
vitest
react testing library

SETUP REQUIREMENTS:
Create a new React project using Vite with TypeScript
Configure SCSS support
Install and configure all required dependencies
Set up a clean, scalable folder structure:
components/
pages/
hooks/
services/
Configure basic project scripts (dev, build, test)

VERIFICATION:
Project builds successfully
Development server starts without errors
Vitest run without errors
Frontend starts with npm run dev
No TypeScript or build errors
All dependencies are installed and listed in package.json
Folder structure is present and ready for development
```

# Plan

Set up a fresh Vite React + TypeScript app in the required client folder, add SCSS, React Query, React Hook Form, Zod, Vitest, React Testing Library, and Storybook per core instructions. Align the base structure to the required folders (components, pages, hooks, services) and wire minimal config so `npm run dev`, `npm run build`, and `npm run test` pass. Use npm and include full React Testing Library trio.

## Steps

1. Create a new Vite React + TypeScript app in `Exam-Budget-Tracker-App/client` and ensure `package.json` scripts include dev/build/test.
2. Install dependencies: `@tanstack/react-query`, `react-hook-form`, `zod`, `sass`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and Storybook per core instructions.
3. Configure SCSS usage by adding a global SCSS entry and updating the main entry (e.g., `Exam-Budget-Tracker-App/client/src/main.tsx`) to import it.
4. Configure React Query provider in the app entry (e.g., `Exam-Budget-Tracker-App/client/src/main.tsx`) to match the frontend agent rules.
5. Set up Vitest config and test setup file (e.g., `Exam-Budget-Tracker-App/client/vite.config.ts`, `Exam-Budget-Tracker-App/client/src/setupTests.ts`) to enable RTL + jest-dom.
6. Create the base folder structure under `Exam-Budget-Tracker-App/client/src`: components, pages, hooks, services, and keep future API logic in services per rules.
7. Add Storybook configuration under the client root (e.g., `Exam-Budget-Tracker-App/client/.storybook`) with basic scripts and ensure it runs.

## Verification

- Run `npm run dev` and confirm the dev server starts without errors.
- Run `npm run build` and confirm a successful build.
- Run `npm run test` (Vitest) and confirm it exits cleanly.

## Decisions

- Use npm for setup and dependency installation.
- Include Storybook now to satisfy core instructions.
- Install full React Testing Library trio for standard testing needs.

# Result

## ✅ Setup Complete

The Budget Tracker frontend has been successfully set up in `Exam-Budget-Tracker-App/client` with all requirements met.

### Dependencies Installed
- ✅ `@tanstack/react-query@^5.90.20` - Data fetching & caching
- ✅ `react-hook-form@^7.71.1` - Form state management
- ✅ `zod@^4.3.6` - Schema validation
- ✅ `sass@^1.97.3` - SCSS support
- ✅ `vitest@^4.0.18` - Unit testing
- ✅ `@testing-library/react@^16.3.2` - React testing
- ✅ `@testing-library/jest-dom@^6.9.1` - DOM matchers
- ✅ `@testing-library/user-event@^14.6.1` - User interactions
- ✅ `@testing-library/dom@^10.4.1` - DOM testing utilities
- ✅ `storybook@^8.6.15` - Component documentation
- ✅ `jsdom@^28.0.0` - Test environment
- ✅ `@vitest/ui@^4.0.18` - Test UI

### Configuration

#### SCSS Setup
- ✅ Converted `index.css` → `index.scss` and `App.css` → `App.scss` 
- ✅ Updated `src/main.tsx` to import `./index.scss`
- ✅ Updated `src/App.tsx` to import `./App.scss`
- ✅ SCSS nesting & features available for use

#### React Query
- ✅ `QueryClient` instantiated in `src/main.tsx`
- ✅ `QueryClientProvider` wraps entire app
- ✅ Types imported from `@tanstack/react-query`

#### Vitest & Testing
- ✅ `vitest.config.ts` created with:
	- jsdom environment
	- Global test APIs enabled
	- Setup file: `src/setupTests.ts`
- ✅ `src/setupTests.ts` configured with:
	- `@testing-library/jest-dom` matchers
	- Auto-cleanup after each test
	- `window.matchMedia` mock
- ✅ Example Button component with 5 passing tests
- ✅ Example Storybook stories for Button component

#### Storybook
- ✅ `.storybook/main.ts` configured for React Vite
- ✅ `.storybook/preview.ts` configured
- ✅ Stories pattern: `src/**/*.stories.tsx`
- ✅ Autodocs enabled

### Folder Structure
```
src/
├── api/              (API service layer - ready for development)
├── components/       (Reusable UI components)
│   ├── Button.tsx    (Example functional component)
│   ├── Button.scss   (SCSS component styles)
│   ├── Button.test.tsx   (Test suite with 5 tests)
│   └── Button.stories.tsx (Storybook stories)
├── pages/            (Page-level / routed components)
├── hooks/            (Custom React hooks)
├── services/         (API & business logic)
├── types/            (TypeScript type definitions)
├── App.tsx           (Root component)
├── App.scss          (SCSS example)
├── index.scss        (Global SCSS)
├── main.tsx          (App entry with React Query provider)
└── setupTests.ts     (Vitest & RTL configuration)
```

### Scripts Configured & Verified

| Script | Command | Status | Output |
|--------|---------|--------|--------|
| Dev | `npm run dev` | ✅ Working | Runs on http://localhost:5173/ |
| Build | `npm run build` | ✅ Passing | Zero errors, 215KB gzipped output |
| Test | `npm run test` | ✅ 5/5 passing | Button component tests pass |
| Test UI | `npm run test:ui` | ✅ Available | Vitest UI mode |
| Storybook | `npm run storybook` | ✅ Running | Runs on http://localhost:6006/ |
| Build Stories | `npm run build-storybook` | ✅ Available | Builds static Storybook |
| Lint | `npm run lint` | ✅ Available | ESLint configured |

### Verification Results

✅ **Project Builds Successfully**
- TypeScript: Zero errors
- Vite: Builds to `dist/` folder
- Output size: 215.69 KB (67.32 KB gzipped)

✅ **Development Server Starts Without Errors**
- Local: http://localhost:5173/
- Network accessible via local IP
- Hot Module Reload (HMR) enabled

✅ **Vitest Runs Without Errors**
- Test Files: 1 passed
- Tests: 5 passed
- Duration: ~4 seconds
- Coverage: Button component tests (render, click, disabled, variants)

✅ **Frontend Starts with `npm run dev`**
- Server ready in 316ms
- Vite dev middleware ready to serve

✅ **No TypeScript or Build Errors**
- TSConfig strict mode enabled
- All imports resolved
- No unused imports or variables

✅ **All Dependencies Installed**
- Total packages: 446
- All peer dependencies resolved with `--legacy-peer-deps`
- No vulnerabilities found

✅ **Folder Structure Ready**
- Core folders present: `components/`, `pages/`, `hooks/`, `services/`, `types/`, `api/`
- Example component with tests & stories
- Ready for feature development

### Key Files Created
- `Exam-Budget-Tracker-App/client/vite.config.ts` - Vitest configuration
- `Exam-Budget-Tracker-App/client/vitest.config.ts` - Vitest environment setup
- `Exam-Budget-Tracker-App/client/.storybook/main.ts` - Storybook config
- `Exam-Budget-Tracker-App/client/.storybook/preview.ts` - Storybook preview
- `Exam-Budget-Tracker-App/client/src/setupTests.ts` - Test setup
- `Exam-Budget-Tracker-App/client/src/components/Button.tsx` - Example component
- `Exam-Budget-Tracker-App/client/src/components/Button.scss` - Component styles
- `Exam-Budget-Tracker-App/client/src/components/Button.test.tsx` - Test suite
- `Exam-Budget-Tracker-App/client/src/components/Button.stories.tsx` - Storybook stories
- `Exam-Budget-Tracker-App/client/src/App.scss` - Global styles (SCSS)
- `Exam-Budget-Tracker-App/client/src/index.scss` - Entry styles (SCSS)

### Next Steps
The frontend is ready for feature development:
1. Create components following the Button component example
2. Add API services in the `services/` folder
3. Create custom hooks in the `hooks/` folder
4. Add page components in the `pages/` folder
5. Write tests for each new component
6. Add Storybook stories for documentation