const fs = require('fs');
const path = require('path');

// Read project information
const packageJson = require('./package.json');

// Read config.js content as text to extract URL
const configJsContent = fs.readFileSync('./config.js', 'utf8');

// Extract Google Apps Script URL from config.js
let googleScriptUrl = '';
try {
  // Extract URL using regex
  const urlMatch = configJsContent.match(/['"]([^'"]*macros\/s\/[^'"]*)['"]/);
  if (urlMatch && urlMatch[1]) {
    googleScriptUrl = urlMatch[1];
  } else {
    // Fallback to default URL from documentation
    googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwrfLlkWHqe2CkRjOH3iQpBVynXZHWkbjcVxmr-V25rtwkuQYIFj0UAznWadCPnDbQN/exec';
  }
} catch (error) {
  console.log('Could not extract Google Apps Script URL from config.js, using default');
  googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwrfLlkWHqe2CkRjOH3iQpBVynXZHWkbjcVxmr-V25rtwkuQYIFj0UAznWadCPnDbQN/exec';
}

// Extract relevant information from PROJECT_SUMMARY.md and ANALYSIS_REPORT.md
const projectSummary = fs.readFileSync('./PROJECT_SUMMARY.md', 'utf8');
const analysisReport = fs.readFileSync('./ANALYSIS_REPORT.md', 'utf8');

// Parse key information from the markdown files
function extractInfo(content, section) {
  const regex = new RegExp(`## ${section}[\\s\\S]*?(?=##|$)`, 'g');
  const match = content.match(regex);
  return match ? match[0] : '';
}

// Function to read last 3 chat logs
function readLastChatLogs() {
  try {
    const chatLogContent = fs.readFileSync('./logs/chat-log.txt', 'utf8');
    const chatLogs = chatLogContent.split('## ').filter(log => log.trim() !== '');
    
    // Get last 3 logs
    const lastLogs = chatLogs.slice(-3);
    
    return lastLogs.map(log => {
      const lines = log.split('\n').filter(line => line.trim() !== '');
      return lines.join('\n');
    }).join('\n\n');
  } catch (error) {
    console.log('Could not read chat logs:', error.message);
    return 'No chat logs available';
  }
}

// Function to read unresolved errors
function readUnresolvedErrors() {
  try {
    const errorLogContent = fs.readFileSync('./errors/error-log.json', 'utf8');
    const errors = JSON.parse(errorLogContent);
    
    // Filter unresolved errors
    const unresolvedErrors = errors.filter(error => error.status === 'unresolved');
    
    return unresolvedErrors.map(error => 
      `- ${error.id}: ${error.type} - ${error.message} (${error.file}:${error.line})`,
    ).join('\n');
  } catch (error) {
    console.log('Could not read error logs:', error.message);
    return 'No error logs available';
  }
}

// Function to read recurring errors
function readRecurringErrors() {
  try {
    const recurringErrorsContent = fs.readFileSync('./errors/recurring-errors.json', 'utf8');
    const recurringErrors = JSON.parse(recurringErrorsContent);
    
    return recurringErrors.map(error => 
      `- ${error.pattern}: Occurred ${error.count} times (${error.first_occurrence} to ${error.last_occurrence})`,
    ).join('\n');
  } catch (error) {
    console.log('Could not read recurring errors:', error.message);
    return 'No recurring errors available';
  }
}

// Function to read context files from the new structure
function readContextFiles() {
  try {
    const contextData = {
      business: {},
      technical: {},
      operational: {},
      user: {}
    };

    // Read business context files
    const businessDir = './context/business';
    if (fs.existsSync(businessDir)) {
      const businessFiles = fs.readdirSync(businessDir);
      businessFiles.forEach(file => {
        if (file.endsWith('.md')) {
          const content = fs.readFileSync(path.join(businessDir, file), 'utf8');
          contextData.business[file.replace('.md', '')] = content;
        }
      });
    }

    // Read technical context files
    const technicalDir = './context/technical';
    if (fs.existsSync(technicalDir)) {
      const technicalFiles = fs.readdirSync(technicalDir);
      technicalFiles.forEach(file => {
        if (file.endsWith('.md')) {
          const content = fs.readFileSync(path.join(technicalDir, file), 'utf8');
          contextData.technical[file.replace('.md', '')] = content;
        }
      });
    }

    // Read operational context files
    const operationalDir = './context/operational';
    if (fs.existsSync(operationalDir)) {
      const operationalFiles = fs.readdirSync(operationalDir);
      operationalFiles.forEach(file => {
        if (file.endsWith('.md')) {
          const content = fs.readFileSync(path.join(operationalDir, file), 'utf8');
          contextData.operational[file.replace('.md', '')] = content;
        }
      });
    }

    // Read user context files
    const userDir = './context/user';
    if (fs.existsSync(userDir)) {
      const userFiles = fs.readdirSync(userDir);
      userFiles.forEach(file => {
        if (file.endsWith('.md')) {
          const content = fs.readFileSync(path.join(userDir, file), 'utf8');
          contextData.user[file.replace('.md', '')] = content;
        }
      });
    }

    return contextData;
  } catch (error) {
    console.log('Could not read context files:', error.message);
    return {};
  }
}

// Function to read context state
function readContextState() {
  try {
    const stateContent = fs.readFileSync('./context/context-state.json', 'utf8');
    return JSON.parse(stateContent);
  } catch (error) {
    console.log('Could not read context state:', error.message);
    return {
      version: '1.0.0',
      last_updated: new Date().toISOString(),
      context_engineering_version: '1.0'
    };
  }
}

// Function to read context version
function readContextVersion() {
  try {
    const versionContent = fs.readFileSync('./context/context-version.json', 'utf8');
    return JSON.parse(versionContent);
  } catch (error) {
    console.log('Could not read context version:', error.message);
    return {
      current_version: '1.0.0',
      last_updated: new Date().toISOString(),
      context_engineering_version: '1.0'
    };
  }
}

// Function to read context mapping
function readContextMapping() {
  try {
    const mappingContent = fs.readFileSync('./context/context-mapping.json', 'utf8');
    return JSON.parse(mappingContent);
  } catch (error) {
    console.log('Could not read context mapping:', error.message);
    return {};
  }
}

// Function to read dependencies
function readDependencies() {
  try {
    const dependenciesContent = fs.readFileSync('./context/dependencies.json', 'utf8');
    return JSON.parse(dependenciesContent);
  } catch (error) {
    console.log('Could not read dependencies:', error.message);
    return {};
  }
}

// Function to read code-context mapping
function readCodeContextMapping() {
  try {
    const mappingContent = fs.readFileSync('./context/code-context-mapping.json', 'utf8');
    return JSON.parse(mappingContent);
  } catch (error) {
    console.log('Could not read code-context mapping:', error.message);
    return {};
  }
}

// Function to read error-context mapping
function readErrorContextMapping() {
  try {
    const mappingContent = fs.readFileSync('./context/error-context-mapping.json', 'utf8');
    return JSON.parse(mappingContent);
  } catch (error) {
    console.log('Could not read error-context mapping:', error.message);
    return {};
  }
}

// Generate context object
const context = {
  projectName: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  technologies: {
    frontend: 'HTML5, CSS3, JavaScript (ES6+)',
    uiFramework: 'Tailwind CSS',
    notification: 'SweetAlert2',
    font: 'Prompt (Google Fonts)',
    pwa: 'Service Worker, Manifest, Offline Support',
    backend: 'Google Apps Script',
    database: 'Google Sheets',
  },
  googleAppsScript: {
    url: googleScriptUrl,
    spreadsheetId: '1fcq5P7vm3IxtJMDS9BLDwO8B14hFmmDdK257GHyoM',
  },
  projectStructure: {
    mainFiles: [
      'main.js',
      'index.html',
      'edit.html',
      'config.js',
      'service-worker.js',
    ],
    database: {
      sheets: [
        'Jobs',
        'JobDetails',
        'AdditionalFees',
        'Users',
        'JobHistory',
      ],
    },
  },
  roles: [
    {
      name: 'Messenger',
      features: [
        'Login/Register',
        'Home Screen (Dashboard)',
        'New Job Screen',
        'History Screen',
        'Edit Job Screen',
        'Upload Images',
        'Offline Support',
      ],
      count: 7
    },
    {
      name: 'Employee (Admin)',
      features: [
        'View data from Google Sheet',
        'Dashboard with company/employee selection',
        'Monthly reports',
        'Export PDF (Billing/Payroll)',
        'Auto query/filter to separate sheets',
      ],
      count: 5
    },
    {
      name: 'Owner',
      features: [
        'Overall monthly dashboard',
        'Company/employee summary',
        'Payroll approval',
        'Bill verification',
      ],
      count: 4
    },
  ],
  salarySystem: {
    split: '70/30 (Messenger gets 70%, Company gets 30%)',
    baseSalary: '15,000 THB',
    socialSecurity: '5% of earnings (max 750 THB)',
    specialAllowance: 'Difference when 70% >= 15,000 THB',
    deductions: 'Difference when 70% < 15,000 THB',
  },
  // Add new context engineering information
  contextEngineering: {
    version: '2.0',
    structure: {
      business: 'Business domain, roles, processes',
      technical: 'Architecture, components, data model',
      operational: 'Workflows, policies',
      user: 'Personas, journeys'
    },
    state: readContextState(),
    versionInfo: readContextVersion(),
    mapping: readContextMapping(),
    dependencies: readDependencies(),
    codeContextMapping: readCodeContextMapping(),
    errorContextMapping: readErrorContextMapping(),
    detailedContext: readContextFiles()
  },
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

// Write context to a JSON file
fs.writeFileSync('./context.json', JSON.stringify(context, null, 2));

console.log('Context generated successfully!');
console.log('Project context saved to context.json');
console.log('Project:', context.projectName);
console.log('Version:', context.version);
console.log('Description:', context.description);

// Also create a simple summary report
const lastChatLogs = readLastChatLogs();
const unresolvedErrors = readUnresolvedErrors();
const recurringErrors = readRecurringErrors();

const summary = `# Project Context Summary

## Basic Information
- Project Name: ${context.projectName}
- Version: ${context.version}
- Description: ${context.description}

## Technologies
- Frontend: ${context.technologies.frontend}
- UI Framework: ${context.technologies.uiFramework}
- Backend: ${context.technologies.backend}
- Database: ${context.technologies.database}

## Google Apps Script
- URL: ${context.googleAppsScript.url}
- Spreadsheet ID: ${context.googleAppsScript.spreadsheetId}

## Roles
${context.roles.map(role => `- ${role.name}: ${role.count} features`).join('\n')}

## Salary System
- Split: ${context.salarySystem.split}
- Base Salary: ${context.salarySystem.baseSalary}

## Recent Chat Logs (Last 3)
${lastChatLogs}

## Unresolved Errors
${unresolvedErrors || 'No unresolved errors'}

## Recurring Errors
${recurringErrors || 'No recurring errors'}

## Context Engineering
- Version: ${context.contextEngineering.version}
- Structure: Business, Technical, Operational, User contexts
- Last Updated: ${context.contextEngineering.state.last_updated}
- Context Version: ${context.contextEngineering.versionInfo.current_version}
`;

fs.writeFileSync('./context-summary.md', summary.trim());

console.log('Summary report saved to context-summary.md');