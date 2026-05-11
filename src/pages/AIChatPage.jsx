import { useState } from 'react'
import { askAIChat } from '../services/api'

const cannedAnswers = {
  'muqimiy':
    'Muqimiy ijodida xalqona ruh, ijtimoiy tanqid va ma’rifatparvarlik asosiy yo‘nalish sanaladi.',
  'qahhor':
    'Abdulla Qahhor asarlarida ixcham uslub, kuchli xarakter yaratish va teran psixologik tahlil ustun.',
  'stipendiya':
    'Stipendiya uchun odatda test natijalari, o‘zlashtirish ko‘rsatkichi va motivatsion xat talab qilinadi.',
}

function resolveAnswer(text) {
  const lower = text.toLowerCase()

  if (lower.includes('muqimiy')) return cannedAnswers.muqimiy
  if (lower.includes('qahhor')) return cannedAnswers.qahhor
  if (lower.includes('stipendiya')) return cannedAnswers.stipendiya

  return 'Savolingiz qiziqarli. Bu bo‘limni keyingi bosqichda real AI API bilan ulab, aniq javob qaytaradigan qilamiz.'
}

function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Assalomu alaykum. Adabiyot, testlar va stipendiyalar bo‘yicha savol berishingiz mumkin.',
    },
  ])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  async function sendMessage(event) {
    event.preventDefault()

    const clean = text.trim()
    if (!clean) return

    const nextMessages = [...messages, { role: 'user', text: clean }]
    setMessages(nextMessages)
    setText('')
    setSending(true)

    try {
      const historyPayload = messages.map((item) => ({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: item.text,
      }))

      const data = await askAIChat(clean, historyPayload)
      setMessages([
        ...nextMessages,
        { role: 'assistant', text: data?.message || resolveAnswer(clean) },
      ])
    } catch {
      setMessages([
        ...nextMessages,
        { role: 'assistant', text: resolveAnswer(clean) },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section-page">
      <header className="page-top">
        <span className="page-kicker">Yordamchi</span>
        <h2>AI Chat</h2>
        <p>
          Bu sahifa hozircha lokal demo javoblar bilan ishlaydi. Keyingi qadamda
          OpenAI API yoki boshqa model bilan ulanadi.
        </p>
      </header>

      <div className="chat-page-box">
        <div className="chat-history">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-line ${message.role}`}>
              {message.text}
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Savolingizni yozing..."
            disabled={sending}
          />
          <button type="submit" className="primary-btn" disabled={sending}>
            {sending ? 'Yuborilmoqda...' : 'Yuborish'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AIChatPage
