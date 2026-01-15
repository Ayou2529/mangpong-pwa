#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to the project root
const projectRoot = path.resolve(__dirname, '..');
const contextDir = path.join(projectRoot, 'context');

// Available commands
const commands = {
  help: {
    description: 'Show this help message',
    usage: 'context-engine help',
  },
  validate: {
    description: 'Validate context files structure and content',
    usage: 'context-engine validate',
  },
  visualize: {
    description: 'Generate context visualization diagrams',
    usage: 'context-engine visualize',
  },
  search: {
    description: 'Search context files for a term',
    usage: 'context-engine search <query>',
  },
  list: {
    description: 'List all context files',
    usage: 'context-engine list',
  },
  stats: {
    description: 'Show context statistics',
    usage: 'context-engine stats',
  },
  sync: {
    description: 'Sync context with code changes',
    usage: 'context-engine sync',
  },
  watch: {
    description: 'Watch context files for changes and auto-regenerate',
    usage: 'context-engine watch',
  },
  update: {
    description: 'Update all context files and mappings',
    usage: 'context-engine update',
  },
  report: {
    description: 'Generate context completeness report',
    usage: 'context-engine report',
  },
};

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }
  
  const command = args[0];
  
  switch (command) {
  case 'help':
    showHelp();
    break;
      
  case 'validate':
    await runScript('validate-context.js');
    break;
      
  case 'visualize':
    await runScript('visualize-context.js');
    break;
      
  case 'search':
    if (args.length < 2) {
      console.log('Please provide a search term');
      console.log('Usage: context-engine search <query>');
      process.exit(1);
    }
    await runScript('search-context.js', ['search', ...args.slice(1)]);
    break;
      
  case 'list':
    await runScript('search-context.js', ['list']);
    break;
      
  case 'stats':
    await runScript('search-context.js', ['stats']);
    break;
      
  case 'sync':
    await runScript('sync-context.js', ['sync']);
    await runScript('sync-context.js', ['update-errors']);
    break;
      
  case 'watch':
    await runScript('validate-context.js', ['--watch']);
    break;
      
  case 'update':
    console.log('🔄 Updating all context files...');
    await runScript('generate-context.js');
    await runScript('validate-context.js');
    await runScript('visualize-context.js');
    await runScript('sync-context.js', ['update-errors']);
    console.log('✅ All context files updated successfully');
    break;
      
  case 'report':
    await runScript('validate-context.js');
    break;
      
  default:
    console.log(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }
}

// Function to show help
function showHelp() {
  console.log('📚 Mangpong Trading PWA Context Engineering Tool');
  console.log('==================================================\n');
  
  console.log('Usage: context-engine <command> [options]\n');
  
  console.log('Available commands:');
  for (const [cmd, info] of Object.entries(commands)) {
    console.log(`  ${cmd.padEnd(12)} ${info.description}`);
    console.log(`               ${info.usage}`);
    console.log('');
  }
  
  console.log('Examples:');
  console.log('  context-engine validate          # Validate context files');
  console.log('  context-engine search commission # Search for "commission"');
  console.log('  context-engine visualize         # Generate diagrams');
  console.log('  context-engine update            # Update all context files');
  console.log('  context-engine watch             # Watch for changes');
}

// Function to run a script
function runScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(contextDir, scriptName);
    const child = spawn('node', [scriptPath, ...args], {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptName} exited with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Run main function
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

// Export for use as module
export { main, showHelp, runScript };