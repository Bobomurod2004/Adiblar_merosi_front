import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchTestDetail, submitTest } from '../services/api'

function TestDetailPage() {
  const { slug } = useParams()
  const startedAtRef = useRef(null)
  const timerRef = useRef(null)

  const [testData, setTestData] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    let active = true
    startedAtRef.current = Date.now()

    async function loadTest() {
      try {
        const data = await fetchTestDetail(slug)
        if (!active) return
        setTestData(data)
        if (data.duration_minutes) {
          setTimeLeft(data.duration_minutes * 60)
        }
      } catch {
        if (!active) return
        setError('Test ma’lumotini yuklab bo‘lmadi.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadTest()
    return () => { active = false }
  }, [slug])

  // Countdown Timer logic
  useEffect(() => {
    if (timeLeft === null || result || loading) return

    if (timeLeft <= 0) {
      // Auto submit when time is up
      if (!submitting) {
        autoSubmit()
      }
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [timeLeft, result, loading])

  async function autoSubmit() {
    // Manually trigger the form submission logic
    const mockEvent = { preventDefault: () => {} }
    handleSubmit(mockEvent)
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const questions = testData?.questions || []
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const progressPercent = useMemo(() => 
    questions.length ? Math.floor((answeredCount / questions.length) * 100) : 0, 
  [answeredCount, questions])

  function selectOption(questionId, optionId) {
    if (timeLeft <= 0 && timeLeft !== null) return // Block if time is up
    setAnswers((prev) => ({ ...prev, [String(questionId)]: optionId }))
  }

  async function handleSubmit(event) {
    if (event) event.preventDefault()
    if (!questions.length) return
    
    setSubmitting(true)
    setError('')
    clearInterval(timerRef.current)

    try {
      const startedAt = startedAtRef.current || Date.now()
      const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      const data = await submitTest(slug, {
        answers,
        time_spent_seconds: elapsedSeconds,
      })
      setResult(data)
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.message || 'Test natijasini yuborishda xatolik yuz berdi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="section-page">
        <div className="loading-container">
          <p className="muted-text">Test yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!testData) {
    return (
      <div className="section-page">
        <div className="error-container" style={{ textAlign: 'center' }}>
          <p className="form-error">{error || 'Test topilmadi.'}</p>
          <Link to="/tests" className="secondary-btn">Testlar ro‘yxatiga qaytish</Link>
        </div>
      </div>
    )
  }

  return (
    <section className="test-taking-view" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Sticky Header */}
      <header className="test-header-sticky" style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: '#fff', 
        padding: '15px 0', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#0f264a', margin: 0 }}>{testData.title}</h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{testData.questions_count} ta savol</span>
          </div>

          {timeLeft !== null && !result && (
            <div style={{ 
              background: timeLeft < 120 ? '#fee2e2' : '#f1f5f9', 
              color: timeLeft < 120 ? '#dc2626' : '#0f264a',
              padding: '8px 20px',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '1.2rem',
              fontFamily: 'monospace',
              border: '1px solid',
              borderColor: timeLeft < 120 ? '#fecaca' : '#e2e8f0'
            }}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}

          <div style={{ textAlign: 'right', minWidth: '150px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
              <span>Progress</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#e9be64', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        
        {error ? <p className="form-error" style={{ marginBottom: '20px' }}>{error}</p> : null}

        {result ? (
          <div className="test-result-premium" style={{ 
            background: '#fff', 
            borderRadius: '24px', 
            padding: '50px', 
            textAlign: 'center', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)' 
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: result.passed ? '#d1fae5' : '#fee2e2', 
              color: result.passed ? '#059669' : '#dc2626',
              display: 'grid',
              placeItems: 'center',
              fontSize: '3rem',
              margin: '0 auto 30px'
            }}>
              {result.passed ? '✅' : '❌'}
            </div>
            
            <h3 style={{ fontSize: '2rem', color: '#0f264a', marginBottom: '10px' }}>
              {result.passed ? 'Muvaffaqiyatli topshirdingiz!' : 'Natija yetarli emas'}
            </h3>
            <p className="muted-text" style={{ fontSize: '1.1rem', marginBottom: '40px' }}>
              Siz {result.total_questions} ta savoldan {result.correct_answers} tasiga to‘g‘ri javob berdingiz.
            </p>

            <div className="result-stats-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px', 
              marginBottom: '40px',
              textAlign: 'left'
            }}>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
                <span className="muted-text" style={{ fontSize: '0.9rem' }}>To‘plangan ball</span>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f264a' }}>{result.score_percent}%</div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                  <div style={{ width: `${result.score_percent}%`, height: '100%', background: '#0f264a', borderRadius: '3px' }}></div>
                </div>
              </div>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
                <span className="muted-text" style={{ fontSize: '0.9rem' }}>O‘tish chegarasi</span>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#64748b' }}>{testData.pass_percent}%</div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                  <div style={{ width: `${testData.pass_percent}%`, height: '100%', background: '#64748b', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>

            <div className="result-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link to="/tests" className="secondary-btn" style={{ padding: '12px 30px' }}>Boshqa testlar</Link>
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setResult(null)
                  setAnswers({})
                  startedAtRef.current = Date.now()
                  window.scrollTo(0, 0)
                }}
                style={{ padding: '12px 30px' }}
              >
                Qayta topshirish
              </button>
            </div>
          </div>
        ) : (
          <form className="test-questions-list" onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <article key={question.id} className="question-card-premium" style={{ 
                background: '#fff', 
                borderRadius: '20px', 
                padding: '40px', 
                marginBottom: '30px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <span style={{ 
                    width: '36px', 
                    height: '36px', 
                    background: '#0f264a', 
                    color: '#fff', 
                    borderRadius: '50%', 
                    display: 'grid', 
                    placeItems: 'center', 
                    flexShrink: 0,
                    fontWeight: '700'
                  }}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: '#0f264a', marginBottom: '25px', lineHeight: '1.4' }}>{question.prompt}</h3>
                    
                    <div className="options-grid" style={{ display: 'grid', gap: '12px' }}>
                      {question.options.map((option) => (
                        <label 
                          key={option.id} 
                          className={`option-label ${answers[String(question.id)] === option.id ? 'is-selected' : ''}`}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '15px', 
                            padding: '16px 20px', 
                            borderRadius: '12px', 
                            border: '2px solid',
                            borderColor: answers[String(question.id)] === option.id ? '#0f264a' : '#f1f5f9',
                            background: answers[String(question.id)] === option.id ? '#f8fafc' : '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={answers[String(question.id)] === option.id}
                            onChange={() => selectOption(question.id, option.id)}
                            style={{ display: 'none' }}
                          />
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '50%', 
                            border: '2px solid',
                            borderColor: answers[String(question.id)] === option.id ? '#0f264a' : '#cbd5e1',
                            display: 'grid',
                            placeItems: 'center',
                            background: '#fff'
                          }}>
                            {answers[String(question.id)] === option.id && (
                              <div style={{ width: '10px', height: '10px', background: '#0f264a', borderRadius: '50%' }}></div>
                            )}
                          </div>
                          <span style={{ fontSize: '1.05rem', color: answers[String(question.id)] === option.id ? '#0f264a' : '#475569', fontWeight: answers[String(question.id)] === option.id ? '600' : '400' }}>
                            {option.option_text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <button 
                type="submit" 
                className="primary-btn" 
                disabled={submitting || answeredCount < questions.length} 
                style={{ 
                  padding: '16px 60px', 
                  fontSize: '1.1rem', 
                  boxShadow: '0 10px 30px rgba(15,38,74,0.2)',
                  opacity: (submitting || answeredCount < questions.length) ? 0.6 : 1,
                  cursor: (submitting || answeredCount < questions.length) ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Natijalar hisoblanmoqda...' : 'Testni yakunlash'}
              </button>
              {answeredCount < questions.length && (
                <p style={{ marginTop: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                  Iltimos, barcha savollarga javob bering ({answeredCount} / {questions.length})
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default TestDetailPage
