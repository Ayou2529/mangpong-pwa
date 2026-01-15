# Context Engineering System

The Mangpong Trading PWA implements a comprehensive Context Engineering system to maintain consistency between business requirements, technical implementation, and user experience.

## 📋 Table of Contents
- [Overview](#overview)
- [System Components](#system-components)
- [Workflow](#workflow)
- [Tools](#tools)
- [Validation](#validation)
- [Visualization](#visualization)
- [Search](#search)
- [Synchronization](#synchronization)
- [CLI Usage](#cli-usage)

## 🌟 Overview

Context Engineering is the practice of maintaining a clear, consistent, and up-to-date understanding of a project's context across all dimensions:
- **Business Context**: Domain, roles, processes
- **Technical Context**: Architecture, components, data model
- **Operational Context**: Workflows, policies
- **User Context**: Personas, journeys

This system ensures that all team members (even if it's just one developer) have access to the same understanding of the project and can make informed decisions.

## ⚙️ System Components

### 1. Context Files
Organized in the `context/` directory with subdirectories:
- `business/` - Business domain information
- `technical/` - Technical architecture details
- `operational/` - Operational workflows and policies
- `user/` - User personas and journeys

### 2. Context Mapping
The `context-mapping.json` file defines relationships between different context elements using a graph-based approach.

### 3. Dependencies
The `dependencies.json` file tracks dependencies between components, features, and data elements.

### 4. Error Mapping
The `error-context-mapping.json` file links error patterns to relevant context files and solutions.

## 🔄 Workflow

1. **Create/Update Context**: Add or modify context files in the appropriate directories
2. **Validate**: Run validation to ensure consistency and completeness
3. **Visualize**: Generate diagrams to understand relationships
4. **Search**: Find relevant context information quickly
5. **Sync**: Keep context in sync with code changes

## 🛠️ Tools

### Context Engine CLI
The main interface for context engineering operations:

```bash
# Show help
npm run context:validate

# Validate context files
npm run context:validate

# Generate visualization diagrams
npm run context:visualize

# Update all context files
npm run context:update

# Watch for changes
npm run context:watch

# Search context files
npm run context:search <query>
```

### Individual Tools
- `validate-context.js` - Validate context structure and content
- `visualize-context.js` - Generate context diagrams
- `search-context.js` - Search across context files
- `sync-context.js` - Sync context with code changes
- `generate-context.js` - Generate context.json and summary

## ✅ Validation

The validation system ensures context completeness and consistency:

### Structure Validation
- Checks that all required directories exist
- Verifies that all required files are present
- Ensures proper file naming conventions

### Content Validation
- Verifies that required sections are present in each file
- Checks for broken links between context files
- Validates formatting and structure

### Completeness Report
Generates a report showing context completeness percentage and identifying missing elements.

## 🎨 Visualization

### Context Relationship Diagram
Shows relationships between different context elements using a directed graph.

### Dependencies Diagram
Visualizes dependencies between components, features, and data elements.

### Interactive Visualizations
Generated diagrams are saved as markdown files with Mermaid syntax for easy viewing in GitHub and other markdown viewers.

## 🔍 Search

The search system allows quick discovery of context information:

### Features
- Full-text search across all context files
- Case-sensitive and whole-word search options
- File and line number results
- Statistics on context size and content

### Usage
```bash
# Search for a term
node context/context-engine.js search "commission"

# List all context files
node context/context-engine.js list

# Show context statistics
node context/context-engine.js stats
```

## 🔄 Synchronization

The synchronization system keeps context in sync with code changes:

### Automatic Updates
- Detects when source files are newer than context
- Automatically regenerates context when needed
- Updates error mappings based on new errors

### Error Integration
- Links error patterns to relevant context files
- Suggests solutions based on error types
- Provides prevention strategies

## 🖥️ CLI Usage

### Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `help` | Show help message | `context-engine help` |
| `validate` | Validate context files | `context-engine validate` |
| `visualize` | Generate diagrams | `context-engine visualize` |
| `search` | Search context files | `context-engine search <query>` |
| `list` | List all context files | `context-engine list` |
| `stats` | Show context statistics | `context-engine stats` |
| `sync` | Sync context with code | `context-engine sync` |
| `watch` | Watch for changes | `context-engine watch` |
| `update` | Update all context files | `context-engine update` |
| `report` | Generate completeness report | `context-engine report` |

### Examples

```bash
# Validate context files
npm run context:validate

# Search for information about commissions
npm run context:search commission

# Generate all diagrams
npm run context:visualize

# Update everything
npm run context:update

# Watch for changes
npm run context:watch
```

## 📈 Benefits

1. **Consistency**: Ensures all team members have the same understanding
2. **Traceability**: Links requirements to implementation to testing
3. **Maintainability**: Makes it easier to understand and modify the system
4. **Onboarding**: Helps new developers quickly understand the project
5. **Decision Making**: Provides context for technical and business decisions
6. **Error Prevention**: Links errors to relevant context for faster resolution

## 🚀 Future Improvements

1. **AI-Powered Context Analysis**: Use AI to suggest context improvements
2. **Context Versioning**: Track changes to context over time
3. **Context Diff Tool**: Compare context versions to track changes
4. **Interactive Context Maps**: Create web-based interactive context visualization
5. **Context Templates**: Standardized templates for creating new context files
6. **Context History**: Track who made changes and when