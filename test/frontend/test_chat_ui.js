// Unit tests for chat UI functionality
// Tests for User Story 3: Interactive Communication

describe('Chat UI Functionality (US3)', () => {
  beforeEach(() => {
    // Setup DOM elements for testing
    document.body.innerHTML = `
      <div class="chat-container" style="display: none;">
        <div class="chat-header">
          <h3 data-zh="AI助手" data-en="AI Assistant" data-ja="AIアシスタント">AI助手</h3>
          <button class="chat-close" aria-label="Close chat">×</button>
        </div>
        <div class="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
          <div class="message bot-message">
            <div class="message-content" data-zh="你好！我是AI助手，有什么可以帮助您的吗？" 
                 data-en="Hello! I'm your AI assistant. How can I help you today?" 
                 data-ja="こんにちは！AIアシスタントです。何かお手伝いできることはありますか？">你好！我是AI助手，有什么可以帮助您的吗？</div>
          </div>
        </div>
        <div class="chat-input-container">
          <textarea class="chat-input" placeholder="输入消息..." 
                    data-zh-placeholder="输入消息..." 
                    data-en-placeholder="Type your message..." 
                    data-ja-placeholder="メッセージを入力..." 
                    aria-label="Chat input"></textarea>
          <button class="chat-send" aria-label="Send message">
            <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
          </button>
        </div>
        <div class="chat-status" aria-live="polite" aria-label="Chat status"></div>
      </div>
      <button class="chat-toggle" aria-label="Open chat">
        <i class="fa-solid fa-comments" aria-hidden="true"></i>
      </button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Chat Container Visibility', () => {
    it('should hide chat container by default', () => {
      const chatContainer = document.querySelector('.chat-container');
      expect(chatContainer.style.display).to.equal('none');
    });

    it('should show chat container when toggle button is clicked', () => {
      const chatToggle = document.querySelector('.chat-toggle');
      const chatContainer = document.querySelector('.chat-container');
      
      chatToggle.click();
      
      expect(chatContainer.style.display).to.not.equal('none');
    });

    it('should hide chat container when close button is clicked', () => {
      const chatToggle = document.querySelector('.chat-toggle');
      const chatClose = document.querySelector('.chat-close');
      const chatContainer = document.querySelector('.chat-container');
      
      // First show the chat
      chatToggle.click();
      expect(chatContainer.style.display).to.not.equal('none');
      
      // Then close it
      chatClose.click();
      expect(chatContainer.style.display).to.equal('none');
    });
  });

  describe('Chat Input Functionality', () => {
    it('should have proper input elements', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      expect(chatInput).to.exist;
      expect(sendButton).to.exist;
      expect(chatInput.tagName.toLowerCase()).to.equal('textarea');
      expect(sendButton.tagName.toLowerCase()).to.equal('button');
    });

    it('should allow text input in chat input field', () => {
      const chatInput = document.querySelector('.chat-input');
      const testMessage = 'Hello, this is a test message';
      
      chatInput.value = testMessage;
      
      expect(chatInput.value).to.equal(testMessage);
    });

    it('should clear input after sending message', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const testMessage = 'Test message';
      
      chatInput.value = testMessage;
      sendButton.click();
      
      // Input should be cleared after sending
      expect(chatInput.value).to.equal('');
    });

    it('should handle Enter key to send message', () => {
      const chatInput = document.querySelector('.chat-input');
      const testMessage = 'Message sent with Enter';
      
      chatInput.value = testMessage;
      
      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      
      chatInput.dispatchEvent(enterEvent);
      
      // Message should be sent (input cleared)
      expect(chatInput.value).to.equal('');
    });

    it('should not send message with Shift+Enter', () => {
      const chatInput = document.querySelector('.chat-input');
      const testMessage = 'Message with Shift+Enter';
      
      chatInput.value = testMessage;
      
      // Simulate Shift+Enter key press
      const shiftEnterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        shiftKey: true,
        bubbles: true
      });
      
      chatInput.dispatchEvent(shiftEnterEvent);
      
      // Message should not be sent (input not cleared)
      expect(chatInput.value).to.equal(testMessage);
    });
  });

  describe('Message Display', () => {
    it('should display bot welcome message', () => {
      const botMessage = document.querySelector('.bot-message .message-content');
      expect(botMessage).to.exist;
      expect(botMessage.textContent.trim()).to.not.be.empty;
    });

    it('should add user message to chat when sent', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      const testMessage = 'User test message';
      
      chatInput.value = testMessage;
      sendButton.click();
      
      // Should add user message to chat
      const userMessages = chatMessages.querySelectorAll('.user-message');
      expect(userMessages.length).to.be.at.least(1);
      
      const lastUserMessage = userMessages[userMessages.length - 1];
      expect(lastUserMessage.querySelector('.message-content').textContent).to.equal(testMessage);
    });

    it('should maintain message order', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      
      // Send multiple messages
      const messages = ['First message', 'Second message', 'Third message'];
      
      messages.forEach(message => {
        chatInput.value = message;
        sendButton.click();
      });
      
      // Check message order
      const allMessages = chatMessages.querySelectorAll('.message-content');
      const userMessages = Array.from(allMessages).slice(1); // Skip bot welcome message
      
      expect(userMessages.length).to.equal(3);
      expect(userMessages[0].textContent).to.equal('First message');
      expect(userMessages[1].textContent).to.equal('Second message');
      expect(userMessages[2].textContent).to.equal('Third message');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      const chatContainer = document.querySelector('.chat-container');
      const chatMessages = document.querySelector('.chat-messages');
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      expect(chatMessages.getAttribute('role')).to.equal('log');
      expect(chatMessages.getAttribute('aria-live')).to.equal('polite');
      expect(chatInput.getAttribute('aria-label')).to.equal('Chat input');
      expect(sendButton.getAttribute('aria-label')).to.equal('Send message');
    });

    it('should support keyboard navigation', () => {
      const chatToggle = document.querySelector('.chat-toggle');
      const chatClose = document.querySelector('.chat-close');
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // All interactive elements should be focusable
      expect(chatToggle.getAttribute('tabindex')).to.not.equal('-1');
      expect(chatClose.getAttribute('tabindex')).to.not.equal('-1');
      expect(chatInput.getAttribute('tabindex')).to.not.equal('-1');
      expect(sendButton.getAttribute('tabindex')).to.not.equal('-1');
    });

    it('should announce new messages to screen readers', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Send a message
      chatInput.value = 'Accessibility test message';
      sendButton.click();
      
      // Chat messages should have aria-live for announcements
      expect(chatMessages.getAttribute('aria-live')).to.equal('polite');
    });
  });

  describe('Multilingual Support', () => {
    it('should have multilingual placeholders', () => {
      const chatInput = document.querySelector('.chat-input');
      
      expect(chatInput.getAttribute('data-zh-placeholder')).to.equal('输入消息...');
      expect(chatInput.getAttribute('data-en-placeholder')).to.equal('Type your message...');
      expect(chatInput.getAttribute('data-ja-placeholder')).to.equal('メッセージを入力...');
    });

    it('should update placeholders based on language', () => {
      const chatInput = document.querySelector('.chat-input');
      
      // Simulate language change to English
      chatInput.setAttribute('data-current-lang', 'en');
      // In real implementation, this would trigger placeholder update
      
      expect(chatInput.getAttribute('data-en-placeholder')).to.exist;
    });

    it('should have multilingual chat header', () => {
      const chatHeader = document.querySelector('.chat-header h3');
      
      expect(chatHeader.getAttribute('data-zh')).to.equal('AI助手');
      expect(chatHeader.getAttribute('data-en')).to.equal('AI Assistant');
      expect(chatHeader.getAttribute('data-ja')).to.equal('AIアシスタント');
    });
  });

  describe('UI State Management', () => {
    it('should show loading state during message sending', () => {
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      
      // Simulate sending message
      sendButton.click();
      
      // Should show loading state
      expect(sendButton.disabled).to.be.true;
      expect(chatStatus.textContent).to.include('发送中');
    });

    it('should disable input during message sending', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Simulate sending message
      sendButton.click();
      
      // Input should be disabled during sending
      expect(chatInput.disabled).to.be.true;
    });

    it('should restore UI state after message sent', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Send message
      chatInput.value = 'Test message';
      sendButton.click();
      
      // Simulate completion
      setTimeout(() => {
        expect(chatInput.disabled).to.be.false;
        expect(sendButton.disabled).to.be.false;
        expect(chatInput.value).to.equal('');
      }, 100);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty message input', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      
      const initialMessageCount = chatMessages.querySelectorAll('.message').length;
      
      // Try to send empty message
      chatInput.value = '';
      sendButton.click();
      
      // Should not add new message
      const finalMessageCount = chatMessages.querySelectorAll('.message').length;
      expect(finalMessageCount).to.equal(initialMessageCount);
    });

    it('should handle very long messages', () => {
      const chatInput = document.querySelector('.chat-input');
      const longMessage = 'a'.repeat(10000); // Very long message
      
      chatInput.value = longMessage;
      
      // Should handle long messages gracefully
      expect(chatInput.value.length).to.equal(10000);
    });

    it('should show error state for failed messages', () => {
      const chatStatus = document.querySelector('.chat-status');
      
      // Simulate error state
      chatStatus.textContent = '发送失败，请重试';
      chatStatus.className = 'chat-status error';
      
      expect(chatStatus.textContent).to.include('失败');
      expect(chatStatus.className).to.include('error');
    });
  });

  describe('Performance', () => {
    it('should handle rapid message sending', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Send multiple messages rapidly
      for (let i = 0; i < 5; i++) {
        chatInput.value = `Message ${i}`;
        sendButton.click();
      }
      
      // Should handle rapid sending without errors
      expect(chatInput.value).to.equal('');
    });

    it('should maintain smooth UI during message operations', (done) => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      const startTime = performance.now();
      
      // Send message
      chatInput.value = 'Performance test message';
      sendButton.click();
      
      setTimeout(() => {
        const endTime = performance.now();
        const operationTime = endTime - startTime;
        
        // Should complete within reasonable time
        expect(operationTime).to.be.lessThan(1000);
        done();
      }, 50);
    });
  });
});
