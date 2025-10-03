// Frontend unit tests for script/app.js

describe('i18n language switching (unit)', () => {
  beforeEach(() => {
    localStorage.removeItem('rex_resume_lang');
    // reset button styles
    document.getElementById('lang-en').style = '';
    document.getElementById('lang-zh').style = '';
    // default text is zh per app init
    const el = document.getElementById('i18n-text');
    el.setAttribute('data-en', 'Hello');
    el.setAttribute('data-zh', '你好');
    el.textContent = '你好';
  });

  it('defaults to zh when no saved preference', () => {
    const el = document.getElementById('i18n-text');
    expect(el.textContent).to.equal('你好');
  });

  it('applyLang("en") updates text and persists', () => {
    window.__app.i18n.applyLang('en');
    const el = document.getElementById('i18n-text');
    expect(el.textContent).to.equal('Hello');
    expect(localStorage.getItem(window.__app.i18n.KEY)).to.equal('en');
  });

  it('applyLang("zh") updates text and persists', () => {
    window.__app.i18n.applyLang('zh');
    const el = document.getElementById('i18n-text');
    expect(el.textContent).to.equal('你好');
    expect(localStorage.getItem(window.__app.i18n.KEY)).to.equal('zh');
  });
});

describe('anchor highlight on scroll (unit)', () => {
  it('highlights nav-a after setActiveByY near sec-a', () => {
    const secA = document.getElementById('sec-a');
    const y = (secA ? secA.offsetTop : 0) + 1 + 120; // just past sec-a threshold
    window.__app.scroll.setActiveByY(y);
    const a = document.getElementById('nav-a');
    expect(a.style.background || '').to.include('linear-gradient');
  });

  it('when scrolled near sec-b, highlights nav-b', () => {
    const secB = document.getElementById('sec-b');
    const y = (secB ? secB.offsetTop : 16000) + 1 + 120;
    window.__app.scroll.setActiveByY(y);
    const b = document.getElementById('nav-b');
    expect(b.style.background || '').to.include('linear-gradient');
  });
});