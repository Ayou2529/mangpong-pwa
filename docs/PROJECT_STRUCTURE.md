# Project Structure

```
mangpong-pwa/
├── src/
│   ├── components/
│   │   ├── JobForm/
│   │   │   └── JobForm.js
│   │   ├── JobHistory.js
│   │   └── index.js
│   ├── utils/
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── date.js
│   │   ├── navigation.js
│   │   ├── storage.js
│   │   └── validation.js
│   ├── styles/
│   │   └── main.css
│   └── main.js
├── public/
│   ├── assets/
│   └── favicon.ico
├── scripts/
│   └── check-file-sizes.js
├── dist/
├── tests/
├── node_modules/
├── index.html
├── edit.html
├── main.js
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## File Organization Guidelines

### Component Files (≤ 500 lines)
- `src/components/` - UI components
- Each component should be in its own file
- Components should be focused and single-purpose

### Utility Files (≤ 500 lines)
- `src/utils/` - Helper functions and utilities
- Each utility file should focus on a single concern
- Functions should be pure and testable

### Style Files (≤ 500 lines)
- `src/styles/main.css` - Main CSS file with Tailwind imports
- Use Tailwind's `@layer` directive to organize styles

### Entry Point
- `main.js` - Main application entry point (≤ 100 lines)
- Should only contain imports and initialization code