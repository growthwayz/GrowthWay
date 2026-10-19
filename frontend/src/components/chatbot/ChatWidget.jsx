/**
 * ChatWidget — Item 31 (Phase D)
 * Art-directed, designer-grade AI Concierge & Briefing Assistant.
 * Connects to /api/ai/chat and provides direct human handoff & brief generation.
 */

import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './ChatWidget.css';

const INITIAL_SUGGESTIONS = [
  'What services & disciplines do you offer?',
  'Explain your brand strategy sprint.',
  'What are your typical project timelines?',
  'Help me formulate a creative brief.',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [sessionId, setSessionId] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const widgetRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(2, 15));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, loading, reducedMotion]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInputValue('');
    setLoading(true);
    setSuggestions([]);

    try {
      const res = await api.post('/api/ai/chat', {
        sessionId,
        message: text,
        history: messages.slice(-5),
      });

      setMessages([...newMsgs, { role: 'assistant', content: res.reply }]);
      if (res.suggestions && res.suggestions.length > 0) {
        setSuggestions(res.suggestions);
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: "Our concierge connection is currently resting. You can reach our founding team directly via WhatsApp or submit a project brief.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className={`chat-wrapper ${isOpen ? 'is-open' : ''}`} ref={widgetRef}>
      {/* Floating Capsule Launcher */}
      <button
        className={`chat-capsule-launcher ${reducedMotion ? 'reduced-motion' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI concierge' : 'Ask Growthway AI'}
        aria-expanded={isOpen}
      >
        <img src="/logo-icon.png" alt="" className="w-4 h-4 rounded-[3px] object-cover" />
        <span className="chat-launcher-beacon" />
        <span className="chat-launcher-label">
          {isOpen ? 'CLOSE CONCIERGE ✕' : 'GW // AI INTEL'}
        </span>
      </button>

      {/* Designer Chat Drawer / Panel */}
      <div className={`chat-panel ${reducedMotion ? 'reduced-motion' : ''}`} aria-hidden={!isOpen}>
        
        {/* Header */}
        <div className="chat-header">
          <div className="flex items-center gap-3">
            <img
              src="/logo-icon.png"
              alt="Growth Way"
              className="w-8 h-8 rounded-[6px] object-cover border border-white/20 shadow-sm"
            />
            <div>
              <h3 className="chat-title">GW // INTELLIGENCE</h3>
              <span className="chat-subtitle">Creative Agency Concierge · v2.6</span>
            </div>
          </div>
          <button
            className="chat-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close concierge"
          >
            ✕
          </button>
        </div>

        {/* Message Stream */}
        <div className="chat-body" aria-live="polite">
          {messages.length === 0 && (
            <div className="chat-welcome-card">
              <div className="chat-welcome-eyebrow">
                <span>[DIRECT ACCESS]</span>
                <span>MUMBAI STUDIO</span>
              </div>
              <h4 className="chat-welcome-heading">
                Turn your ambition into meaningful impact.
              </h4>
              <p className="chat-welcome-text">
                Ask about our design systems, branding methodology, client case studies, or request guidance on framing your project brief.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble-row ${msg.role}`}>
              <div className="chat-bubble-sender">
                {msg.role === 'assistant' ? 'GROWTHWAY INTELLIGENCE' : 'CLIENT DISPATCH'}
              </div>
              <div className={`chat-bubble ${msg.isError ? 'error' : ''}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-row assistant">
              <div className="chat-bubble-sender">PROCESSING BRIEF...</div>
              <div className="chat-bubble loading">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Suggestions */}
        {suggestions.length > 0 && (
          <div className="chat-suggestions">
            <span className="chat-sug-title">Suggested Inquiries:</span>
            <div className="chat-sug-grid">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  className="chat-suggestion-chip"
                  onClick={() => sendMessage(sug)}
                >
                  <span className="chat-sug-idx">0{i + 1}</span>
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar & Shortcuts */}
        <div className="chat-footer">
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Ask anything about our creative work..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send"
              disabled={!inputValue.trim() || loading}
              aria-label="Send query"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Quick Handoff Links */}
          <div className="chat-shortcuts">
            <a href="/contact" className="chat-shortcut-link">
              <span>Start Project Brief</span>
              <span>→</span>
            </a>
            <span className="chat-shortcut-sep">/</span>
            <a
              href="https://wa.me/917607012896?text=Hi%20Growthway!%20I'd%20like%20to%20connect%20with%20a%20strategist."
              target="_blank"
              rel="noopener noreferrer"
              className="chat-shortcut-link"
            >
              <span>WhatsApp Direct</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
