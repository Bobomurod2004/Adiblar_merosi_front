import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTests } from '../services/api'

const levelColors = {
  'Oson': { bg: '#d1fae5', text: '#065f46' },
  'O‘rta': { bg: '#fef3c7', text: '#92400e' },
  'Murakkab': { bg: '#fee2e2', text: '#991b1b' },
  'Qiyin': { bg: '#fee2e2', text: '#991b1b' },
}

function TestsPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function loadTests() {
      try {
        const data = await fetchTests()
        if (!active) return
        const items = data?.results || data || []
        setTests(items)
      } catch {
        if (!active) return
        setError('Testlar ro‘yxatini yuklab bo‘lmadi.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadTests()
    return () => { active = false }
  }, [])

  return (
    <section className="section-page">
      <header className="page-top" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="page-kicker">Bilimni sinash</span>
        <h2 style={{ fontSize: '3rem', color: '#0f264a' }}>Testlar markazi</h2>
        <p style={{ maxWidth: '700px', margin: '20px auto' }}>
          O‘zbek adabiyoti, adiblar hayoti va ijodiga oid maxsus testlar. 
          O‘z bilimingizni sinab ko‘ring va stipendiya yutish imkoniyatingizni oshiring.
        </p>
      </header>

      {loading ? (
        <div className="loading-container">
          <p className="muted-text">Testlar yuklanmoqda...</p>
        </div>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error ? (
        <div className="tests-premium-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {tests.map((test) => (
            <div key={test.id} className="test-card-premium" style={{ 
              background: '#fff', 
              borderRadius: '20px', 
              padding: '30px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ 
                  background: '#f8fafc', 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  display: 'grid', 
                  placeItems: 'center',
                  fontSize: '1.5rem'
                }}>
                  📝
                </div>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700',
                  background: levelColors[test.level]?.bg || '#f1f5f9',
                  color: levelColors[test.level]?.text || '#64748b'
                }}>
                  {test.level}
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', color: '#0f264a', marginBottom: '15px', lineHeight: '1.3' }}>{test.title}</h3>
              <p className="muted-text" style={{ fontSize: '0.9rem', marginBottom: '25px', flexGrow: 1 }}>{test.topic || 'Adabiyot bo‘yicha umumiy bilimlar'}</p>

              <div className="test-info-row" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '8px', 
                padding: '15px 0', 
                borderTop: '1px solid #f1f5f9',
                marginBottom: '20px',
                fontSize: '0.85rem',
                color: '#61789c'
              }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span>❓ {test.questions_count} savol</span>
                  <span>⏱️ {test.duration_minutes} daqiqa</span>
                </div>
                {test.expires_at && (
                  <div style={{ color: '#dc2626', fontWeight: '600' }}>
                    ⌛ Muddat: {new Date(test.expires_at).toLocaleDateString()} gacha
                  </div>
                )}
              </div>

              <Link to={`/tests/${test.slug || test.id}`} className="primary-btn" style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', textDecoration: 'none' }}>
                Testni boshlash
              </Link>
            </div>
          ))}
        </div>
      ) : null}

      {!loading && tests.length === 0 && (
        <p className="muted-text" style={{ textAlign: 'center' }}>Hozircha testlar mavjud emas.</p>
      )}
    </section>
  )
}

export default TestsPage
