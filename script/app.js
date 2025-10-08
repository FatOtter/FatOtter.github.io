// Extracted from index.html inline scripts

// 语言切换功能 (Enhanced for User Story 2)
(function(){
  const KEY = 'rex_resume_lang';
  const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja'];
  const DEFAULT_LANGUAGE = 'zh';
  
  const btnEN = document.getElementById('lang-en');
  const btnZH = document.getElementById('lang-zh');
  const btnJA = document.getElementById('lang-ja');
  
  // 增强的语言应用函数
  const applyLang = (lang) => {
    try {
      // 验证语言代码
      if (!SUPPORTED_LANGUAGES.includes(lang)) {
        console.warn(`Unsupported language: ${lang}, falling back to ${DEFAULT_LANGUAGE}`);
        lang = DEFAULT_LANGUAGE;
      }
      
      // 设置HTML lang属性
      document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
      
      // 遍历带 data-en / data-zh / data-ja 的元素，填充对应文本
      document.querySelectorAll('[data-en],[data-zh],[data-ja]').forEach(el => {
        let text;
        if (lang === 'en') text = el.getAttribute('data-en');
        else if (lang === 'zh') text = el.getAttribute('data-zh');
        else if (lang === 'ja') text = el.getAttribute('data-ja');
        
        // 增强的fallback逻辑: zh -> en -> ja -> keep original
        if (!text || text.trim() === '') {
          text = el.getAttribute('data-zh') || el.getAttribute('data-en') || el.getAttribute('data-ja') || el.textContent;
        }
        
        if (text && text.trim() !== '') {
          el.textContent = text;
        }
      });
      
      // 高亮当前语言按钮
      updateLanguageButtons(lang);
      
      // 保存语言偏好
      saveLanguagePreference(lang);
      
      // 触发语言切换事件
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
      
    } catch (error) {
      console.error('Error applying language:', error);
      // 回退到默认语言
      if (lang !== DEFAULT_LANGUAGE) {
        applyLang(DEFAULT_LANGUAGE);
      }
    }
  };
  
  // 更新语言按钮状态
  const updateLanguageButtons = (lang) => {
    const buttons = { en: btnEN, zh: btnZH, ja: btnJA };
    
    Object.entries(buttons).forEach(([langCode, btn]) => {
      if (!btn) return;
      
      if (langCode === lang) {
        // 激活当前语言按钮
        btn.style.background = 'linear-gradient(135deg, var(--primary), #5ac8fa)';
        btn.style.color = '#001';
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-current', 'true');
      } else {
        // 停用其他语言按钮
        btn.style.background = '';
        btn.style.color = 'var(--muted)';
        btn.setAttribute('aria-pressed', 'false');
        btn.removeAttribute('aria-current');
      }
    });
  };
  
  // 保存语言偏好
  const saveLanguagePreference = (lang) => {
    try {
      localStorage.setItem(KEY, lang);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
      // 尝试使用sessionStorage作为备选
      try {
        sessionStorage.setItem(KEY, lang);
      } catch (sessionError) {
        console.warn('Failed to save language preference to sessionStorage:', sessionError);
      }
    }
  };
  
  // 获取保存的语言偏好
  const getSavedLanguagePreference = () => {
    try {
      const saved = localStorage.getItem(KEY);
      return SUPPORTED_LANGUAGES.includes(saved) ? saved : null;
    } catch (error) {
      console.warn('Failed to read language preference from localStorage:', error);
      // 尝试从sessionStorage读取
      try {
        const saved = sessionStorage.getItem(KEY);
        return SUPPORTED_LANGUAGES.includes(saved) ? saved : null;
      } catch (sessionError) {
        console.warn('Failed to read language preference from sessionStorage:', sessionError);
        return null;
      }
    }
  };
  
  // 检测浏览器语言
  const detectBrowserLanguage = () => {
    const browserLang = (navigator.language || navigator.userLanguage || DEFAULT_LANGUAGE).toLowerCase();
    
    if (browserLang.startsWith('en')) return 'en';
    else if (browserLang.startsWith('ja')) return 'ja';
    else if (browserLang.startsWith('zh')) return 'zh';
    else return DEFAULT_LANGUAGE;
  };
  
  // 初始化语言
  const initLang = () => {
    const saved = getSavedLanguagePreference();
    const detected = detectBrowserLanguage();
    const lang = saved || detected;
    
    applyLang(lang);
  };
  
  // 添加事件监听器
  if (btnEN) {
    btnEN.addEventListener('click', () => applyLang('en'));
    btnEN.setAttribute('aria-label', 'Switch to English');
  }
  if (btnZH) {
    btnZH.addEventListener('click', () => applyLang('zh'));
    btnZH.setAttribute('aria-label', '切换到中文');
  }
  if (btnJA) {
    btnJA.addEventListener('click', () => applyLang('ja'));
    btnJA.setAttribute('aria-label', '日本語に切り替え');
  }
  
  // 初始化
  initLang();
  
  // expose for tests (non-invasive)
  try {
    window.__app = window.__app || {};
    window.__app.i18n = { 
      applyLang, 
      initLang, 
      KEY,
      getCurrentLanguage: () => getSavedLanguagePreference() || detectBrowserLanguage(),
      getSupportedLanguages: () => [...SUPPORTED_LANGUAGES],
      isLanguageSupported: (lang) => SUPPORTED_LANGUAGES.includes(lang),
      updateLanguageButtons,
      saveLanguagePreference,
      getSavedLanguagePreference,
      detectBrowserLanguage
    };
  } catch(e) {}
})();

/* 聊天功能（增强版 UI 对接后端，配置来自 assets/config.json） */
(function(){
  const conf = { 
    backendUrl: 'http://localhost:5000', 
    model: 'auto', 
    temperature: 0.7, 
    stream: false,
    maxMessageLength: 1000,
    supportedLanguages: ['zh', 'en', 'ja'],
    chatEnabled: true,
    debugMode: false
  };
  
  // 加载配置
  (async function loadConfig(){
    try {
      const resp = await fetch('assets/config.json', { cache: 'no-cache' });
      const data = await resp.json();
      conf.backendUrl = data.backendUrl || conf.backendUrl;
      conf.model = (typeof data.model === 'string' ? data.model : conf.model);
      conf.temperature = (typeof data.temperature === 'number' ? data.temperature : conf.temperature);
      conf.stream = !!data.stream;
      conf.maxMessageLength = data.maxMessageLength || conf.maxMessageLength;
      conf.supportedLanguages = data.supportedLanguages || conf.supportedLanguages;
      conf.chatEnabled = data.chatEnabled !== false;
      conf.debugMode = !!data.debugMode;
    } catch(e) {
      console.warn('Failed to load chat config, using defaults:', e);
    }
  })();

  const elInput = document.getElementById('chat-input');
  const elSend = document.getElementById('chat-send');
  const elClear = document.getElementById('chat-clear');
  const elLog = document.getElementById('chat-log');
  const elStatus = document.getElementById('chat-status');
  const messages = [];
  let isSending = false;
  let currentLanguage = 'zh';

  // 增强的消息气泡创建函数
  function addBubble(role, text, options = {}) {
    const row = document.createElement('div');
    row.className = `message ${role}-message`;
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'flex-start';
    row.style.marginBottom = '12px';
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = role === 'user' ? 
      (currentLanguage === 'zh' ? '您' : currentLanguage === 'ja' ? 'あなた' : 'You') : 
      (currentLanguage === 'zh' ? 'AI' : currentLanguage === 'ja' ? 'AI' : 'AI');

    const bubble = document.createElement('div');
    bubble.className = 'message-content';
    bubble.style.background = role === 'user' ? 'rgba(255,255,255,.06)' : 'linear-gradient(135deg, var(--primary), #5ac8fa)';
    bubble.style.color = role === 'user' ? 'var(--text)' : '#001';
    bubble.style.padding = '8px 10px';
    bubble.style.borderRadius = '10px';
    bubble.style.boxShadow = 'var(--shadow)';
    bubble.style.maxWidth = '80%';
    bubble.style.wordWrap = 'break-word';

    bubble.textContent = text || '';
    
    // 添加时间戳
    const timestamp = document.createElement('div');
    timestamp.className = 'message-time';
    timestamp.style.fontSize = '0.75em';
    timestamp.style.color = 'var(--muted)';
    timestamp.style.marginTop = '4px';
    timestamp.textContent = new Date().toLocaleTimeString();
    
    const messageContainer = document.createElement('div');
    messageContainer.style.flex = '1';
    messageContainer.appendChild(bubble);
    messageContainer.appendChild(timestamp);
    
    row.appendChild(badge);
    row.appendChild(messageContainer);
    
    if (elLog) {
      elLog.appendChild(row);
      // 滚动到底部
      elLog.scrollTop = elLog.scrollHeight;
      
      // 动画显示
      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, 10);
    }
    
    return row;
  }

  // 增强的发送函数
  async function send(){
    if (isSending) return; // 防止重复发送
    if (!conf.chatEnabled) {
      showError('聊天功能已禁用');
      return;
    }
    
    const text = (elInput && elInput.value || '').trim();
    if (!text) {
      showError('请输入消息内容');
      return;
    }
    
    // 验证消息长度
    if (text.length > conf.maxMessageLength) {
      showError(`消息长度不能超过 ${conf.maxMessageLength} 个字符`);
      return;
    }
    
    isSending = true;
    setUIState('sending');
    
    // 添加用户消息
    const userMessage = addBubble('user', text);
    messages.push({ role: 'user', content: text });
    
    // 清空输入框
    if (elInput) elInput.value = '';
    
    try {
      // 获取当前语言
      const savedLang = localStorage.getItem('rex_resume_lang') || 'zh';
      currentLanguage = savedLang;
      
      const requestBody = {
        message: text,
        user_id: generateUserId(),
        language: currentLanguage,
        model: conf.model,
        temperature: conf.temperature,
        stream: conf.stream
      };
      
      if (conf.debugMode) {
        console.log('Sending chat request:', requestBody);
      }
      
      const resp = await fetch(`${conf.backendUrl}/api/chat/completions`, {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      let data;
      try { 
        data = await resp.json(); 
      } catch(e) { 
        data = { error: 'Invalid JSON response', text: await resp.text() }; 
      }
      
      if (!resp.ok) {
        const errorMsg = getErrorMessage(data, resp.status);
        addBubble('assistant', errorMsg, { type: 'error' });
        showError(errorMsg);
        return;
      }
      
      // 处理成功响应
      const content = extractResponseContent(data);
      addBubble('assistant', content);
      messages.push({ role: 'assistant', content });
      
      if (elStatus) elStatus.textContent = '';
      
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      addBubble('assistant', errorMsg, { type: 'error' });
      showError(errorMsg);
      console.error('Chat error:', err);
    } finally {
      isSending = false;
      setUIState('ready');
    }
  }
  
  // 辅助函数
  function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  function extractResponseContent(data) {
    return (data && data.response) ||
           (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
           (data && data.message) ||
           (data && data.output_text) ||
           JSON.stringify(data);
  }
  
  function getErrorMessage(data, status = null) {
    if (data && data.error) {
      return data.error;
    }
    if (status === 429) {
      return '请求过于频繁，请稍后再试';
    }
    if (status === 500) {
      return '服务器内部错误，请稍后再试';
    }
    if (status === 503) {
      return '服务暂时不可用，请稍后再试';
    }
    if (status) {
      return `请求失败 (HTTP ${status})`;
    }
    return '网络连接错误，请检查网络连接';
  }
  
  function showError(message) {
    if (elStatus) {
      elStatus.textContent = message;
      elStatus.className = 'chat-status error';
      setTimeout(() => {
        elStatus.textContent = '';
        elStatus.className = 'chat-status';
      }, 5000);
    }
  }
  
  function setUIState(state) {
    if (state === 'sending') {
      if (elInput) elInput.disabled = true;
      if (elSend) {
        elSend.disabled = true;
        elSend.textContent = '发送中...';
      }
      if (elStatus) elStatus.textContent = '正在发送...';
    } else if (state === 'ready') {
      if (elInput) elInput.disabled = false;
      if (elSend) {
        elSend.disabled = false;
        elSend.textContent = '发送';
      }
      if (elStatus) elStatus.textContent = '';
    }
  }

  // 增强的清除功能
  function clearAll(){
    if (isSending) return; // 发送中不允许清除
    
    messages.length = 0;
    if (elLog) {
      // 保留欢迎消息
      const welcomeMessage = elLog.querySelector('.bot-message');
      elLog.innerHTML = '';
      if (welcomeMessage) {
        elLog.appendChild(welcomeMessage);
      }
    }
    if (elInput) elInput.value = '';
    if (elStatus) {
      elStatus.textContent = '';
      elStatus.className = 'chat-status';
    }
    
    // 触发清除事件
    window.dispatchEvent(new CustomEvent('chatCleared'));
  }
  
  // 键盘事件处理
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
  
  // 输入验证
  function handleInput(e) {
    const text = e.target.value;
    const remaining = conf.maxMessageLength - text.length;
    
    if (elStatus) {
      if (remaining < 0) {
        elStatus.textContent = `消息过长，超出 ${Math.abs(remaining)} 个字符`;
        elStatus.className = 'chat-status error';
      } else if (remaining < 100) {
        elStatus.textContent = `剩余 ${remaining} 个字符`;
        elStatus.className = 'chat-status warning';
      } else {
        elStatus.textContent = '';
        elStatus.className = 'chat-status';
      }
    }
  }
  
  // 语言切换事件监听
  function handleLanguageChange(e) {
    currentLanguage = e.detail.language;
    updateChatLanguage();
  }
  
  function updateChatLanguage() {
    // 更新聊天界面的语言相关文本
    const placeholders = {
      zh: '输入消息...',
      en: 'Type your message...',
      ja: 'メッセージを入力...'
    };
    
    if (elInput) {
      elInput.placeholder = placeholders[currentLanguage] || placeholders.zh;
    }
    
    if (elSend) {
      const sendTexts = {
        zh: '发送',
        en: 'Send',
        ja: '送信'
      };
      elSend.textContent = sendTexts[currentLanguage] || sendTexts.zh;
    }
  }

  // 事件监听器
  if (elSend) elSend.addEventListener('click', send);
  if (elClear) elClear.addEventListener('click', clearAll);
  if (elInput) {
    elInput.addEventListener('keydown', handleKeyDown);
    elInput.addEventListener('input', handleInput);
  }
  
  // 监听语言切换事件
  window.addEventListener('languageChanged', handleLanguageChange);

  // 增强的后端健康检查
  async function pingBackend(){
    if (!elStatus) return;
    try {
      elStatus.textContent = '检查后端连接...';
      const r = await fetch(`${conf.backendUrl}/api/health`, { 
        mode: 'cors',
        timeout: 5000 
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      elStatus.textContent = '后端连接正常';
      elStatus.className = 'chat-status success';
      
      // 检查聊天配置
      try {
        const configResp = await fetch(`${conf.backendUrl}/api/config/public`, { mode: 'cors' });
        if (configResp.ok) {
          const config = await configResp.json();
          if (config.chatEnabled === false) {
            conf.chatEnabled = false;
            elStatus.textContent = '聊天功能已禁用';
            elStatus.className = 'chat-status warning';
          }
        }
      } catch (configErr) {
        console.warn('Failed to load chat config:', configErr);
      }
      
    } catch (e) {
      elStatus.textContent = '后端连接失败';
      elStatus.className = 'chat-status error';
      conf.chatEnabled = false;
    }
  }
  
  // 延迟执行健康检查，等待配置加载
  setTimeout(pingBackend, 1000);

  // 暴露增强的测试接口
  try {
    window.__app = window.__app || {};
    window.__app.chat = { 
      send, 
      clearAll, 
      messages, 
      conf,
      isSending: () => isSending,
      currentLanguage: () => currentLanguage,
      setLanguage: (lang) => {
        currentLanguage = lang;
        updateChatLanguage();
      },
      showError,
      setUIState
    };
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
        a.setAttribute('aria-current', 'page');
      } else {
        a.style.background = '#0f1420';
        a.style.color = 'var(--text)';
        a.removeAttribute('aria-current');
      }
    });
  }

  // 平滑滚动到目标部分
  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // 键盘导航支持
  function handleKeyNavigation(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').slice(1);
      smoothScrollTo(targetId);
    }
  }

  // 为所有导航链接添加键盘事件监听器和可访问性属性
  links.forEach(link => {
    link.addEventListener('keydown', handleKeyNavigation);
    link.setAttribute('tabindex', '0');
    link.setAttribute('role', 'button');
  });
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
    window.__app.scroll = { onScroll, links, sections, setActiveByY, smoothScrollTo };
  } catch(e) {}
})();