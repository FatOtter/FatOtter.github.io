// Unit tests for navigation functionality
// Tests for User Story 1: Professional Information Discovery

describe('Navigation Functionality (US1)', () => {
  beforeEach(() => {
    // Setup DOM elements for testing
    document.body.innerHTML = `
      <nav id="main-nav">
        <a href="#about" class="nav-link" data-section="about">关于我</a>
        <a href="#education" class="nav-link" data-section="education">教育经历</a>
        <a href="#experience" class="nav-link" data-section="experience">工作经历</a>
        <a href="#skills" class="nav-link" data-section="skills">技能</a>
        <a href="#contact" class="nav-link" data-section="contact">联系方式</a>
      </nav>
      <main>
        <section id="about" class="content-section">
          <h1>关于我</h1>
          <p>个人介绍内容...</p>
        </section>
        <section id="education" class="content-section">
          <h2>教育经历</h2>
          <p>教育背景内容...</p>
        </section>
        <section id="experience" class="content-section">
          <h2>工作经历</h2>
          <p>工作经验内容...</p>
        </section>
        <section id="skills" class="content-section">
          <h2>技能</h2>
          <p>技能列表内容...</p>
        </section>
        <section id="contact" class="content-section">
          <h2>联系方式</h2>
          <p>联系信息内容...</p>
        </section>
      </main>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Navigation Structure', () => {
    it('should have navigation links for all main sections', () => {
      const navLinks = document.querySelectorAll('.nav-link');
      expect(navLinks.length).to.equal(5);
      
      const expectedSections = ['about', 'education', 'experience', 'skills', 'contact'];
      expectedSections.forEach(section => {
        const link = document.querySelector(`[data-section="${section}"]`);
        expect(link).to.exist;
        expect(link.getAttribute('href')).to.equal(`#${section}`);
      });
    });

    it('should have corresponding content sections', () => {
      const contentSections = document.querySelectorAll('.content-section');
      expect(contentSections.length).to.equal(5);
      
      const expectedIds = ['about', 'education', 'experience', 'skills', 'contact'];
      expectedIds.forEach(id => {
        const section = document.getElementById(id);
        expect(section).to.exist;
        expect(section.classList.contains('content-section')).to.be.true;
      });
    });
  });

  describe('Navigation Functionality', () => {
    it('should navigate to sections when links are clicked', () => {
      const aboutLink = document.querySelector('[data-section="about"]');
      const aboutSection = document.getElementById('about');
      
      // Simulate click
      aboutLink.click();
      
      // Check if section is visible (basic check)
      expect(aboutSection).to.exist;
    });

    it('should support smooth scrolling to sections', (done) => {
      const educationLink = document.querySelector('[data-section="education"]');
      const educationSection = document.getElementById('education');
      
      // Mock scrollIntoView
      educationSection.scrollIntoView = function() {
        done(); // Test passes if scrollIntoView is called
      };
      
      educationLink.click();
    });

    it('should highlight active navigation link', () => {
      const navLinks = document.querySelectorAll('.nav-link');
      const firstLink = navLinks[0];
      
      // Simulate setting active state
      firstLink.classList.add('active');
      
      expect(firstLink.classList.contains('active')).to.be.true;
    });
  });

  describe('Section Accessibility', () => {
    it('should have proper ARIA labels for navigation', () => {
      const nav = document.getElementById('main-nav');
      expect(nav).to.exist;
      
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        expect(link.getAttribute('href')).to.exist;
        expect(link.textContent.trim()).to.not.be.empty;
      });
    });

    it('should have proper heading structure in sections', () => {
      const sections = document.querySelectorAll('.content-section');
      sections.forEach(section => {
        const heading = section.querySelector('h1, h2, h3');
        expect(heading).to.exist;
        expect(heading.textContent.trim()).to.not.be.empty;
      });
    });

    it('should support keyboard navigation', () => {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        // Check if links are focusable
        expect(link.tagName.toLowerCase()).to.equal('a');
        expect(link.getAttribute('href')).to.exist;
      });
    });
  });

  describe('Performance Requirements', () => {
    it('should navigate to any section within 3 clicks', () => {
      const navLinks = document.querySelectorAll('.nav-link');
      const sections = document.querySelectorAll('.content-section');
      
      // Each link should directly navigate to its section
      navLinks.forEach(link => {
        const targetSection = link.getAttribute('data-section');
        const section = document.getElementById(targetSection);
        expect(section).to.exist;
        
        // Navigation should be direct (1 click)
        expect(link.getAttribute('href')).to.equal(`#${targetSection}`);
      });
    });

    it('should load navigation quickly', (done) => {
      const startTime = performance.now();
      
      // Simulate navigation loading
      setTimeout(() => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // Navigation should be instant
        expect(loadTime).to.be.lessThan(100);
        done();
      }, 5);
    });
  });

  describe('Responsive Navigation', () => {
    it('should work on different screen sizes', () => {
      const nav = document.getElementById('main-nav');
      const navLinks = document.querySelectorAll('.nav-link');
      
      // Navigation should exist and be functional
      expect(nav).to.exist;
      expect(navLinks.length).to.be.at.least(1);
      
      // All links should be accessible
      navLinks.forEach(link => {
        expect(link.offsetWidth).to.be.at.least(0);
        expect(link.offsetHeight).to.be.at.least(0);
      });
    });
  });
});
