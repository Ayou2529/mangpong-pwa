import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to the project root
const projectRoot = path.resolve(__dirname, '..');

// Function to search across all context files
function searchContext(query, options = {}) {
  console.log(`🔍 Searching context for: "${query}"`);
  
  const contextRoot = path.join(projectRoot, 'context');
  const results = [];
  
  // Default options
  const opts = {
    caseSensitive: false,
    wholeWord: false,
    ...options
  };
  
  // Prepare search term
  let searchTerm = opts.caseSensitive ? query : query.toLowerCase();
  
  // Get all context files
  const contextDirs = ['business', 'technical', 'operational', 'user'];
  
  for (const dir of contextDirs) {
    const dirPath = path.join(contextRoot, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Process content based on options
      let fileContent = opts.caseSensitive ? content : content.toLowerCase();
      
      // Check if query exists in file
      let found = false;
      if (opts.wholeWord) {
        // Use word boundary regex
        const regex = new RegExp(`\\b${searchTerm}\\b`, opts.caseSensitive ? 'g' : 'gi');
        found = regex.test(fileContent);
      } else {
        found = fileContent.includes(searchTerm);
      }
      
      if (found) {
        // Get line numbers where the term appears
        const lines = content.split('\n');
        const matches = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = opts.caseSensitive ? lines[i] : lines[i].toLowerCase();
          if (line.includes(searchTerm)) {
            matches.push({
              line: i + 1,
              content: lines[i].trim()
            });
          }
        }
        
        results.push({
          file: `${dir}/${file}`,
          path: filePath,
          matches: matches.slice(0, 5) // Limit to first 5 matches
        });
      }
    }
  }
  
  // Display results
  console.log(`\n🎯 Found ${results.length} file(s) containing "${query}":\n`);
  
  if (results.length === 0) {
    console.log('No matches found.');
    return results;
  }
  
  for (const result of results) {
    console.log(`📁 ${result.file}`);
    console.log(`   Matches: ${result.matches.length}`);
    for (const match of result.matches) {
      console.log(`   - Line ${match.line}: ${match.content.substring(0, 100)}${match.content.length > 100 ? '...' : ''}`);
    }
    console.log('');
  }
  
  return results;
}

// Function to list all context files with their summaries
function listContextFiles() {
  console.log('📋 Listing all context files:\n');
  
  const contextRoot = path.join(projectRoot, 'context');
  const contextDirs = ['business', 'technical', 'operational', 'user'];
  
  for (const dir of contextDirs) {
    console.log(`📂 ${dir.toUpperCase()}`);
    const dirPath = path.join(contextRoot, dir);
    if (!fs.existsSync(dirPath)) {
      console.log('   (directory not found)');
      continue;
    }
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract first heading as summary
      const firstHeading = content.match(/^#\s+(.+)$/m);
      const summary = firstHeading ? firstHeading[1] : '(no title)';
      
      console.log(`   📄 ${file} - ${summary}`);
    }
    console.log('');
  }
}

// Function to get context statistics
function getContextStatistics() {
  console.log('📊 Context Statistics:\n');
  
  const contextRoot = path.join(projectRoot, 'context');
  const stats = {
    directories: 0,
    files: 0,
    totalLines: 0,
    totalWords: 0,
    totalCharacters: 0
  };
  
  const contextDirs = ['business', 'technical', 'operational', 'user'];
  
  for (const dir of contextDirs) {
    const dirPath = path.join(contextRoot, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    stats.directories++;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      stats.files++;
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const lines = content.split('\n');
      stats.totalLines += lines.length;
      stats.totalWords += content.split(/\s+/).length;
      stats.totalCharacters += content.length;
    }
  }
  
  console.log(`Directories: ${stats.directories}`);
  console.log(`Files: ${stats.files}`);
  console.log(`Lines: ${stats.totalLines}`);
  console.log(`Words: ${stats.totalWords}`);
  console.log(`Characters: ${stats.totalCharacters}`);
  
  return stats;
}

// Function to find related context files
function findRelatedContext(filePath) {
  console.log(`🔗 Finding context files related to: ${filePath}\n`);
  
  // Read context mapping
  const mappingPath = path.join(projectRoot, 'context', 'context-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    console.log('❌ Context mapping file not found');
    return [];
  }
  
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  
  // Find the node corresponding to the file
  const node = mapping.nodes.find(n => n.file && n.file.includes(filePath));
  if (!node) {
    console.log('❌ File not found in context mapping');
    return [];
  }
  
  // Find related nodes
  const related = [];
  
  // Find incoming edges (what points to this node)
  const incoming = mapping.edges.filter(e => e.target === node.id);
  for (const edge of incoming) {
    const sourceNode = mapping.nodes.find(n => n.id === edge.source);
    if (sourceNode) {
      related.push({
        relationship: `is ${edge.relationship} by`,
        node: sourceNode
      });
    }
  }
  
  // Find outgoing edges (what this node points to)
  const outgoing = mapping.edges.filter(e => e.source === node.id);
  for (const edge of outgoing) {
    const targetNode = mapping.nodes.find(n => n.id === edge.target);
    if (targetNode) {
      related.push({
        relationship: `${edge.relationship}`,
        node: targetNode
      });
    }
  }
  
  console.log(`Found ${related.length} related context files:\n`);
  for (const item of related) {
    console.log(`- ${item.node.label} (${item.relationship})`);
  }
  
  return related;
}

// Export functions
export {
  searchContext,
  listContextFiles,
  getContextStatistics,
  findRelatedContext
};

// CLI interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node context-search.js <command> [options]');
    console.log('Commands:');
    console.log('  search <query>     Search context files for a term');
    console.log('  list              List all context files');
    console.log('  stats             Show context statistics');
    console.log('  related <file>    Find related context files');
    process.exit(0);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'search':
      if (args.length < 2) {
        console.log('Please provide a search term');
        process.exit(1);
      }
      searchContext(args[1]);
      break;
      
    case 'list':
      listContextFiles();
      break;
      
    case 'stats':
      getContextStatistics();
      break;
      
    case 'related':
      if (args.length < 2) {
        console.log('Please provide a file path');
        process.exit(1);
      }
      findRelatedContext(args[1]);
      break;
      
    default:
      console.log(`Unknown command: ${command}`);
      process.exit(1);
  }
}