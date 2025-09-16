// eslint-plugin-mangpong/index.js
module.exports = {
  rules: {
    'file-size-limit': require('./rules/file-size-limit'),
  },
  configs: {
    recommended: {
      rules: {
        'mangpong/file-size-limit': 'warn',
      },
    },
  },
};