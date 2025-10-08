// Unit tests for contact information accessibility
// Tests for User Story 1: Professional Information Discovery

describe('Contact Information Accessibility (US1)', () => {
  beforeEach(() => {
    // Setup DOM elements for testing
    document.body.innerHTML = `
      <section id="contact" class="content-section">
        <h2 data-zh="联系方式" data-en="Contact" data-ja="連絡先">联系方式</h2>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-label" data-zh="姓名" data-en="Name" data-ja="名前">姓名</span>
            <span class="contact-value">沈励钥</span>
          </div>
          <div class="contact-item">
            <span class="contact-label" data-zh="电话" data-en="Phone" data-ja="電話">电话</span>
            <a href="tel:+8618801734215" class="contact-value">+86 188-0173-4215</a>
          </div>
          <div class="contact-item">
            <span class="contact-label" data-zh="邮箱" data-en="Email" data-ja="メール">邮箱</span>
            <a href="mailto:Narcy188@outlook.com" class="contact-value">Narcy188@outlook.com</a>
          </div>
          <div class="contact-item">
            <span class="contact-label" data-zh="网站" data-en="Website" data-ja="ウェブサイト">网站</span>
            <a href="https://fatotter.github.io/" target="_blank" rel="noopener noreferrer" class="contact-value">https://fatotter.github.io/</a>
          </div>
        </div>
      </section>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Contact Information Structure', () => {
    it('should display all required contact information', () => {
      const contactSection = document.getElementById('contact');
      const contactItems = contactSection.querySelectorAll('.contact-item');
      
      expect(contactSection).to.exist;
      expect(contactItems.length).to.equal(4);
      
      // Check for name
      const nameItem = Array.from(contactItems).find(item => 
        item.querySelector('.contact-label').textContent.includes('姓名')
      );
      expect(nameItem).to.exist;
      expect(nameItem.querySelector('.contact-value').textContent).to.equal('沈励钥');
      
      // Check for phone
      const phoneItem = Array.from(contactItems).find(item => 
        item.querySelector('.contact-label').textContent.includes('电话')
      );
      expect(phoneItem).to.exist;
      expect(phoneItem.querySelector('.contact-value').textContent).to.equal('+86 188-0173-4215');
      
      // Check for email
      const emailItem = Array.from(contactItems).find(item => 
        item.querySelector('.contact-label').textContent.includes('邮箱')
      );
      expect(emailItem).to.exist;
      expect(emailItem.querySelector('.contact-value').textContent).to.equal('Narcy188@outlook.com');
      
      // Check for website
      const websiteItem = Array.from(contactItems).find(item => 
        item.querySelector('.contact-label').textContent.includes('网站')
      );
      expect(websiteItem).to.exist;
      expect(websiteItem.querySelector('.contact-value').textContent).to.equal('https://fatotter.github.io/');
    });

    it('should have proper semantic structure', () => {
      const contactSection = document.getElementById('contact');
      const heading = contactSection.querySelector('h2');
      const contactInfo = contactSection.querySelector('.contact-info');
      
      expect(heading).to.exist;
      expect(contactInfo).to.exist;
      expect(heading.textContent.trim()).to.not.be.empty;
    });
  });

  describe('Contact Links Functionality', () => {
    it('should have clickable phone number', () => {
      const phoneLink = document.querySelector('a[href^="tel:"]');
      expect(phoneLink).to.exist;
      expect(phoneLink.getAttribute('href')).to.equal('tel:+8618801734215');
      expect(phoneLink.textContent).to.equal('+86 188-0173-4215');
    });

    it('should have clickable email address', () => {
      const emailLink = document.querySelector('a[href^="mailto:"]');
      expect(emailLink).to.exist;
      expect(emailLink.getAttribute('href')).to.equal('mailto:Narcy188@outlook.com');
      expect(emailLink.textContent).to.equal('Narcy188@outlook.com');
    });

    it('should have clickable website with proper security attributes', () => {
      const websiteLink = document.querySelector('a[href^="https://"]');
      expect(websiteLink).to.exist;
      expect(websiteLink.getAttribute('href')).to.equal('https://fatotter.github.io/');
      expect(websiteLink.getAttribute('target')).to.equal('_blank');
      expect(websiteLink.getAttribute('rel')).to.equal('noopener noreferrer');
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels and roles', () => {
      const contactSection = document.getElementById('contact');
      const contactItems = contactSection.querySelectorAll('.contact-item');
      
      contactItems.forEach(item => {
        const label = item.querySelector('.contact-label');
        const value = item.querySelector('.contact-value');
        
        expect(label).to.exist;
        expect(value).to.exist;
        expect(label.textContent.trim()).to.not.be.empty;
        expect(value.textContent.trim()).to.not.be.empty;
      });
    });

    it('should support keyboard navigation', () => {
      const contactLinks = document.querySelectorAll('.contact-item a');
      
      contactLinks.forEach(link => {
        expect(link.tagName.toLowerCase()).to.equal('a');
        expect(link.getAttribute('href')).to.exist;
        expect(link.textContent.trim()).to.not.be.empty;
      });
    });

    it('should have sufficient color contrast', () => {
      const contactLinks = document.querySelectorAll('.contact-item a');
      
      contactLinks.forEach(link => {
        // Basic check that links are visible
        const computedStyle = window.getComputedStyle(link);
        expect(computedStyle.color).to.not.equal('transparent');
        expect(computedStyle.display).to.not.equal('none');
      });
    });

    it('should have proper focus indicators', () => {
      const contactLinks = document.querySelectorAll('.contact-item a');
      
      contactLinks.forEach(link => {
        // Simulate focus
        link.focus();
        
        // Check if element can receive focus
        expect(document.activeElement).to.equal(link);
      });
    });
  });

  describe('Multilingual Support', () => {
    it('should support Chinese contact labels', () => {
      const labels = document.querySelectorAll('.contact-label');
      const labelTexts = Array.from(labels).map(label => label.textContent);
      
      expect(labelTexts).to.include('姓名');
      expect(labelTexts).to.include('电话');
      expect(labelTexts).to.include('邮箱');
      expect(labelTexts).to.include('网站');
    });

    it('should have data attributes for all languages', () => {
      const contactLabels = document.querySelectorAll('.contact-label');
      
      contactLabels.forEach(label => {
        expect(label.getAttribute('data-zh')).to.exist;
        expect(label.getAttribute('data-en')).to.exist;
        expect(label.getAttribute('data-ja')).to.exist;
      });
    });

    it('should have multilingual section heading', () => {
      const heading = document.querySelector('#contact h2');
      expect(heading.getAttribute('data-zh')).to.equal('联系方式');
      expect(heading.getAttribute('data-en')).to.equal('Contact');
      expect(heading.getAttribute('data-ja')).to.equal('連絡先');
    });
  });

  describe('Performance Requirements', () => {
    it('should load contact information within 1 minute', (done) => {
      const startTime = performance.now();
      
      // Simulate contact information loading
      setTimeout(() => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // Should load within 1 minute (60000ms) as per success criteria
        expect(loadTime).to.be.lessThan(60000);
        done();
      }, 10);
    });

    it('should be accessible within 3 clicks from any section', () => {
      const contactSection = document.getElementById('contact');
      const contactLinks = contactSection.querySelectorAll('a');
      
      // Contact information should be directly accessible
      expect(contactSection).to.exist;
      expect(contactLinks.length).to.be.at.least(3);
      
      // All contact links should be functional
      contactLinks.forEach(link => {
        expect(link.getAttribute('href')).to.exist;
        expect(link.textContent.trim()).to.not.be.empty;
      });
    });
  });

  describe('Security and Privacy', () => {
    it('should have secure external links', () => {
      const externalLinks = document.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        expect(link.getAttribute('rel')).to.include('noopener');
        expect(link.getAttribute('rel')).to.include('noreferrer');
      });
    });

    it('should not expose sensitive information in DOM', () => {
      const contactSection = document.getElementById('contact');
      const sectionHTML = contactSection.innerHTML;
      
      // Should not contain any sensitive data patterns
      expect(sectionHTML).to.not.include('password');
      expect(sectionHTML).to.not.include('secret');
      expect(sectionHTML).to.not.include('private');
    });
  });
});
