module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  plugins: ['react', 'react-native', 'react-hooks', 'prettier', 'import', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: true,
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  ignorePatterns: ['dist', 'node_modules', 'android', 'ios', 'build', '.eslintrc.js', 'metro.config.js'],
  rules: {
    'react-native/split-platform-components': 'off',
    'react/no-unescaped-entities': 'off',
    'react-native/no-unused-styles': 'off',
    'react-native/no-raw-text': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-inline-styles': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': ['error'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index'],
        pathGroups: [
          { pattern: 'components', group: 'internal' },
          { pattern: 'screens', group: 'internal' },
          { pattern: 'common', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
