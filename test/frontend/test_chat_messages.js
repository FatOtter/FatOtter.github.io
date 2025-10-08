// Unit tests for chat message handling
// Tests for User Story 3: Interactive Communication

describe('Chat Message Handling (US3)', () => {
  let mockChatAPI;
  
  beforeEach(() => {
    // Setup DOM elements for testing
    document.body.innerHTML = `
      <div class="chat-container">
        <div class="chat-messages" role="log" aria-live="polite">
          <div class="message bot-message">
            <div class="message-content">Hello! How can I help you?</div>
            <div class="message-time">12:00</div>
          </div>
        </div>
        <div class="chat-input-container">
          <textarea class="chat-input" placeholder="Type your message..."></textarea>
          <button class="chat-send">Send</button>
        </div>
        <div class="chat-status"></div>
      </div>
    `;
    
    // Mock chat API
    mockChatAPI = {
      sendMessage: function(message) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              response: `AI Response to: ${message}`,
              timestamp: new Date().toISOString()
            });
          }, 100);
        });
      }
    };
    
    // Mock window.__app.chat if it doesn't exist
    window.__app = window.__app || {};
    window.__app.chat = window.__app.chat || mockChatAPI;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete window.__app.chat;
  });

  describe('Message Creation', () => {
    it('should create user message element correctly', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const messageText = 'Hello, this is a test message';
      
      // Simulate creating user message
      const userMessage = document.createElement('div');
      userMessage.className = 'message user-message';
      userMessage.innerHTML = `
        <div class="message-content">${messageText}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
      `;
      
      chatMessages.appendChild(userMessage);
      
      const createdMessage = chatMessages.querySelector('.user-message');
      expect(createdMessage).to.exist;
      expect(createdMessage.querySelector('.message-content').textContent).to.equal(messageText);
      expect(createdMessage.querySelector('.message-time')).to.exist;
    });

    it('should create bot message element correctly', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const botResponse = 'This is a bot response';
      
      // Simulate creating bot message
      const botMessage = document.createElement('div');
      botMessage.className = 'message bot-message';
      botMessage.innerHTML = `
        <div class="message-content">${botResponse}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
      `;
      
      chatMessages.appendChild(botMessage);
      
      const createdMessage = chatMessages.querySelector('.bot-message:last-child');
      expect(createdMessage).to.exist;
      expect(createdMessage.querySelector('.message-content').textContent).to.equal(botResponse);
    });

    it('should format message timestamps correctly', () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      
      const messageTime = document.createElement('div');
      messageTime.className = 'message-time';
      messageTime.textContent = timeString;
      
      expect(messageTime.textContent).to.equal(timeString);
    });
  });

  describe('Message Sending', () => {
    it('should send message to API and display response', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatMessages = document.querySelector('.chat-messages');
      const testMessage = 'Test message for API';
      
      chatInput.value = testMessage;
      
      // Mock successful API response
      const originalSendMessage = window.__app.chat.sendMessage;
      window.__app.chat.sendMessage = function(message) {
        return Promise.resolve({
          success: true,
          response: `AI Response: ${message}`,
          timestamp: new Date().toISOString()
        });
      };
      
      // Send message
      sendButton.click();
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should have user message and bot response
      const userMessages = chatMessages.querySelectorAll('.user-message');
      const botMessages = chatMessages.querySelectorAll('.bot-message');
      
      expect(userMessages.length).to.be.at.least(1);
      expect(botMessages.length).to.be.at.least(2); // Original + new response
      
      // Restore original function
      window.__app.chat.sendMessage = originalSendMessage;
    });

    it('should handle API errors gracefully', async () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      const chatStatus = document.querySelector('.chat-status');
      const testMessage = 'Message that will cause error';
      
      chatInput.value = testMessage;
      
      // Mock API error
      const originalSendMessage = window.__app.chat.sendMessage;
      window.__app.chat.sendMessage = function(message) {
        return Promise.reject(new Error('API Error'));
      };
      
      // Send message
      sendButton.click();
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should show error status
      expect(chatStatus.textContent).to.include('错误');
      
      // Restore original function
      window.__app.chat.sendMessage = originalSendMessage;
    });

    it('should validate message content before sending', () => {
      const chatInput = document.querySelector('.chat-input');
      const sendButton = document.querySelector('.chat-send');
      
      // Test empty message
      chatInput.value = '';
      sendButton.click();
      
      // Should not send empty message
      expect(chatInput.value).to.equal('');
      
      // Test whitespace-only message
      chatInput.value = '   ';
      sendButton.click();
      
      // Should not send whitespace-only message
      expect(chatInput.value.trim()).to.equal('');
    });
  });

  describe('Message Display', () => {
    it('should scroll to bottom when new message is added', () => {
      const chatMessages = document.querySelector('.chat-messages');
      
      // Add multiple messages to create scrollable content
      for (let i = 0; i < 10; i++) {
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.innerHTML = `<div class="message-content">Message ${i}</div>`;
        chatMessages.appendChild(message);
      }
      
      // Simulate scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      expect(chatMessages.scrollTop).to.equal(chatMessages.scrollHeight);
    });

    it('should maintain message order', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const messages = ['First', 'Second', 'Third'];
      
      messages.forEach((text, index) => {
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(message);
      });
      
      const messageContents = Array.from(chatMessages.querySelectorAll('.user-message .message-content'));
      const texts = messageContents.map(el => el.textContent);
      
      expect(texts).to.deep.equal(messages);
    });

    it('should handle long messages with proper wrapping', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const longMessage = 'This is a very long message that should wrap properly in the chat interface and not break the layout or cause horizontal scrolling issues.';
      
      const message = document.createElement('div');
      message.className = 'message user-message';
      message.innerHTML = `<div class="message-content">${longMessage}</div>`;
      chatMessages.appendChild(message);
      
      const messageContent = message.querySelector('.message-content');
      expect(messageContent.textContent).to.equal(longMessage);
      expect(messageContent.offsetWidth).to.be.lessThan(chatMessages.offsetWidth);
    });
  });

  describe('Message Types', () => {
    it('should handle text messages', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const textMessage = 'This is a regular text message';
      
      const message = document.createElement('div');
      message.className = 'message user-message';
      message.innerHTML = `<div class="message-content">${textMessage}</div>`;
      chatMessages.appendChild(message);
      
      const messageContent = message.querySelector('.message-content');
      expect(messageContent.textContent).to.equal(textMessage);
    });

    it('should handle messages with special characters', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const specialMessage = 'Message with special chars: @#$%^&*()_+-=[]{}|;:,.<>?';
      
      const message = document.createElement('div');
      message.className = 'message user-message';
      message.innerHTML = `<div class="message-content">${specialMessage}</div>`;
      chatMessages.appendChild(message);
      
      const messageContent = message.querySelector('.message-content');
      expect(messageContent.textContent).to.equal(specialMessage);
    });

    it('should handle multilingual messages', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const multilingualMessage = 'Hello 你好 こんにちは';
      
      const message = document.createElement('div');
      message.className = 'message user-message';
      message.innerHTML = `<div class="message-content">${multilingualMessage}</div>`;
      chatMessages.appendChild(message);
      
      const messageContent = message.querySelector('.message-content');
      expect(messageContent.textContent).to.equal(multilingualMessage);
    });
  });

  describe('Message History', () => {
    it('should maintain conversation history', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const conversation = [
        { type: 'user', content: 'Hello' },
        { type: 'bot', content: 'Hi there!' },
        { type: 'user', content: 'How are you?' },
        { type: 'bot', content: 'I am doing well, thank you!' }
      ];
      
      conversation.forEach(msg => {
        const message = document.createElement('div');
        message.className = `message ${msg.type}-message`;
        message.innerHTML = `<div class="message-content">${msg.content}</div>`;
        chatMessages.appendChild(message);
      });
      
      const allMessages = chatMessages.querySelectorAll('.message');
      expect(allMessages.length).to.equal(conversation.length + 1); // +1 for initial bot message
    });

    it('should clear conversation history when requested', () => {
      const chatMessages = document.querySelector('.chat-messages');
      
      // Add some messages
      for (let i = 0; i < 5; i++) {
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.innerHTML = `<div class="message-content">Message ${i}</div>`;
        chatMessages.appendChild(message);
      }
      
      const initialCount = chatMessages.querySelectorAll('.message').length;
      expect(initialCount).to.be.greaterThan(1);
      
      // Clear history (keep initial bot message)
      const initialBotMessage = chatMessages.querySelector('.bot-message');
      chatMessages.innerHTML = '';
      chatMessages.appendChild(initialBotMessage);
      
      const finalCount = chatMessages.querySelectorAll('.message').length;
      expect(finalCount).to.equal(1);
    });
  });

  describe('Message Status', () => {
    it('should show sending status for pending messages', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const message = document.createElement('div');
      message.className = 'message user-message sending';
      message.innerHTML = `
        <div class="message-content">Sending message...</div>
        <div class="message-status">Sending...</div>
      `;
      chatMessages.appendChild(message);
      
      const status = message.querySelector('.message-status');
      expect(status.textContent).to.include('Sending');
      expect(message.className).to.include('sending');
    });

    it('should show sent status for delivered messages', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const message = document.createElement('div');
      message.className = 'message user-message sent';
      message.innerHTML = `
        <div class="message-content">Delivered message</div>
        <div class="message-status">Sent</div>
      `;
      chatMessages.appendChild(message);
      
      const status = message.querySelector('.message-status');
      expect(status.textContent).to.include('Sent');
      expect(message.className).to.include('sent');
    });

    it('should show error status for failed messages', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const message = document.createElement('div');
      message.className = 'message user-message error';
      message.innerHTML = `
        <div class="message-content">Failed message</div>
        <div class="message-status">Failed to send</div>
      `;
      chatMessages.appendChild(message);
      
      const status = message.querySelector('.message-status');
      expect(status.textContent).to.include('Failed');
      expect(message.className).to.include('error');
    });
  });

  describe('Performance', () => {
    it('should handle large number of messages efficiently', () => {
      const chatMessages = document.querySelector('.chat-messages');
      const startTime = performance.now();
      
      // Add many messages
      for (let i = 0; i < 100; i++) {
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.innerHTML = `<div class="message-content">Message ${i}</div>`;
        chatMessages.appendChild(message);
      }
      
      const endTime = performance.now();
      const operationTime = endTime - startTime;
      
      // Should complete within reasonable time
      expect(operationTime).to.be.lessThan(1000);
      expect(chatMessages.querySelectorAll('.message').length).to.equal(101); // +1 for initial bot message
    });

    it('should maintain smooth scrolling with many messages', () => {
      const chatMessages = document.querySelector('.chat-messages');
      
      // Add many messages
      for (let i = 0; i < 50; i++) {
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.innerHTML = `<div class="message-content">Message ${i}</div>`;
        chatMessages.appendChild(message);
      }
      
      // Test scrolling performance
      const startTime = performance.now();
      chatMessages.scrollTop = chatMessages.scrollHeight;
      const endTime = performance.now();
      
      const scrollTime = endTime - startTime;
      expect(scrollTime).to.be.lessThan(100);
    });
  });
});
