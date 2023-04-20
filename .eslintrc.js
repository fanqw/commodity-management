module.exports = {
  extends: 'airbnb-base',
  plugins: ['import'],
  env: {
    node: true,
    es6: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'no-console': 'off',
    'object-curly-newline': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    camelcase: 'off',
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error'
  }
};
