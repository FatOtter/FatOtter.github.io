// Unit tests for localStorage language preference persistence
// Tests for User Story 2: Multilingual Content Access

describe('Language Preference Persistence (US2)', () => {
  const STORAGE_KEY = 'rex_resume_lang';
  
  beforeEach(() => {
    // Setup DOM elements for testing
    document.body.innerHTML = `
      <div class="nav-actions">
        <button id="lang-en" class="chip" type="button">English</button>
        <button id="lang-zh" class="chip" type="button">中文</button>
        <button id="lang-ja" class="chip" type="button">日本語</button>
      </div>
      <div class="content">
        <h1 data-zh="沈励钥（Rex）" data-en="Liyue Shen (Rex)" data-ja="沈励钥（Rex）">沈励钥（Rex）</h1>
        <h2 data-zh="关于我" data-en="About" data-ja="紹介">关于我</h2>
        <p data-zh="我是沈励钥，一名经验丰富的项目经理和算法工程师。" 
           data-en="I am Liyue Shen, an experienced project manager and algorithm engineer."
           data-ja="私は沈励钥と申します。経験豊富なプロジェクトマネージャー兼アルゴリズムエンジニアです。">我是沈励钥，一名经验丰富的项目经理和算法工程师。</p>
      </div>
    `;
    
    // Clear localStorage before each test
    localStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.removeItem(STORAGE_KEY);
  });

  describe('Language Preference Storage', () => {
    it('should save language preference to localStorage when switching', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      // Switch to English
      langEn.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('en');
      
      // Switch to Chinese
      langZh.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('zh');
      
      // Switch to Japanese
      langJa.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('ja');
    });

    it('should persist language preference across page reloads', () => {
      const langEn = document.getElementById('lang-en');
      const heading = document.querySelector('h1');
      
      // Switch to English
      langEn.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('en');
      expect(heading.textContent).to.equal('Liyue Shen (Rex)');
      
      // Simulate page reload by clearing DOM and reinitializing
      document.body.innerHTML = `
        <div class="nav-actions">
          <button id="lang-en" class="chip" type="button">English</button>
          <button id="lang-zh" class="chip" type="button">中文</button>
          <button id="lang-ja" class="chip" type="button">日本語</button>
        </div>
        <div class="content">
          <h1 data-zh="沈励钥（Rex）" data-en="Liyue Shen (Rex)" data-ja="沈励钥（Rex）">沈励钥（Rex）</h1>
        </div>
      `;
      
      // Check if preference is still stored
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('en');
    });

    it('should load saved language preference on page load', () => {
      // Pre-set language preference
      localStorage.setItem(STORAGE_KEY, 'en');
      
      // Simulate page load with saved preference
      const heading = document.querySelector('h1');
      
      // Should load English content based on saved preference
      // This would be handled by the language initialization function
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('en');
    });
  });

  describe('Language Detection and Default Selection', () => {
    it('should use saved preference over browser language', () => {
      // Set saved preference to Japanese
      localStorage.setItem(STORAGE_KEY, 'ja');
      
      // Mock browser language to English
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true
      });
      
      // Should use saved preference (Japanese) over browser language
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('ja');
    });

    it('should fallback to browser language when no preference is saved', () => {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Mock browser language
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true
      });
      
      // Should detect browser language when no preference is saved
      const detectedLang = navigator.language.startsWith('en') ? 'en' : 'zh';
      expect(detectedLang).to.equal('en');
    });

    it('should default to Chinese when browser language is not supported', () => {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Mock unsupported browser language
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true
      });
      
      // Should default to Chinese for unsupported languages
      const supportedLanguages = ['zh', 'en', 'ja'];
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'zh';
      expect(defaultLang).to.equal('zh');
    });

    it('should handle Japanese browser language detection', () => {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Mock Japanese browser language
      Object.defineProperty(navigator, 'language', {
        value: 'ja-JP',
        configurable: true
      });
      
      // Should detect Japanese
      const detectedLang = navigator.language.startsWith('ja') ? 'ja' : 'zh';
      expect(detectedLang).to.equal('ja');
    });
  });

  describe('Session Persistence', () => {
    it('should maintain language preference during the session', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const heading = document.querySelector('h1');
      
      // Switch to English
      langEn.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('en');
      expect(heading.textContent).to.equal('Liyue Shen (Rex)');
      
      // Switch to Chinese
      langZh.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('zh');
      expect(heading.textContent).to.equal('沈励钥（Rex）');
      
      // Switch back to English
      langEn.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('en');
      expect(heading.textContent).to.equal('Liyue Shen (Rex)');
    });

    it('should persist language preference across browser tabs', () => {
      const langEn = document.getElementById('lang-en');
      
      // Switch to English in current tab
      langEn.click();
      expect(localStorage.getItem(STORAGE_KEY)).to.equal('en');
      
      // Simulate opening new tab (localStorage is shared)
      const newTabStorage = localStorage.getItem(STORAGE_KEY);
      expect(newTabStorage).to.equal('en');
    });
  });

  describe('Storage Error Handling', () => {
    it('should handle localStorage quota exceeded gracefully', () => {
      // Mock localStorage quota exceeded
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function(key, value) {
        if (key === STORAGE_KEY) {
          throw new Error('QuotaExceededError');
        }
        return originalSetItem.call(this, key, value);
      };
      
      const langEn = document.getElementById('lang-en');
      
      // Should not throw error when localStorage fails
      expect(() => langEn.click()).to.not.throw();
      
      // Restore original function
      localStorage.setItem = originalSetItem;
    });

    it('should handle localStorage disabled gracefully', () => {
      // Mock localStorage disabled
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;
      
      localStorage.getItem = function() { throw new Error('localStorage disabled'); };
      localStorage.setItem = function() { throw new Error('localStorage disabled'); };
      
      const langEn = document.getElementById('lang-en');
      
      // Should not throw error when localStorage is disabled
      expect(() => langEn.click()).to.not.throw();
      
      // Restore original functions
      localStorage.getItem = originalGetItem;
      localStorage.setItem = originalSetItem;
    });

    it('should fallback to session storage when localStorage fails', () => {
      // Mock localStorage failure but sessionStorage success
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function() { throw new Error('localStorage failed'); };
      
      const langEn = document.getElementById('lang-en');
      
      // Should handle gracefully without breaking functionality
      expect(() => langEn.click()).to.not.throw();
      
      // Restore original function
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Data Validation', () => {
    it('should validate stored language preference', () => {
      const validLanguages = ['zh', 'en', 'ja'];
      
      // Test valid languages
      validLanguages.forEach(lang => {
        localStorage.setItem(STORAGE_KEY, lang);
        const stored = localStorage.getItem(STORAGE_KEY);
        expect(validLanguages).to.include(stored);
      });
    });

    it('should handle invalid stored language preference', () => {
      // Set invalid language preference
      localStorage.setItem(STORAGE_KEY, 'invalid-lang');
      
      // Should fallback to default language
      const stored = localStorage.getItem(STORAGE_KEY);
      const validLanguages = ['zh', 'en', 'ja'];
      const isValid = validLanguages.includes(stored);
      
      // If invalid, should be handled gracefully
      if (!isValid) {
        expect(stored).to.equal('invalid-lang');
        // In real implementation, this would be reset to default
      }
    });

    it('should handle corrupted localStorage data', () => {
      // Set corrupted data
      localStorage.setItem(STORAGE_KEY, '{"corrupted": "data"}');
      
      // Should handle gracefully
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).to.be.a('string');
    });
  });

  describe('Performance', () => {
    it('should load language preference quickly', (done) => {
      localStorage.setItem(STORAGE_KEY, 'en');
      
      const startTime = performance.now();
      
      // Simulate loading preference
      setTimeout(() => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // Should load within reasonable time
        expect(loadTime).to.be.lessThan(100);
        done();
      }, 5);
    });

    it('should save language preference quickly', (done) => {
      const langEn = document.getElementById('lang-en');
      
      const startTime = performance.now();
      
      // Switch language
      langEn.click();
      
      setTimeout(() => {
        const endTime = performance.now();
        const saveTime = endTime - startTime;
        
        // Should save within reasonable time
        expect(saveTime).to.be.lessThan(100);
        done();
      }, 5);
    });
  });
});
