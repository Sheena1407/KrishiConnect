import React, { useState, useRef, useEffect } from 'react';
import { assistantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BotMessageSquare, Send, Sparkles, User, RefreshCw } from 'lucide-react';

const SUGGESTION_CHIPS = [
  'Which crop is suitable for my soil?',
  'When should I irrigate?',
  'How do I improve soil health?',
  'What should I do if leaves turn yellow?',
  'What should I do before heavy rain?',
  'Which fertilizer is suitable?',
];

const KrishiAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste ${user?.name || 'Farmer'}! 🙏 I am your **Krishi Assistant**. I can help you with crop selection, soil pH management, irrigation cycles, pest remedies, and government schemes like PM-Kisan. How can I assist you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText = input) => {
    const textToSend = queryText.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await assistantAPI.ask(textToSend);
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.data.reply,
            suggestions: res.data.suggestions,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I apologize, I am temporarily having trouble retrieving that agronomic data. Please try again or consult our KVK experts under Ask an Expert.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip) => {
    handleSend(chip);
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: `Chat cleared. Namaste ${user?.name || 'Farmer'}! How can I assist your farm today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
              <BotMessageSquare size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Krishi Assistant (कृषि सहायक)</h3>
          </div>
          <p className="text-muted small mb-0">
            Conversational agronomic advisor grounded in Indian agricultural science and ICAR recommendations.
          </p>
        </div>

        <button onClick={handleClearChat} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
          <RefreshCw size={14} /> Clear Chat
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="krishi-card p-0 overflow-hidden d-flex flex-column" style={{ height: '70vh' }}>
        {/* Chat Messages Stream */}
        <div className="flex-grow-1 p-4 overflow-y-auto bg-light bg-opacity-50 d-flex flex-column gap-3">
          {messages.map((msg, index) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={index}
                className={`d-flex gap-2 ${isBot ? 'justify-content-start' : 'justify-content-end'}`}
              >
                {isBot && (
                  <div
                    className="rounded-circle p-2 bg-success text-white flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: '38px', height: '38px' }}
                  >
                    <BotMessageSquare size={20} />
                  </div>
                )}

                <div style={{ maxWidth: '78%' }}>
                  <div
                    className={`p-3 rounded-4 shadow-sm ${
                      isBot ? 'bg-white text-dark border border-light-subtle' : 'bg-success text-white'
                    }`}
                  >
                    <p
                      className="mb-0 small"
                      style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                    >
                      {msg.text}
                    </p>
                  </div>
                  <div
                    className={`small text-muted mt-1 ${isBot ? 'text-start' : 'text-end'}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {msg.time}
                  </div>

                  {/* Follow-up suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleChipClick(sug)}
                          className="btn btn-sm btn-outline-success bg-white rounded-pill px-2 py-0 small"
                          style={{ fontSize: '0.72rem' }}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div
                    className="rounded-circle p-2 bg-secondary text-white flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{ width: '38px', height: '38px' }}
                  >
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <div className="rounded-circle p-2 bg-success text-white" style={{ width: '38px', height: '38px' }}>
                <BotMessageSquare size={20} />
              </div>
              <div className="p-3 bg-white rounded-4 border border-light-subtle small text-muted">
                <span className="spinner-border spinner-border-sm me-2 text-success"></span>
                Consulting agricultural knowledge base...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Quick Chips */}
        <div className="p-2 px-3 bg-white border-top border-light-subtle d-flex gap-2 overflow-x-auto">
          <span className="small text-muted fw-semibold flex-shrink-0 d-flex align-items-center gap-1">
            <Sparkles size={14} className="text-warning" /> Suggestions:
          </span>
          {SUGGESTION_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="btn btn-sm btn-light border rounded-pill px-3 py-1 flex-shrink-0 small text-dark"
              style={{ fontSize: '0.78rem' }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-top border-light-subtle">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="input-group"
          >
            <input
              type="text"
              className="form-control ps-3 py-2"
              placeholder="Ask anything about crops, pests, fertilizers, soil testing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn btn-krishi px-4">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KrishiAssistant;
