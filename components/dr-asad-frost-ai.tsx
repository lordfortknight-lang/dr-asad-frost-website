'use client'

import { useState } from 'react'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { ArrowUpRight, Copy, RotateCcw, Send, Sparkles } from 'lucide-react'

type Mode = 'dental' | 'markets' | 'mentor'

const modes: Array<{ id: Mode; label: string; description: string; prompts: string[] }> = [
  { id: 'dental', label: 'Dental', description: 'Understand symptoms, procedures, prevention, and next steps.', prompts: ['Help me understand my tooth pain.', 'What should I know before a root canal?', 'When does dental swelling become an emergency?'] },
  { id: 'markets', label: 'Markets', description: 'Learn frameworks for evidence-aware market analysis.', prompts: ["Teach me how to analyze a company's fundamentals.", 'Explain the risks of this stock.', 'Help me understand the Nifty 50.'] },
  { id: 'mentor', label: 'Mentor', description: 'Think clearly about learning, work, and difficult decisions.', prompts: ['Help me build a realistic study plan.', 'I feel stuck. Help me identify my next step.', 'Help me make a difficult decision.'] },
]

export function DrAsadFrostAI() {
  const [mode, setMode] = useState<Mode>('dental')
  const [input, setInput] = useState('')
  const current = modes.find((item) => item.id === mode)!
  const transport = new DefaultChatTransport({ api: '/api/dr-asad-frost-ai', body: { mode } })
  const { messages, sendMessage, status, error, setMessages } = useChat({ transport })
  const busy = status === 'submitted' || status === 'streaming'

  const submit = (value: string) => {
    const text = value.trim()
    if (!text || busy) return
    setInput('')
    void sendMessage({ text })
  }

  return (
    <main className="ai-shell">
      <section className={`ai-intro ai-state-${status}`} aria-labelledby="ai-title">
        <div className="ai-orb" aria-hidden="true"><i /><i /><i /><span><Sparkles size={22} /></span></div>
        <p className="eyebrow">Dr Asad Frost AI / private interface</p>
        <h1 id="ai-title">One intelligent companion. <em>Three worlds.</em></h1>
        <p className="ai-lede">A thoughtful space for oral health education, market understanding, and clearer decisions. No chat history is stored by this experience.</p>
      </section>
      <section className="ai-panel" aria-label="Dr Asad Frost AI conversation">
        <div className="ai-modes" role="tablist" aria-label="Expert modes">
          {modes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} className={mode === item.id ? 'is-active' : ''} onClick={() => setMode(item.id)}>{item.label}</button>)}
        </div>
        <div className="ai-panel-meta"><span>{current.description}</span><button type="button" onClick={() => setMessages([])}><RotateCcw size={13} /> New conversation</button></div>
        <div className="ai-history" aria-live="polite">
          {messages.length === 0 ? <div className="ai-welcome"><p className="ai-prompt">/ ready when you are</p><h2>What are you thinking about?</h2><div className="ai-starters">{current.prompts.map((prompt) => <button key={prompt} type="button" onClick={() => submit(prompt)}>{prompt}<ArrowUpRight size={15} /></button>)}</div></div> : messages.map((message) => <article className={`ai-message ai-${message.role}`} key={message.id}><span className="ai-label">{message.role === 'user' ? 'You' : 'Dr Asad Frost AI'}</span><div>{message.parts.map((part, index) => part.type === 'text' ? <p key={`${message.id}-${index}`}>{part.text}</p> : null)}</div>{message.role === 'assistant' && <button className="ai-copy" type="button" onClick={() => navigator.clipboard.writeText(message.parts.map((part) => part.type === 'text' ? part.text : '').join(''))}><Copy size={13} /> Copy</button>}</article>)}
          {busy && <div className="ai-thinking" role="status">Thinking<span /><span /><span /></div>}
          {error && <div className="ai-error" role="alert">The companion is unavailable right now. Check the server AI configuration and try again.</div>}
        </div>
        <form className="ai-composer" onSubmit={(event) => { event.preventDefault(); submit(input) }}><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); submit(input) } }} placeholder={`Ask ${current.label.toLowerCase()} intelligence...`} aria-label="Message Dr Asad Frost AI" maxLength={4000} rows={2} /><button type="submit" disabled={busy || !input.trim()} aria-label="Send message"><Send size={17} /></button></form>
        <p className="ai-disclaimer">Educational guidance only. Do not share passwords, payment details, or unnecessary sensitive information. This is not an emergency service.</p>
      </section>
    </main>
  )
}
