// The portfolio remains readable without JavaScript. This file only enhances it.
(function () {
  'use strict';
  const KEY = 'rex_resume_lang';
  const supported = ['zh', 'en', 'ja'];
  const buttons = supported.map(lang => document.getElementById('lang-' + lang));
  let current = 'zh';
  function readPreference() {
    try { return localStorage.getItem(KEY); } catch (_) { return null; }
  }
  function savePreference(lang) {
    try { localStorage.setItem(KEY, lang); } catch (_) { /* Storage is optional. */ }
  }
  function initialLanguage() {
    const saved = readPreference();
    if (supported.includes(saved)) return saved;
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return supported.includes(browser) ? browser : 'zh';
  }
  function applyLang(lang) {
    current = supported.includes(lang) ? lang : 'zh';
    document.documentElement.lang = current === 'zh' ? 'zh-CN' : current;
    document.querySelectorAll('[data-zh]').forEach(el => {
      el.textContent = el.getAttribute('data-' + current) || el.getAttribute('data-zh');
    });
    document.querySelectorAll('[data-meta-zh]').forEach(el => {
      el.content = el.getAttribute('data-meta-' + current) || el.getAttribute('data-meta-zh');
    });
    document.querySelectorAll('[data-aria-zh]').forEach(el => {
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + current) || el.getAttribute('data-aria-zh'));
    });
    const ogTitle = document.querySelector('[property="og:title"]');
    const ogDescription = document.querySelector('[property="og:description"]');
    const description = document.querySelector('meta[name="description"]');
    if (ogTitle) ogTitle.content = document.title;
    if (ogDescription && description) ogDescription.content = description.content;
    const nav = document.querySelector('.nav-links');
    const group = document.querySelector('.nav-actions');
    if (nav) nav.setAttribute('aria-label', {zh:'主要导航', en:'Main navigation', ja:'メインナビゲーション'}[current]);
    if (group) group.setAttribute('aria-label', {zh:'语言', en:'Language', ja:'言語'}[current]);
    buttons.forEach((button, index) => {
      if (button) button.setAttribute('aria-pressed', String(supported[index] === current));
    });
    savePreference(current);
    window.dispatchEvent(new CustomEvent('languageChanged', {detail: {language: current}}));
  }
  buttons.forEach((button, index) => {
    if (button) button.addEventListener('click', () => applyLang(supported[index]));
  });
  applyLang(initialLanguage());

  // Track section links only; calls to action keep their own visual treatment.
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const targets = links.map(link => ({link, section: document.getElementById(link.hash.slice(1))})).filter(item => item.section);
  function setActiveByY(y) {
    let active = null;
    targets.forEach(item => {
      const top = item.section.getBoundingClientRect().top + window.scrollY;
      if (top <= y) active = item;
    });
    links.forEach(link => link.removeAttribute('aria-current'));
    if (active) active.link.setAttribute('aria-current', 'location');
  }
  function onScroll() {
    const header = document.querySelector('.global-nav');
    setActiveByY(window.scrollY + (header ? header.offsetHeight : 72) + 30);
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => { onScroll(); scheduled = false; });
    }
  }, {passive: true});
  window.addEventListener('resize', onScroll);
  window.addEventListener('languageChanged', onScroll);
  window.addEventListener('load', onScroll);
  onScroll();
  window.__app = {i18n: {KEY, applyLang, initialLanguage, getLanguage: () => current}, scroll: {setActiveByY, onScroll}};
})();
