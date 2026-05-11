import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWork, resolveBackendUrl } from '../services/api'

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function WorkDetailPage() {
  const { slug } = useParams()
  const [work, setWork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('info') // 'info' or 'read'

  useEffect(() => {
    async function loadWork() {
      try {
        const data = await fetchWork(slug)
        setWork(data)
      } catch (err) {
        setError('Asar ma’lumotlarini yuklashda xatolik yuz berdi.')
      } finally {
        setLoading(false)
      }
    }
    loadWork()
  }, [slug])

  if (loading) {
    return (
      <div className="section-page">
        <div className="loading-container">
          <p className="muted-text">Asar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="section-page">
        <div className="error-container">
          <p className="form-error">{error || 'Asar topilmadi'}</p>
          <Link to="/works" className="secondary-btn">Kutubxonaga qaytish</Link>
        </div>
      </div>
    )
  }

  const hasPdf = work.book_file && work.book_file.file_type === 'pdf'
  const fileUrl = resolveBackendUrl(work.book_file?.file)

  return (
    <section className="work-detail-view">
      {/* Hero Section */}
      <header className="work-hero" style={{ background: '#0f264a', color: '#fff', padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          
          <div className="work-hero-cover" style={{ flexShrink: 0 }}>
            {work.cover_image ? (
              <img src={work.cover_image} alt={work.title} style={{ width: '240px', height: '340px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
            ) : (
              <div style={{ width: '240px', height: '340px', background: '#2c3e50', borderRadius: '12px', display: 'grid', placeItems: 'center', fontSize: '4rem', fontWeight: '800', color: '#34495e' }}>
                {work.title[0]}
              </div>
            )}
          </div>

          <div className="work-hero-info">
            <span className="work-category" style={{ background: '#e9be64', color: '#0f264a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '15px', display: 'inline-block' }}>
              {work.genre?.name || 'Adabiy asar'}
            </span>
            <h1 style={{ fontSize: '3rem', marginBottom: '10px', lineHeight: '1.1' }}>{work.title}</h1>
            <p style={{ fontSize: '1.4rem', color: '#e9be64', marginBottom: '20px' }}>
              <Link to={`/writers/${work.writer?.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {work.writer?.full_name}
              </Link>
            </p>
            
            <div className="work-meta-row" style={{ display: 'flex', gap: '30px', marginBottom: '30px', opacity: 0.8 }}>
              <span>📅 {work.publication_year}-yil</span>
              <span>👁 {work.views_count} ko'rish</span>
              <span>⬇️ {work.downloads_count} yuklash</span>
              <span>⭐ {work.rating}/5.0</span>
            </div>

            <div className="work-actions" style={{ display: 'flex', gap: '15px' }}>
              {hasPdf ? (
                <>
                  <button className="primary-btn" onClick={() => setViewMode(viewMode === 'read' ? 'info' : 'read')} style={{ padding: '12px 30px', fontSize: '1rem' }}>
                    {viewMode === 'read' ? 'ℹ️ Ma’lumotlar' : '📖 Onlayn o‘qish'}
                  </button>
                  <a href={fileUrl} download className="secondary-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 30px', textDecoration: 'none', display: 'inline-block', borderRadius: '8px' }}>
                    📥 Yuklab olish
                  </a>
                </>
              ) : (
                <button className="primary-btn" disabled style={{ opacity: 0.5 }}>Fayl mavjud emas</button>
              )}
            </div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(233,190,100,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 1 }}></div>
      </header>

      <div className="container" style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        {viewMode === 'read' && hasPdf ? (
          <div className="pdf-viewer-container" style={{ background: '#f1f5f9', borderRadius: '16px', overflow: 'hidden', height: '800px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', position: 'relative' }}>
            <iframe 
              src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`} 
              title={work.title}
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
            >
              <p>Brauzeringiz PDF ko‘rishni qo‘llab-quvvatlamaydi. <a href={fileUrl}>Faylni yuklab oling.</a></p>
            </iframe>
          </div>
        ) : (
          <div className="work-info-content" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '50px' }}>
            <div className="work-main-text">
              <div className="info-card" style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h3 style={{ color: '#0f264a', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Asar haqida</h3>
                <p style={{ lineHeight: '1.8', color: '#445', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>{work.description}</p>
              </div>

              {work.introduction && (
                <div className="info-card" style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ color: '#0f264a', marginBottom: '20px', fontSize: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Muqaddima</h3>
                  <div style={{ lineHeight: '1.8', color: '#445', fontStyle: 'italic' }}>{work.introduction}</div>
                </div>
              )}
            </div>

            <aside className="work-sidebar">
              <div className="info-card" style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'sticky', top: '40px' }}>
                <h4 style={{ color: '#0f264a', marginBottom: '20px', fontSize: '1.2rem' }}>Ma’lumotlar</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '15px' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span className="muted-text">Asl tili:</span>
                    <span style={{ fontWeight: '600' }}>{work.original_language}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span className="muted-text">Nashr yili:</span>
                    <span style={{ fontWeight: '600' }}>{work.publication_year}</span>
                  </li>
                  {work.book_file && (
                    <>
                      <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                        <span className="muted-text">Sahifalar:</span>
                        <span style={{ fontWeight: '600' }}>{work.book_file.pages_count || 'Noma’lum'}</span>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                        <span className="muted-text">Fayl hajmi:</span>
                        <span style={{ fontWeight: '600' }}>{formatFileSize(work.book_file.file_size)}</span>
                      </li>
                    </>
                  )}
                </ul>
                
                <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
                    Ushbu asarni o‘qish orqali adibning ijodiy olami bilan yaqindan tanishishingiz mumkin.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

export default WorkDetailPage
