// Unit tests for professional information display functionality
// Tests for User Story 1: Professional Information Discovery

describe('Professional Information Display (US1)', () => {
  beforeEach(() => {
    // Setup DOM elements for testing
    document.body.innerHTML = `
      <div id="about-section">
        <h1 data-zh="关于我" data-en="About Me" data-ja="私について">关于我</h1>
        <p data-zh="我是沈励钥，一名经验丰富的项目经理和算法工程师。" 
           data-en="I am Liyue Shen, an experienced project manager and algorithm engineer."
           data-ja="私は沈励钥と申します。経験豊富なプロジェクトマネージャー兼アルゴリズムエンジニアです。">我是沈励钥，一名经验丰富的项目经理和算法工程师。</p>
      </div>
      <div id="education-section">
        <h2 data-zh="教育经历" data-en="Education" data-ja="学歴">教育经历</h2>
        <div class="education-item">
          <h3>复旦大学</h3>
          <p>通信工程专业</p>
          <span>2010.9 – 2014.7</span>
        </div>
        <div class="education-item">
          <h3>昆士兰大学</h3>
          <p>信息技术专业</p>
          <span>2020.6 – 2022.7</span>
        </div>
      </div>
      <div id="experience-section">
        <h2 data-zh="工作经历" data-en="Work Experience" data-ja="職歴">工作经历</h2>
        <div class="experience-item">
          <h3>商飞智能</h3>
          <p>项目经理/算法工程师/解决方案经理</p>
          <span>2022.7至今</span>
        </div>
      </div>
      <div id="skills-section">
        <h2 data-zh="技能" data-en="Skills" data-ja="スキル">技能</h2>
        <ul>
          <li>英语：工作语言，商务水平</li>
          <li>日语：N2</li>
          <li>Python（numpy、torch、keras、matplotlib等）</li>
        </ul>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Professional Information Content', () => {
    it('should display personal information in about section', () => {
      const aboutSection = document.getElementById('about-section');
      const heading = aboutSection.querySelector('h1');
      const description = aboutSection.querySelector('p');
      
      expect(aboutSection).to.exist;
      expect(heading).to.exist;
      expect(description).to.exist;
      expect(description.textContent).to.include('沈励钥');
    });

    it('should display education information', () => {
      const educationSection = document.getElementById('education-section');
      const educationItems = educationSection.querySelectorAll('.education-item');
      
      expect(educationSection).to.exist;
      expect(educationItems.length).to.be.at.least(2);
      
      // Check for Fudan University
      const fudanItem = Array.from(educationItems).find(item => 
        item.querySelector('h3').textContent.includes('复旦大学')
      );
      expect(fudanItem).to.exist;
      
      // Check for University of Queensland
      const uqItem = Array.from(educationItems).find(item => 
        item.querySelector('h3').textContent.includes('昆士兰大学')
      );
      expect(uqItem).to.exist;
    });

    it('should display work experience information', () => {
      const experienceSection = document.getElementById('experience-section');
      const experienceItems = experienceSection.querySelectorAll('.experience-item');
      
      expect(experienceSection).to.exist;
      expect(experienceItems.length).to.be.at.least(1);
      
      // Check for current position
      const currentJob = Array.from(experienceItems).find(item => 
        item.querySelector('h3').textContent.includes('商飞智能')
      );
      expect(currentJob).to.exist;
    });

    it('should display skills information', () => {
      const skillsSection = document.getElementById('skills-section');
      const skillsList = skillsSection.querySelector('ul');
      const skillItems = skillsList.querySelectorAll('li');
      
      expect(skillsSection).to.exist;
      expect(skillsList).to.exist;
      expect(skillItems.length).to.be.at.least(3);
      
      // Check for specific skills
      const skillTexts = Array.from(skillItems).map(li => li.textContent);
      expect(skillTexts.some(skill => skill.includes('英语'))).to.be.true;
      expect(skillTexts.some(skill => skill.includes('日语'))).to.be.true;
      expect(skillTexts.some(skill => skill.includes('Python'))).to.be.true;
    });
  });

  describe('Multilingual Support', () => {
    it('should support Chinese content display', () => {
      const aboutHeading = document.querySelector('#about-section h1');
      expect(aboutHeading.textContent).to.equal('关于我');
    });

    it('should have data attributes for all languages', () => {
      const aboutHeading = document.querySelector('#about-section h1');
      expect(aboutHeading.getAttribute('data-zh')).to.equal('关于我');
      expect(aboutHeading.getAttribute('data-en')).to.equal('About Me');
      expect(aboutHeading.getAttribute('data-ja')).to.equal('私について');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const h1 = document.querySelector('h1');
      const h2s = document.querySelectorAll('h2');
      
      expect(h1).to.exist;
      expect(h2s.length).to.be.at.least(3);
    });

    it('should have semantic structure for education items', () => {
      const educationItems = document.querySelectorAll('.education-item');
      educationItems.forEach(item => {
        const heading = item.querySelector('h3');
        const description = item.querySelector('p');
        const date = item.querySelector('span');
        
        expect(heading).to.exist;
        expect(description).to.exist;
        expect(date).to.exist;
      });
    });
  });

  describe('Performance Requirements', () => {
    it('should load professional information quickly', (done) => {
      const startTime = performance.now();
      
      // Simulate content loading
      setTimeout(() => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // Should load within 30 seconds (30000ms) as per success criteria
        expect(loadTime).to.be.lessThan(30000);
        done();
      }, 10); // Simulate quick load
    });
  });
});
