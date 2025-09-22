// scripts/check-file-sizes.js - Script to check file sizes

import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const MAX_FILE_SIZE = 500; // lines

async function checkFileSize(filePath) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile() && extname(filePath) === '.js') {
      const content = await readFile(filePath, 'utf8');
      const lines = content.split('\n').length;
      
      if (lines > MAX_FILE_SIZE) {
        console.warn(`⚠️  File ${filePath} exceeds ${MAX_FILE_SIZE} lines: ${lines} lines`);
        return false;
      } else {
        console.log(`✅ File ${filePath}: ${lines} lines`);
        return true;
      }
    }
    return true;
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message);
    return false;
  }
}

async function readFile(filePath, encoding) {
  const { readFile: fsReadFile } = await import('fs/promises');
  return fsReadFile(filePath, encoding);
}

async function walkDirectory(dir) {
  try {
    const files = await readdir(dir);
    const results = [];
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        results.push(...await walkDirectory(filePath));
      } else {
        results.push(filePath);
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
    return [];
  }
}

async function checkAllFiles() {
  const directories = ['src/components', 'src/utils', 'src/hooks', 'src/constants'];
  let allPassed = true;
  
  for (const dir of directories) {
    console.log(`\nChecking files in ${dir}...`);
    const files = await walkDirectory(dir);
    
    for (const file of files) {
      const passed = await checkFileSize(file);
      if (!passed) allPassed = false;
    }
  }
  
  console.log(`\n${allPassed ? '✅ All files are within size limits' : '⚠️  Some files exceed size limits'}`);
  return allPassed;
}

// Run the check
checkAllFiles().catch(error => {
  console.error('Error during file size check:', error);
  process.exit(1);
});