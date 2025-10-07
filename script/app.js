// Extracted from index.html inline scripts

// 语言切换
(function(){
  const KEY = 'rex_resume_lang';
  const btnEN = document.getElementById('lang-en');
  const btnZH = document.getElementById('lang-zh');
  const btnJA = document.getElementById('lang-ja');
  const applyLang = (lang) => {
    // 遍历带 data-en / data-zh 的元素，填充对应文本
    document.querySelectorAll('[data-en],[data-zh],[data-ja]').forEach(el => {
      let text;
      if (lang === 'en') text = el.getAttribute('data-en');
      else if (lang === 'zh') text = el.getAttribute('data-zh');
      else if (lang === 'ja') text = el.getAttribute('data-ja');
      // fallback: zh -> en -> ja -> keep
      if (!text) text = el.getAttribute('data-zh') || el.getAttribute('data-en') || el.getAttribute('data-ja') || el.textContent;
      el.textContent = text;
    });
    // 高亮当前语言
    if (btnEN && btnZH) {
      const activate = (btn) => {
        if (!btn) return;
        btn.style.background = 'linear-gradient(135deg, var(--primary), #5ac8fa)';
        btn.style.color = '#001';
      };
      const deactivate = (btn) => {
        if (!btn) return;
        btn.style.background = '';
        btn.style.color = 'var(--muted)';
      };
      deactivate(btnEN); deactivate(btnZH); deactivate(btnJA);
      if (lang === 'en') activate(btnEN);
      else if (lang === 'zh') activate(btnZH);
      else if (lang === 'ja') activate(btnJA);
    }
    localStorage.setItem(KEY, lang);
  };
  const initLang = () => {
    const saved = localStorage.getItem(KEY);
    let lang = (saved === 'en' || saved === 'zh' || saved === 'ja') ? saved : null;
    if (!lang) {
      const nav = (navigator.language || navigator.userLanguage || 'zh').toLowerCase();
      if (nav.startsWith('en')) lang = 'en';
      else if (nav.startsWith('ja')) lang = 'ja';
      else lang = 'zh';
    }
    applyLang(lang);
  };
  if (btnEN) btnEN.addEventListener('click', () => applyLang('en'));
  if (btnZH) btnZH.addEventListener('click', () => applyLang('zh'));
  if (btnJA) btnJA.addEventListener('click', () => applyLang('ja'));
  initLang();

  // expose for tests (non-invasive)
  try {
    window.__app = window.__app || {};
    window.__app.i18n = { applyLang, initLang, KEY };
  } catch(e) {}
})();

/* 聊天功能（基础 UI 对接后端，配置来自 assets/config.json） */
(function(){
  const conf = { backendUrl: 'http://localhost:5000', model: 'auto', temperature: 0.7, stream: false };
  (async function loadConfig(){
    try {
      const resp = await fetch('assets/config.json', { cache: 'no-cache' });
      const data = await resp.json();
      conf.backendUrl = data.backendUrl || conf.backendUrl;
      conf.model = (typeof data.model === 'string' ? data.model : conf.model);
      conf.temperature = (typeof data.temperature === 'number' ? data.temperature : conf.temperature);
      conf.stream = !!data.stream;
    } catch(e) {
      // ignore, use defaults
    }
  })();

  const elInput = document.getElementById('chat-input');
  const elSend = document.getElementById('chat-send');
  const elClear = document.getElementById('chat-clear');
  const elLog = document.getElementById('chat-log');
  const elStatus = document.getElementById('chat-status');
  const messages = [];

  function addBubble(role, text){
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'flex-start';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = role === 'user' ? 'You' : 'AI';

    const bubble = document.createElement('div');
    bubble.style.background = role === 'user' ? 'rgba(255,255,255,.06)' : 'linear-gradient(135deg, var(--primary), #5ac8fa)';
    bubble.style.color = role === 'user' ? 'var(--text)' : '#001';
    bubble.style.padding = '8px 10px';
    bubble.style.borderRadius = '10px';
    bubble.style.boxShadow = 'var(--shadow)';

    bubble.textContent = text || '';
    row.appendChild(badge);
    row.appendChild(bubble);
    if (elLog) elLog.appendChild(row);
  }

  async function send(){
    const text = (elInput && elInput.value || '').trim();
    if (!text) return;
    addBubble('user', text);
    messages.push({ role: 'user', content: text });

    if (elStatus) { elStatus.textContent = '…'; }
    try {
      const resp = await fetch(`${conf.backendUrl}/api/chat/completions`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, model: conf.model, temperature: conf.temperature, stream: conf.stream })
      });
      let data;
      try { data = await resp.json(); } catch(e) { data = { error: 'Invalid JSON', text: await resp.text() }; }
      if (!resp.ok) {
        const msg = (data && (data.message || data.error)) || `HTTP ${resp.status}`;
        addBubble('assistant', `Error: ${msg}`);
        if (elStatus) elStatus.textContent = '';
        return;
      }
      // 兼容多种返回格式（choices/message/output_text）
      const content =
        (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
        (data && data.message) ||
        (data && data.output_text) ||
        JSON.stringify(data);
      addBubble('assistant', content);
      messages.push({ role: 'assistant', content });
      if (elInput) elInput.value = '';
      if (elStatus) elStatus.textContent = '';
    } catch (err) {
      addBubble('assistant', `Error: ${String(err)}`);
      if (elStatus) elStatus.textContent = '';
    }
  }

  function clearAll(){
    messages.length = 0;
    if (elLog) elLog.textContent = '';
    if (elInput) elInput.value = '';
    if (elStatus) elStatus.textContent = '';
  }

  if (elSend) elSend.addEventListener('click', send);
  if (elClear) elClear.addEventListener('click', clearAll);

  // 后端健康检查（启动时）
  async function pingBackend(){
    if (!elStatus) return;
    try {
      elStatus.textContent = 'Checking backend…';
      const r = await fetch(`${conf.backendUrl}/api/health`, { mode: 'cors' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      elStatus.textContent = 'Backend OK';
    } catch (e) {
      elStatus.textContent = 'Backend unreachable';
    }
  }
  pingBackend();

  // 暴露测试接口
  try {
    window.__app = window.__app || {};
    window.__app.chat = { send, clearAll, messages };
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