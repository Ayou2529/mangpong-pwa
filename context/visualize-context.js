import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to the project root
const projectRoot = path.resolve(__dirname, '..');

// Function to generate a visual diagram of context relationships
function generateContextDiagram() {
  console.log('🎨 Generating context relationship diagram...');
  
  // Read the context mapping file
  const mappingPath = path.join(projectRoot, 'context', 'context-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    console.log('❌ Context mapping file not found');
    return;
  }
  
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  
  // Generate Mermaid diagram
  let diagram = 'graph TD\n';
  
  // Add nodes
  for (const node of mapping.nodes) {
    const nodeType = node.type.charAt(0).toUpperCase() + node.type.slice(1);
    diagram += `    ${node.id}[${node.label}\\n(${nodeType})]\n`;
  }
  
  diagram += '\n';
  
  // Add edges
  for (const edge of mapping.edges) {
    const relationship = edge.relationship.replace('_', ' ');
    diagram += `    ${edge.source} -- ${relationship} --> ${edge.target}\n`;
  }
  
  // Create the markdown file with the diagram
  const diagramContent = `# Context Relationship Diagram

This diagram shows the relationships between different context elements in the project.

\`\`\`mermaid
${diagram}\`\`\`

## Legend
- **Business** - Business domain, roles, and processes
- **Technical** - Technical architecture and components
- **Operational** - Workflows and policies
- **User** - Personas and journeys

## Relationships
${mapping.edges.map(edge => `- **${edge.source} → ${edge.target}**: ${edge.description}`).join('\n')}
`;
  
  const diagramPath = path.join(projectRoot, 'context', 'context-diagram.md');
  fs.writeFileSync(diagramPath, diagramContent);
  
  console.log(`✅ Context diagram generated and saved to: ${diagramPath}`);
  
  return diagram;
}

// Function to generate a dependencies diagram
function generateDependenciesDiagram() {
  console.log('🔗 Generating dependencies diagram...');
  
  // Read the dependencies file
  const dependenciesPath = path.join(projectRoot, 'context', 'dependencies.json');
  if (!fs.existsSync(dependenciesPath)) {
    console.log('❌ Dependencies file not found');
    return;
  }
  
  const dependenciesData = JSON.parse(fs.readFileSync(dependenciesPath, 'utf8'));
  
  // Generate Mermaid diagram
  let diagram = 'graph LR\n';
  
  // Group dependencies by type for better visualization
  const componentDeps = dependenciesData.dependencies.filter(d => d.type === 'component');
  const featureDeps = dependenciesData.dependencies.filter(d => d.type === 'feature');
  const dataDeps = dependenciesData.dependencies.filter(d => d.type === 'data');
  const externalDeps = dependenciesData.dependencies.filter(d => d.type === 'external');
  
  // Add component dependencies
  for (const dep of componentDeps) {
    diagram += `    ${dep.source.replace(/\s+/g, '_')}[${dep.source}] --> ${dep.target.replace(/\s+/g, '_')}[${dep.target}]\n`;
  }
  
  diagram += '\n';
  
  // Add feature dependencies
  for (const dep of featureDeps) {
    diagram += `    ${dep.source.replace(/\s+/g, '_')}[${dep.source}] -.-> ${dep.target.replace(/\s+/g, '_')}[${dep.target}]\n`;
  }
  
  diagram += '\n';
  
  // Add data dependencies
  for (const dep of dataDeps) {
    diagram += `    ${dep.source.replace(/\s+/g, '_')}[${dep.source}] ==> ${dep.target.replace(/\s+/g, '_')}[${dep.target}]\n`;
  }
  
  diagram += '\n';
  
  // Add external dependencies
  for (const dep of externalDeps) {
    diagram += `    ${dep.source.replace(/\s+/g, '_')}[${dep.source}] --- ${dep.target.replace(/\s+/g, '_')}[${dep.target}]\n`;
  }
  
  // Create the markdown file with the diagram
  const diagramContent = `# Dependencies Diagram

This diagram shows the dependencies between different components, features, and data elements in the project.

\`\`\`mermaid
${diagram}\`\`\`

## Legend
- **Solid Arrow** --> Component dependencies
- **Dotted Arrow** -.-> Feature dependencies
- **Bold Arrow** ==> Data dependencies
- **Dash Arrow** --- External dependencies

## Dependencies List
${dependenciesData.dependencies.map(dep => `- **${dep.source} → ${dep.target}** (${dep.type}): ${dep.description}`).join('\n')}

## Dependency Types
${Object.entries(dependenciesData.dependency_types).map(([type, description]) => `- **${type}**: ${description}`).join('\n')}
`;
  
  const diagramPath = path.join(projectRoot, 'context', 'dependencies-diagram.md');
  fs.writeFileSync(diagramPath, diagramContent);
  
  console.log(`✅ Dependencies diagram generated and saved to: ${diagramPath}`);
  
  return diagram;
}

// Function to generate a comprehensive context visualization report
function generateVisualizationReport() {
  console.log('📊 Generating comprehensive context visualization report...');
  
  // Create directory for visualization outputs
  const vizDir = path.join(projectRoot, 'context', 'visualizations');
  if (!fs.existsSync(vizDir)) {
    fs.mkdirSync(vizDir, { recursive: true });
  }
  
  // Generate all diagrams
  const contextDiagram = generateContextDiagram();
  const dependenciesDiagram = generateDependenciesDiagram();
  
  // Create main report
  const reportContent = `# Context Visualization Report

This report provides visual representations of the project's context and dependencies.

## Table of Contents
1. [Context Relationship Diagram](#context-relationship-diagram)
2. [Dependencies Diagram](#dependencies-diagram)

## Context Relationship Diagram

\`\`\`mermaid
${contextDiagram}
\`\`\`

## Dependencies Diagram

\`\`\`mermaid
${dependenciesDiagram}
\`\`\`

---
*Generated on ${new Date().toISOString()}*
`;
  
  const reportPath = path.join(vizDir, 'visualization-report.md');
  fs.writeFileSync(reportPath, reportContent);
  
  console.log(`✅ Comprehensive visualization report generated and saved to: ${reportPath}`);
}

// Export functions
export {
  generateContextDiagram,
  generateDependenciesDiagram,
  generateVisualizationReport,
};

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateVisualizationReport();
}