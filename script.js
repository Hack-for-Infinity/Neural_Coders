/* ─────────────────────────────────────────
   EDUVOICE — script.js  (Enhanced v2)
   New features:
   • Indian Sign Language (ISL) panel
   • Form field read-aloud on focus
   • Image OCR (Tesseract.js)
   • Video speed control, reading line,
     section repeat
   • Accessible quiz (voice + keyboard)
   • Focus mode (cognitive overload)
   • Feedback widget
───────────────────────────────────────── */
'use strict';

/* ══════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);
const srAnnounce = (msg, urgent = false) => {
  const el = urgent ? $('sr-alert') : $('sr-announce');
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = msg; });
};

/* ══════════════════════════════════════════
   NAVIGATION TOGGLE
══════════════════════════════════════════ */
const navBtn  = $('nav-btn');
const navMenu = $('nav-menu');
navBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navBtn.setAttribute('aria-expanded', String(isOpen));
  navBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) { navBtn.click(); navBtn.focus(); }
});
document.addEventListener('click', e => {
  if (!e.target.closest('.site-nav') && navMenu.classList.contains('open')) navBtn.click();
});

/* ══════════════════════════════════════════
   SMOOTH SCROLL + FOCUS
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════
   ACTIVE NAV ON SCROLL
══════════════════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-list a');
const sectionObserverNav = new IntersectionObserver(entries => {
  const active = entries.find(e => e.isIntersecting);
  if (active) {
    navLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === '#' + active.target.id;
      isCurrent ? link.setAttribute('aria-current','page') : link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-30% 0px -60% 0px' });
document.querySelectorAll('section[id], header[id]').forEach(el => sectionObserverNav.observe(el));

/* ══════════════════════════════════════════
   FORM SUBMISSION
══════════════════════════════════════════ */
const contactForm = $('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const status = $('form-status');
    status.className = 'form-status ok';
    status.textContent = '✓ Message sent! We\'ll be in touch within 2 business days.';
    contactForm.reset();
    status.setAttribute('tabindex', '-1');
    status.focus();
    srAnnounce('Form submitted successfully.');
  });
}

/* ══════════════════════════════════════════
   FORM FIELD READ-ALOUD ON FOCUS  (Feature 1)
   Each form field announces its label +
   hint text when focused
══════════════════════════════════════════ */
function initFormReadAloud() {
  const formFields = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
  formFields.forEach(field => {
    field.addEventListener('focus', () => {
      // Find label
      const labelEl = document.querySelector(`label[for="${field.id}"]`);
      const hintEl  = document.getElementById(field.getAttribute('aria-describedby'));
      let announcement = '';
      if (labelEl) announcement += labelEl.textContent.replace('*','required') + '. ';
      if (hintEl)  announcement += hintEl.textContent;
      if (announcement.trim()) speakText(announcement.trim());
    });
  });
}
initFormReadAloud();

/* ══════════════════════════════════════════
   GLOBAL TEXT SIZE
══════════════════════════════════════════ */
const TEXT_SIZES = [75, 87.5, 100, 112.5, 125, 150, 175, 200];
let textIdx = 2;
function applyTextSize(idx) {
  document.documentElement.style.fontSize = TEXT_SIZES[idx] + '%';
  $('txt-decrease').disabled = idx === 0;
  $('txt-increase').disabled = idx === TEXT_SIZES.length - 1;
  srAnnounce(`Text size ${TEXT_SIZES[idx]}%`);
}
$('txt-decrease').addEventListener('click', () => { if (textIdx > 0) applyTextSize(--textIdx); });
$('txt-increase').addEventListener('click', () => { if (textIdx < TEXT_SIZES.length-1) applyTextSize(++textIdx); });
$('txt-reset').addEventListener('click',    () => { textIdx = 2; applyTextSize(textIdx); });

/* ══════════════════════════════════════════
   GLOBAL DYSLEXIA FONT
══════════════════════════════════════════ */
$('dyslexia-toggle').addEventListener('click', function () {
  const on = document.body.classList.toggle('dyslexia-font');
  this.setAttribute('aria-pressed', String(on));
  srAnnounce(on ? 'Dyslexia-friendly Lexend font enabled' : 'Default font restored');
});

/* ══════════════════════════════════════════
   GLOBAL HIGH CONTRAST
══════════════════════════════════════════ */
$('contrast-toggle').addEventListener('click', function () {
  const on = document.body.classList.toggle('high-contrast');
  this.setAttribute('aria-pressed', String(on));
  srAnnounce(on ? 'High contrast mode enabled' : 'High contrast mode off');
});

/* ══════════════════════════════════════════
   FOCUS MODE  (Feature 5 — reduce cognitive overload)
   Hides decorative elements, increases
   spacing, shows one section at a time
══════════════════════════════════════════ */
$('focus-mode-btn').addEventListener('click', function () {
  const on = document.body.classList.toggle('focus-mode');
  this.setAttribute('aria-pressed', String(on));
  srAnnounce(on ? 'Focus mode on. Distractions reduced.' : 'Focus mode off. Full layout restored.');
});

/* ══════════════════════════════════════════
   SPEECH SYNTHESIS HELPER
══════════════════════════════════════════ */
function speakText(text, onWord) {
  if (!('speechSynthesis' in window)) {
    srAnnounce('Read-aloud is not supported in this browser. Try Chrome or Edge.', true);
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text.trim());
  utter.rate = 0.92; utter.pitch = 1; utter.lang = 'en-US';
  if (onWord) utter.onboundary = onWord;
  window.speechSynthesis.speak(utter);
  // Show ISL for text being spoken
  if (islPanelVisible()) showISLForText(text);
  return utter;
}

/* ══════════════════════════════════════════
   GLOBAL READ-ALOUD (click any text)
══════════════════════════════════════════ */
let globalReadaloud = false;
const mainEl = $('main');

function handleGlobalClick(e) {
  const target = e.target.closest('p, h1, h2, h3, h4, li, figcaption, .stat-desc, .check-text, label, .section-lead');
  if (!target) return;
  const text = target.innerText || target.textContent;
  if (text?.trim()) speakText(text);
}

$('readaloud-toggle').addEventListener('click', function () {
  globalReadaloud = !globalReadaloud;
  this.setAttribute('aria-pressed', String(globalReadaloud));
  if (globalReadaloud) {
    mainEl.classList.add('readaloud-active');
    mainEl.addEventListener('click', handleGlobalClick);
    srAnnounce('Read-aloud on. Click any paragraph or heading to hear it spoken.');
  } else {
    mainEl.classList.remove('readaloud-active');
    mainEl.removeEventListener('click', handleGlobalClick);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    srAnnounce('Read-aloud off.');
  }
});

/* ══════════════════════════════════════════
   AUTO-GUIDE: announce section headings on scroll
══════════════════════════════════════════ */
let autoGuideOn = false;
$('autoread-toggle').addEventListener('click', function () {
  autoGuideOn = !autoGuideOn;
  this.setAttribute('aria-pressed', String(autoGuideOn));
  srAnnounce(autoGuideOn ? 'Auto-guide on. Section titles will be announced as you scroll.' : 'Auto-guide off.');
});
const autoGuideObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!autoGuideOn || !entry.isIntersecting) return;
    const heading = entry.target.querySelector('h2, h3');
    if (heading) { const text = heading.innerText || heading.textContent; if (text?.trim()) speakText(text.trim()); }
  });
}, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });
document.querySelectorAll('section[id]').forEach(sec => autoGuideObserver.observe(sec));

document.addEventListener('visibilitychange', () => {
  if (document.hidden && 'speechSynthesis' in window) window.speechSynthesis.cancel();
});

/* ══════════════════════════════════════════
   INDIAN SIGN LANGUAGE (ISL) MODULE  (Feature 2)
══════════════════════════════════════════ */
const ISL_ALPHA = {
  a:'🤙',b:'🖐',c:'🤏',d:'☝',e:'✊',f:'👌',g:'👉',h:'✌',
  i:'🤟',j:'🤘',k:'✌',l:'🤙',m:'✊',n:'✊',o:'👌',p:'👇',
  q:'👇',r:'🤞',s:'✊',t:'✊',u:'✌',v:'✌',w:'🖐',x:'☝',
  y:'🤙',z:'☝',' ':'　'
};
const ISL_WORDS = {
  'hello':'👋','hi':'👋','welcome':'🙏','thank':'🙏','you':'👆',
  'name':'✍','what':'🤷','where':'🤷','when':'🤷','how':'🤷',
  'yes':'👍','no':'👎','please':'🙏','sorry':'🙏','help':'🤝',
  'learn':'📚','read':'👁','write':'✍','speak':'🗣','listen':'👂',
  'education':'🎓','school':'🏫','teacher':'🧑‍🏫','student':'🧑‍🎓',
  'good':'👍','bad':'👎','big':'🙌','small':'🤏','fast':'💨',
  'stop':'✋','start':'▶','go':'👉','come':'👈','understand':'🧠',
  'question':'❓','answer':'💬','know':'💡','see':'👁','hear':'👂',
  'india':'🇮🇳','sign':'🤟','language':'💬','accessible':'♿',
  'disability':'🦽','deaf':'👂','blind':'👁','font':'🔠',
  'community':'🤝','document':'📄','image':'🖼','video':'🎬',
  'quiz':'❓','feedback':'💬','upload':'📤','text':'📝',
  'audio':'🔊','caption':'💬','color':'🎨','lexend':'🔠',
  'wcag':'📜','keyboard':'⌨️','screen':'🖥','reader':'📖'
};

let islQueue = [];
let islRunning = false;

function islPanelVisible() {
  const p = $('isl-panel');
  return p && !p.hidden;
}

function showISLForText(text) {
  if (!islPanelVisible()) return;
  const words = text.toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(Boolean);
  islQueue = islQueue.concat(words);
  if (!islRunning) processISLQueue();
}

function processISLQueue() {
  if (!islQueue.length) { islRunning = false; updateISLStatus('Ready'); return; }
  islRunning = true;
  const word = islQueue.shift();
  displayISLWord(word);
  const delay = word.length <= 3 ? 400 : word.length <= 6 ? 650 : 900;
  setTimeout(processISLQueue, delay);
}

function displayISLWord(word) {
  const lettersEl = $('isl-letters');
  const wordDisplay = $('isl-word-display');
  const placeholder = $('isl-placeholder');
  if (!lettersEl) return;
  if (placeholder) placeholder.style.display = 'none';
  lettersEl.style.display = 'flex';
  updateISLStatus(word);
  if (wordDisplay) wordDisplay.textContent = word;
  if (ISL_WORDS[word]) {
    lettersEl.innerHTML = `<span class="isl-sign isl-word-sign" title="${word}" role="img" aria-label="Sign for: ${word}">${ISL_WORDS[word]}</span>`;
  } else {
    lettersEl.innerHTML = word.split('').map(ch => {
      const sign = ISL_ALPHA[ch] || '🤟';
      return `<span class="isl-sign isl-letter-sign" title="${ch.toUpperCase()}" role="img" aria-label="Letter ${ch.toUpperCase()}">${sign}</span>`;
    }).join('');
  }
}

function updateISLStatus(text) {
  const st = $('isl-status');
  if (st) st.textContent = text;
}

// Build ISL panel
function buildISLPanel() {
  const panel = document.createElement('div');
  panel.id = 'isl-panel';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Indian Sign Language panel');
  panel.hidden = true;
  panel.innerHTML = `
    <div class="isl-header">
      <span class="isl-title" aria-hidden="true">🤟 ISL</span>
      <span class="isl-status" id="isl-status">Ready</span>
      <button class="isl-close" id="isl-close-btn" aria-label="Close Indian Sign Language panel">✕</button>
    </div>
    <div class="isl-body" id="isl-body">
      <div class="isl-placeholder" id="isl-placeholder">
        <span aria-hidden="true">🤟</span>
        <p>Signs appear here while text is being read aloud</p>
      </div>
      <div class="isl-letters" id="isl-letters" style="display:none" aria-hidden="true"></div>
      <div class="isl-word-display" id="isl-word-display" aria-live="polite"></div>
    </div>
    <div class="isl-size-row">
      <button class="isl-size-btn" id="isl-size-sm" aria-label="Small ISL panel">S</button>
      <button class="isl-size-btn isl-size-active" id="isl-size-md" aria-label="Medium ISL panel">M</button>
      <button class="isl-size-btn" id="isl-size-lg" aria-label="Large ISL panel">L</button>
    </div>
  `;
  document.body.appendChild(panel);

  $('isl-close-btn').addEventListener('click', () => {
    panel.hidden = true;
    $('isl-toggle-btn').setAttribute('aria-pressed','false');
    srAnnounce('ISL panel closed.');
  });
  ['sm','md','lg'].forEach(sz => {
    $(`isl-size-${sz}`).addEventListener('click', function() {
      document.querySelectorAll('.isl-size-btn').forEach(b => b.classList.remove('isl-size-active'));
      this.classList.add('isl-size-active');
      panel.className = '';
      panel.id = 'isl-panel';
      if (sz !== 'md') panel.classList.add(`isl-${sz}`);
    });
  });
}
buildISLPanel();

// ISL toggle button
$('isl-toggle-btn').addEventListener('click', function() {
  const panel = $('isl-panel');
  const on = panel.hidden;
  panel.hidden = !on;
  this.setAttribute('aria-pressed', String(on));
  srAnnounce(on ? 'Indian Sign Language panel opened.' : 'ISL panel closed.');
  if (on) islQueue = []; // clear stale queue
});

/* ══════════════════════════════════════════
   ACCESSIBLE TAB COMPONENT
══════════════════════════════════════════ */
const tabBtns   = Array.from(document.querySelectorAll('[role="tab"]'));
const tabPanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
function activateTab(btn) {
  tabBtns.forEach(b => { b.setAttribute('aria-selected','false'); b.classList.remove('tab-btn-active'); b.setAttribute('tabindex','-1'); });
  tabPanels.forEach(p => { p.hidden = true; });
  btn.setAttribute('aria-selected','true'); btn.classList.add('tab-btn-active'); btn.setAttribute('tabindex','0'); btn.focus();
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  if (panel) panel.hidden = false;
  srAnnounce(`${btn.textContent.trim()} tab selected`);
}
tabBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => activateTab(btn));
  btn.addEventListener('keydown', e => {
    let newIdx = idx;
    if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabBtns.length;
    else if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabBtns.length) % tabBtns.length;
    else if (e.key === 'Home') newIdx = 0;
    else if (e.key === 'End')  newIdx = tabBtns.length - 1;
    else return;
    e.preventDefault(); activateTab(tabBtns[newIdx]);
  });
});

/* ══════════════════════════════════════════
   DRAG-AND-DROP HELPERS
══════════════════════════════════════════ */
function initDropzone(zoneId, fileInputId, handler) {
  const zone  = $(zoneId);
  const input = $(fileInputId);
  if (!zone || !input) return;
  input.addEventListener('change', () => { if (input.files[0]) handler(input.files[0]); });
  ['dragenter','dragover'].forEach(ev => { zone.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); zone.classList.add('drag-over'); }); });
  ['dragleave','dragend'].forEach(ev => { zone.addEventListener(ev, () => zone.classList.remove('drag-over')); });
  zone.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); zone.classList.remove('drag-over'); const file = e.dataTransfer?.files[0]; if (file) handler(file); });
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
}

/* ══════════════════════════════════════════
   DOCUMENT PROCESSING
══════════════════════════════════════════ */
let docRawText = '';
let docSentences = [];
let docSpeaking = false;
let docISLEnabled = false;

function showDocProcessing(msg = 'Processing your file…') {
  $('doc-processing').hidden = false;
  $('doc-processing-msg').textContent = msg;
  $('doc-error').hidden = true;
  $('doc-viewer').hidden = true;
  srAnnounce(msg);
}
function hideDocProcessing() { $('doc-processing').hidden = true; }
function showDocError(msg) { hideDocProcessing(); const el = $('doc-error'); el.hidden = false; el.textContent = '⚠ ' + msg; srAnnounce(msg, true); }

function renderDocText(text) {
  docRawText = text;
  docSentences = text.match(/[^.!?\n]+(?:[.!?]+\s*|\n)/g) || text.split('\n').filter(Boolean);
  const contentEl = $('doc-content');
  contentEl.innerHTML = docSentences.map((s, i) => `<span class="doc-sentence" data-idx="${i}">${escapeHtml(s)}</span>`).join(' ');
  $('doc-meta').textContent = `${text.length.toLocaleString()} characters · ${countWords(text).toLocaleString()} words`;
  hideDocProcessing();
  $('doc-viewer').hidden = false;
  srAnnounce('Document ready. Use the toolbar to read aloud, show ISL, change font, or adjust contrast.');
}

function escapeHtml(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function countWords(str) { return str.trim().split(/\s+/).filter(Boolean).length; }

async function processDocFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  showDocProcessing(`Reading ${file.name}…`);
  try {
    if (ext === 'txt' || ext === 'csv') { renderDocText(await file.text()); }
    else if (ext === 'pdf') { await processPDF(file); }
    else if (ext === 'docx' || ext === 'doc') { await processDOCX(file); }
    else if (ext === 'xlsx' || ext === 'xls') { await processXLSX(file); }
    else { showDocError(`File type ".${ext}" is not supported. Try PDF, Word, Excel, or plain text.`); }
  } catch (err) { console.error(err); showDocError('Could not read this file. Error: ' + err.message); }
}

async function processPDF(file) {
  if (typeof pdfjsLib === 'undefined') { showDocError('PDF library not loaded. Check your internet and reload.'); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    showDocProcessing(`Extracting text — page ${i} of ${pdf.numPages}…`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n\n';
  }
  if (fullText.trim().length < 10) { showDocError('This PDF appears to be a scanned image. Use the Image tab with OCR instead.'); return; }
  renderDocText(fullText.trim());
}

async function processDOCX(file) {
  if (typeof mammoth === 'undefined') { showDocError('Word library not loaded.'); return; }
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  if (!result.value?.trim()) { showDocError('No readable text in this Word document.'); return; }
  renderDocText(result.value.trim());
}

async function processXLSX(file) {
  if (typeof XLSX === 'undefined') { showDocError('Excel library not loaded.'); return; }
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  let allText = '';
  wb.SheetNames.forEach(name => { const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name]); if (csv.trim()) allText += `Sheet: ${name}\n${'─'.repeat(30)}\n${csv}\n\n`; });
  if (!allText.trim()) { showDocError('No readable data in this Excel file.'); return; }
  renderDocText(allText.trim());
}

initDropzone('doc-dropzone', 'doc-file-input', processDocFile);

// ISL toggle for document
$('doc-isl-btn').addEventListener('click', function() {
  docISLEnabled = !docISLEnabled;
  this.setAttribute('aria-pressed', String(docISLEnabled));
  if (docISLEnabled) {
    // Open ISL panel if not open
    const panel = $('isl-panel');
    if (panel.hidden) { panel.hidden = false; $('isl-toggle-btn').setAttribute('aria-pressed','true'); }
    srAnnounce('ISL enabled for document. Press Read Aloud to see signs.');
  } else {
    srAnnounce('ISL disabled for document.');
  }
});

/* ── Document read-aloud with sentence highlighting + ISL ── */
$('doc-read-btn').addEventListener('click', function () {
  if (docSpeaking) return;
  if (!docSentences.length) { srAnnounce('No document loaded.', true); return; }
  if (!('speechSynthesis' in window)) { srAnnounce('Speech synthesis not supported. Try Chrome or Edge.', true); return; }
  docSpeaking = true;
  this.setAttribute('aria-pressed','true');
  this.hidden = true;
  $('doc-stop-btn').hidden = false;
  speakDocSentences(0);
});
$('doc-stop-btn').addEventListener('click', stopDocSpeech);

function speakDocSentences(startIdx) {
  if (startIdx >= docSentences.length || !docSpeaking) { stopDocSpeech(); return; }
  clearDocHighlight();
  const spanEl = document.querySelector(`.doc-sentence[data-idx="${startIdx}"]`);
  if (spanEl) { spanEl.classList.add('sentence-highlight'); spanEl.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
  if (docISLEnabled) showISLForText(docSentences[startIdx]);
  const utter = new SpeechSynthesisUtterance(docSentences[startIdx]);
  utter.rate = 0.92; utter.lang = 'en-US';
  utter.onend = () => { if (docSpeaking) speakDocSentences(startIdx + 1); };
  utter.onerror = () => { if (docSpeaking) speakDocSentences(startIdx + 1); };
  window.speechSynthesis.speak(utter);
}

function stopDocSpeech() {
  docSpeaking = false;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  clearDocHighlight();
  $('doc-read-btn').setAttribute('aria-pressed','false');
  $('doc-read-btn').hidden = false;
  $('doc-stop-btn').hidden = true;
  srAnnounce('Reading stopped.');
}
function clearDocHighlight() { document.querySelectorAll('.doc-sentence.sentence-highlight').forEach(el => el.classList.remove('sentence-highlight')); }

$('doc-dyslexia-btn').addEventListener('click', function () { const on = $('doc-content').classList.toggle('dyslexia-viewer'); this.setAttribute('aria-pressed', String(on)); srAnnounce(on ? 'Dyslexia font on for document' : 'Default font restored'); });
$('doc-contrast-btn').addEventListener('click', function () { const on = $('doc-content').classList.toggle('hc-viewer'); this.setAttribute('aria-pressed', String(on)); srAnnounce(on ? 'High contrast on' : 'Standard contrast restored'); });

['sm','md','lg','xl'].forEach(size => {
  $(`doc-txt-${size}`).addEventListener('click', function () {
    const content = $('doc-content');
    content.className = content.className.replace(/\btxt-\w+/g,'') + ` txt-${size}`;
    document.querySelectorAll('.viewer-size').forEach(b => b.classList.remove('viewer-size-active'));
    this.classList.add('viewer-size-active');
    srAnnounce(`Text size ${size.toUpperCase()}`);
  });
});

$('doc-download-btn').addEventListener('click', () => {
  if (!docRawText) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([docRawText], { type:'text/plain' }));
  a.download = 'document-text.txt'; a.click();
  srAnnounce('Text file downloaded.');
});

/* ══════════════════════════════════════════
   IMAGE VIEWER + OCR  (Features 3)
══════════════════════════════════════════ */
let imgFilters = { hc:false, gs:false, inv:false, sim:'none' };
let imgOcrText = '';

initDropzone('img-dropzone', 'img-file-input', processImageFile);

function processImageFile(file) {
  if (!file.type.startsWith('image/')) { srAnnounce('This file does not appear to be an image.', true); return; }
  const url = URL.createObjectURL(file);
  const preview = $('img-preview');
  preview.src = url; preview.alt = '';
  $('img-viewer').hidden = false;
  $('img-alt-input').value = '';
  $('img-caption-display').textContent = '';
  $('img-ocr-panel').hidden = true;
  imgOcrText = '';
  srAnnounce('Image loaded. Add a description, or press "Extract Text" to automatically recognise text in the image.');
}

$('img-alt-input').addEventListener('input', function () {
  const desc = this.value.trim();
  $('img-preview').alt = desc;
  $('img-caption-display').textContent = desc;
});

$('img-read-btn').addEventListener('click', () => {
  const desc = $('img-alt-input').value.trim();
  if (!desc) { srAnnounce('Please enter a description first.', true); return; }
  speakText(desc);
});

// ISL for image description
$('img-isl-desc-btn').addEventListener('click', function() {
  const desc = $('img-alt-input').value.trim();
  if (!desc) { srAnnounce('Please enter a description first.', true); return; }
  const on = !islPanelVisible();
  if (on) { $('isl-panel').hidden = false; $('isl-toggle-btn').setAttribute('aria-pressed','true'); }
  showISLForText(desc);
  this.setAttribute('aria-pressed','true');
  srAnnounce('Showing ISL for image description.');
});

// OCR using Tesseract.js
$('img-ocr-btn').addEventListener('click', async () => {
  const preview = $('img-preview');
  if (!preview.src || preview.src === window.location.href) { srAnnounce('No image loaded.', true); return; }
  if (typeof Tesseract === 'undefined') { srAnnounce('OCR library not loaded. Check your internet connection.', true); return; }

  $('img-ocr-btn').disabled = true;
  $('img-ocr-btn').textContent = '🔍 Recognising text…';
  srAnnounce('Extracting text from image using OCR. Please wait…');

  try {
    const result = await Tesseract.recognize(preview.src, 'eng', {
      logger: m => { if (m.status === 'recognizing text') srAnnounce(`OCR progress: ${Math.round(m.progress * 100)}%`); }
    });
    imgOcrText = result.data.text.trim();
    if (!imgOcrText) {
      srAnnounce('No readable text found in this image. Try a clearer image.', true);
    } else {
      $('img-ocr-text').textContent = imgOcrText;
      $('img-ocr-panel').hidden = false;
      // Pre-fill description if empty
      if (!$('img-alt-input').value.trim()) {
        $('img-alt-input').value = imgOcrText.substring(0, 200);
        $('img-preview').alt = imgOcrText.substring(0, 200);
      }
      srAnnounce(`Text extracted: ${imgOcrText.substring(0,80)}. Use the Read or ISL buttons to access it.`);
    }
  } catch(err) {
    srAnnounce('OCR failed: ' + err.message, true);
  }
  $('img-ocr-btn').disabled = false;
  $('img-ocr-btn').innerHTML = '<span aria-hidden="true">🔍</span> Extract Text (OCR)';
});

$('img-ocr-read-btn').addEventListener('click', () => {
  if (!imgOcrText) return;
  speakText(imgOcrText);
  srAnnounce('Reading extracted text aloud.');
});

$('img-ocr-isl-btn').addEventListener('click', () => {
  if (!imgOcrText) return;
  const panel = $('isl-panel');
  if (panel.hidden) { panel.hidden = false; $('isl-toggle-btn').setAttribute('aria-pressed','true'); }
  showISLForText(imgOcrText);
  srAnnounce('Showing ISL for extracted text.');
});

$('img-ocr-copy-btn').addEventListener('click', () => {
  if (!imgOcrText) return;
  navigator.clipboard.writeText(imgOcrText).then(() => srAnnounce('Text copied to clipboard.')).catch(() => srAnnounce('Copy failed — try selecting the text manually.'));
});

function applyImageFilters() {
  const preview = $('img-preview');
  let filters = [];
  if (imgFilters.hc)  filters.push('contrast(2.5) saturate(0)');
  if (imgFilters.gs)  filters.push('grayscale(1)');
  if (imgFilters.inv) filters.push('invert(1)');
  const simMap = { protanopia:'saturate(0.7) hue-rotate(-30deg)', deuteranopia:'saturate(0.6) hue-rotate(30deg)', tritanopia:'saturate(0.8) hue-rotate(180deg)' };
  if (imgFilters.sim !== 'none') filters.push(simMap[imgFilters.sim] || '');
  preview.style.filter = filters.join(' ') || 'none';
}

$('img-contrast-btn').addEventListener('click', function () { imgFilters.hc = !imgFilters.hc; this.setAttribute('aria-pressed', String(imgFilters.hc)); applyImageFilters(); srAnnounce(imgFilters.hc ? 'High contrast applied' : 'High contrast removed'); });
$('img-grayscale-btn').addEventListener('click', function () { imgFilters.gs = !imgFilters.gs; this.setAttribute('aria-pressed', String(imgFilters.gs)); applyImageFilters(); srAnnounce(imgFilters.gs ? 'Greyscale applied' : 'Greyscale removed'); });
$('img-invert-btn').addEventListener('click', function () { imgFilters.inv = !imgFilters.inv; this.setAttribute('aria-pressed', String(imgFilters.inv)); applyImageFilters(); srAnnounce(imgFilters.inv ? 'Colours inverted' : 'Inversion removed'); });

document.querySelectorAll('.sim-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.sim-btn').forEach(b => { b.classList.remove('sim-btn-active'); b.setAttribute('aria-pressed','false'); });
    this.classList.add('sim-btn-active'); this.setAttribute('aria-pressed','true');
    imgFilters.sim = this.dataset.filter; applyImageFilters();
    srAnnounce(this.textContent.trim() === 'Normal' ? 'Colour simulation removed' : `${this.textContent.trim()} simulation applied`);
  });
});

/* ══════════════════════════════════════════
   VIDEO PLAYER + CAPTIONS + ISL + SPEED +
   READING LINE + REPEAT SECTION  (Feature 4)
══════════════════════════════════════════ */
let recognition = null;
let captionLog   = [];
let capFontSize  = 'cap-md';
let vidISLEnabled = false;
let vidSectionStart = null;
let vidSectionEnd   = null;
let vidRepeating    = false;

initDropzone('vid-dropzone', 'vid-file-input', processVideoFile);

function processVideoFile(file) {
  if (!file.type.startsWith('video/')) { srAnnounce('This file does not appear to be a video.', true); return; }
  const player = $('vid-player');
  player.src = URL.createObjectURL(file);
  $('vid-viewer').hidden = false;
  resetCaptions($('caption-text'), $('caption-panel'));
  srAnnounce('Video loaded. Use the toolbar below to add captions, ISL, and speed controls.');
}

function resetCaptions(textEl, panelEl) {
  if (textEl) { textEl.textContent = 'Captions will appear here when live captioning is active.'; textEl.className = `caption-text caption-placeholder ${capFontSize}`; }
  if (panelEl) panelEl.classList.remove('captioning-active');
  captionLog = [];
}

function startRecognition(textEl, panelEl, btnEl) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { srAnnounce('Live captions require Chrome or Edge browser.', true); return; }
  recognition = new SpeechRecognition();
  recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
  recognition.onstart = () => { panelEl.classList.add('captioning-active'); btnEl.classList.add('recording'); srAnnounce('Microphone active. Captions are being generated.'); };
  recognition.onresult = (e) => {
    let interim = '', final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) { final += t + ' '; captionLog.push(t); }
      else { interim += t; }
    }
    textEl.textContent = (final || interim).trim() || '…';
    textEl.className = `caption-text ${capFontSize}`;
    if (final.trim()) {
      $('vid-download-captions') && ($('vid-download-captions').hidden = false);
      $('standalone-download')   && ($('standalone-download').hidden   = false);
      // Show ISL for new caption text
      if (vidISLEnabled) {
        const col = $('vid-isl-col');
        if (col && !col.hidden) showVidISL(final.trim());
      }
    }
  };
  recognition.onerror = (e) => {
    if (e.error === 'not-allowed') srAnnounce('Microphone access denied. Please allow microphone in browser settings.', true);
    else srAnnounce(`Caption error: ${e.error}`, true);
    stopRecognition(textEl, panelEl, btnEl);
  };
  recognition.onend = () => { if (btnEl.getAttribute('aria-pressed') === 'true') recognition.start(); };
  recognition.start();
}

function stopRecognition(textEl, panelEl, btnEl) {
  if (recognition) { recognition.onend = null; recognition.stop(); recognition = null; }
  panelEl.classList.remove('captioning-active'); btnEl.classList.remove('recording'); btnEl.setAttribute('aria-pressed','false');
  if (!captionLog.length) resetCaptions(textEl, panelEl);
  srAnnounce('Captioning stopped.');
}

$('vid-caption-btn').addEventListener('click', function () {
  const on = this.getAttribute('aria-pressed') !== 'true';
  this.setAttribute('aria-pressed', String(on));
  if (on) startRecognition($('caption-text'), $('caption-panel'), this);
  else    stopRecognition ($('caption-text'), $('caption-panel'), this);
});

// Video ISL
$('vid-isl-btn').addEventListener('click', function () {
  vidISLEnabled = !vidISLEnabled;
  this.setAttribute('aria-pressed', String(vidISLEnabled));
  const col = $('vid-isl-col');
  col.hidden = !vidISLEnabled;
  srAnnounce(vidISLEnabled ? 'ISL panel shown alongside captions.' : 'ISL panel hidden.');
});

function showVidISL(text) {
  const signsEl = $('vid-isl-signs');
  const wordEl  = $('vid-isl-word');
  if (!signsEl) return;
  const words = text.toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(Boolean);
  if (!words.length) return;
  const word = words[0]; // show first word immediately
  wordEl.textContent = word;
  if (ISL_WORDS[word]) {
    signsEl.innerHTML = `<span class="isl-sign isl-word-sign" aria-hidden="true">${ISL_WORDS[word]}</span>`;
  } else {
    signsEl.innerHTML = word.split('').map(ch => `<span class="isl-sign" aria-hidden="true">${ISL_ALPHA[ch]||'🤟'}</span>`).join('');
  }
}

// Reading line toggle
$('vid-reading-line-btn').addEventListener('click', function() {
  const on = this.getAttribute('aria-pressed') !== 'true';
  this.setAttribute('aria-pressed', String(on));
  $('vid-reading-line').hidden = !on;
  srAnnounce(on ? 'Reading line highlight enabled.' : 'Reading line hidden.');
});

// Speed control
document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const speed = parseFloat(this.dataset.speed);
    const player = $('vid-player');
    if (player) player.playbackRate = speed;
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('speed-btn-active'));
    this.classList.add('speed-btn-active');
    srAnnounce(`Playback speed set to ${speed}×`);
  });
});

// Section repeat
$('vid-mark-start').addEventListener('click', () => {
  const player = $('vid-player');
  if (!player || player.readyState === 0) { srAnnounce('No video loaded.', true); return; }
  vidSectionStart = player.currentTime;
  updateRepeatStatus();
  srAnnounce(`Section start marked at ${formatTime(vidSectionStart)}.`);
});

$('vid-mark-end').addEventListener('click', () => {
  const player = $('vid-player');
  if (!player || player.readyState === 0 || vidSectionStart === null) { srAnnounce('Mark section start first.', true); return; }
  vidSectionEnd = player.currentTime;
  if (vidSectionEnd <= vidSectionStart) { srAnnounce('Section end must be after section start.', true); return; }
  $('vid-repeat-btn').hidden = false;
  updateRepeatStatus();
  srAnnounce(`Section end marked at ${formatTime(vidSectionEnd)}. Press Repeat to loop this section.`);
});

$('vid-repeat-btn').addEventListener('click', function() {
  vidRepeating = !vidRepeating;
  this.textContent = vidRepeating ? '🔁 Stop Repeat' : '🔁 Repeat Section';
  this.setAttribute('aria-pressed', String(vidRepeating));
  if (vidRepeating) {
    const player = $('vid-player');
    player.currentTime = vidSectionStart;
    player.play();
    srAnnounce(`Repeating section from ${formatTime(vidSectionStart)} to ${formatTime(vidSectionEnd)}.`);
  } else {
    srAnnounce('Section repeat stopped.');
  }
  updateRepeatStatus();
});

// Check repeat loop
const vidPlayer = $('vid-player');
if (vidPlayer) {
  vidPlayer.addEventListener('timeupdate', () => {
    if (vidRepeating && vidSectionEnd !== null && vidPlayer.currentTime >= vidSectionEnd) {
      vidPlayer.currentTime = vidSectionStart;
    }
  });
}

function updateRepeatStatus() {
  const statusEl = $('vid-repeat-status');
  if (!statusEl) return;
  if (vidSectionStart === null && vidSectionEnd === null) { statusEl.hidden = true; return; }
  statusEl.hidden = false;
  let msg = '';
  if (vidSectionStart !== null) msg += `Start: ${formatTime(vidSectionStart)}`;
  if (vidSectionEnd   !== null) msg += `  →  End: ${formatTime(vidSectionEnd)}`;
  if (vidRepeating) msg += '  🔁 Repeating';
  statusEl.textContent = msg;
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// Caption size
['sm','md','lg'].forEach(size => {
  $(`cap-${size}`).addEventListener('click', function () {
    capFontSize = `cap-${size}`;
    document.querySelectorAll('.cap-size').forEach(b => { b.classList.remove('cap-size-active'); b.setAttribute('aria-pressed','false'); });
    this.classList.add('cap-size-active'); this.setAttribute('aria-pressed','true');
    const ct = $('caption-text'); if (ct) ct.className = ct.className.replace(/\bcap-\w+/g,capFontSize);
    srAnnounce(`Caption size ${size}`);
  });
});

$('vid-download-captions') && $('vid-download-captions').addEventListener('click', () => downloadCaptions());

// Standalone mic captions
let standaloneMicOn = false;
$('mic-standalone-btn').addEventListener('click', function () {
  standaloneMicOn = !standaloneMicOn;
  this.setAttribute('aria-pressed', String(standaloneMicOn));
  const panel = $('caption-panel-standalone'); const textEl = $('caption-text-standalone');
  panel.hidden = false;
  if (standaloneMicOn) { this.innerHTML = '<span aria-hidden="true">⏹</span> Stop Captions'; this.classList.add('btn-primary'); startRecognition(textEl, panel, this); }
  else { this.innerHTML = '<span aria-hidden="true">🎤</span> Start Live Lecture Captions'; this.classList.remove('btn-primary'); stopRecognition(textEl, panel, this); }
});

$('standalone-download') && $('standalone-download').addEventListener('click', () => downloadCaptions());

function downloadCaptions() {
  if (!captionLog.length) { srAnnounce('No captions to download.', true); return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([captionLog.join('\n')], { type:'text/plain' }));
  a.download = 'lecture-captions.txt'; a.click();
  srAnnounce('Captions downloaded.');
}

/* ══════════════════════════════════════════
   ACCESSIBLE QUIZ SYSTEM  (Feature 6)
   Voice answers, keyboard answers,
   simplified structure, one question at a time
══════════════════════════════════════════ */
const QUIZ_ANSWERS = { q1:'b', q2:'b', q3:'c' };
const QUIZ_FEEDBACK = {
  q1: { b: 'Correct! WCAG 2.1 stands for Web Content Accessibility Guidelines — the international standard for accessible web design.', wrong: 'Not quite. WCAG 2.1 stands for Web Content Accessibility Guidelines — the international standard for making websites accessible to all users.' },
  q2: { b: 'Correct! In EduVoice, pressing Tab moves focus to each element one by one and reads it aloud — no mouse needed.', wrong: 'Not quite. In EduVoice, the Tab key navigates between elements and reads each one aloud for visually impaired users.' },
  q3: { c: 'Correct! Lexend is a typeface specifically designed to reduce visual stress for readers with dyslexia. It\'s available free on Google Fonts.', wrong: 'Not quite. Lexend is the recommended font for dyslexic learners — it reduces visual stress and is free on Google Fonts.' }
};

let quizCurrentQ = 0;
const totalQ = 3;

function updateQuizProgress() {
  const fill = $('quiz-progress-fill');
  const text = $('quiz-progress-text');
  const bar  = $('quiz-progress-bar');
  const pct  = ((quizCurrentQ) / totalQ) * 100;
  fill.style.width = pct + '%';
  bar.setAttribute('aria-valuenow', quizCurrentQ);
  text.textContent = `Question ${quizCurrentQ + 1} of ${totalQ}`;
  srAnnounce(`Question ${quizCurrentQ + 1} of ${totalQ}`);
}

function showQuestion(idx) {
  document.querySelectorAll('.quiz-question').forEach((q, i) => { q.hidden = i !== idx; });
  $('quiz-prev-btn').disabled = idx === 0;
  $('quiz-next-btn').hidden   = idx === totalQ - 1;
  $('quiz-submit-btn').hidden = idx !== totalQ - 1;
  quizCurrentQ = idx;
  updateQuizProgress();
  // Read question aloud
  const qTextEl = document.querySelector(`#quiz-q${idx+1} .quiz-q-text`);
  if (qTextEl) setTimeout(() => speakText(qTextEl.textContent), 400);
}

// Read question button on each question
document.querySelectorAll('.quiz-read-q-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const qTextEl = document.querySelector(`#quiz-q${i+1} .quiz-q-text`);
    if (qTextEl) speakText(qTextEl.textContent);
  });
});

// Keyboard on quiz options (Space/Enter to select)
document.querySelectorAll('.quiz-option').forEach(opt => {
  opt.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); const radio = opt.querySelector('input[type="radio"]'); if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles:true })); } }
  });
  opt.addEventListener('click', () => {
    const radio = opt.querySelector('input[type="radio"]');
    if (radio) { radio.checked = true; speakText(opt.querySelector('span:last-child').textContent); }
  });
});

$('quiz-next-btn').addEventListener('click', () => { if (quizCurrentQ < totalQ - 1) showQuestion(quizCurrentQ + 1); });
$('quiz-prev-btn').addEventListener('click', () => { if (quizCurrentQ > 0) showQuestion(quizCurrentQ - 1); });

$('quiz-submit-btn').addEventListener('click', () => {
  let score = 0;
  let allAnswered = true;
  // Inline feedback per question
  ['q1','q2','q3'].forEach((q, i) => {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    const fbEl = $(`quiz-feedback-${q}`);
    if (!selected) { allAnswered = false; return; }
    const correct = selected.value === QUIZ_ANSWERS[q];
    if (correct) score++;
    fbEl.hidden = false;
    fbEl.className = `quiz-feedback ${correct ? 'quiz-correct' : 'quiz-wrong'}`;
    fbEl.textContent = correct ? '✓ ' + QUIZ_FEEDBACK[q][selected.value] : '✗ ' + QUIZ_FEEDBACK[q].wrong;
  });
  if (!allAnswered) { srAnnounce('Please answer all questions before submitting.', true); return; }
  // Show result
  const result = $('quiz-result');
  const circle = $('quiz-score-circle');
  const text   = $('quiz-result-text');
  circle.textContent = `${score}/${totalQ}`;
  circle.className   = `quiz-score-circle ${score === totalQ ? 'score-perfect' : score >= 2 ? 'score-good' : 'score-low'}`;
  const msgs = ['Keep going — every attempt builds knowledge!', 'Good work — one more and you\'ll ace it!', 'Excellent! You know your accessibility basics.'];
  text.textContent = msgs[score] || msgs[2];
  result.hidden = false;
  result.scrollIntoView({ behavior:'smooth', block:'center' });
  speakText(`Quiz complete. You scored ${score} out of ${totalQ}. ${text.textContent}`);
  $('quiz-questions-wrap').hidden = true;
  document.querySelector('.quiz-nav').hidden = true;
});

$('quiz-restart-btn').addEventListener('click', () => {
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.querySelectorAll('.quiz-feedback').forEach(f => { f.hidden = true; f.textContent = ''; });
  $('quiz-result').hidden = true;
  $('quiz-questions-wrap').hidden = false;
  document.querySelector('.quiz-nav').hidden = false;
  showQuestion(0);
  srAnnounce('Quiz restarted. Question 1.');
});

// Voice answers for quiz
function initVoiceAnswer(qNum, correctValue, correctLetter) {
  const btn = $(`quiz-voice-q${qNum}`);
  const hint = $(`quiz-voice-hint-q${qNum}`);
  if (!btn) return;
  let voiceRec = null;

  btn.addEventListener('click', function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { srAnnounce('Voice input requires Chrome or Edge.', true); return; }
    if (voiceRec) { voiceRec.stop(); voiceRec = null; btn.innerHTML = '<span aria-hidden="true">🎤</span> Voice Answer'; hint.textContent = ''; return; }
    voiceRec = new SpeechRecognition();
    voiceRec.lang = 'en-US'; voiceRec.interimResults = false; voiceRec.maxAlternatives = 3;
    btn.innerHTML = '<span aria-hidden="true">⏹</span> Listening…';
    hint.textContent = 'Speak: "A", "B", "C", or "D"…';
    voiceRec.onresult = (e) => {
      const spoken = e.results[0][0].transcript.trim().toUpperCase();
      hint.textContent = `Heard: "${spoken}"`;
      // Match A/B/C/D
      const letterMatch = spoken.match(/\b([ABCD])\b/);
      if (letterMatch) {
        const letter = letterMatch[1].toLowerCase();
        const radio = document.querySelector(`input[name="q${qNum}"][value="${letter}"]`);
        if (radio) { radio.checked = true; speakText(`Selected option ${letterMatch[1]}`); srAnnounce(`Answered ${letterMatch[1]}.`); }
      } else {
        hint.textContent = 'Not recognised. Say A, B, C, or D.';
        srAnnounce('Answer not recognised. Please say A, B, C, or D.', true);
      }
      voiceRec = null; btn.innerHTML = '<span aria-hidden="true">🎤</span> Voice Answer';
    };
    voiceRec.onerror = () => { hint.textContent = 'Voice error. Try again.'; voiceRec = null; btn.innerHTML = '<span aria-hidden="true">🎤</span> Voice Answer'; };
    voiceRec.start();
  });
}
initVoiceAnswer(1, 'b', 'B');
initVoiceAnswer(2, 'b', 'B');
initVoiceAnswer(3, 'c', 'C');

// Init quiz at Q1
showQuestion(0);

/* ══════════════════════════════════════════
   FEEDBACK WIDGET  (Feature 7)
══════════════════════════════════════════ */
let feedbackRating = 0;

$('feedback-trigger').addEventListener('click', () => {
  const widget = $('feedback-widget');
  widget.hidden = !widget.hidden;
  if (!widget.hidden) {
    srAnnounce('Accessibility feedback panel opened.');
    $('feedback-close').focus();
  }
});

$('feedback-close').addEventListener('click', () => {
  $('feedback-widget').hidden = true;
  $('feedback-trigger').focus();
  srAnnounce('Feedback panel closed.');
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('feedback-widget').hidden) {
    $('feedback-widget').hidden = true;
    $('feedback-trigger').focus();
  }
});

// Star rating
document.querySelectorAll('.star-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    feedbackRating = parseInt(this.dataset.rating);
    document.querySelectorAll('.star-btn').forEach((b, i) => {
      b.classList.toggle('star-active', i < feedbackRating);
    });
    const labels = ['','Very difficult','Difficult','OK','Easy','Very easy'];
    $('feedback-rating-val').textContent = `Rated ${feedbackRating} star${feedbackRating > 1 ? 's' : ''}: ${labels[feedbackRating]}`;
    srAnnounce(`Rating set to ${feedbackRating} — ${labels[feedbackRating]}`);
  });
  // Keyboard star rating
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const stars = Array.from(document.querySelectorAll('.star-btn'));
      const idx   = stars.indexOf(btn);
      const newIdx = e.key === 'ArrowRight' ? Math.min(idx + 1, stars.length - 1) : Math.max(idx - 1, 0);
      stars[newIdx].click(); stars[newIdx].focus();
    }
  });
});

$('feedback-submit-btn').addEventListener('click', () => {
  const issues = Array.from(document.querySelectorAll('input[name="fb-issue"]:checked')).map(cb => cb.value);
  const detail = $('fb-detail').value.trim();

  if (!issues.length && !detail && !feedbackRating) {
    srAnnounce('Please select an issue, add a comment, or give a rating before submitting.', true);
    return;
  }

  // Simulate submit
  const thanks = $('feedback-thanks');
  thanks.hidden = false;
  thanks.innerHTML = `<span aria-hidden="true">✓</span> Thank you! Your feedback helps us improve EduVoice for everyone.${issues.length ? ' We\'ll look at: ' + issues.join(', ') + '.' : ''}`;
  speakText('Thank you for your feedback. We will use it to improve EduVoice.');

  // Auto-apply quick fixes
  if (issues.includes('contrast')) {
    document.body.classList.add('high-contrast');
    $('contrast-toggle').setAttribute('aria-pressed','true');
    srAnnounce('High contrast mode automatically enabled based on your feedback.');
  }
  if (issues.includes('text')) {
    textIdx = Math.min(textIdx + 1, TEXT_SIZES.length - 1);
    applyTextSize(textIdx);
  }

  // Reset form after delay
  setTimeout(() => {
    document.querySelectorAll('input[name="fb-issue"]').forEach(cb => cb.checked = false);
    $('fb-detail').value = '';
    feedbackRating = 0;
    document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('star-active'));
    thanks.hidden = true;
    $('feedback-widget').hidden = true;
    $('feedback-trigger').focus();
  }, 4000);
});

