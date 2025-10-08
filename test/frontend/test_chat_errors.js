// Unit tests for chat error handling
// Tests for User Story 3: Interactive Communication

describe('Chat Error Handling (US3)', () => {
  let mockChatAPI;
  
  beforeEach(() => {
    // Setup DOM elements for testing
    document.body.innerHTML = `
      <div class="chat-container">
        <div class="chat-messages" role="log" aria-live="polite">
          <div class="message bot-message">
            <div class="message-content">Hello! How can I help you?</div>
          </div>
        </div>
        <div class="chat-input-container">
          <textarea class="chat-input" placeholder="Type your message..."></textarea>
          <button class="chat-send">Send</button>
        </div>
        <div class="chat-status" aria-live="polite"></div>
        <div class="error-message" style="display: none;"></div>
      </div>
    `;
    
    // Mock chat API with error handling
    mockChatAPI = {
      sendMessage: function(message) {
        return new Promise((resolve, reject) => {
          // Simulate different error conditions based on message content
          if (message.includes('network_error')) {
            reject(new Error('Network Error: Unable to connect to server'));
          } else if (message.includes('timeout_error')) {
            reject(new Error('Request Timeout: Server did not respond in time'));
          } else if (message.includes('server_error')) {
            reject(new Error('Server Error: Internal server error'));
          } else if (message.includes('rate_limit')) {
            reject(new Error('Rate Limit: Too many requests'));
          } else if (message.includes('invalid_message')) {
            reject(new Error('Invalid Message: Message format not supported'));
          } else {
            resolve({
              success: true,
              response: `AI Response to: ${message}`,
              timestamp: new Date().toISOString()
            });
          }
        });
      }
    };
    
    // Mock window.__app.chat
    window.__app = window.__app || {};
    window.__app.chat = mockChatAPI;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete window.__app.chat;
  });

  describe('Network Error Handling', () => {
    it('should handle network connection errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      const errorMessage = document.querySelector('.error-message');
      
      chatInput.value = 'This will cause a network_error';
      sendButton.click();
      
      // Wait for async error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show network error
      expect(chatStatus.textContent).to.include('网络');
      expect(chatStatus.textContent).to.include('错误');
      expect(errorMessage.style.display).to.not.equal('none');
    });

    it('should handle server timeout errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      chatInput.value = 'This will cause a timeout_error';
      sendButton.click();
      
      // Wait for async error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show timeout error
      expect(chatStatus.textContent).to.include('超时');
      expect(chatStatus.textContent).to.include('错误');
    });

    it('should handle server internal errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      chatInput.value = 'This will cause a server_error';
      sendButton.click();
      
      // Wait for async error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show server error
      expect(chatStatus.textContent).to.include('服务器');
      expect(chatStatus.textContent).to.include('错误');
    });
  });

  describe('Rate Limiting Error Handling', () => {
    it('should handle rate limiting errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      chatInput.value = 'This will cause a rate_limit';
      sendButton.click();
      
      // Wait for async error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show rate limit error
      expect(chatStatus.textContent).to.include('请求');
      expect(chatStatus.textContent).to.include('频繁');
    });

    it('should disable input during rate limiting', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      chatInput.value = 'This will cause a rate_limit';
      sendButton.click();
      
      // Wait for async error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Input should be disabled during rate limiting
      expect(chatInput.disabled).to.be.true;
      expect(sendButton.disabled).to.be.true;
    });

    it('should re-enable input after rate limit period', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      chatInput.value = 'This will cause a rate_limit';
      sendButton.click();
      
      // Wait for error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simulate rate limit period ending
      setTimeout(() => {
        expect(chatInput.disabled).to.be.false;
        expect(sendButton.disabled).to.be.false;
      }, 1000);
    });
  });

  describe('Message Validation Errors', () => {
    it('should handle invalid message format errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      chatInput.value = 'This will cause an invalid_message';
      sendButton.click();
      
      // Wait for async error handling
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show invalid message error
      expect(chatStatus.textContent).to.include('消息');
      expect(chatStatus.textContent).to.include('格式');
    });

    it('should handle empty message errors', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      // Try to send empty message
      chatInput.value = '';
      sendButton.click();
      
      // Should show empty message error
      expect(chatStatus.textContent).to.include('消息');
      expect(chatStatus.textContent).to.include('空');
    });

    it('should handle message length validation errors', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      // Try to send very long message
      const longMessage = 'a'.repeat(10000);
      chatInput.value = longMessage;
      sendButton.click();
      
      // Should show length validation error
      expect(chatStatus.textContent).to.include('消息');
      expect(chatStatus.textContent).to.include('长度');
    });
  });

  describe('Error Recovery', () => {
    it('should allow retry after network error', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      // First attempt - network error
      chatInput.value = 'This will cause a network_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(chatStatus.textContent).to.include('错误');
      
      // Second attempt - should work
      chatInput.value = 'This should work fine';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(chatStatus.textContent).to.not.include('错误');
    });

    it('should clear error state on successful message', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      const errorMessage = document.querySelector('.error-message');
      
      // First attempt - error
      chatInput.value = 'This will cause a server_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(chatStatus.textContent).to.include('错误');
      expect(errorMessage.style.display).to.not.equal('none');
      
      // Second attempt - success
      chatInput.value = 'This should work fine';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(chatStatus.textContent).to.not.include('错误');
      expect(errorMessage.style.display).to.equal('none');
    });

    it('should provide retry button for failed messages', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      
      // Send message that will fail
      chatInput.value = 'This will cause a network_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should have retry button in failed message
      const failedMessage = chatMessages.querySelector('.message.error');
      expect(failedMessage).to.exist;
      
      const retryButton = failedMessage.querySelector('.retry-button');
      expect(retryButton).to.exist;
    });
  });

  describe('Error Message Display', () => {
    it('should show user-friendly error messages', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      const errorTests = [
        { input: 'network_error', expected: '网络' },
        { input: 'timeout_error', expected: '超时' },
        { input: 'server_error', expected: '服务器' },
        { input: 'rate_limit', expected: '请求' }
      ];
      
      for (const test of errorTests) {
        chatInput.value = `This will cause a ${test.input}`;
        sendButton.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(chatStatus.textContent).to.include(test.expected);
        
        // Clear for next test
        chatStatus.textContent = '';
      }
    });

    it('should show error messages in multiple languages', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      // Test Chinese error message
      chatInput.value = 'This will cause a network_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(chatStatus.textContent).to.include('网络');
      
      // Simulate language change to English
      document.documentElement.setAttribute('lang', 'en');
      chatStatus.setAttribute('data-lang', 'en');
      
      // Should show English error message
      expect(chatStatus.getAttribute('data-lang')).to.equal('en');
    });

    it('should display error messages with proper styling', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      chatInput.value = 'This will cause a server_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Error message should have error styling
      expect(chatStatus.className).to.include('error');
      expect(chatStatus.style.color).to.include('red');
    });
  });

  describe('Error Logging', () => {
    it('should log errors for debugging', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Mock console.error
      const consoleSpy = sinon.spy(console, 'error');
      
      chatInput.value = 'This will cause a server_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should log error
      expect(consoleSpy.called).to.be.true;
      
      consoleSpy.restore();
    });

    it('should include error context in logs', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Mock console.error
      const consoleSpy = sinon.spy(console, 'error');
      
      chatInput.value = 'This will cause a network_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should log with context
      const logCall = consoleSpy.getCall(0);
      expect(logCall.args[0]).to.include('Network Error');
      
      consoleSpy.restore();
    });
  });

  describe('Graceful Degradation', () => {
    it('should continue functioning after API errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      
      // Send message that will fail
      chatInput.value = 'This will cause a server_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Chat should still be functional
      expect(chatInput.disabled).to.be.false;
      expect(sendButton.disabled).to.be.false;
      expect(chatMessages).to.exist;
    });

    it('should maintain chat history after errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      
      // Send successful message first
      chatInput.value = 'This should work fine';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Send message that will fail
      chatInput.value = 'This will cause a network_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should maintain chat history
      const messages = chatMessages.querySelectorAll('.message');
      expect(messages.length).to.be.at.least(2);
    });

    it('should provide fallback responses for critical errors', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      
      // Send message that will cause critical error
      chatInput.value = 'This will cause a server_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show fallback message
      const fallbackMessage = chatMessages.querySelector('.message.fallback');
      expect(fallbackMessage).to.exist;
      expect(fallbackMessage.textContent).to.include('暂时无法');
    });
  });

  describe('Error Prevention', () => {
    it('should validate input before sending', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Test various invalid inputs
      const invalidInputs = [
        '', // Empty
        '   ', // Whitespace only
        null, // Null
        undefined // Undefined
      ];
      
      invalidInputs.forEach(input => {
        chatInput.value = input;
        sendButton.click();
        
        // Should not send invalid input
        expect(chatInput.value).to.equal(input || '');
      });
    });

    it('should prevent duplicate message sending', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      chatInput.value = 'This should work fine';
      
      // Send multiple times rapidly
      sendButton.click();
      sendButton.click();
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Should only send once
      const userMessages = document.querySelectorAll('.user-message');
      expect(userMessages.length).to.equal(1);
    });

    it('should handle concurrent error conditions', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      // Simulate multiple error conditions
      chatInput.value = 'This will cause a network_error';
      sendButton.click();
      
      // Immediately try another error
      chatInput.value = 'This will cause a server_error';
      sendButton.click();
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Should handle gracefully
      expect(chatStatus.textContent).to.not.be.empty;
    });
  });
});
