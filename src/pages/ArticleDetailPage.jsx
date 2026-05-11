import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { fetchArticle } from '../services/api'

function getInitials(fullName) {
  if (!fullName) return 'AD'
  const parts = String(fullName).split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function ArticleDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadArticle() {
      try {
        const data = await fetchArticle(slug)
        if (!active) return
        setArticle(data)
      } catch (err) {
        if (!active) return
        setError('Maqola ma’lumotini yuklab bo‘lmadi.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadArticle()

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="section-page">
        <div className="loading-container">
          <p className="muted-text">Maqola yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <section className="section-page">
        <div className="error-container">
          <p className="form-error">{error || 'Maqola topilmadi.'}</p>
          <Link to="/articles" className="secondary-btn">
            Maqolalar ro‘yxatiga qaytish
          </Link>
        </div>
      </section>
    )
  }

  const authorName =
    article.author?.first_name || article.author?.last_name
      ? `${article.author?.first_name || ''} ${article.author?.last_name || ''}`.trim()
      : article.author?.username || 'Muallif'

  return (
    <div className="article-detail-view">
      <div className="article-detail-container">
        <div className="article-detail-hero">
          {article.featured_image ? (
            <img src={article.featured_image} alt={article.title} />
          ) : (
            <div className="hero-placeholder" />
          )}
          <div className="article-hero-overlay">
            <button onClick={() => navigate(-1)} className="secondary-btn tiny-btn-dark" style={{ width: 'fit-content', marginBottom: '20px' }}>
              ← Orqaga
            </button>
            <span className="page-kicker" style={{ background: 'rgba(233, 190, 100, 0.9)', border: 'none' }}>
              {article.writer?.full_name || 'Maqola'}
            </span>
          </div>
        </div>

        <header className="article-detail-header">
          <h1>{article.title}</h1>
          <p className="article-summary-text" style={{ fontSize: '1.3rem', color: '#5a6d8d', borderLeft: '4px solid #e9be64', paddingLeft: '20px' }}>
            {article.summary}
          </p>
        </header>

        <div className="article-detail-meta">
          <div className="meta-item">
            <div className="author-avatar-mini">
              {getInitials(authorName)}
            </div>
            <span className="author-name-text">
              {authorName}
            </span>
          </div>
          <div className="meta-item">
            <span className="icon">📅</span>
            <span>{article.published_at ? article.published_at.slice(0, 10) : 'Sana yo‘q'}</span>
          </div>
          <div className="meta-item">
            <span className="icon">👁</span>
            <span>{article.views_count || 0} marta ko‘rilgan</span>
          </div>
        </div>

        <article className="article-body-content">
          {String(article.content || '')
            .split('\n')
            .filter(Boolean)
            .map((line, index) => (
              <p key={`${line.slice(0, 20)}-${index}`}>{line}</p>
            ))}
        </article>

        {article.tags?.length ? (
          <div className="article-tags-section">
            {article.tags.map((tag) => (
              <span key={tag.id} className="tag-badge">
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}

        {article.article_file ? (
          <div style={{ padding: '0 60px 60px' }}>
            <a
              href={article.article_file}
              target="_blank"
              rel="noreferrer"
              className="primary-btn"
            >
              Maqolani PDF formatda yuklab olish
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ArticleDetailPage
