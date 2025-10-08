<!--
Sync Impact Report:
Version change: 1.0.0 → 1.1.0
Modified principles: N/A (no existing principles modified)
Added sections: VI. Minimal Code Modification, VII. Test-First Development
Removed sections: N/A
Templates requiring updates: 
  ✅ plan-template.md (Constitution Check section updated)
  ✅ spec-template.md (aligned with portfolio requirements)
  ✅ tasks-template.md (aligned with frontend/backend structure and testing requirements)
Follow-up TODOs: None
-->

# FatOtter.github.io Constitution

## Core Principles

### I. Zero-Dependency Frontend (NON-NEGOTIABLE)
The frontend MUST run directly in web browsers without any build process, package managers, or external dependencies. All functionality must be implemented using vanilla HTML, CSS, and JavaScript. This ensures maximum portability, simplicity, and eliminates deployment complexity.

### II. Structured File Organization
The project structure MUST maintain clear separation: css/ for stylesheets, script/ for JavaScript files, assets/ for static resources, and test/ for testing frameworks. The archive/ directory is preserved but excluded from active development. This organization enables maintainability and clear responsibility boundaries.

### III. Personal Portfolio Focus
All features MUST serve the primary purpose of showcasing personal professional information, including resume content, project experience, and skills. The website serves as a professional presence and MUST prioritize content presentation over complex functionality.

### IV. Backend API Integration
The optional Flask backend MUST provide RESTful APIs for enhanced functionality while maintaining frontend independence. Backend services are supplementary and MUST NOT be required for basic portfolio functionality. All API calls MUST be configurable and gracefully degrade when backend is unavailable.

### V. Multilingual Support
The website MUST support multiple languages (Chinese, English, Japanese) using data attributes and localStorage persistence. Language switching MUST be seamless and maintain user preference across sessions. This reflects the international professional experience of the portfolio owner.

### VI. Minimal Code Modification (NON-NEGOTIABLE)
Every single feature implementation MUST be based on existing code with the absolute minimum modifications required. Developers MUST prioritize enhancing existing functionality over creating new implementations. This principle ensures code stability, reduces regression risks, and maintains the proven foundation of the existing codebase.

### VII. Test-First Development (NON-NEGOTIABLE)
Every single feature implementation MUST be accompanied by corresponding test files in the test/ directory. Unit tests MUST be written and executed before any commit. No code changes are allowed to be committed without passing all relevant unit tests. This ensures code quality, prevents regressions, and maintains system reliability.

## Frontend Architecture

### Technology Stack
- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: CSS Variables for theming, responsive design principles
- **Testing**: Browser-based testing with Mocha + Chai
- **Assets**: Static files in assets/ directory (images, documents, configuration)

### Performance Requirements
- **Load Time**: Initial page load under 2 seconds on standard broadband
- **Responsiveness**: Mobile-first design with breakpoints at 768px and 1024px
- **Accessibility**: WCAG AA compliance with semantic HTML and proper contrast ratios

## Backend Integration

### API Design
- **Framework**: Flask with RESTful endpoints
- **Configuration**: Environment-based configuration with config.json fallback
- **Error Handling**: Graceful degradation when backend services are unavailable
- **Security**: No hardcoded secrets, configurable endpoints

### Optional Services
- **Chat Proxy**: Volcengine integration for enhanced user interaction
- **Analytics**: Optional usage tracking and performance monitoring
- **Content Management**: Dynamic content updates without frontend changes

## Development Workflow

### Documentation-Driven Development
All development MUST follow the documentation-driven workflow centered on the project/ directory:
1. Update requirements.md for feature specifications
2. Compare with current_state.md to identify gaps
3. Maintain todo.md with clear task status tracking
4. Implement changes following existing patterns with minimal modifications
5. Update documentation to reflect implementation state

### Test-First Implementation Process
Every feature implementation MUST follow this mandatory sequence:
1. **Analyze Existing Code**: Identify the minimal changes required to existing code
2. **Write Tests First**: Create test files in test/ directory before any code changes
3. **Implement Minimal Changes**: Make only the necessary modifications to existing code
4. **Run Unit Tests**: Execute all relevant tests and ensure they pass
5. **Commit Only After Tests Pass**: No commits allowed without passing unit tests

### Testing Strategy
- **Frontend Tests**: Browser-based testing via test/frontend/index.html
- **Backend Tests**: pytest integration tests in test/backend/
- **Unit Test Coverage**: Every new feature MUST have corresponding unit tests
- **Test Execution**: All tests MUST pass before any commit
- **Manual Testing**: Cross-browser compatibility verification
- **Performance Testing**: Load time and responsiveness validation

### Code Quality Standards
- **Minimal Modification**: Enhance existing code rather than rewriting
- **Test Coverage**: Every feature must have corresponding unit tests
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation
- **Security**: External links with rel="noopener noreferrer", no hardcoded credentials
- **Maintainability**: Clear code structure, consistent naming conventions
- **Internationalization**: Proper character encoding, RTL support consideration

## Governance

### Amendment Procedure
Constitution amendments require:
1. Documentation of the proposed change with clear rationale
2. Impact assessment on existing functionality
3. Update of all dependent templates and documentation
4. Version increment following semantic versioning (MAJOR.MINOR.PATCH)

### Compliance Review
All development work MUST verify compliance with constitution principles before implementation. The constitution supersedes all other development practices and serves as the authoritative guide for project decisions.

### Version Control
- **MAJOR**: Backward incompatible changes to core principles
- **MINOR**: New principles or significant feature additions
- **PATCH**: Clarifications, typo fixes, non-semantic refinements

**Version**: 1.1.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27