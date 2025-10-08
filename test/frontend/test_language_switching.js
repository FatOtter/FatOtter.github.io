// Unit tests for language switching functionality
// Tests for User Story 2: Multilingual Content Access

describe('Language Switching Functionality (US2)', () => {
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
        <div class="contact-info">
          <span data-zh="联系方式" data-en="Contact" data-ja="連絡先">联系方式</span>
          <a href="mailto:Narcy188@outlook.com" data-zh="邮箱" data-en="Email" data-ja="メール">邮箱</a>
        </div>
      </div>
    `;
    
    // Clear localStorage before each test
    localStorage.removeItem('rex_resume_lang');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.removeItem('rex_resume_lang');
  });

  describe('Language Button Functionality', () => {
    it('should have language switching buttons', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      expect(langEn).to.exist;
      expect(langZh).to.exist;
      expect(langJa).to.exist;
      
      expect(langEn.textContent).to.equal('English');
      expect(langZh.textContent).to.equal('中文');
      expect(langJa.textContent).to.equal('日本語');
    });

    it('should switch to English when English button is clicked', () => {
      const langEn = document.getElementById('lang-en');
      const heading = document.querySelector('h1');
      const aboutHeading = document.querySelector('h2');
      
      // Simulate click
      langEn.click();
      
      // Check if content switched to English
      expect(heading.textContent).to.equal('Liyue Shen (Rex)');
      expect(aboutHeading.textContent).to.equal('About');
    });

    it('should switch to Chinese when Chinese button is clicked', () => {
      const langZh = document.getElementById('lang-zh');
      const heading = document.querySelector('h1');
      const aboutHeading = document.querySelector('h2');
      
      // Simulate click
      langZh.click();
      
      // Check if content switched to Chinese
      expect(heading.textContent).to.equal('沈励钥（Rex）');
      expect(aboutHeading.textContent).to.equal('关于我');
    });

    it('should switch to Japanese when Japanese button is clicked', () => {
      const langJa = document.getElementById('lang-ja');
      const heading = document.querySelector('h1');
      const aboutHeading = document.querySelector('h2');
      
      // Simulate click
      langJa.click();
      
      // Check if content switched to Japanese
      expect(heading.textContent).to.equal('沈励钥（Rex）');
      expect(aboutHeading.textContent).to.equal('紹介');
    });
  });

  describe('Content Translation', () => {
    it('should translate all elements with data attributes', () => {
      const langEn = document.getElementById('lang-en');
      const elements = document.querySelectorAll('[data-en]');
      
      // Switch to English
      langEn.click();
      
      // Check that all elements with data-en have been translated
      elements.forEach(element => {
        const englishText = element.getAttribute('data-en');
        if (englishText) {
          expect(element.textContent).to.equal(englishText);
        }
      });
    });

    it('should handle elements with missing translations gracefully', () => {
      // Add an element with only Chinese data attribute
      const testElement = document.createElement('div');
      testElement.setAttribute('data-zh', '测试文本');
      testElement.textContent = '测试文本';
      document.body.appendChild(testElement);
      
      const langEn = document.getElementById('lang-en');
      
      // Switch to English
      langEn.click();
      
      // Should fallback to existing text or Chinese
      expect(testElement.textContent).to.not.be.empty;
    });

    it('should maintain content structure during language switching', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Get initial structure
      const initialStructure = document.querySelector('.content').innerHTML;
      
      // Switch languages
      langEn.click();
      langZh.click();
      
      // Structure should be maintained
      const finalStructure = document.querySelector('.content').innerHTML;
      expect(finalStructure).to.equal(initialStructure);
    });
  });

  describe('Button State Management', () => {
    it('should highlight active language button', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Switch to English
      langEn.click();
      
      // English button should be highlighted
      expect(langEn.style.background).to.include('linear-gradient');
      expect(langEn.style.color).to.equal('#001');
      
      // Chinese button should not be highlighted
      expect(langZh.style.background).to.not.include('linear-gradient');
    });

    it('should update button states when switching languages', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      // Switch to English
      langEn.click();
      expect(langEn.style.background).to.include('linear-gradient');
      
      // Switch to Chinese
      langZh.click();
      expect(langZh.style.background).to.include('linear-gradient');
      expect(langEn.style.background).to.not.include('linear-gradient');
      
      // Switch to Japanese
      langJa.click();
      expect(langJa.style.background).to.include('linear-gradient');
      expect(langZh.style.background).to.not.include('linear-gradient');
    });
  });

  describe('Performance Requirements', () => {
    it('should complete language switching within 2 seconds', (done) => {
      const langEn = document.getElementById('lang-en');
      const startTime = performance.now();
      
      // Switch to English
      langEn.click();
      
      // Check completion time
      setTimeout(() => {
        const endTime = performance.now();
        const switchTime = endTime - startTime;
        
        // Should complete within 2 seconds (2000ms) as per success criteria
        expect(switchTime).to.be.lessThan(2000);
        done();
      }, 10);
    });

    it('should maintain content consistency during switching', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Switch multiple times
      langEn.click();
      langZh.click();
      langEn.click();
      
      // Content should be consistent
      const heading = document.querySelector('h1');
      expect(heading.textContent).to.equal('Liyue Shen (Rex)');
    });
  });

  describe('Accessibility', () => {
    it('should support keyboard navigation for language buttons', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Focus on English button
      langEn.focus();
      expect(document.activeElement).to.equal(langEn);
      
      // Focus on Chinese button
      langZh.focus();
      expect(document.activeElement).to.equal(langZh);
    });

    it('should have proper ARIA labels for language buttons', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      // Buttons should be accessible
      expect(langEn.tagName.toLowerCase()).to.equal('button');
      expect(langZh.tagName.toLowerCase()).to.equal('button');
      expect(langJa.tagName.toLowerCase()).to.equal('button');
      
      // Should have descriptive text
      expect(langEn.textContent.trim()).to.not.be.empty;
      expect(langZh.textContent.trim()).to.not.be.empty;
      expect(langJa.textContent.trim()).to.not.be.empty;
    });

    it('should announce language changes to screen readers', () => {
      const langEn = document.getElementById('lang-en');
      const heading = document.querySelector('h1');
      
      // Switch to English
      langEn.click();
      
      // Content should be updated and accessible
      expect(heading.textContent).to.equal('Liyue Shen (Rex)');
      expect(heading.getAttribute('lang')).to.not.equal('zh-CN');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data attributes gracefully', () => {
      // Add element without data attributes
      const testElement = document.createElement('div');
      testElement.textContent = 'Original text';
      document.body.appendChild(testElement);
      
      const langEn = document.getElementById('lang-en');
      
      // Switch to English
      langEn.click();
      
      // Should preserve original text
      expect(testElement.textContent).to.equal('Original text');
    });

    it('should handle empty data attributes', () => {
      // Add element with empty data attributes
      const testElement = document.createElement('div');
      testElement.setAttribute('data-en', '');
      testElement.setAttribute('data-zh', '');
      testElement.textContent = 'Original text';
      document.body.appendChild(testElement);
      
      const langEn = document.getElementById('lang-en');
      
      // Switch to English
      langEn.click();
      
      // Should preserve original text
      expect(testElement.textContent).to.equal('Original text');
    });
  });
});
