'use client'

import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Clipboard, RotateCcw, Send, Sparkles } from 'lucide-react'
import Link from 'next/link'

type Mode = 'dental' | 'markets' | 'mentor'

const modes: Array<{ id: Mode; label: string; description: string; prompts: string[] }> = [
  { id: 'dental', label: 'Dental', description: 'Understand symptoms, procedures, and next steps.', prompts: ['Help me understand my tooth pain.', 'What should I know before a root canal?', 'When does swelling become an emergency?'] },
  { id: 'markets', label: 'Markets', description: 'Learn frameworks for thoughtful market research.', prompts: ["Teach me how to analyze a company's fundamentals.", 'Explain the risks of this stock.', 'Help me understand the Nifty 50.'] },
  { id: 'mentor', label: 'Mentor', description: 'Turn uncertainty into a realistic next step.', prompts: ['Help me build a realistic study plan.', 'I feel stuck. Help me identify my next step.', 'Help me make a difficult decision.'] },
]

export function DrAsadFrostAI() {
  const [mode, setMode] = useState<Mode>('dental')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/dr-asad-frost-ai' }), [])
  const { messages, sendMessage, status, error, setMessages } = useChat({ transport })
  const active = modes.find((item) => item.id === mode) ?? modes[0]
  const isBusy = status === 'submitted' || status === 'streaming'

  const submit = async (value = input) => {
    const text = value.trim()
    if (!text || isBusy) return
    setInput('')
    await sendMessage({ text }, { body: { mode } })
  }

  return (
    <main className="ai-companion-shell">
      <section className="ai-companion-hero" aria-labelledby="ai-title">
        <div className={`ai-neural-orb ai-neural-orb-${status}`} aria-hidden="true">
          <span className="ai-orb-core"><Sparkles size={25} /></span><i /><i /><i />
        </div>
        <p className="eyebrow">Dr Asad Frost AI / private session</p>
        <h1 id="ai-title">One intelligent companion.<br /><em>Three worlds</em> of expertise.</h1>
        <p className="ai-companion-intro">A calm, evidence-aware conversation for oral health, markets, and the decisions that shape a life.</p>
        <p className="ai-companion-notice">Not an emergency service. Do not share passwords, payment information, or unnecessary personal details.</p>
      </section>

      <section className="ai-companion-panel" aria-label="AI companion chat">
        <div className="ai-mode-selector" role="tablist" aria-label="Choose an intelligence mode">
          {modes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} className={mode === item.id ? 'is-active' : ''} onClick={() => setMode(item.id)}>{item.label}</button>)}
        </div>
        <div className="ai-mode-description"><span>{active.description}</span><button type="button" className="ai-new-chat" onClick={() => setMessages([])}><RotateCcw size={13} /> New conversation</button></div>

        <div className="ai-message-history" aria-live="polite">
          {messages.length === 0 && <div className="ai-welcome"><span className="ai-prompt-line">&gt; session ready / {active.label.toLowerCase()} intelligence</span><h2>What are you thinking about?</h2><div className="ai-starters">{active.prompts.map((prompt) => <button key={prompt} type="button" onClick={() => submit(prompt)}>{prompt}<ArrowUpRight size={15} /></button>)}</div></div>}
          {messages.map((message) => <article key={message.id} className={`ai-message ai-message-${message.role}`}><span className="ai-message-label">{message.role === 'user' ? 'You' : 'Frost AI'}</span><div>{message.parts.map((part, index) => part.type === 'text' ? <p key={`${message.id}-${index}`}>{part.text}</p> : null)}</div>{message.role === 'assistant' && <button type="button" className="ai-copy" aria-label="Copy response" onClick={() => { const text = message.parts.filter((part) => part.type === 'text').map((part) => part.text).join(''); navigator.clipboard.writeText(text); setCopied(message.id); setTimeout(() => setCopied(null), 1500) }}><Clipboard size={13} /> {copied === message.id ? 'Copied' : 'Copy'}</button>}</article>)}
          {isBusy && <div className="ai-thinking" role="status"><span /><span /><span /> Thinking carefully</div>}
          {error && <div className="ai-error" role="alert">The session could not reach the AI service. Check the server configuration and try again.</div>}
        </div>

        <form className="ai-composer" onSubmit={(event) => { event.preventDefault(); void submit() }}><label htmlFor="ai-message" className="sr-only">Message Dr Asad Frost AI</label><textarea id="ai-message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void submit() } }} placeholder="Ask a careful question..." maxLength={4000} rows={2} /><button type="submit" disabled={!input.trim() || isBusy} aria-label="Send message"><Send size={17} /></button></form>
        <p className="ai-footer-note">Guidance is educational and limited to this conversation. When something needs examination, verification, or urgent care, the next step is a qualified professional.</p>
      </section>
      <Link className="ai-back-link" href="/">Return to Dr Asad Frost <ArrowUpRight size={15} /></Link>
    </main>
  )
}
