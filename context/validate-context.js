import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to the project root
const projectRoot = path.resolve(__dirname, '..');

// Validation rules for context files
const validationRules = {
  business: {
    requiredFiles: ['domain.md', 'roles.md', 'processes.md'],
    requiredSections: {
      'domain.md': ['## ภาพรวม', '## โดเมนธุรกิจ', '## กฎทางธุรกิจ', '## กระบวนการทางธุรกิจ'],
      'roles.md': ['## บทบาทผู้ใช้'],
      'processes.md': ['## กระบวนการทางธุรกิจ'],
    },
  },
  technical: {
    requiredFiles: ['architecture.md', 'components.md', 'data-model.md'],
    requiredSections: {
      'architecture.md': ['## สถาปัตยกรรมระบบ'],
      'components.md': ['## ส่วนประกอบทางเทคนิค'],
      'data-model.md': ['## โมเดลข้อมูล'],
    },
  },
  operational: {
    requiredFiles: ['workflows.md', 'policies.md'],
    requiredSections: {
      'workflows.md': ['## ขั้นตอนการทำงาน'],
      'policies.md': ['## นโยบายการดำเนินงาน'],
    },
  },
  user: {
    requiredFiles: ['personas.md', 'journeys.md'],
    requiredSections: {
      'personas.md': ['## ตัวแทนผู้ใช้'],
      'journeys.md': ['## เส้นทางผู้ใช้'],
    },
  },
};

// Function to validate context directory structure
function validateContextStructure() {
  console.log('🔍 Validating context directory structure...');
  
  const contextRoot = path.join(projectRoot, 'context');
  if (!fs.existsSync(contextRoot)) {
    throw new Error('Context directory not found');
  }
  
  const contextDirs = ['business', 'technical', 'operational', 'user'];
  const errors = [];
  
  for (const dir of contextDirs) {
    const dirPath = path.join(contextRoot, dir);
    if (!fs.existsSync(dirPath)) {
      errors.push(`Missing directory: ${dir}`);
      continue;
    }
    
    // Check required files
    const requiredFiles = validationRules[dir].requiredFiles;
    const existingFiles = fs.readdirSync(dirPath);
    
    for (const requiredFile of requiredFiles) {
      if (!existingFiles.includes(requiredFile)) {
        errors.push(`Missing file in ${dir}: ${requiredFile}`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.log('❌ Validation failed:');
    errors.forEach(error => console.log(`  - ${error}`));
    return false;
  }
  
  console.log('✅ Context directory structure is valid');
  return true;
}

// Function to validate content of context files
function validateContextContent() {
  console.log('🔍 Validating context file content...');
  
  const contextRoot = path.join(projectRoot, 'context');
  const errors = [];
  
  for (const [dir, rules] of Object.entries(validationRules)) {
    const dirPath = path.join(contextRoot, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    for (const [file, requiredSections] of Object.entries(rules.requiredSections)) {
      const filePath = path.join(dirPath, file);
      if (!fs.existsSync(filePath)) continue;
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      for (const section of requiredSections) {
        if (!content.includes(section)) {
          errors.push(`Missing section "${section}" in ${dir}/${file}`);
        }
      }
    }
  }
  
  if (errors.length > 0) {
    console.log('❌ Content validation failed:');
    errors.forEach(error => console.log(`  - ${error}`));
    return false;
  }
  
  console.log('✅ Context file content is valid');
  return true;
}

// Function to check for broken links in context files
function validateContextLinks() {
  console.log('🔍 Checking for broken links in context files...');
  
  const contextRoot = path.join(projectRoot, 'context');
  const errors = [];
  
  // Check markdown links in all context files
  const contextDirs = ['business', 'technical', 'operational', 'user'];
  
  for (const dir of contextDirs) {
    const dirPath = path.join(contextRoot, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for markdown links [text](link)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      
      while ((match = linkRegex.exec(content)) !== null) {
        const [, text, link] = match;
        
        // Skip external links and anchors
        if (link.startsWith('http') || link.startsWith('#')) continue;
        
        // Check if relative path exists
        const linkPath = path.resolve(path.dirname(filePath), link);
        if (!fs.existsSync(linkPath)) {
          errors.push(`Broken link in ${dir}/${file}: ${link}`);
        }
      }
    }
  }
  
  if (errors.length > 0) {
    console.log('❌ Link validation failed:');
    errors.forEach(error => console.log(`  - ${error}`));
    return false;
  }
  
  console.log('✅ All context links are valid');
  return true;
}

// Function to generate context completeness report
function generateContextReport() {
  console.log('📊 Generating context completeness report...');
  
  const contextRoot = path.join(projectRoot, 'context');
  const report = {
    timestamp: new Date().toISOString(),
    directories: {},
    completeness: 0,
    issues: [],
  };
  
  const contextDirs = ['business', 'technical', 'operational', 'user'];
  let totalFiles = 0;
  let presentFiles = 0;
  
  for (const dir of contextDirs) {
    const dirPath = path.join(contextRoot, dir);
    report.directories[dir] = {
      present: fs.existsSync(dirPath),
      files: {},
    };
    
    if (!fs.existsSync(dirPath)) {
      report.issues.push(`Missing directory: ${dir}`);
      continue;
    }
    
    const requiredFiles = validationRules[dir].requiredFiles;
    totalFiles += requiredFiles.length;
    
    for (const requiredFile of requiredFiles) {
      const filePath = path.join(dirPath, requiredFile);
      const isPresent = fs.existsSync(filePath);
      report.directories[dir].files[requiredFile] = isPresent;
      
      if (isPresent) {
        presentFiles++;
      } else {
        report.issues.push(`Missing file: ${dir}/${requiredFile}`);
      }
    }
  }
  
  report.completeness = totalFiles > 0 ? Math.round((presentFiles / totalFiles) * 100) : 0;
  
  // Save report
  const reportPath = path.join(projectRoot, 'context', 'context-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`✅ Context completeness report generated (${report.completeness}% complete)`);
  console.log(`📄 Report saved to: ${reportPath}`);
  
  return report;
}

// Function to watch context files for changes
function watchContextFiles() {
  console.log('👀 Watching context files for changes...');
  
  try {
    import('chokidar').then(({ default: chokidar }) => {
      const watcher = chokidar.watch(path.join(projectRoot, 'context/**/*'), {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
      });
      
      watcher.on('change', (filePath) => {
        console.log(`📝 Context file changed: ${path.relative(projectRoot, filePath)}`);
        console.log('🔄 Regenerating context...');
        
        // Import and run the generate-context script
        import('./generate-context.js').catch(err => {
          console.error('❌ Error regenerating context:', err);
        });
      });
      
      watcher.on('add', (filePath) => {
        console.log(`➕ New context file added: ${path.relative(projectRoot, filePath)}`);
      });
      
      watcher.on('unlink', (filePath) => {
        console.log(`➖ Context file removed: ${path.relative(projectRoot, filePath)}`);
      });
      
      console.log('✅ Context file watcher started');
    }).catch(err => {
      console.log('⚠️  File watching not available (chokidar not installed)');
      console.log('💡 Run "npm install chokidar" to enable file watching');
    });
  } catch (err) {
    console.log('⚠️  File watching not available');
  }
}

// Main validation function
async function validateContext() {
  console.log('🚀 Starting context validation...\n');
  
  const structureValid = validateContextStructure();
  const contentValid = validateContextContent();
  const linksValid = validateContextLinks();
  
  const isValid = structureValid && contentValid && linksValid;
  
  generateContextReport();
  
  console.log('\n' + '='.repeat(50));
  if (isValid) {
    console.log('🎉 All context validation checks passed!');
  } else {
    console.log('⚠️  Some context validation checks failed. Please review the errors above.');
  }
  console.log('='.repeat(50));
  
  return isValid;
}

// Export functions for use in other scripts
export {
  validateContext,
  validateContextStructure,
  validateContextContent,
  validateContextLinks,
  generateContextReport,
  watchContextFiles,
};

// Run validation if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateContext().then(() => {
    if (process.argv.includes('--watch')) {
      watchContextFiles();
    }
  });
}