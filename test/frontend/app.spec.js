// Exercise the real page, rather than a duplicate DOM fixture. No CDN dependency.
(function () {
  const frame = document.getElementById('portfolio');
  frame.addEventListener('load', function run() {
    const win = frame.contentWindow;
    const doc = win.document;
    const results = [];
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    const test = (name, callback) => {
      try { callback(); results.push({name, passed: true}); }
      catch (error) { results.push({name, passed: false, error: error.message}); }
    };
    const app = win.__app;
    if (!app) {
      document.getElementById('status').textContent = 'Unable to access page. Use a local HTTP server.';
      window.__testResults = {passed: 0, failed: 1};
      return;
    }
    const previous = win.localStorage.getItem(app.i18n.KEY);
    const languages = {zh: 'zh-CN', en: 'en', ja: 'ja'};
    for (const [lang, htmlLang] of Object.entries(languages)) {
      test(`${lang}: language switch, full content and accessibility state`, () => {
        doc.getElementById('lang-' + lang).click();
        assert(doc.documentElement.lang === htmlLang, 'Incorrect document language');
        assert(doc.querySelectorAll('[aria-pressed="true"]').length === 1, 'Language selection must be unique');
        assert(doc.getElementById('lang-' + lang).getAttribute('aria-pressed') === 'true', 'Wrong active language');
        doc.querySelectorAll('[data-zh]').forEach(el => {
          assert(el.getAttribute('data-' + lang), 'Missing translation');
          assert(el.textContent === el.getAttribute('data-' + lang), 'Translation mismatch');
        });
        assert(win.localStorage.getItem(app.i18n.KEY) === lang, 'Preference not saved');
        assert(doc.querySelector('[property="og:title"]').content === doc.title, 'Metadata not updated');
      });
    }
    test('Invalid language falls back to Chinese', () => {
      app.i18n.applyLang('invalid');
      assert(doc.documentElement.lang === 'zh-CN', 'No language fallback');
    });
    test('Saved language takes precedence over browser language', () => {
      win.localStorage.setItem(app.i18n.KEY, 'ja');
      assert(app.i18n.initialLanguage() === 'ja', 'Preference ignored');
    });
    test('Invalid stored preference uses browser/default language', () => {
      win.localStorage.setItem(app.i18n.KEY, 'invalid');
      const lang = win.navigator.language.slice(0, 2);
      assert(app.i18n.initialLanguage() === (lang in languages ? lang : 'zh'), 'Wrong fallback');
    });
    test('Navigation highlights its section and preserves contact actions', () => {
      const section = doc.getElementById('projects');
      app.scroll.setActiveByY(section.getBoundingClientRect().top + win.scrollY + 1);
      const active = doc.querySelectorAll('.nav-links [aria-current]');
      assert(active.length === 1 && active[0].hash === '#projects', 'Wrong section');
      assert(!doc.querySelector('.nav-contact').hasAttribute('aria-current'), 'CTA became navigation');
      app.scroll.setActiveByY(0);
      assert(!doc.querySelector('.nav-links [aria-current]'), 'Hero should have no section selection');
    });
    test('Every internal anchor points to an existing element', () => {
      doc.querySelectorAll('a[href^="#"]').forEach(a => assert(doc.getElementById(a.hash.slice(1)), 'Broken anchor: '+a.hash));
    });
    test('Historical cases expand and close natively', () => {
      const item = doc.querySelector('details');
      item.querySelector('summary').click();
      assert(item.open, 'Case did not open');
      item.querySelector('summary').click();
      assert(!item.open, 'Case did not close');
    });
    test('Historical projects, publications and contacts are retained', () => {
      assert(doc.querySelectorAll('.past-project').length === 6, 'Missing history');
      assert(doc.querySelectorAll('.publication').length === 4, 'Missing papers');
      assert(doc.querySelector('a[href="mailto:Narcy188@outlook.com"]'), 'Missing email');
      assert(doc.querySelector('a[href="tel:+8618801734215"]'), 'Missing phone');
      assert(doc.querySelector('a[href="assets/resume.md"]'), 'Missing resume');
    });
    test('External tabs use noopener and noreferrer', () => {
      doc.querySelectorAll('a[target="_blank"]').forEach(a => assert(a.relList.contains('noopener') && a.relList.contains('noreferrer'), 'Unsafe external tab'));
    });
    test('Homepage has no game, chat or external runtime dependencies', () => {
      assert(!doc.querySelector('#game-overlay, #chat'), 'Legacy UI still present');
      doc.querySelectorAll('script[src],link[rel="stylesheet"]').forEach(el => assert(new URL(el.src || el.href).origin === win.location.origin, 'External dependency'));
    });
    if (previous === null) win.localStorage.removeItem(app.i18n.KEY);
    else win.localStorage.setItem(app.i18n.KEY, previous);
    app.i18n.applyLang(previous || 'zh');
    if (previous === null) win.localStorage.removeItem(app.i18n.KEY);
    results.forEach(result => {
      const li = document.createElement('li');
      li.className = result.passed ? 'pass' : 'fail';
      li.textContent = `${result.passed ? 'PASS' : 'FAIL'}: ${result.name}${result.error ? ' — '+result.error : ''}`;
      document.getElementById('results').appendChild(li);
    });
    const failed = results.filter(result => !result.passed).length;
    window.__testResults = {passed: results.length - failed, failed, results};
    document.getElementById('status').textContent = `${results.length - failed}/${results.length} passed`;
  }, {once: true});
})();
