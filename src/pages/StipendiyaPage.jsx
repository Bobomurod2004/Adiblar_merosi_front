import { useEffect, useState } from 'react'
import { fetchScholarships } from '../services/api'

function formatAmount(value) {
  const numberValue = Number(value)
  if (!Number.isFinite(numberValue)) return ''

  return `${new Intl.NumberFormat('uz-UZ').format(numberValue)} so‘m`
}

function normalizeRequirements(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function normalizeScholarship(item) {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    amount: formatAmount(item.monthly_amount),
    details: item.description || '',
    requirements: normalizeRequirements(item.requirements),
  }
}

function StipendiyaPage() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadScholarships() {
      try {
        const data = await fetchScholarships()
        if (!active) return

        const items = data?.results || data || []
        setScholarships(Array.isArray(items) ? items.map(normalizeScholarship) : [])
      } catch {
        if (!active) return
        setError('Stipendiya ma’lumotlarini yuklab bo‘lmadi.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadScholarships()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="section-page">
      <header className="page-top">
        <span className="page-kicker">Grantlar</span>
        <h2>Stipendiya dasturlari</h2>
        <p>
          Platformadagi faol stipendiya dasturlari, talablar va baholash
          mezonlari bilan tanishing.
        </p>
      </header>

      {loading ? <p className="muted-text">Yuklanmoqda...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !error && scholarships.length === 0 ? (
        <p className="muted-text">Hozircha faol stipendiya dasturi mavjud emas.</p>
      ) : null}

      <div className="scholarship-grid-page">
        {scholarships.map((item) => (
          <article key={item.id || item.slug} className="scholarship-card-page">
            <h3>{item.name}</h3>
            <p className="amount">{item.amount}</p>
            <p>{item.details || item.description}</p>
            {(item.requirements || []).length > 0 ? (
              <ul>
                {(item.requirements || []).map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export default StipendiyaPage
