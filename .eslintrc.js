module.exports = {
    parser: '@typescript-eslint/parser', // Use the TypeScript parser
    extends: [
      'eslint:recommended', // Basic ESLint rules
      'plugin:@typescript-eslint/recommended', // TypeScript specific rules
      'standard', // Use StandardJS rules
    ],
    parserOptions: {
      ecmaVersion: 2020, // Allows parsing of modern JavaScript features
      sourceType: 'module', // Allows for the use of imports
    },
    env: {
      node: true,
      es6: true,
    },
    rules: {
      'no-unused-vars': 'warn', // Warn on unused variables
      // Add or modify other ESLint rules as needed
    },
  };
  