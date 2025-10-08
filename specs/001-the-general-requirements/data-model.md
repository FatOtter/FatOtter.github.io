# Data Model: Personal Portfolio Website

**Feature**: Personal Portfolio Website  
**Date**: 2025-01-27  
**Status**: Complete

## Entity Overview

The portfolio website operates with a simple data model focused on content presentation and user preferences. No complex database relationships are required due to the static nature of portfolio content.

## Core Entities

### Professional Profile
**Purpose**: Contains all professional information displayed on the portfolio  
**Source**: Static content from `assets/resume.md` and HTML structure  
**Attributes**:
- Personal Information (name, contact details, profile image)
- Education History (institutions, degrees, dates)
- Work Experience (companies, positions, responsibilities, dates)
- Skills (technical skills, languages, certifications)
- Projects (project descriptions, technologies, outcomes)
- Publications (academic papers, articles, presentations)

**State Management**: Static content, no state transitions required  
**Validation**: Content validation through manual review and testing

### Language Content
**Purpose**: Manages multilingual text and interface elements  
**Source**: HTML data attributes (data-zh, data-en, data-ja)  
**Attributes**:
- Interface Text (navigation, buttons, labels)
- Content Text (section headers, descriptions)
- Error Messages (validation, system messages)
- Accessibility Labels (ARIA labels, alt text)

**State Management**: Language switching through JavaScript  
**Validation**: All languages must have equivalent content

### User Preferences
**Purpose**: Stores visitor-specific settings and preferences  
**Source**: Browser localStorage  
**Attributes**:
- Language Preference (zh/en/ja)
- Theme Preference (if implemented)
- Chat History (optional, session-based)

**State Management**: Persistent storage in localStorage  
**Validation**: Language preference must be valid (zh/en/ja)

### Chat Session
**Purpose**: Manages interactive communication with visitors  
**Source**: Backend API and frontend state  
**Attributes**:
- Session ID (unique identifier)
- Messages (user messages, assistant responses)
- Context (conversation history)
- Timestamps (message creation times)
- Status (active, completed, error)

**State Management**: Session-based with optional persistence  
**Validation**: Messages must be non-empty, timestamps must be valid

## Data Flow

### Content Loading
1. HTML loads with default language content
2. JavaScript checks localStorage for language preference
3. If preference exists, apply language-specific data attributes
4. If no preference, detect browser language or use default

### Language Switching
1. User selects new language
2. JavaScript updates all data attributes
3. localStorage updated with new preference
4. UI elements updated with new language content

### Chat Interaction
1. User sends message
2. Frontend validates message content
3. API call to backend (if available)
4. Response received and displayed
5. Context maintained for follow-up messages

## Storage Strategy

### Frontend Storage
- **localStorage**: User preferences, language selection
- **Session Storage**: Chat context (optional)
- **Static Files**: Professional content, images, configuration

### Backend Storage (Optional)
- **MySQL**: Chat sessions, message history (if persistence required)
- **Configuration**: API keys, service endpoints

## Validation Rules

### Content Validation
- All required professional information must be present
- Contact information must be valid and accessible
- Images must have appropriate alt text for accessibility

### Language Validation
- All interface elements must have translations for all supported languages
- Language codes must be valid (zh, en, ja)
- Content length should be reasonable across all languages

### Chat Validation
- Messages must not be empty
- Message length should be within reasonable limits
- API responses must be properly formatted

## Security Considerations

### Data Protection
- No sensitive personal information in frontend storage
- API keys and secrets stored in backend configuration only
- User input sanitization for chat messages

### Privacy
- Chat history not persisted unless explicitly requested
- No tracking or analytics without user consent
- GDPR compliance for EU visitors

## Performance Considerations

### Loading Strategy
- Static content loaded immediately
- Language switching without page reload
- Lazy loading for non-critical resources

### Caching
- Browser caching for static assets
- localStorage caching for user preferences
- API response caching where appropriate
