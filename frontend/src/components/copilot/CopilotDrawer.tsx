import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CopilotResponse } from '../../types';
import { Sparkles, Send, Bot, User, ArrowRight, Shield, Zap, DollarSign, CheckCircle, HelpCircle } from 'lucide-react';

export const CopilotDrawer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content?: string; structured?: CopilotResponse }>>([
    {
      role: 'assistant',
      content:
        'Hello! I am CloudPulse Copilot, your autonomous cloud intelligence assistant. I analyze live telemetry, AWS security findings, cost records, and incident correlation. How can I help you today?',
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCopilotSuggestions().then(setSuggestions).catch(console.error);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    const userMsg = { role: 'user' as const, content: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const resp = await api.queryCopilot(q);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          structured: resp,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error querying the cloud intelligence engine. Please retry your request.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle flex flex-col h-[780px]">
      {/* Copilot Header */}
      <div className="pb-4 border-b border-[#EDE3DE] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-peach-600 via-peach-500 to-peach-400 p-0.5 shadow-peach-glow flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 fill-peach-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-charcoal-800">CloudPulse Copilot</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
                AIOps Grounded
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Deterministic reasoning grounded in real-time telemetry, incidents, and security signals.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-charcoal-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Reasoning Online
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-peach-100 border border-peach-200 text-peach-700 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs ${
              m.role === 'user'
                ? 'bg-peach-500 text-white font-medium ml-12 shadow-subtle'
                : 'bg-[#FFFDFC] border border-[#EDE3DE] text-charcoal-800 shadow-subtle'
            }`}>
              {m.content && <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>}

              {/* Structured AI Analysis Card */}
              {m.structured && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="p-3.5 rounded-xl bg-peach-50/70 border border-peach-200">
                    <span className="font-bold text-peach-900 uppercase tracking-wider text-[10px] block mb-1">
                      Executive Summary
                    </span>
                    <p className="text-charcoal-800 font-medium leading-relaxed">
                      {m.structured.structured_analysis.summary}
                    </p>
                  </div>

                  {/* Probable Cause & Confidence */}
                  {m.structured.structured_analysis.probable_cause && (
                    <div className="p-3.5 rounded-xl bg-white border border-[#EDE3DE]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-charcoal-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-peach-600" />
                          Probable Root Cause
                        </span>
                        <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {Math.round(m.structured.structured_analysis.confidence * 100)}% Confidence ({m.structured.structured_analysis.confidence_label})
                        </span>
                      </div>
                      <p className="text-charcoal-700 leading-relaxed">
                        {m.structured.structured_analysis.probable_cause}
                      </p>
                    </div>
                  )}

                  {/* Evidence List */}
                  {m.structured.structured_analysis.evidence.length > 0 && (
                    <div>
                      <span className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px] block mb-2">
                        Observed Signal Evidence
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {m.structured.structured_analysis.evidence.map((ev, i) => (
                          <li key={i} className="flex items-start gap-2 text-charcoal-700">
                            <span className="text-peach-500 font-bold">•</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Impact */}
                  {m.structured.structured_analysis.impact && (
                    <div className="pt-2 border-t border-[#EDE3DE]">
                      <span className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px] block mb-1">
                        Infrastructure Impact
                      </span>
                      <p className="text-charcoal-700 leading-relaxed">
                        {m.structured.structured_analysis.impact}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {m.structured.structured_analysis.recommendations.length > 0 && (
                    <div className="pt-2 border-t border-[#EDE3DE]">
                      <span className="font-bold text-peach-900 uppercase tracking-wider text-[10px] block mb-2">
                        Recommended Actions
                      </span>
                      <div className="space-y-1.5">
                        {m.structured.structured_analysis.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-peach-50/50 border border-peach-100 text-charcoal-800">
                            <span className="font-mono font-bold text-peach-700">{i + 1}.</span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-Ups */}
                  {m.structured.suggested_follow_ups.length > 0 && (
                    <div className="pt-3 border-t border-[#EDE3DE]">
                      <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-2">
                        Suggested Follow-Up Queries
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.structured.suggested_follow_ups.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-peach-50 border border-[#EDE3DE] hover:border-peach-300 text-charcoal-700 text-[11px] font-medium transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-peach-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-subtle">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-charcoal-500 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-peach-100 text-peach-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <span>Correlating telemetry and synthesizing structured analysis...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      {suggestions.length > 0 && (
        <div className="py-2 overflow-x-auto border-t border-[#EDE3DE] flex items-center gap-1.5 mb-3">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase font-mono whitespace-nowrap mr-1">
            Presets:
          </span>
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="text-[11px] px-3 py-1 rounded-full bg-peach-50 hover:bg-peach-100 border border-peach-200 text-peach-900 whitespace-nowrap font-medium transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-[#EDE3DE]"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Copilot (e.g., 'Why is my API slow?', 'What caused INC-1024?')..."
          className="flex-1 text-xs px-4 py-3 rounded-2xl border border-[#EDE3DE] focus:border-peach-500 focus:outline-none bg-charcoal-50/50"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-5 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-subtle hover:scale-[1.02]"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
