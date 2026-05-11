import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles } from '../services/api'

function getInitials(fullName) {
  if (!fullName) return 'AD'
  const parts = String(fullName).split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadArticles() {
      try {
        const data = await fetchArticles()
        if (!active) return
        setArticles(data?.results || data || [])
      } catch (err) {
        if (!active) return
        setError('Maqolalar ma’lumotini yuklashda xatolik yuz berdi.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadArticles()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="section-page">
      <header className="page-top">
        <span className="page-kicker">Ilmiy Meros</span>
        <h2>Maqolalar</h2>
        <p>
          O‘zbek adabiyoti durdonalari, adiblar hayoti va ijodi haqida
          yozilgan eng sara maqolalar to‘plami.
        </p>
      </header>

      {loading ? (
        <div className="loading-container">
          <p className="muted-text">Maqolalar yuklanmoqda...</p>
        </div>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error ? (
        <div className="article-list-page">
          {articles.map((article) => (
            <article key={article.slug || article.id} className="article-item-page">
              <div className="article-card-image">
                {article.featured_image ? (
                  <img src={article.featured_image} alt={article.title} />
                ) : (
                  <div className="placeholder-image">
                    <span>{getInitials(article.title)}</span>
                  </div>
                )}
              </div>

              <div className="article-card-content">
                <span className="article-category">
                  {article.writer?.full_name || 'Adabiyotshunoslik'}
                </span>
                <h3>
                  <Link to={`/articles/${article.slug}`} className="article-title-link">
                    {article.title}
                  </Link>
                </h3>
                <p className="article-summary-text">{article.summary}</p>

                <div className="article-card-footer">
                  <div className="article-author-info">
                    <div className="author-avatar-mini">
                      {getInitials(article.author?.first_name || article.author?.username)}
                    </div>
                    <span className="author-name-text">
                      {article.author?.first_name || article.author?.username}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span>📅 {article.published_at ? article.published_at.slice(0, 10) : (article.created_at ? article.created_at.slice(0, 10) : '')}</span>
                    <span style={{ marginLeft: '10px' }}>👁 {article.views_count || 0}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {articles.length === 0 && (
            <p className="muted-text">Hozircha hech qanday maqola topilmadi.</p>
          )}
        </div>
      ) : null}
    </section>
  )
}

export default ArticlesPage
