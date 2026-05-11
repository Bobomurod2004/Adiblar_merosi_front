import { useEffect, useState } from 'react'
import { fetchWriters } from '../services/api'
import muqimiyImage from '../assets/writers/muqimiy.jpg'
import qahhorImage from '../assets/writers/qahhor.jpg'

function resolveWriterImage(writer) {
  if (writer?.image) {
    return writer.image
  }

  const name = String(writer?.full_name || '').toLowerCase()
  if (name.includes('muqimiy')) return muqimiyImage
  if (name.includes('qahhor')) return qahhorImage
  return qahhorImage
}

function WritersPage() {
  const [writers, setWriters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadWriters() {
      try {
        const data = await fetchWriters()
        if (!active) return
        setWriters(data?.results || data || [])
      } catch {
        if (!active) return
        setError('Adiblar ma’lumotini yuklashda xatolik yuz berdi.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadWriters()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="section-page">
      <header className="page-top">
        <span className="page-kicker">Adiblar</span>
        <h2>Yozuvchilar bazasi</h2>
        <p>
          Har bir adibning hayoti, ijodiy davri, asosiy janrlari va merosi haqida
          to‘liq ma’lumotlar jamlangan.
        </p>
      </header>

      {loading ? <p className="muted-text">Yuklanmoqda...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error ? (
        <div className="catalog-grid">
          {writers.map((writer) => (
            <article key={writer.slug || writer.id} className="catalog-card">
              <div className="avatar-circle writer-photo">
                <img src={resolveWriterImage(writer)} alt={writer.full_name || 'Adib'} />
              </div>
              <h3>{writer.full_name}</h3>
              <p className="meta-line">{writer.years_display}</p>
              <p>{writer.short_bio}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default WritersPage
