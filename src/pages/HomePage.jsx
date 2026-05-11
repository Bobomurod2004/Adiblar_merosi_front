import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchHomeArticles,
  fetchScholarships,
  fetchTests,
  fetchWriters,
} from '../services/api'
import heroManuscriptImage from '../assets/hero-manuscript.jpg'
import muqimiyImage from '../assets/writers/qahhor.jpg'
import qahhorImage from '../assets/writers/muqimiy.jpg'
import quillPenImage from '../assets/quill-pen.png'

const fallbackWriters = [
  { full_name: 'Abdulla Qahhor', years_display: '(1907-1968)' },
  { full_name: 'Muqimiy', years_display: '(1850-1903)' },
]

const fallbackTests = [
  {
    id: 'qahhor',
    slug: 'abdulla-qahhor-boyicha-test',
    title: 'Abdulla Qahhor bo‘yicha test',
    questions_count: 20,
    style: 'is-blue',
  },
  {
    id: 'muqimiy',
    slug: 'muqimiy-boyicha-test',
    title: 'Muqimiy bo‘yicha test',
    questions_count: 20,
    style: 'is-gold',
  },
]

const features = [
  {
    icon: '📖',
    title: 'Asarlarni o‘qish',
    text: 'Adiblarning mashhur asarlarini o‘qing va yuklab oling.',
  },
  {
    icon: '🎓',
    title: 'Test ishlash',
    text: 'Stipendiyaga tayyorgarlik uchun testlardan o‘ting.',
  },
  {
    icon: '✍',
    title: 'Maqola yozish',
    text: 'O‘z maqolangizni yozing va boshqalar bilan baham ko‘ring.',
  },
  {
    icon: '🤖',
    title: 'AI yordamchi',
    text: 'Savollaringizga AI yordamchimizdan javob oling.',
  },
  {
    icon: '👥',
    title: 'Ilmiy meros',
    text: 'Milliy adabiyot merosini asrang va o‘rganing.',
  },
]

const quickQuestions = [
  'Abdulla Qahhor haqida ma’lumot bering',
  'Stipendiya uchun nima qilish kerak?',
  'Muqimiy asarlari ro‘yxatini ko‘rsat',
]

function toShortDate(value) {
  if (!value) return 'Sana yo‘q'
  const normalized = String(value).slice(0, 10)
  const [year, month, day] = normalized.split('-')
  if (!year || !month || !day) return normalized
  return `${year}-${month}-${day}`
}

function getInitials(fullName) {
  if (!fullName) return 'AD'
  const parts = String(fullName)
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (!parts.length) return 'AD'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function pickWriterYears(writer) {
  if (writer?.years_display) {
    return String(writer.years_display).replace(/[()]/g, '')
  }

  if (writer?.birth_year && writer?.death_year) {
    return `${writer.birth_year}-${writer.death_year}`
  }

  return 'Noma’lum'
}

function normalizeScholarship(item) {
  return {
    name: item?.name || 'Noma’lum stipendiya',
    slug: item?.slug || '',
    text: item?.description || 'Tavsif mavjud emas.',
  }
}

function HomePage() {
  const [writers, setWriters] = useState(fallbackWriters)
  const [articles, setArticles] = useState([])
  const [tests, setTests] = useState(fallbackTests)
  const [scholarships, setScholarships] = useState([])
  const [scholarshipsLoading, setScholarshipsLoading] = useState(true)
  const [scholarshipsError, setScholarshipsError] = useState('')
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [articlesError, setArticlesError] = useState('')

  useEffect(() => {
    let active = true

    async function loadData() {
      const [
        writersResult,
        articlesResult,
        testsResult,
        scholarshipsResult,
      ] = await Promise.allSettled([
        fetchWriters(),
        fetchHomeArticles(),
        fetchTests(),
        fetchScholarships(),
      ])

      if (!active) return

      if (writersResult.status === 'fulfilled') {
        const writersData = writersResult.value?.results || writersResult.value || []
        if (writersData.length) {
          setWriters(writersData)
        }
      } else {
        console.error('Writers data yuklanmadi:', writersResult.reason)
      }

      if (articlesResult.status === 'fulfilled') {
        const articlesData = articlesResult.value || []
        setArticles(Array.isArray(articlesData) ? articlesData : [])
        setArticlesError('')
      } else {
        console.error('Home articles yuklanmadi:', articlesResult.reason)
        setArticles([])
        setArticlesError('Maqolalar ma’lumotini yuklab bo‘lmadi.')
      }
      setArticlesLoading(false)

      if (testsResult.status === 'fulfilled') {
        const testsData = testsResult.value?.results || testsResult.value || []
        if (testsData.length) {
          setTests(
            testsData.slice(0, 2).map((item, index) => ({
              id: item.id,
              slug: item.slug,
              title: item.title,
              questions_count: item.questions_count || 0,
              style: index % 2 === 0 ? 'is-blue' : 'is-gold',
            })),
          )
        }
      } else {
        console.error('Tests data yuklanmadi:', testsResult.reason)
      }

      if (scholarshipsResult.status === 'fulfilled') {
        const scholarshipsData = scholarshipsResult.value?.results || scholarshipsResult.value || []
        setScholarships(
          Array.isArray(scholarshipsData)
            ? scholarshipsData.slice(0, 2).map(normalizeScholarship)
            : [],
        )
        setScholarshipsError('')
      } else {
        console.error('Scholarships data yuklanmadi:', scholarshipsResult.reason)
        setScholarships([])
        setScholarshipsError('Stipendiya ma’lumotini yuklab bo‘lmadi.')
      }
      setScholarshipsLoading(false)
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const heroWriters = useMemo(() => {
    const base = writers.slice(0, 2)
    if (base.length === 2) return base
    return [...base, ...fallbackWriters].slice(0, 2)
  }, [writers])

  const qahhorWriter = useMemo(() => {
    const byName = heroWriters.find((item) =>
      String(item?.full_name || '').toLowerCase().includes('qahhor'),
    )
    return byName || heroWriters[0] || fallbackWriters[0]
  }, [heroWriters])

  const muqimiyWriter = useMemo(() => {
    const byName = heroWriters.find((item) =>
      String(item?.full_name || '').toLowerCase().includes('muqimiy'),
    )
    if (byName) return byName

    const fallback = heroWriters.find((item) => item !== qahhorWriter)
    return fallback || fallbackWriters[1]
  }, [heroWriters, qahhorWriter])

  const latestArticles = useMemo(() => articles.slice(0, 3), [articles])

  return (
    <div className="home-screen">
      <section className="hero-premium">
        <div className="hero-premium-content">
          <p className="hero-premium-kicker">Milliy adabiyot platformasi</p>
          <h2>
            Adabiyot va stipendiyaga
            <span> tayyorgarlik platformasi</span>
          </h2>
          <p>
            Abdulla Qahhor va Muqimiy merosini o‘rganing, asarlarni o‘qing,
            testlar orqali bilimingizni sinang, maqolalar yozing va boshqalar
            bilan baham ko‘ring.
          </p>
          <div className="hero-premium-tags" aria-label="Asosiy yo‘nalishlar">
            <span>📚 Adiblar merosi</span>
            <span>🧠 Interaktiv testlar</span>
            <span>✍️ Ilmiy maqolalar</span>
          </div>

          <div className="hero-premium-actions">
            <Link to="/works" className="btn-icon gold">
              <span>📖</span> Asarlarni o‘qish
            </Link>
            <Link to="/tests" className="btn-icon dark">
              <span>✔️</span> Test ishlash
            </Link>
            <Link to="/articles" className="btn-icon dark">
              <span>📄</span> Maqolalar
            </Link>
            <Link to="/submit-article" className="btn-icon dark">
              <span>📝</span> Maqola yuborish
            </Link>
          </div>
        </div>

        <div className="hero-premium-visual">
          <div className="hero-premium-backdrop" aria-hidden="true">
            <img src={heroManuscriptImage} alt="" />
          </div>
          <img className="hero-quill-mark" src={quillPenImage} alt="" aria-hidden="true" />
          <div className="portrait-frame left">
            <img src={qahhorImage} alt={qahhorWriter.full_name} />
            <div className="writer-badge">
              <h4>{qahhorWriter.full_name}</h4>
              <p>{pickWriterYears(qahhorWriter)}</p>
            </div>
          </div>
          <div className="portrait-frame right">
            <img src={muqimiyImage} alt={muqimiyWriter.full_name} />
            <div className="writer-badge">
              <h4>{muqimiyWriter.full_name}</h4>
              <p>{pickWriterYears(muqimiyWriter)}</p>
            </div>
          </div>
          <div className="hero-premium-ground" aria-hidden="true" />
        </div>
      </section>

      <section className="why-section">
        <div className="why-left">
          <h3>Nima uchun biz?</h3>
          <div className="feature-grid">
            {features.map((item) => (
              <article key={item.title} className="feature-card">
                <span className="feature-icon">{item.icon}</span>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="scholarship-panel">
          <h3>Stipendiya haqida</h3>
          {scholarshipsLoading ? <p className="muted-text">Yuklanmoqda...</p> : null}
          {!scholarshipsLoading && scholarshipsError ? (
            <p className="form-error">{scholarshipsError}</p>
          ) : null}
          {!scholarshipsLoading && !scholarshipsError && scholarships.length === 0 ? (
            <p className="muted-text">Hozircha faol stipendiya mavjud emas.</p>
          ) : null}
          {!scholarshipsLoading && !scholarshipsError
            ? scholarships.map((item, index) => (
              <article key={item.slug || item.name} className="scholarship-item">
                <div className="scholarship-item-icon" aria-hidden="true">
                  {index === 0 ? '❂' : '✶'}
                </div>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.text}</p>
                </div>
                <Link to="/scholarships" className="tiny-btn">
                  Batafsil
                </Link>
              </article>
            ))
            : null}
        </aside>
      </section>

      <section className="home-columns">
        <article className="panel tests-panel">
          <div className="panel-header">
            <h3>Testlar</h3>
            <Link to="/tests">Barchasini ko‘rish</Link>
          </div>

          <div className="test-list">
            {tests.map((test) => (
              <article key={test.id} className={`test-card ${test.style || 'is-blue'}`}>
                <div className="test-card-content">
                  <h4>{test.title}</h4>
                  <p>{test.questions_count || 0} ta savol</p>
                  <Link to={`/tests/${test.slug}`} className="tiny-btn tiny-btn-dark">
                    Testga kirish
                  </Link>
                </div>
                <div className="test-portrait" aria-hidden="true">
                  <img
                    src={test.title.toLowerCase().includes('muqimiy') ? muqimiyImage : qahhorImage}
                    alt={test.title}
                  />
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel article-panel">
          <div className="panel-header">
            <h3>Maqolalar</h3>
            <Link to="/articles">Barchasini ko‘rish</Link>
          </div>

          <div className="mini-article-list">
            {articlesLoading ? <p className="muted-text">Maqolalar yuklanmoqda...</p> : null}
            {!articlesLoading && articlesError ? <p className="form-error">{articlesError}</p> : null}
            {!articlesLoading && !articlesError && latestArticles.length === 0 ? (
              <p className="muted-text">Hozircha e’lon qilingan maqolalar yo‘q.</p>
            ) : null}

            {!articlesLoading && !articlesError
              ? latestArticles.map((article) => (
                <Link
                  key={article.slug || article.id}
                  to={article.slug ? `/articles/${article.slug}` : '/articles'}
                  className="mini-article-item"
                >
                  <div className="mini-article-thumb" aria-hidden="true">
                    {getInitials(article.writer?.full_name || article.title || 'Adib')}
                  </div>

                  <div className="mini-article-body">
                    <h4>{article.title}</h4>
                    <p>{article.summary}</p>
                    <div className="meta-row">
                      <span>{toShortDate(article.published_at)}</span>
                      <span>{article.views_count || 0} ko‘rish</span>
                    </div>
                  </div>
                </Link>
              ))
              : null}
          </div>
        </article>

        <article className="panel chat-panel">
          <div className="panel-header">
            <h3>AI Chat</h3>
            <Link to="/ai-chat" className="tiny-btn">
              Yangi suhbat
            </Link>
          </div>

          <div className="chat-bubble user">
            Muqimiy ijodining asosiy xususiyatlari nimalardan iborat?
          </div>
          <div className="chat-bubble bot">
            Muqimiy ijodining asosiy xususiyatlari insonparvarlik g‘oyalari,
            xalqparvarlik, ma’rifatparvarlik ruhi va sodda ta’sirchan uslubidir.
          </div>

          <div className="quick-questions">
            {quickQuestions.map((question) => (
              <button key={question} type="button">
                {question}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <input type="text" placeholder="Savolingizni yozing..." />
            <button type="button">➤</button>
          </div>
        </article>
      </section>

      <section className="home-cta">
        <div>
          <h3>O‘z maqolangizni yuboring va boshqalar bilan baham ko‘ring!</h3>
          <p>Eng yaxshi maqolalar saytimizda joylanadi.</p>
        </div>
        <Link to="/submit-article" className="primary-btn">
          Maqola yuborish
        </Link>
      </section>
    </div>
  )
}

export default HomePage
