# Quickstart Guide: Personal Portfolio Website

**Feature**: Personal Portfolio Website  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This guide provides quick setup instructions for the personal portfolio website. The implementation leverages existing codebase with minimal configuration required.

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.8+ (for optional backend)
- Git (for development)

## Frontend Setup (Required)

### 1. Basic Setup
```bash
# Clone or navigate to the repository
cd FatOtter.github.io

# Open the main page in a browser
open index.html
# OR
python3 -m http.server 8080
# Then visit http://localhost:8080
```

### 2. Configuration
Edit `assets/config.json` to customize:
```json
{
  "backendUrl": "http://127.0.0.1:5001",
  "model": "auto",
  "temperature": 0.7,
  "stream": false
}
```

### 3. Content Customization
- Update `assets/resume.md` with your professional information
- Replace `assets/protrait.png` with your profile image
- Modify `index.html` for any structural changes

## Backend Setup (Optional)

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configuration
Copy and customize configuration:
```bash
cp config.example.json config.json
```

Edit `backend/config.json`:
```json
{
  "CORS_ORIGINS": ["http://localhost:8080", "https://fatotter.github.io"],
  "VOLCENGINE_API_BASE": "https://ark.cn-beijing.volces.com/api/v3",
  "VOLCENGINE_ENABLE_SSE": false,
  "DEFAULT_MODEL": "ep-20241218123456-abcde"
}
```

### 3. Environment Variables (Optional)
```bash
export VOLCENGINE_ACCESS_KEY="your_access_key"
export VOLCENGINE_SECRET_KEY="your_secret_key"
```

### 4. Start Backend
```bash
python app.py
```

Backend will be available at `http://localhost:5001`

## Testing

### Frontend Tests
```bash
# Open in browser
open test/frontend/index.html
```

### Backend Tests
```bash
cd test/backend
export BACKEND_URL="http://localhost:5001"
pytest test_api.py
```

## Features

### Multilingual Support
- **Languages**: Chinese (zh), English (en), Japanese (ja)
- **Switching**: Click language buttons in navigation
- **Persistence**: Language preference saved in localStorage
- **Default**: Auto-detects browser language

### Chat Functionality
- **Access**: Click "与我聊天" / "Chat with me" button
- **Features**: Send messages, receive responses, clear conversation
- **Fallback**: Works without backend (graceful degradation)
- **Context**: Maintains conversation history during session

### Responsive Design
- **Mobile**: Optimized for mobile devices
- **Desktop**: Full-featured desktop experience
- **Breakpoints**: 768px and 1024px

## Customization

### Styling
Edit `css/style.css` to customize:
- Color scheme (CSS variables)
- Typography
- Layout and spacing
- Responsive breakpoints

### Content
- **Professional Info**: Update `assets/resume.md`
- **Images**: Replace images in `assets/` directory
- **Text**: Modify language-specific content in `index.html`

### Functionality
- **JavaScript**: Enhance `script/app.js`
- **API Integration**: Modify backend endpoints
- **Testing**: Add test cases in `test/` directory

## Deployment

### Frontend (GitHub Pages)
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Site will be available at `https://username.github.io`

### Backend (Optional)
1. Deploy to cloud provider (Heroku, AWS, etc.)
2. Update `assets/config.json` with production URL
3. Configure environment variables

## Troubleshooting

### Common Issues

**Language switching not working**
- Check browser console for JavaScript errors
- Verify localStorage is enabled
- Ensure all language content is present

**Chat not responding**
- Check backend is running (if using backend)
- Verify API configuration in `assets/config.json`
- Check network connectivity

**Styling issues**
- Clear browser cache
- Check CSS file is loading correctly
- Verify responsive breakpoints

### Debug Mode
Enable debug logging in `script/app.js`:
```javascript
window.__app.debug = true;
```

## Support

For issues or questions:
- Check `project/current_state.md` for implementation status
- Review `project/requirements.md` for feature specifications
- Run tests to verify functionality

## Next Steps

1. **Content**: Update professional information in `assets/resume.md`
2. **Styling**: Customize colors and layout in `css/style.css`
3. **Backend**: Set up optional chat backend for enhanced functionality
4. **Testing**: Run test suite to verify all features work correctly
5. **Deployment**: Deploy to production environment
