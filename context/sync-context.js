import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to the project root
const projectRoot = path.resolve(__dirname, '..');

// Function to analyze source code and update context files
async function syncContextWithCode() {
  console.log('🔄 Syncing context with code changes...');
  
  // This would typically analyze source code files and update context
  // For now, we'll just check if the main files have changed since last context update
  
  const contextJsonPath = path.join(projectRoot, 'context.json');
  if (!fs.existsSync(contextJsonPath)) {
    console.log('⚠️  No existing context.json found. Generating new context...');
    await generateNewContext();
    return;
  }
  
  const contextStats = fs.statSync(contextJsonPath);
  const contextModified = new Date(contextStats.mtime);
  
  // Check if any source files are newer than the context
  const srcDir = path.join(projectRoot, 'src');
  const sourceFiles = getAllSourceFiles(srcDir);
  
  let needsUpdate = false;
  for (const file of sourceFiles) {
    const stats = fs.statSync(file);
    const fileModified = new Date(stats.mtime);
    
    if (fileModified > contextModified) {
      console.log(`📝 Source file updated: ${path.relative(projectRoot, file)}`);
      needsUpdate = true;
    }
  }
  
  if (needsUpdate) {
    console.log('🔄 Source files have changed since last context update. Regenerating context...');
    await generateNewContext();
  } else {
    console.log('✅ Context is up to date with source code');
  }
}

// Helper function to get all source files
function getAllSourceFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules and other ignored directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
          walk(itemPath);
        }
      } else if (stats.isFile() && (item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.html'))) {
        files.push(itemPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Function to generate new context based on current code
async function generateNewContext() {
  console.log('⚙️  Generating new context from current code...');
  
  try {
    // Import and run the generate-context script
    await import('./generate-context.js');
    console.log('✅ Context successfully regenerated');
  } catch (error) {
    console.error('❌ Error generating context:', error);
  }
}

// Function to update error context mapping
function updateErrorContextMapping() {
  console.log('🚨 Updating error context mapping...');
  
  // Read error log
  const errorLogPath = path.join(projectRoot, 'errors', 'error-log.json');
  if (!fs.existsSync(errorLogPath)) {
    console.log('⚠️  No error log found');
    return;
  }
  
  const errorLog = JSON.parse(fs.readFileSync(errorLogPath, 'utf8'));
  
  // Read existing error context mapping
  const mappingPath = path.join(projectRoot, 'context', 'error-context-mapping.json');
  let errorMapping = { error_context_mapping: [], chat_log_insights: [], last_updated: new Date().toISOString() };
  
  if (fs.existsSync(mappingPath)) {
    errorMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  }
  
  // Update with new errors
  for (const error of errorLog) {
    // Check if error already exists in mapping
    const existing = errorMapping.error_context_mapping.find(e => e.error_id === error.id);
    
    if (!existing && error.status !== 'resolved') {
      console.log(`➕ Adding new error to context mapping: ${error.id}`);
      
      // Add new error mapping
      errorMapping.error_context_mapping.push({
        error_id: error.id,
        context_files: getContextFilesForError(error),
        solutions: getSuggestedSolutions(error),
        prevention: getPreventionStrategies(error)
      });
    } else if (existing && error.status === 'resolved') {
      console.log(`✅ Marking error as resolved in context mapping: ${error.id}`);
      // We could remove resolved errors or mark them as resolved
    }
  }
  
  // Update last updated timestamp
  errorMapping.last_updated = new Date().toISOString();
  
  // Save updated mapping
  fs.writeFileSync(mappingPath, JSON.stringify(errorMapping, null, 2));
  console.log('✅ Error context mapping updated');
}

// Helper function to determine relevant context files for an error
function getContextFilesForError(error) {
  const contextFiles = [];
  
  // Map error types to context files
  if (error.type.includes('Network') || error.type.includes('API')) {
    contextFiles.push('/context/technical/architecture.md#backend-architecture');
    contextFiles.push('/context/business/processes.md#job-tracking');
  }
  
  if (error.type.includes('UI') || error.type.includes('Rendering')) {
    contextFiles.push('/context/technical/architecture.md#frontend-components');
    contextFiles.push('/context/user/personas.md#messenger');
  }
  
  if (error.type.includes('Service Worker') || error.type.includes('Offline')) {
    contextFiles.push('/context/technical/architecture.md#pwa-features');
  }
  
  if (error.type.includes('Storage')) {
    contextFiles.push('/context/technical/components.md#storage-management');
  }
  
  if (error.type.includes('Authentication')) {
    contextFiles.push('/context/technical/architecture.md#authentication');
    contextFiles.push('/context/user/personas.md#messenger');
  }
  
  return contextFiles.length > 0 ? contextFiles : ['/context/technical/architecture.md'];
}

// Helper function to suggest solutions for an error
function getSuggestedSolutions(error) {
  const solutions = [];
  
  if (error.type.includes('Network')) {
    solutions.push('Check network connectivity');
    solutions.push('Verify Google Apps Script URL in config.js');
    solutions.push('Review API endpoint status');
  }
  
  if (error.type.includes('UI') || error.type.includes('Rendering')) {
    solutions.push('Check CSS styling');
    solutions.push('Verify JavaScript for component display');
    solutions.push('Test on different devices');
  }
  
  if (error.type.includes('Service Worker')) {
    solutions.push('Ensure service worker file is in root directory');
    solutions.push('Check service worker registration code');
    solutions.push('Verify HTTPS requirement');
  }
  
  if (error.type.includes('Storage')) {
    solutions.push('Implement data cleanup mechanism');
    solutions.push('Use IndexedDB for larger data storage');
    solutions.push('Compress data before storing');
  }
  
  if (error.type.includes('Authentication')) {
    solutions.push('Verify the LINE LIFF ID in config.js');
    solutions.push('Check LINE Developer Console for correct configuration');
    solutions.push('Ensure the LIFF app is in Published status');
  }
  
  return solutions.length > 0 ? solutions : ['Review error message and stack trace', 'Check related documentation'];
}

// Helper function to suggest prevention strategies
function getPreventionStrategies(error) {
  const strategies = [];
  
  if (error.type.includes('Network')) {
    strategies.push('Implement retry mechanism');
    strategies.push('Add offline support');
    strategies.push('Create mock API for development');
  }
  
  if (error.type.includes('UI') || error.type.includes('Rendering')) {
    strategies.push('Implement responsive design testing');
    strategies.push('Add cross-browser testing');
    strategies.push('Create device-specific components');
  }
  
  if (error.type.includes('Service Worker')) {
    strategies.push('Add service worker registration error handling');
    strategies.push('Implement fallback mechanisms');
    strategies.push('Test on multiple browsers');
  }
  
  if (error.type.includes('Storage')) {
    strategies.push('Implement automatic data cleanup');
    strategies.push('Set storage quotas');
    strategies.push('Use compression for large data');
  }
  
  if (error.type.includes('Authentication')) {
    strategies.push('Add authentication error handling');
    strategies.push('Implement fallback login methods');
    strategies.push('Regularly verify LIFF configuration');
  }
  
  return strategies.length > 0 ? strategies : ['Add proper error handling', 'Implement logging', 'Add unit tests'];
}

// Function to create a context diff tool
function createContextDiff() {
  console.log('🔍 Creating context diff analysis...');
  
  // This would compare context versions and show changes
  // For now, we'll just show a message
  console.log('💡 Context diff tool would analyze changes between context versions');
  console.log('💡 It would show added/removed/modified context elements');
}

// Export functions
export {
  syncContextWithCode,
  updateErrorContextMapping,
  createContextDiff
};

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    syncContextWithCode().then(() => {
      updateErrorContextMapping();
    });
  } else {
    const command = args[0];
    
    switch (command) {
      case 'sync':
        syncContextWithCode();
        break;
        
      case 'update-errors':
        updateErrorContextMapping();
        break;
        
      case 'diff':
        createContextDiff();
        break;
        
      default:
        console.log(`Unknown command: ${command}`);
        process.exit(1);
    }
  }
}