import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchWorks } from '../services/api'

function WorksPage() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const loadWorks = useCallback(async (currentPage, searchQuery) => {
    setLoading(true)
    try {
      const data = await fetchWorks({
        page: currentPage,
        search: searchQuery
      })
      setWorks(data?.results || [])
      setTotalCount(data?.count || 0)
    } catch (err) {
      setError('Asarlar ma’lumotini yuklashda xatolik yuz berdi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadWorks(page, search)
    }, 400) // Debounce search
    return () => clearTimeout(timer)
  }, [page, search, loadWorks])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1) // Reset to first page on search
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  return (
    <section className="section-page">
      <header className="page-top" style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
        <span className="page-kicker">Kutubxona</span>
        <h2 style={{ fontSize: '3rem', color: '#0f264a' }}>Adabiy asarlar</h2>
        <p style={{ maxWidth: '700px', margin: '20px auto' }}>
          O‘zbek adabiyotining durdona asarlari to‘plami.
        </p>
        
        {/* Total Count Badge */}
        <div style={{ position: 'absolute', top: '0', right: '0', background: '#f1f5f9', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Jami asarlar:</span>
          <strong style={{ marginLeft: '8px', color: '#0f264a' }}>{totalCount}</strong>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar-container" style={{ maxWidth: '600px', margin: '0 auto 40px', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Asar nomi, muallif yoki yil bo'yicha qidirish..." 
          value={search}
          onChange={handleSearchChange}
          style={{ 
            width: '100%', 
            padding: '15px 25px', 
            borderRadius: '30px', 
            border: '2px solid #e2e8f0',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          onFocus={(e) => e.target.style.borderColor = '#e9be64'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
      </div>

      {loading ? (
        <div className="loading-container">
          <p className="muted-text">Kutubxona yuklanmoqda...</p>
        </div>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="works-library-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '40px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {works.map((work) => (
              <Link key={work.slug || work.id} to={`/works/${work.slug}`} className="book-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="book-cover-container" style={{ 
                  position: 'relative', 
                  height: '320px', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  marginBottom: '15px'
                }}>
                  {work.cover_image ? (
                    <img src={work.cover_image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'grid', placeItems: 'center', fontSize: '3rem', color: '#cbd5e1', fontWeight: '800' }}>
                      {work.title[0]}
                    </div>
                  )}
                </div>
                <div className="book-info">
                  <span style={{ fontSize: '0.8rem', color: '#e9be64', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {work.genre?.name || 'Asar'}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f264a', margin: '5px 0 2px', lineHeight: '1.3' }}>{work.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{work.writer?.full_name} · {work.publication_year}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalCount > 10 && (
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '60px' }}>
              <button 
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="secondary-btn"
                style={{ opacity: page === 1 ? 0.5 : 1 }}
              >
                ⬅️ Oldingi
              </button>
              
              <span style={{ fontWeight: '600', color: '#0f264a' }}>Sahifa {page} / {Math.ceil(totalCount / 10)}</span>

              <button 
                disabled={page >= Math.ceil(totalCount / 10)}
                onClick={() => handlePageChange(page + 1)}
                className="secondary-btn"
                style={{ opacity: page >= Math.ceil(totalCount / 10) ? 0.5 : 1 }}
              >
                Keyingi ➡️
              </button>
            </div>
          )}
        </>
      ) : null}

      {!loading && works.length === 0 && (
        <p className="muted-text" style={{ textAlign: 'center' }}>Siz qidirgan mezonlar bo‘yicha asarlar topilmadi.</p>
      )}
    </section>
  )
}

export default WorksPage
