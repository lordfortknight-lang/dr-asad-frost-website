'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { ArrowUpRight, Copy, Mic, MicOff, RotateCcw, Send, Sparkles, Volume2, VolumeX } from 'lucide-react'

type Mode = 'dental' | 'markets' | 'mentor'
type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error'
type SpeechRecognitionLike = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null }
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global { interface Window { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor } }

const modes: Array<{ id: Mode; label: string; description: string; prompts: string[] }> = [
  { id: 'dental', label: 'Dental', description: 'Understand symptoms, procedures, prevention, and next steps.', prompts: ['Help me understand my tooth pain.', 'What should I know before a root canal?', 'When does dental swelling become an emergency?'] },
  { id: 'markets', label: 'Markets', description: 'Learn frameworks for evidence-aware market analysis.', prompts: ["Teach me how to analyze a company's fundamentals.", 'Explain the risks of this stock.', 'Help me understand the Nifty 50.'] },
  { id: 'mentor', label: 'Mentor', description: 'Think clearly about learning, work, and difficult decisions.', prompts: ['Help me build a realistic study plan.', 'I feel stuck. Help me identify my next step.', 'Help me make a difficult decision.'] },
]

export function DrAsadFrostAI() {
  const [mode, setMode] = useState<Mode>('dental')
  const [input, setInput] = useState('')
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const current = useMemo(() => modes.find((item) => item.id === mode)!, [mode])
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/dr-asad-frost-ai', body: { mode } }), [mode])
  const { messages, sendMessage, status, error, setMessages } = useChat({ transport })
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => { if (busy) setOrbState(status === 'streaming' ? 'speaking' : 'thinking'); else if (!listening && !speaking) setOrbState(error ? 'error' : 'idle') }, [busy, error, listening, speaking, status])
  useEffect(() => () => { recognitionRef.current?.stop(); window.speechSynthesis?.cancel() }, [])

  const submit = (value: string) => { const text = value.trim(); if (!text || busy) return; setInput(''); setVoiceError(''); setOrbState('thinking'); void sendMessage({ text }) }
  const toggleListening = () => {
    if (listening) { recognitionRef.current?.stop(); return }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) { setVoiceError('Voice input is not supported in this browser. You can continue with text.'); setOrbState('error'); return }
    const recognition = new Recognition(); recognition.lang = navigator.language || 'en-US'; recognition.continuous = false; recognition.interimResults = true
    recognition.onresult = (event) => { const transcript = Array.from(event.results).map((result) => result[0].transcript).join(''); setInput(transcript) }
    recognition.onerror = (event) => { setVoiceError(event.error === 'not-allowed' ? 'Microphone permission was denied. Enable it in your browser or use text.' : 'Voice input stopped. Please try again.'); setListening(false); setOrbState('error') }
    recognition.onend = () => { setListening(false); setOrbState('idle') }
    recognitionRef.current = recognition; setVoiceError(''); setListening(true); setOrbState('listening'); recognition.start()
  }
  const speak = (text: string) => { if (!window.speechSynthesis) { setVoiceError('Spoken playback is not supported in this browser.'); return } window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.onstart = () => { setSpeaking(true); setOrbState('speaking') }; utterance.onend = () => { setSpeaking(false); setOrbState('idle') }; utterance.onerror = () => { setSpeaking(false); setVoiceError('Audio playback could not start.'); setOrbState('error') }; window.speechSynthesis.speak(utterance) }
  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setSpeaking(false); setOrbState('idle') }

  return <main className="ai-shell"><section className={`ai-intro ai-state-${orbState}`} aria-labelledby="ai-title"><div className="ai-orb" aria-label={`AI state: ${orbState}`} role="img"><i /><i /><i /><span><Sparkles size={22} /></span></div><p className="eyebrow">Dr Asad Frost AI / private interface</p><h1 id="ai-title">One intelligent companion. <em>Three worlds.</em></h1><p className="ai-lede">A thoughtful space for oral health education, market understanding, and clearer decisions. No chat history is stored by this experience.</p></section><section className="ai-panel" aria-label="Dr Asad Frost AI conversation"><div className="ai-modes" role="tablist" aria-label="Expert modes">{modes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} className={mode === item.id ? 'is-active' : ''} onClick={() => setMode(item.id)}>{item.label}</button>)}</div><div className="ai-panel-meta"><span>{current.description}</span><button type="button" onClick={() => setMessages([])}><RotateCcw size={13} /> New conversation</button></div><div className="ai-history" aria-live="polite">{messages.length === 0 ? <div className="ai-welcome"><p className="ai-prompt">/ ready when you are</p><h2>What are you thinking about?</h2><div className="ai-starters">{current.prompts.map((prompt) => <button key={prompt} type="button" onClick={() => submit(prompt)}>{prompt}<ArrowUpRight size={15} /></button>)}</div></div> : messages.map((message) => <article className={`ai-message ai-${message.role}`} key={message.id}><span className="ai-label">{message.role === 'user' ? 'You' : 'Dr Asad Frost AI'}</span><div>{message.parts.map((part, index) => part.type === 'text' ? <p key={`${message.id}-${index}`}>{part.text}</p> : null)}</div>{message.role === 'assistant' && <div className="ai-message-actions"><button className="ai-copy" type="button" onClick={() => navigator.clipboard.writeText(message.parts.map((part) => part.type === 'text' ? part.text : '').join(''))}><Copy size={13} /> Copy</button><button className="ai-copy" type="button" onClick={() => speaking ? stopSpeaking() : speak(message.parts.map((part) => part.type === 'text' ? part.text : '').join(''))}>{speaking ? <VolumeX size={13} /> : <Volume2 size={13} />} {speaking ? 'Stop' : 'Play response'}</button></div>}</article>)}{busy && <div className="ai-thinking" role="status">{status === 'streaming' ? 'Responding' : 'Thinking'}<span /><span /><span /></div>}{(error || voiceError) && <div className="ai-error" role="alert">{voiceError || 'The AI provider returned an error. Please try again.'}</div>}</div><form className="ai-composer" onSubmit={(event) => { event.preventDefault(); submit(input) }}><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); submit(input) } }} placeholder={`Ask ${current.label.toLowerCase()} intelligence...`} aria-label="Message Dr Asad Frost AI" maxLength={4000} rows={2} /><button type="button" className="ai-voice-button" onClick={toggleListening} aria-label={listening ? 'Stop listening' : 'Start voice input'}>{listening ? <MicOff size={17} /> : <Mic size={17} />}</button><button type="submit" disabled={busy || !input.trim()} aria-label="Send message"><Send size={17} /></button></form><p className="ai-disclaimer">Educational guidance only. Voice input uses your browser&apos;s speech recognition after you grant permission; audio is not recorded by this site. Do not share passwords, payment details, or unnecessary sensitive information.</p></section></main>
}
