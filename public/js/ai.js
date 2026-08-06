// QuickBill POS — Reliable hands-free "Hey Access" assistant
// Strategy: short listen cycles (Chrome-friendly) + wake word + open command window.

class VoiceAssistant {
  constructor() {
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = null;
    this.isListening = false;
    this.handsFree = false;
    this.muted = false;
    this.speaking = false;
    this.awaitingCommand = false;
    this.restartTimer = null;
    this.followUpTimer = null;
    this.lastHandledKey = '';
    this.partialBuffer = '';
    this.supported = !!this.SpeechRecognition;

    if (!this.supported) {
      console.warn('[Voice] Web Speech API not supported. Use Chrome/Edge.');
    }

    this.bindUiHooks();
  }

  bindUiHooks() {
    // Re-arm listening on any click inside the POS (preserves mic permission / gesture)
    document.addEventListener('click', (e) => {
      const appView = document.getElementById('app-view');
      if (!appView || appView.style.display === 'none') return;
      if (this.muted || !this.supported) return;
      if (!this.handsFree) {
        this.enableHandsFree({ silent: true });
      } else if (!this.isListening && !this.speaking) {
        this.startListening();
      }
    }, true);
  }

  createRecognizer() {
    const rec = new this.SpeechRecognition();
    // Non-continuous cycles are far more reliable in Chrome than continuous=true
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 5;
    rec.lang = 'en-US';

    rec.onstart = () => {
      this.isListening = true;
      this.setStatus(this.awaitingCommand ? 'Listening for your command…' : 'Listening — say “Hey Access”');
      this.updateMicStatusUI();
    };

    rec.onend = () => {
      this.isListening = false;
      this.clearStatus();
      this.updateMicStatusUI();
      if (this.handsFree && !this.muted && !this.speaking) {
        this.scheduleRestart(220);
      }
    };

    rec.onerror = (event) => {
      this.isListening = false;
      this.clearStatus();
      const err = event.error;
      console.warn('[Voice Error]', err);
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        this.handsFree = false;
        this.showToast('Allow microphone permission for Hey Access');
        this.updateMicStatusUI();
        return;
      }
      if (this.handsFree && !this.muted && !this.speaking && err !== 'aborted') {
        this.scheduleRestart(err === 'network' ? 1000 : 350);
      }
    };

    rec.onresult = (event) => {
      if (this.speaking || this.muted) return;

      let interim = '';
      let finals = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const alt = this.bestAlternative(event.results[i]);
        if (event.results[i].isFinal) finals += ` ${alt}`;
        else interim += ` ${alt}`;
      }

      interim = interim.trim();
      finals = finals.trim();

      if (interim) {
        this.setStatus(`Hearing: “${interim}”`);
        const n = this.normalize(interim);
        if (this.hasWake(n) && !this.awaitingCommand) {
          // Open command window early (don't speak yet — wait for final)
          this.openCommandWindow({ greet: false });
        }
      }

      if (!finals) return;

      const key = this.normalize(finals);
      const dedupeKey = `${key}|${this.awaitingCommand ? 1 : 0}`;
      if (dedupeKey === this.lastHandledKey && Date.now() - (this._lastAt || 0) < 1200) return;
      this.lastHandledKey = dedupeKey;
      this._lastAt = Date.now();

      console.log('[Voice Final]', finals);
      this.setStatus(`Heard: “${finals}”`);
      this.handleUtterance(finals);
    };

    return rec;
  }

  bestAlternative(result) {
    let best = result[0]?.transcript || '';
    let bestScore = this.score(best);
    for (let i = 1; i < result.length; i++) {
      const t = result[i]?.transcript || '';
      const s = this.score(t);
      if (s > bestScore) {
        best = t;
        bestScore = s;
      }
    }
    return best;
  }

  score(text) {
    const n = this.normalize(text);
    let s = n.length;
    if (this.hasWake(n)) s += 80;
    if (/\b(add|scan|checkout|clear|cart|pay|bill|milk|bread|rice|coffee)\b/.test(n)) s += 40;
    return s;
  }

  scheduleRestart(ms = 250) {
    clearTimeout(this.restartTimer);
    this.restartTimer = setTimeout(() => {
      if (this.handsFree && !this.muted && !this.isListening && !this.speaking) {
        this.startListening();
      }
    }, ms);
  }

  startListening() {
    if (!this.supported || this.muted || this.speaking) return;
    try {
      if (!this.recognition) this.recognition = this.createRecognizer();
      this.recognition.start();
    } catch (e) {
      // InvalidStateError: already started — recreate and retry once
      try {
        this.recognition = this.createRecognizer();
        this.recognition.start();
      } catch (e2) {
        this.scheduleRestart(500);
      }
    }
  }

  stopListening() {
    clearTimeout(this.restartTimer);
    try { this.recognition?.abort(); } catch (e) {
      try { this.recognition?.stop(); } catch (e2) {}
    }
    this.isListening = false;
  }

  async enableHandsFree(opts = {}) {
    if (!this.supported) {
      this.showToast('Voice needs Chrome or Edge browser');
      return false;
    }
    this.muted = false;
    this.handsFree = true;

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {
      this.handsFree = false;
      this.showToast('Please allow microphone access');
      return false;
    }

    this.recognition = this.createRecognizer();
    this.startListening();
    this.updateMicStatusUI();
    if (!opts.silent) {
      this.showToast('Hey Access is listening', 3000);
    }
    return true;
  }

  disableHandsFree() {
    this.handsFree = false;
    this.awaitingCommand = false;
    this.muted = false;
    clearTimeout(this.followUpTimer);
    this.stopListening();
    this.clearStatus();
    this.updateMicStatusUI();
  }

  /** Voice button: unmute + force start (always works after Allow) */
  toggleListening() {
    if (!this.supported) {
      this.promptManual();
      return;
    }
    if (this.handsFree && !this.muted) {
      // Mute
      this.muted = true;
      this.handsFree = false;
      this.awaitingCommand = false;
      this.stopListening();
      this.clearStatus();
      this.updateMicStatusUI();
      this.showToast('Hey Access muted — click again to enable');
      return;
    }
    // Enable / unmute with user gesture
    this.enableHandsFree();
  }

  activate() {
    return this.enableHandsFree();
  }

  openCommandWindow({ greet = true } = {}) {
    this.awaitingCommand = true;
    this.updateMicStatusUI();
    if (this.isListening) {
      this.setStatus('Access is ready — say add milk, checkout, scan…');
    }
    clearTimeout(this.followUpTimer);
    this.followUpTimer = setTimeout(() => {
      this.awaitingCommand = false;
      this.updateMicStatusUI();
    }, 25000);

    if (greet) {
      this.speak("Hi, I'm Access. How can I help?");
    } else {
      this.showToast('Access is listening for your command…');
    }
  }

  normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  hasWake(text) {
    const n = this.normalize(text);
    const compact = n.replace(/\s+/g, '');
    if (/\b(hey|hi|hello|ok|okay|yo)\s+(access|axis|assess|excess|assist|akses|essex|ashes|accents?)\b/.test(n)) {
      return true;
    }
    if (/^(hey|hi|hello|ok|okay|yo)(access|axis|assess|excess|assist|akses)/.test(compact)) {
      return true;
    }
    return false;
  }

  stripWake(text) {
    let n = this.normalize(text);
    n = n.replace(/\b(hey|hi|hello|ok|okay|yo)\s+(access|axis|assess|excess|assist|akses|essex|ashes|accents?)\b/g, ' ');
    n = n.replace(/\b(hey|hi|hello)?access\b/g, ' ');
    return n.replace(/\s+/g, ' ').trim();
  }

  isLikelyCommand(text) {
    const n = this.normalize(text);
    return /\b(add|buy|get|cart|scan|barcode|checkout|check out|pay|bill|clear|empty|search|find|show|help)\b/.test(n);
  }

  handleUtterance(transcript) {
    const raw = this.normalize(transcript);
    const wake = this.hasWake(raw);
    const command = this.stripWake(raw);

    // Ambient noise — ignore unless wake or open command window or clear command verb
    if (!wake && !this.awaitingCommand && !this.isLikelyCommand(raw)) {
      return;
    }

    // Wake only
    if (wake && !command) {
      this.openCommandWindow({ greet: true });
      return;
    }

    // Wake + command together: "hey access add milk"
    if (wake && command) {
      this.openCommandWindow({ greet: false });
      this.runIntent(command, transcript);
      return;
    }

    // Follow-up after wake, OR clear command while hands-free
    if (this.awaitingCommand || this.isLikelyCommand(raw)) {
      if (!this.awaitingCommand) this.openCommandWindow({ greet: false });
      this.runIntent(command || raw, transcript);
      return;
    }
  }

  runIntent(commandText, original) {
    const intent = this.parseIntent(commandText);
    this.showToast(`Command: “${original}”`);
    this.execute(intent, original);
  }

  parseIntent(command) {
    const c = this.normalize(command);
    if (!c) return { action: 'HELP' };
    if (/\b(help|what can you do)\b/.test(c)) return { action: 'HELP' };
    if (/\b(checkout|check out|pay|payment|bill)\b/.test(c)) return { action: 'CHECKOUT' };
    if (/\b(scan|barcode|camera)\b/.test(c)) return { action: 'SCAN' };
    if (/\b(clear|empty|reset)\b/.test(c)) return { action: 'CLEAR' };
    if (/\b(search|find|show)\b/.test(c)) {
      const target = c.replace(/\b(search|find|show|for|product|products|me|please)\b/g, ' ').replace(/\s+/g, ' ').trim();
      return { action: 'SEARCH', target };
    }
    if (/\btelugu\b/.test(c)) return { action: 'LANG', target: 'te' };
    if (/\btamil\b/.test(c)) return { action: 'LANG', target: 'ta' };
    if (/\bhindi\b/.test(c)) return { action: 'LANG', target: 'hi' };
    if (/\b(spanish|espanol)\b/.test(c)) return { action: 'LANG', target: 'es' };
    if (/\benglish\b/.test(c)) return { action: 'LANG', target: 'en' };

    // Add to cart — strip filler words
    let target = c
      .replace(/\b(add|to|cart|please|get|me|i|want|buy|pack|of|bottle|one|two|a|an|the|some|order|my|put)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return { action: 'ADD', target: target || '' };
  }

  findProduct(target) {
    const products = window.POS_APP?.products || [];
    if (!target || !products.length) return null;
    const clean = target.toLowerCase().trim();
    const words = clean.split(/\s+/).filter((w) => w.length > 1);

    const scored = products.map((p) => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      let score = 0;
      if (name === clean) score += 100;
      if (name.includes(clean)) score += 50;
      if (clean.includes(name.split(' ')[0])) score += 20;
      words.forEach((w) => {
        if (name.includes(w)) score += 15;
        if (cat.includes(w)) score += 8;
      });
      if (String(p.barcode || '').includes(clean)) score += 40;
      return { p, score };
    }).filter((x) => x.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.p || null;
  }

  execute(intent) {
    const app = window.POS_APP;

    switch (intent.action) {
      case 'HELP':
        this.openCommandWindow({ greet: false });
        this.speak('You can say add milk, scan barcode, checkout, or clear cart.');
        break;

      case 'ADD': {
        if (!intent.target) {
          this.openCommandWindow({ greet: false });
          this.speak('Which product should I add?');
          this.setStatus('Say a product name, e.g. milk');
          return;
        }
        const product = this.findProduct(intent.target);
        if (product) {
          app?.addToCart(product);
          this.speak(`Added ${product.name}`);
          this.showToast(`Added “${product.name}” · ₹${Number(product.price).toFixed(2)}`);
          this.setStatus(`Added ${product.name} — say another command or Hey Access`);
          // Keep window open for rapid multi-add
          this.openCommandWindow({ greet: false });
        } else {
          this.speak(`I could not find ${intent.target}`);
          this.showToast(`No product matched “${intent.target}”`);
          this.setStatus('Try another product name');
          this.openCommandWindow({ greet: false });
        }
        break;
      }

      case 'SCAN':
        this.speak('Opening scanner');
        app?.openScannerModal();
        break;

      case 'CHECKOUT':
        this.speak('Starting checkout');
        app?.processCheckout();
        this.awaitingCommand = false;
        break;

      case 'CLEAR':
        this.speak('Cart cleared');
        app?.clearCart();
        this.showToast('Cart cleared');
        break;

      case 'SEARCH': {
        const input = document.getElementById('pos-search-input');
        if (input && intent.target) {
          input.value = intent.target;
          app?.handleSearch(intent.target);
        }
        this.speak(`Searching ${intent.target || ''}`);
        break;
      }

      case 'LANG':
        if (intent.target) {
          const sel = document.getElementById('lang-selector');
          if (sel) sel.value = intent.target;
          app?.changeLanguage(intent.target);
          this.speak('Language updated');
        }
        break;

      default:
        this.speak('Please say Hey Access, then your command');
        this.setStatus('Say “Hey Access” then add milk / checkout / clear cart');
    }
  }

  speak(text) {
    if (!('speechSynthesis' in window)) return;
    this.speaking = true;
    this.stopListening();
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 1.05;
      const resume = () => {
        this.speaking = false;
        if (this.handsFree && !this.muted) this.scheduleRestart(400);
      };
      u.onend = resume;
      u.onerror = resume;
      setTimeout(() => { if (this.speaking) resume(); }, 7000);
      window.speechSynthesis.speak(u);
    } catch (e) {
      this.speaking = false;
      this.scheduleRestart(300);
    }
  }

  setStatus(msg) {
    const el = document.getElementById('voice-live-status');
    if (!el) return;
    // Only show bottom status pill while microphone is actively listening
    if (!msg || !this.isListening) {
      el.textContent = '';
      el.classList.remove('is-listening');
      el.style.display = 'none';
      return;
    }
    el.textContent = msg;
    el.classList.add('is-listening');
    el.style.display = 'block';
  }

  clearStatus() {
    const el = document.getElementById('voice-live-status');
    if (!el) return;
    el.textContent = '';
    el.classList.remove('is-listening');
    el.style.display = 'none';
  }

  showToast(msg, ms = 3500) {
    if (window.POS_APP?.showToast) {
      window.POS_APP.showToast(msg, ms);
      return;
    }
    const toast = document.getElementById('ai-toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    toast.style.display = 'block';
    setTimeout(() => {
      toast.classList.remove('show');
      toast.style.display = 'none';
    }, ms);
  }

  updateMicStatusUI() {
    const btn = document.getElementById('btn-voice-ai');
    if (!btn) return;
    // Default label always — listening state only via class while mic is open
    btn.innerHTML = `<span aria-hidden="true">✦</span> <span>"Hey Access" Voice AI</span>`;
    if (this.isListening && this.handsFree && !this.muted) {
      btn.classList.add('listening');
    } else {
      btn.classList.remove('listening');
    }
  }

  promptManual() {
    const text = prompt('Type a voice command (e.g. Hey Access add milk):');
    if (text) this.handleUtterance(text);
  }
}

window.VoiceAssistantInstance = new VoiceAssistant();
