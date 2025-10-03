// Extracted from index.html inline scripts

// 语言切换
(function(){
  const KEY = 'rex_resume_lang';
  const btnEN = document.getElementById('lang-en');
  const btnZH = document.getElementById('lang-zh');
  const applyLang = (lang) => {
    // 遍历带 data-en / data-zh 的元素，填充对应文本
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
      el.textContent = el.getAttribute(lang === 'en' ? 'data-en' : 'data-zh');
    });
    // 高亮当前语言
    if (btnEN && btnZH) {
      if (lang === 'en') {
        btnEN.style.background = 'linear-gradient(135deg, var(--primary), #5ac8fa)';
        btnEN.style.color = '#001';
        btnZH.style.background = '';
        btnZH.style.color = 'var(--muted)';
      } else {
        btnZH.style.background = 'linear-gradient(135deg, var(--primary), #5ac8fa)';
        btnZH.style.color = '#001';
        btnEN.style.background = '';
        btnEN.style.color = 'var(--muted)';
      }
    }
    localStorage.setItem(KEY, lang);
  };
  const initLang = () => {
    const saved = localStorage.getItem(KEY);
    const lang = saved === 'en' || saved === 'zh' ? saved : 'zh';
    applyLang(lang);
  };
  if (btnEN) btnEN.addEventListener('click', () => applyLang('en'));
  if (btnZH) btnZH.addEventListener('click', () => applyLang('zh'));
  initLang();

  // expose for tests (non-invasive)
  try {
    window.__app = window.__app || {};
    window.__app.i18n = { applyLang, initLang, KEY };
  } catch(e) {}
})();

// 小交互：滚动时为导航按钮高亮当前区块
(function(){
  const links = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sections = links.map(a => {
    const id = a.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  function setActiveByY(y){
    let active = -1;
    for (let i=0;i<sections.length;i++){
      const s = sections[i];
      if (s.offsetTop <= y) active = i;
    }
    links.forEach((a,i)=>{
      if (i===active) {
        a.style.background = 'linear-gradient(135deg, var(--primary), #5ac8fa)';
        a.style.color = '#001';
      } else {
        a.style.background = '#0f1420';
        a.style.color = 'var(--text)';
      }
    });
  }
  const onScroll = () => {
    const baseY = (typeof window.scrollY === 'number' ? window.scrollY
                  : (typeof window.pageYOffset === 'number' ? window.pageYOffset
                  : (document.documentElement && document.documentElement.scrollTop) || 0));
    const y = baseY + 120;
    setActiveByY(y);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // expose for tests
  try {
    window.__app = window.__app || {};
    window.__app.scroll = { onScroll, links, sections, setActiveByY };
  } catch(e) {}
})();