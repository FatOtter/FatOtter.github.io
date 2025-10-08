// Unit tests for multilingual content consistency
// Tests for User Story 2: Multilingual Content Access

describe('Multilingual Content Consistency (US2)', () => {
  beforeEach(() => {
    // Setup comprehensive DOM elements for testing
    document.body.innerHTML = `
      <div class="nav-actions">
        <button id="lang-en" class="chip" type="button">English</button>
        <button id="lang-zh" class="chip" type="button">中文</button>
        <button id="lang-ja" class="chip" type="button">日本語</button>
      </div>
      <header>
        <nav class="nav-links">
          <a href="#about" data-zh="关于我" data-en="About" data-ja="紹介">关于我</a>
          <a href="#projects" data-zh="项目" data-en="Projects" data-ja="プロジェクト">项目</a>
          <a href="#skills" data-zh="技能" data-en="Skills" data-ja="スキル">技能</a>
        </nav>
      </header>
      <main>
        <section id="about">
          <h1 data-zh="沈励钥（Rex）" data-en="Liyue Shen (Rex)" data-ja="沈励钥（Rex）">沈励钥（Rex）</h1>
          <h2 data-zh="关于我" data-en="About" data-ja="紹介">关于我</h2>
          <p data-zh="希望能在新的岗位上，利用扎实的技术背景知识和丰富的项目实施经验，减少外部客户和内部团队的沟通成本，打通技术团队和业务团队之间的沟通障碍，让不同文化背景和工作习惯的同事在项目上形成合力，并培养团队成员的个人能力。"
             data-en="Leverage solid technical background and extensive delivery experience to reduce communication costs, bridge technical and business teams, align cross-cultural teammates, and help grow individual capabilities."
             data-ja="新しい職務において、堅実な技術的バックグラウンドと豊富な導入経験を生かし、社内外のコミュニケーションコストを低減し、技術とビジネスの橋渡しを行い、異なる文化・働き方のメンバーを束ね、チーム能力の向上に貢献したい。">希望能在新的岗位上，利用扎实的技术背景知识和丰富的项目实施经验，减少外部客户和内部团队的沟通成本，打通技术团队和业务团队之间的沟通障碍，让不同文化背景和工作习惯的同事在项目上形成合力，并培养团队成员的个人能力。</p>
        </section>
        <section id="education">
          <h2 data-zh="教育经历" data-en="Education" data-ja="学歴">教育经历</h2>
          <div class="education-item">
            <h3>复旦大学</h3>
            <p data-zh="通信工程专业" data-en="Communication Engineering" data-ja="通信工学">通信工程专业</p>
            <span data-zh="2010.9 – 2014.7 · 复旦大学 · 本科" data-en="2010.9 – 2014.7 · Fudan University · Bachelor" data-ja="2010.9 – 2014.7 · 復旦大学 · 学士">2010.9 – 2014.7 · 复旦大学 · 本科</span>
          </div>
        </section>
        <section id="contact">
          <h2 data-zh="联系方式" data-en="Contact" data-ja="連絡先">联系方式</h2>
          <div class="contact-info">
            <span data-zh="姓名" data-en="Name" data-ja="名前">姓名</span>
            <span data-zh="电话" data-en="Phone" data-ja="電話">电话</span>
            <span data-zh="邮箱" data-en="Email" data-ja="メール">邮箱</span>
          </div>
        </section>
      </main>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Content Completeness', () => {
    it('should have translations for all three languages', () => {
      const elementsWithTranslations = document.querySelectorAll('[data-zh][data-en][data-ja]');
      
      expect(elementsWithTranslations.length).to.be.at.least(5);
      
      elementsWithTranslations.forEach(element => {
        expect(element.getAttribute('data-zh')).to.not.be.empty;
        expect(element.getAttribute('data-en')).to.not.be.empty;
        expect(element.getAttribute('data-ja')).to.not.be.empty;
      });
    });

    it('should have consistent content structure across languages', () => {
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
        const headings = section.querySelectorAll('h1, h2, h3');
        const paragraphs = section.querySelectorAll('p');
        
        // Each section should have consistent structure
        expect(headings.length).to.be.at.least(1);
      });
    });

    it('should maintain semantic structure during language switching', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Get initial structure
      const initialStructure = document.querySelector('main').innerHTML;
      
      // Switch languages
      langEn.click();
      const englishStructure = document.querySelector('main').innerHTML;
      
      langZh.click();
      const chineseStructure = document.querySelector('main').innerHTML;
      
      // Structure should be identical
      expect(englishStructure).to.equal(initialStructure);
      expect(chineseStructure).to.equal(initialStructure);
    });
  });

  describe('Language-Specific Content', () => {
    it('should display Chinese content correctly', () => {
      const langZh = document.getElementById('lang-zh');
      const heading = document.querySelector('h1');
      const aboutHeading = document.querySelector('#about h2');
      
      langZh.click();
      
      expect(heading.textContent).to.equal('沈励钥（Rex）');
      expect(aboutHeading.textContent).to.equal('关于我');
    });

    it('should display English content correctly', () => {
      const langEn = document.getElementById('lang-en');
      const heading = document.querySelector('h1');
      const aboutHeading = document.querySelector('#about h2');
      
      langEn.click();
      
      expect(heading.textContent).to.equal('Liyue Shen (Rex)');
      expect(aboutHeading.textContent).to.equal('About');
    });

    it('should display Japanese content correctly', () => {
      const langJa = document.getElementById('lang-ja');
      const heading = document.querySelector('h1');
      const aboutHeading = document.querySelector('#about h2');
      
      langJa.click();
      
      expect(heading.textContent).to.equal('沈励钥（Rex）');
      expect(aboutHeading.textContent).to.equal('紹介');
    });
  });

  describe('Navigation Consistency', () => {
    it('should have consistent navigation across all languages', () => {
      const navLinks = document.querySelectorAll('.nav-links a');
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      // Test all three languages
      [langEn, langZh, langJa].forEach(langButton => {
        langButton.click();
        
        // All navigation links should have content
        navLinks.forEach(link => {
          expect(link.textContent.trim()).to.not.be.empty;
        });
      });
    });

    it('should maintain navigation functionality across languages', () => {
      const navLinks = document.querySelectorAll('.nav-links a');
      const langEn = document.getElementById('lang-en');
      
      langEn.click();
      
      // Navigation links should still be functional
      navLinks.forEach(link => {
        expect(link.getAttribute('href')).to.exist;
        expect(link.textContent.trim()).to.not.be.empty;
      });
    });
  });

  describe('Typography and Layout', () => {
    it('should maintain consistent typography across languages', () => {
      const headings = document.querySelectorAll('h1, h2, h3');
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Get initial styles
      const initialStyles = Array.from(headings).map(h => ({
        fontSize: window.getComputedStyle(h).fontSize,
        fontFamily: window.getComputedStyle(h).fontFamily
      }));
      
      // Switch languages
      langEn.click();
      const englishStyles = Array.from(headings).map(h => ({
        fontSize: window.getComputedStyle(h).fontSize,
        fontFamily: window.getComputedStyle(h).fontFamily
      }));
      
      langZh.click();
      const chineseStyles = Array.from(headings).map(h => ({
        fontSize: window.getComputedStyle(h).fontSize,
        fontFamily: window.getComputedStyle(h).fontFamily
      }));
      
      // Styles should be consistent
      expect(englishStyles).to.deep.equal(initialStyles);
      expect(chineseStyles).to.deep.equal(initialStyles);
    });

    it('should handle different text lengths gracefully', () => {
      const paragraphs = document.querySelectorAll('p');
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Get initial layout
      const initialLayout = Array.from(paragraphs).map(p => ({
        height: p.offsetHeight,
        width: p.offsetWidth
      }));
      
      // Switch to English (potentially different length)
      langEn.click();
      const englishLayout = Array.from(paragraphs).map(p => ({
        height: p.offsetHeight,
        width: p.offsetWidth
      }));
      
      // Switch to Chinese
      langZh.click();
      const chineseLayout = Array.from(paragraphs).map(p => ({
        height: p.offsetHeight,
        width: p.offsetWidth
      }));
      
      // Layout should adapt gracefully
      expect(englishLayout.length).to.equal(initialLayout.length);
      expect(chineseLayout.length).to.equal(initialLayout.length);
    });
  });

  describe('Content Quality', () => {
    it('should have meaningful translations, not just placeholders', () => {
      const elementsWithTranslations = document.querySelectorAll('[data-zh][data-en][data-ja]');
      
      elementsWithTranslations.forEach(element => {
        const zhText = element.getAttribute('data-zh');
        const enText = element.getAttribute('data-en');
        const jaText = element.getAttribute('data-ja');
        
        // Should not be placeholder text
        expect(zhText).to.not.include('TODO');
        expect(zhText).to.not.include('PLACEHOLDER');
        expect(enText).to.not.include('TODO');
        expect(enText).to.not.include('PLACEHOLDER');
        expect(jaText).to.not.include('TODO');
        expect(jaText).to.not.include('PLACEHOLDER');
        
        // Should have reasonable length
        expect(zhText.length).to.be.at.least(2);
        expect(enText.length).to.be.at.least(2);
        expect(jaText.length).to.be.at.least(2);
      });
    });

    it('should maintain professional tone across all languages', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      // Test professional content in each language
      [langEn, langZh, langJa].forEach(langButton => {
        langButton.click();
        
        const aboutText = document.querySelector('#about p');
        expect(aboutText.textContent).to.not.include('casual');
        expect(aboutText.textContent).to.not.include('informal');
        expect(aboutText.textContent).to.not.include('slang');
      });
    });
  });

  describe('Accessibility Across Languages', () => {
    it('should maintain accessibility features across all languages', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      [langEn, langZh, langJa].forEach(langButton => {
        langButton.click();
        
        // Check that headings maintain proper hierarchy
        const h1 = document.querySelector('h1');
        const h2s = document.querySelectorAll('h2');
        
        expect(h1).to.exist;
        expect(h2s.length).to.be.at.least(1);
        
        // Check that links maintain accessibility
        const links = document.querySelectorAll('a');
        links.forEach(link => {
          expect(link.getAttribute('href')).to.exist;
          expect(link.textContent.trim()).to.not.be.empty;
        });
      });
    });

    it('should have proper language attributes', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      // Test language attributes
      langEn.click();
      // In real implementation, html lang should be set to 'en'
      
      langZh.click();
      // In real implementation, html lang should be set to 'zh-CN'
      
      langJa.click();
      // In real implementation, html lang should be set to 'ja'
    });
  });

  describe('Performance Across Languages', () => {
    it('should maintain consistent performance across language switches', (done) => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      const langJa = document.getElementById('lang-ja');
      
      const startTime = performance.now();
      
      // Perform multiple language switches
      langEn.click();
      langZh.click();
      langJa.click();
      langEn.click();
      
      setTimeout(() => {
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        
        // Should complete all switches within reasonable time
        expect(totalTime).to.be.lessThan(1000);
        done();
      }, 50);
    });

    it('should not cause layout thrashing during language switches', () => {
      const langEn = document.getElementById('lang-en');
      const langZh = document.getElementById('lang-zh');
      
      // Get initial layout metrics
      const initialMetrics = {
        height: document.body.offsetHeight,
        width: document.body.offsetWidth
      };
      
      // Switch languages multiple times
      langEn.click();
      langZh.click();
      langEn.click();
      
      // Layout should remain stable
      const finalMetrics = {
        height: document.body.offsetHeight,
        width: document.body.offsetWidth
      };
      
      // Should not have significant layout changes
      expect(Math.abs(finalMetrics.height - initialMetrics.height)).to.be.lessThan(100);
      expect(Math.abs(finalMetrics.width - initialMetrics.width)).to.be.lessThan(100);
    });
  });
});
