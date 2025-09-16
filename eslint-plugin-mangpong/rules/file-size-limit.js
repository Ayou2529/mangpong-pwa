// eslint-plugin-mangpong/rules/file-size-limit.js
const fs = require('fs');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a maximum file size limit',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      exceedLimit: 'File size ({{size}} lines) exceeds the limit ({{limit}} lines). Consider breaking it into smaller files.',
    },
  },
  create(context) {
    const option = context.options[0] || {};
    const limit = option.limit || 1000; // Default limit of 1000 lines

    return {
      Program(node) {
        const filename = context.getFilename();
        
        // Only check JavaScript files
        if (!filename.endsWith('.js')) {
          return;
        }
        
        try {
          const content = fs.readFileSync(filename, 'utf8');
          const lines = content.split('\n').length;
          
          if (lines > limit) {
            context.report({
              node,
              messageId: 'exceedLimit',
              data: {
                size: lines,
                limit,
              },
            });
          }
        } catch (error) {
          // If we can't read the file, skip the check
          console.warn('Could not read file for size check:', filename);
        }
      },
    };
  },
};