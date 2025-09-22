import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to the project root
const projectRoot = path.resolve(__dirname, '..');

// Read project information
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

// Read config.js content as text to extract URL
const configJsContent = fs.readFileSync(path.join(projectRoot, 'config.js'), 'utf8');

// Extract Google Apps Script URL from config.js
let googleScriptUrl = '';
try {
  // Extract URL using regex
  const urlMatch = configJsContent.match(/['"]([^'"]*macros\/s\/[^'"]*)['"]/);
  if (urlMatch && urlMatch[1]) {
    googleScriptUrl = urlMatch[1];
  } else {
    // Fallback to default URL from documentation
    googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxZIMrFlOm3IzVSM-PqmgA91v-t48szqLLk9HD0IKdW9FBd3BFJ7SE9Eci6NEBcNa9v/exec';
  }
} catch (error) {
  console.log('Could not extract Google Apps Script URL from config.js, using default');
  googleScriptUrl = 'https://script.google.com/macros/s/AKfycbxZIMrFlOm3IzVSM-PqmgA91v-t48szqLLk9HD0IKdW9FBd3BFJ7SE9Eci6NEBcNa9v/exec';
}

// Read context files from the new structure
function readContextFiles() {
  try {
    const contextData = {
      business: {},
      technical: {},
      operational: {},
      user: {},
    };

    // Read business context files
    const businessDir = path.join(projectRoot, 'context', 'business');
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
    const technicalDir = path.join(projectRoot, 'context', 'technical');
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
    const operationalDir = path.join(projectRoot, 'context', 'operational');
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
    const userDir = path.join(projectRoot, 'context', 'user');
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
    const stateContent = fs.readFileSync(path.join(projectRoot, 'context', 'context-state.json'), 'utf8');
    return JSON.parse(stateContent);
  } catch (error) {
    console.log('Could not read context state:', error.message);
    return {
      version: '1.0.0',
      last_updated: new Date().toISOString(),
      context_engineering_version: '1.0',
    };
  }
}

// Function to read context version
function readContextVersion() {
  try {
    const versionContent = fs.readFileSync(path.join(projectRoot, 'context', 'context-version.json'), 'utf8');
    return JSON.parse(versionContent);
  } catch (error) {
    console.log('Could not read context version:', error.message);
    return {
      current_version: '1.0.0',
      last_updated: new Date().toISOString(),
      context_engineering_version: '1.0',
    };
  }
}

// Function to read context mapping
function readContextMapping() {
  try {
    const mappingContent = fs.readFileSync(path.join(projectRoot, 'context', 'context-mapping.json'), 'utf8');
    return JSON.parse(mappingContent);
  } catch (error) {
    console.log('Could not read context mapping:', error.message);
    return {};
  }
}

// Function to read dependencies
function readDependencies() {
  try {
    const dependenciesContent = fs.readFileSync(path.join(projectRoot, 'context', 'dependencies.json'), 'utf8');
    return JSON.parse(dependenciesContent);
  } catch (error) {
    console.log('Could not read dependencies:', error.message);
    return {};
  }
}

// Function to read code-context mapping
function readCodeContextMapping() {
  try {
    const mappingContent = fs.readFileSync(path.join(projectRoot, 'context', 'code-context-mapping.json'), 'utf8');
    return JSON.parse(mappingContent);
  } catch (error) {
    console.log('Could not read code-context mapping:', error.message);
    return {};
  }
}

// Function to read error-context mapping
function readErrorContextMapping() {
  try {
    const mappingContent = fs.readFileSync(path.join(projectRoot, 'context', 'error-context-mapping.json'), 'utf8');
    return JSON.parse(mappingContent);
  } catch (error) {
    console.log('Could not read error-context mapping:', error.message);
    return {};
  }
}

// Read error log
function readErrorLog() {
  try {
    const errorLogContent = fs.readFileSync(path.join(projectRoot, 'errors', 'error-log.json'), 'utf8');
    return JSON.parse(errorLogContent);
  } catch (error) {
    console.log('Could not read error log:', error.message);
    return [];
  }
}

// Read chat logs
function readChatLogs() {
  try {
    const chatLogContent = fs.readFileSync(path.join(projectRoot, 'logs', 'chat-log.txt'), 'utf8');
    return chatLogContent;
  } catch (error) {
    console.log('Could not read chat logs:', error.message);
    return '';
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
      count: 7,
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
      count: 5,
    },
    {
      name: 'Owner',
      features: [
        'Overall monthly dashboard',
        'Company/employee summary',
        'Payroll approval',
        'Bill verification',
      ],
      count: 4,
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
      user: 'Personas, journeys',
    },
    state: readContextState(),
    versionInfo: readContextVersion(),
    mapping: readContextMapping(),
    dependencies: readDependencies(),
    codeContextMapping: readCodeContextMapping(),
    errorContextMapping: readErrorContextMapping(),
    detailedContext: readContextFiles(),
  },
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

// Write context to a JSON file
fs.writeFileSync(path.join(projectRoot, 'context.json'), JSON.stringify(context, null, 2));

console.log('Context generated successfully!');
console.log('Project context saved to context.json');
console.log('Project:', context.projectName);
console.log('Version:', context.version);
console.log('Description:', context.description);

// Create a comprehensive summary report with Mermaid diagrams
const detailedContext = readContextFiles();
const errors = readErrorLog();
const chatLogs = readChatLogs();

// Extract key information for summary
const unresolvedErrors = errors.filter(error => error && error.status === 'unresolved');
const recurringErrors = errors.filter(error => error && error.recurring);

// Format recent chat logs
let recentChatLogs = 'No chat logs available';
if (chatLogs) {
  const logs = chatLogs.split('## ').filter(log => log.trim() !== '');
  const lastLogs = logs.slice(-3);
  recentChatLogs = lastLogs.map(log => {
    const lines = log.split('\n').filter(line => line.trim() !== '');
    return lines.join('\n');
  }).join('\n\n');
}

// Create Mermaid diagrams
const userFlowDiagram = `graph TD
    A[LINE Login] --> B[Dashboard]
    B --> C[New Job]
    B --> D[History]
    C --> E[Fill Job Details]
    E --> F[Upload Images]
    F --> G[Save to Google Sheet]
    G --> H[Show Success Message]
    D --> I[View Job History]
    I --> J[Filter by Date]
    J --> K[Export to PDF]
    B --> L[Edit Job]
    L --> M[Update Job Details]
    M --> N[Save Changes]`;

const architectureDiagram = `graph LR
    A[Frontend - PWA] --> B[Google Apps Script API]
    B --> C[Google Sheets Database]
    C --> B
    B --> A
    D[Tailwind CSS] -.-> A
    E[SweetAlert2] -.-> A
    F[Service Worker] -.-> A`;

const contextSummary = `# Project Context Summary

## Basic Information
- **Project Name**: ${context.projectName}
- **Version**: ${context.version}
- **Description**: ${context.description}

## Technologies
- **Frontend**: ${context.technologies.frontend}
- **UI Framework**: ${context.technologies.uiFramework}
- **Backend**: ${context.technologies.backend}
- **Database**: ${context.technologies.database}

## Google Apps Script
- **URL**: ${context.googleAppsScript.url}
- **Spreadsheet ID**: ${context.googleAppsScript.spreadsheetId}

## Roles
${context.roles.map(role => `- **${role.name}**: ${role.count} features`).join('\n')}

## Salary System
- **Split**: ${context.salarySystem.split}
- **Base Salary**: ${context.salarySystem.baseSalary}

## User Flow
\`\`\`mermaid
${userFlowDiagram}
\`\`\`

## System Architecture
\`\`\`mermaid
${architectureDiagram}
\`\`\`

## Recent Chat Logs (Last 3)
${recentChatLogs}

## Unresolved Errors
${unresolvedErrors.length > 0 && unresolvedErrors[0] ? unresolvedErrors.map(error => `- ${error.id}: ${error.type} - ${error.message} (${error.file}:${error.line})`).join('\n') : 'No unresolved errors'}

## Recurring Errors
${recurringErrors.length > 0 && recurringErrors[0] ? recurringErrors.map(error => `- ${error.id}: ${error.type} - ${error.message} (Occurred ${error.count} times)`).join('\n') : 'No recurring errors'}

## Context Engineering
- **Version**: ${context.contextEngineering.version}
- **Structure**: Business, Technical, Operational, User contexts
- **Last Updated**: ${context.contextEngineering.state.last_updated}
- **Context Version**: ${context.contextEngineering.versionInfo.current_version}

## Business Context
${detailedContext.business.domain || 'No business domain information available'}

## Technical Context
${detailedContext.technical.architecture || 'No technical architecture information available'}
`;

fs.writeFileSync(path.join(projectRoot, 'context-summary.md'), contextSummary.trim());

console.log('Summary report saved to context-summary.md');