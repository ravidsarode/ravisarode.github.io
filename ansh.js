// ============================================================
// Ansh — AI chatbot about Ravi Sarode's profile
// ============================================================
(function () {
  const ENDPOINT = '/api/ansh';
  const SUGGESTIONS = [
    'Where do you work right now?',
    
    'How many years of experience do you have?',
    'What is your tech stack?',
    'Tell me about a recent project.'
  ];
  const FALLBACK_NOTE = "// ansh is offline — please email ravidsarode@gmail.com";
  const MAX_TURNS = 10;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const widget = document.createElement('div');
  widget.id = 'anshWidget';
  widget.innerHTML = `
    <button class="ansh-fab is-open" id="anshFab" type="button" aria-label="Close Ansh chatbot" aria-expanded="true" aria-controls="anshPanel">
      <svg class="ansh-fab__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4 3v-3H6.5A2.5 2.5 0 0 1 4 14.5v-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="9"  cy="10.5" r="1" fill="currentColor"/>
        <circle cx="12" cy="10.5" r="1" fill="currentColor"/>
        <circle cx="15" cy="10.5" r="1" fill="currentColor"/>
      </svg>
      <svg class="ansh-fab__close" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>

  <section class="ansh-panel is-open" id="anshPanel" role="dialog" aria-label="Ansh chatbot" aria-hidden="false">
      <header class="ansh-panel__header">
        <div class="ansh-panel__avatar" aria-hidden="true">A</div>
        <div class="ansh-panel__title">
          <span class="ansh-panel__name">
            Ansh
            <span class="dot dot--live" aria-hidden="true" style="width:8px;height:8px;"></span>
          </span>
          <span class="ansh-panel__sub">// ask me about ravi</span>
        </div>
        <button class="ansh-panel__close" id="anshClose" type="button" aria-label="Close chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </header>

      <div class="ansh-panel__log" id="anshLog" role="log" aria-live="polite" aria-atomic="false"></div>

      <div class="ansh-panel__suggestions" id="anshSuggestions">
        <span class="ansh-panel__suggestions-label">// try asking</span>
        ${SUGGESTIONS.map(q => `<button class="ansh-chip" type="button" data-q="${q.replace(/"/g,'&quot;')}">${q}</button>`).join('')}
      </div>

      <form class="ansh-panel__form" id="anshForm" autocomplete="off">
        <textarea class="ansh-panel__input" id="anshInput" rows="1" placeholder="Ask about Ravi..." aria-label="Message Ansh" required></textarea>
        <button class="ansh-panel__send" id="anshSend" type="submit" aria-label="Send message">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8h11m0 0-4-4m4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </form>
    </section>
  `;
  document.body.appendChild(widget);

  // Panel is open by default — greet the visitor once on first render
  setTimeout(() => {
    if (log.children.length === 0) {
      addBot("Hi, I'm Ansh — Ravi's portfolio assistant. Ask me anything about his work, stack, or background.");
    }
  }, 250);

  const fab        = document.getElementById('anshFab');
  const panel      = document.getElementById('anshPanel');
  const closeBtn   = document.getElementById('anshClose');
  const log        = document.getElementById('anshLog');
  const suggestions= document.getElementById('anshSuggestions');
  const form       = document.getElementById('anshForm');
  const input      = document.getElementById('anshInput');
  const sendBtn    = document.getElementById('anshSend');

  const messages = [];
  let isOpen = true;
  let busy = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    fab.classList.add('is-open');
    fab.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (log.children.length === 0) {
      addBot("Hi, I'm Ansh — Ravi's portfolio assistant. Ask me anything about his work, stack, or background.");
    }
    setTimeout(() => input.focus(), 50);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    fab.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    fab.focus();
  }

  fab.addEventListener('click', () => (isOpen ? close() : open()));
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  function addBubble(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `ansh-msg ansh-msg--${role}`;
    wrap.innerHTML = `
      <div class="ansh-msg__avatar" aria-hidden="true">${role === 'user' ? 'You' : 'A'}</div>
      <div class="ansh-msg__bubble"></div>
    `;
    wrap.querySelector('.ansh-msg__bubble').textContent = text;
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function addTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'ansh-msg ansh-msg--bot ansh-typing-wrap';
    wrap.innerHTML = `
      <div class="ansh-msg__avatar" aria-hidden="true">A</div>
      <div class="ansh-msg__bubble">
        <span class="ansh-typing" aria-label="Ansh is typing">
          <span class="ansh-typing__dot"></span>
          <span class="ansh-typing__dot"></span>
          <span class="ansh-typing__dot"></span>
        </span>
      </div>
    `;
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
    if (state) {
      suggestions.style.display = 'none';
    }
  }

  function showError(msg) {
    const err = document.createElement('div');
    err.className = 'ansh-panel__error';
    err.textContent = msg;
    panel.querySelector('.ansh-panel__form').insertAdjacentElement('beforebegin', err);
    setTimeout(() => err.remove(), 6000);
  }

  async function send(text) {
    const question = (text || input.value).trim();
    if (!question || busy) return;

    setBusy(true);
    addBubble('user', question);
    input.value = '';
    input.style.height = 'auto';
    messages.push({ role: 'user', content: question });

    const trimmed = messages.slice(-MAX_TURNS * 2);
    const typing = addTyping();

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: trimmed })
      });

      typing.remove();

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = (data && data.reply) || '';
      addBubble('bot', reply);
      messages.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      addBubble('bot', FALLBACK_NOTE);
      showError('// could not reach ansh — try again, or use the contact form below');
    } finally {
      setBusy(false);
      if (!reduceMotion) input.focus();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send();
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  suggestions.addEventListener('click', (e) => {
    const btn = e.target.closest('.ansh-chip');
    if (!btn) return;
    send(btn.dataset.q);
  });
})();
