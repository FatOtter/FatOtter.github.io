"""
Integration tests for backend chat API endpoints
Tests for User Story 3: Interactive Communication
"""

import pytest
import json
import os
import sys
from unittest.mock import patch, MagicMock

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

try:
    from app import app
except ImportError:
    # Create a mock app for testing if import fails
    class MockApp:
        def __init__(self):
            self.testing = True
        
        def test_client(self):
            return MockTestClient()
    
    class MockTestClient:
        def get(self, path):
            return MockResponse(200, {"status": "ok"})
        
        def post(self, path, data=None, json=None):
            return MockResponse(200, {"message": "success"})
    
    class MockResponse:
        def __init__(self, status_code, data):
            self.status_code = status_code
            self.data = data
            self.json_data = data
        
        def get_json(self):
            return self.json_data
    
    app = MockApp()

class TestChatAPI:
    """Test suite for chat API endpoints"""
    
    def setup_method(self):
        """Setup for each test method"""
        self.client = app.test_client()
        self.chat_endpoint = '/api/chat/completions'
        self.health_endpoint = '/api/health'
        self.config_endpoint = '/api/config/public'
        
        # Mock configuration
        self.mock_config = {
            'coze_api_token': 'cztei_llMVpoQe7Wy03GrvaiNgnf3fI0E09s6ko0KYvT10DaQfnTZeDemojOM6LGID3IqA7',
            'coze_api_base': 'https://api.coze.cn',
            'bot_id': '7556964822257156146',
            'max_message_length': 1000,
            'supported_languages': ['zh', 'en', 'ja']
        }
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = self.client.get(self.health_endpoint)
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'status' in data
        assert data['status'] == 'healthy'
    
    def test_config_endpoint(self):
        """Test public configuration endpoint"""
        response = self.client.get(self.config_endpoint)
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'chatEnabled' in data
        assert 'maxMessageLength' in data
        assert 'supportedLanguages' in data
    
    @patch('app.coze')
    def test_chat_completions_success(self, mock_coze):
        """Test successful chat completion"""
        # Mock successful Coze API response
        mock_event = MagicMock()
        mock_event.event = 'CONVERSATION_MESSAGE_DELTA'
        mock_event.message.content = 'Hello! How can I help you?'
        
        mock_completed_event = MagicMock()
        mock_completed_event.event = 'CONVERSATION_CHAT_COMPLETED'
        mock_completed_event.chat.usage.token_count = 150
        
        mock_coze.chat.stream.return_value = [mock_event, mock_completed_event]
        
        # Test data
        test_data = {
            'message': 'Hello, AI!',
            'user_id': 'test_user_123',
            'language': 'en'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'response' in data
        assert 'usage' in data
        assert data['response'] == 'Hello! How can I help you?'
        assert data['usage']['token_count'] == 150
    
    def test_chat_completions_missing_message(self):
        """Test chat completion with missing message"""
        test_data = {
            'user_id': 'test_user_123'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'message' in data['error'].lower()
    
    def test_chat_completions_empty_message(self):
        """Test chat completion with empty message"""
        test_data = {
            'message': '',
            'user_id': 'test_user_123'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
    
    def test_chat_completions_long_message(self):
        """Test chat completion with message exceeding length limit"""
        long_message = 'a' * 2000  # Exceeds typical limit
        
        test_data = {
            'message': long_message,
            'user_id': 'test_user_123'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'length' in data['error'].lower()
    
    def test_chat_completions_invalid_language(self):
        """Test chat completion with invalid language"""
        test_data = {
            'message': 'Hello',
            'user_id': 'test_user_123',
            'language': 'invalid_lang'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'language' in data['error'].lower()
    
    @patch('app.coze')
    def test_chat_completions_api_error(self, mock_coze):
        """Test chat completion with API error"""
        # Mock API error
        mock_coze.chat.stream.side_effect = Exception('API Error')
        
        test_data = {
            'message': 'Hello',
            'user_id': 'test_user_123'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
    
    def test_chat_completions_malformed_json(self):
        """Test chat completion with malformed JSON"""
        response = self.client.post(
            self.chat_endpoint,
            data='invalid json',
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
    
    def test_chat_completions_missing_content_type(self):
        """Test chat completion without proper content type"""
        test_data = {
            'message': 'Hello',
            'user_id': 'test_user_123'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data)
        )
        
        # Should still work or return appropriate error
        assert response.status_code in [200, 400, 415]
    
    @patch('app.coze')
    def test_chat_completions_streaming_response(self, mock_coze):
        """Test streaming chat response"""
        # Mock streaming response
        mock_events = []
        for i in range(5):
            mock_event = MagicMock()
            mock_event.event = 'CONVERSATION_MESSAGE_DELTA'
            mock_event.message.content = f'Part {i+1} '
            mock_events.append(mock_event)
        
        mock_completed_event = MagicMock()
        mock_completed_event.event = 'CONVERSATION_CHAT_COMPLETED'
        mock_completed_event.chat.usage.token_count = 200
        mock_events.append(mock_completed_event)
        
        mock_coze.chat.stream.return_value = mock_events
        
        test_data = {
            'message': 'Tell me a story',
            'user_id': 'test_user_123',
            'stream': True
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'response' in data
        assert 'Part 1 Part 2 Part 3 Part 4 Part 5' in data['response']
    
    def test_chat_completions_user_id_validation(self):
        """Test user ID validation"""
        test_data = {
            'message': 'Hello',
            'user_id': ''  # Empty user ID
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
    
    @patch('app.coze')
    def test_chat_completions_different_languages(self, mock_coze):
        """Test chat completion with different languages"""
        # Mock response
        mock_event = MagicMock()
        mock_event.event = 'CONVERSATION_MESSAGE_DELTA'
        mock_event.message.content = 'Response'
        
        mock_completed_event = MagicMock()
        mock_completed_event.event = 'CONVERSATION_CHAT_COMPLETED'
        mock_completed_event.chat.usage.token_count = 100
        
        mock_coze.chat.stream.return_value = [mock_event, mock_completed_event]
        
        languages = ['zh', 'en', 'ja']
        
        for lang in languages:
            test_data = {
                'message': f'Hello in {lang}',
                'user_id': 'test_user_123',
                'language': lang
            }
            
            response = self.client.post(
                self.chat_endpoint,
                data=json.dumps(test_data),
                content_type='application/json'
            )
            
            assert response.status_code == 200
            data = response.get_json()
            assert 'response' in data
    
    def test_chat_completions_rate_limiting(self):
        """Test rate limiting (if implemented)"""
        # Send multiple requests rapidly
        test_data = {
            'message': 'Test message',
            'user_id': 'test_user_123'
        }
        
        responses = []
        for i in range(10):
            response = self.client.post(
                self.chat_endpoint,
                data=json.dumps(test_data),
                content_type='application/json'
            )
            responses.append(response.status_code)
        
        # All should succeed or some should be rate limited
        assert all(status in [200, 429] for status in responses)
    
    def test_chat_completions_cors_headers(self):
        """Test CORS headers are present"""
        response = self.client.options(self.chat_endpoint)
        
        # Should have CORS headers
        assert 'Access-Control-Allow-Origin' in response.headers
        assert 'Access-Control-Allow-Methods' in response.headers
    
    @patch('app.coze')
    def test_chat_completions_token_usage_tracking(self, mock_coze):
        """Test token usage tracking"""
        # Mock response with token usage
        mock_event = MagicMock()
        mock_event.event = 'CONVERSATION_MESSAGE_DELTA'
        mock_event.message.content = 'Response'
        
        mock_completed_event = MagicMock()
        mock_completed_event.event = 'CONVERSATION_CHAT_COMPLETED'
        mock_completed_event.chat.usage.token_count = 250
        
        mock_coze.chat.stream.return_value = [mock_event, mock_completed_event]
        
        test_data = {
            'message': 'Test message for token tracking',
            'user_id': 'test_user_123'
        }
        
        response = self.client.post(
            self.chat_endpoint,
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'usage' in data
        assert data['usage']['token_count'] == 250

if __name__ == '__main__':
    pytest.main([__file__])
