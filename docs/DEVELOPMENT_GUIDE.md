# Development Guide

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Code Quality

### ESLint
Run linting:
```bash
npm run lint
```

Auto-fix linting issues:
```bash
npm run lint:fix
```

### File Size Checks
Check that all files are within the 500-line limit:
```bash
npm run check:sizes
```

## Project Structure

Refer to `PROJECT_STRUCTURE.md` for detailed information about the project organization.

## Component Development

1. Create components in `src/components/`
2. Each component file should be ≤ 500 lines
3. Export components through `src/components/index.js`
4. Use Tailwind CSS classes for styling

## Utility Development

1. Create utility functions in `src/utils/`
2. Each utility file should be ≤ 500 lines
3. Functions should be pure and testable
4. Group related functions in the same file

## Styling

1. Use Tailwind CSS classes directly in components
2. Define custom styles in `src/styles/main.css`
3. Use Tailwind's `@layer` directive to organize styles
4. Avoid inline styles except for dynamic values

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

Deploy the application:
```bash
npm run deploy
```