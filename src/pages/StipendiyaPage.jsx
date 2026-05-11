import { useEffect, useState } from 'react'
import { fetchScholarships } from '../services/api'

const fallbackScholarships = [
  {
    id: 'muqimiy',
    slug: 'muqimiy-stipendiyasi',
    name: 'Muqimiy stipendiyasi',
    amount: 'Oyiga 2 500 000 so‘m',
    details:
      'Adabiyot yo‘nalishida yuqori natija ko‘rsatgan bakalavr talabalari uchun mo‘ljallangan.',
    requirements: [
      'Kamida 3.5 GPA yoki tenglashtirilgan yuqori o‘zlashtirish',
      'Adabiyot bo‘yicha ilmiy maqola yoki loyiha',
      'Tavsiyanoma va motivatsion xat',
    ],
  },
  {
    id: 'qahhor',
    slug: 'abdulla-qahhor-stipendiyasi',
    name: 'Abdulla Qahhor stipendiyasi',
    amount: 'Oyiga 3 000 000 so‘m',
    details:
      'Yosh ijodkorlar va ilmiy izlanish olib borayotgan magistratura talabalari uchun maxsus grant.',
    requirements: [
      'Yaratilgan ijodiy ishlar portfeli',
      'Adabiy tanqid yoki tahliliy maqola tajribasi',
      'Suhbat bosqichidan muvaffaqiyatli o‘tish',
    ],
  },
]

function StipendiyaPage() {
  const [scholarships, setScholarships] = useState(fallbackScholarships)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadScholarships() {
      try {
        const data = await fetchScholarships()
        if (!active) return

        const items = data?.results || data || []
        if (items.length) {
          setScholarships(items)
        }
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
          Muqimiy va Abdulla Qahhor yo‘nalishidagi stipendiyalar uchun
          talablar, muddatlar va baholash mezonlari.
        </p>
      </header>

      {loading ? <p className="muted-text">Yuklanmoqda...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

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
