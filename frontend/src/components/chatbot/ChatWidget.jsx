import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './ChatWidget.css';

const INITIAL_SUGGESTIONS = ['What services does Growthway offer?', 'How does a project work?', 'Where is Growthway based?'];
const CTA_LABELS = { '/contact': 'Talk to the Growthway team', '/work': 'Explore our work', '/#services': 'Explore services' };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(null);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [retryText, setRetryText] = useState('');
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const launcherRef = useRef(null);
  const endRef = useRef(null);
  const busyRef = useRef(false);
  const requestRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    api.get('/api/ai/status', { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setAvailable(data.enabled === true); })
      .catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (!isOpen) return;
    endRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    if (!loading) {
      if (!inputRef.current?.disabled) inputRef.current?.focus();
      else panelRef.current?.querySelector('button')?.focus();
    }
  }, [isOpen, messages, loading, reducedMotion]);

  function close() { setIsOpen(false); launcherRef.current?.focus(); }

  function handleKeys(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const items = panelRef.current?.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled)');
    if (!items?.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  async function sendMessage(text, retry = false) {
    text = text.trim();
    if (!text || text.length > 2000 || busyRef.current || available !== true) return;
    busyRef.current = true;
    const controller = new AbortController();
    requestRef.current = controller;
    // Retry replaces the failed exchange rather than adding duplicate user messages.
    const previous = retry ? messages.slice(0, -2) : messages;
    const next = [...previous, { role: 'user', content: text }];
    setMessages(next); setInputValue(''); setLoading(true); setSuggestions([]); setRetryText('');
    try {
      const res = await api.post('/api/ai/chat', {
        sessionId, message: text,
        history: previous.filter(m => !m.isError).slice(-3).map(({ role, content }) => ({ role, content })),
      }, { timeoutMs: 50000, signal: controller.signal });
      if (controller.signal.aborted) return;
      if (typeof res.reply !== 'string') throw new Error('Invalid chat response');
      setMessages([...next, { role: 'assistant', content: res.reply, cta: CTA_LABELS[res.cta] ? res.cta : '/contact' }]);
      setSuggestions(Array.isArray(res.suggestions) ? res.suggestions.filter(s => typeof s === 'string' && s.length <= 120).slice(0, 3) : []);
    } catch (error) {
      if (controller.signal.aborted) return;
      const content = error.status === 429 || error.status === 504
        ? error.message
        : 'Chat is unavailable right now. Please try again or use the contact page.';
      setMessages([...next, { role: 'assistant', content, isError: true, cta: '/contact' }]);
      setRetryText(text);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div className={`chat-wrapper ${isOpen ? 'is-open' : ''}`}>
      <button ref={launcherRef} className={`chat-capsule-launcher ${reducedMotion ? 'reduced-motion' : ''}`}
        onClick={() => isOpen ? close() : setIsOpen(true)} aria-expanded={isOpen} aria-controls="growthway-chat"
        aria-label={isOpen ? 'Close Growthway assistant' : 'Ask Growthway'}>
        <img src="/logo-icon.png" alt="" className="w-4 h-4 rounded-[3px] object-cover" />
        <span className="chat-launcher-beacon" /><span className="chat-launcher-label">{isOpen ? 'CLOSE ×' : 'ASK GROWTHWAY'}</span>
      </button>
      <div id="growthway-chat" ref={panelRef} className={`chat-panel ${reducedMotion ? 'reduced-motion' : ''}`}
        role="dialog" aria-label="Growthway assistant" aria-hidden={!isOpen} inert={!isOpen} onKeyDown={handleKeys}>
        <div className="chat-header">
          <div><h3 className="chat-title">Ask Growthway</h3><span className="chat-subtitle">AI company assistant</span></div>
          <button className="chat-close" onClick={close} aria-label="Close assistant">×</button>
        </div>
        <div className="chat-body" aria-live="polite" aria-busy={loading}>
          {messages.length === 0 && <div className="chat-welcome-card">
            <h4 className="chat-welcome-heading">How can we help your brand?</h4>
            <p className="chat-welcome-text">Ask about Growthway’s services, process, or starting a project. Please avoid sharing sensitive personal information.</p>
          </div>}
          {available === null && <p>Checking chat availability…</p>}
          {available === false && <p>Chat is currently unavailable. You can still contact the Growthway team below.</p>}
          {messages.map((msg, index) => <div key={index} className={`chat-bubble-row ${msg.role}`}>
            <div className="chat-bubble-sender">{msg.role === 'assistant' ? 'GROWTHWAY' : 'YOU'}</div>
            <div className={`chat-bubble ${msg.isError ? 'error' : ''}`}>{msg.content}</div>
            {msg.cta && <a className="chat-shortcut-link" href={msg.cta}>{CTA_LABELS[msg.cta]}</a>}
          </div>)}
          {loading && <div className="chat-bubble loading" role="status" aria-label="Preparing an answer"><span /><span /><span /></div>}
          <div ref={endRef} />
        </div>
        {available === true && suggestions.length > 0 && <div className="chat-suggestions"><div className="chat-sug-grid">
          {suggestions.map((suggestion, index) => <button key={suggestion} className="chat-suggestion-chip" disabled={loading}
            onClick={() => sendMessage(suggestion)}><span className="chat-sug-idx">0{index + 1}</span><span>{suggestion}</span></button>)}
        </div></div>}
        <div className="chat-footer">
          {retryText && <button className="chat-shortcut-link" disabled={loading || available !== true} onClick={() => sendMessage(retryText, true)}>Retry last message</button>}
          <form className="chat-form" onSubmit={event => { event.preventDefault(); sendMessage(inputValue); }}>
            <input ref={inputRef} type="text" className="chat-input" aria-label="Message Growthway" placeholder="Ask about Growthway…"
              value={inputValue} maxLength={2000} onChange={event => setInputValue(event.target.value)} disabled={loading || available !== true} />
            <button type="submit" className="chat-send" disabled={!inputValue.trim() || loading || available !== true} aria-label="Send message">→</button>
          </form>
          <div className="chat-shortcuts"><a href="/contact" className="chat-shortcut-link">Talk to a human / Start a project →</a></div>
        </div>
      </div>
    </div>
  );
}
