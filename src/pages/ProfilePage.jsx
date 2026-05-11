import { useEffect, useState } from 'react'
import { fetchProfile, updateProfile, fetchMyArticles } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function getInitials(fullName) {
  if (!fullName) return 'AD'
  const parts = String(fullName).split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const statusMap = {
  draft: { label: 'Qoralama', color: '#61789c', bg: '#f1f5f9' },
  pending: { label: 'Kutilmoqda', color: '#d97706', bg: '#fef3c7' },
  published: { label: 'Tasdiqlandi', color: '#059669', bg: '#d1fae5' },
  rejected: { label: 'Rad etildi', color: '#dc2626', bg: '#fee2e2' },
}

function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [myArticles, setMyArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    bio: '',
    phone_number: '',
    telegram_username: '',
    website: '',
    location: '',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, articlesData] = await Promise.all([
          fetchProfile(),
          fetchMyArticles()
        ])
        setProfile(profData)
        setMyArticles(articlesData?.results || articlesData || [])
        setFormData({
          bio: profData.bio || '',
          phone_number: profData.phone_number || '',
          telegram_username: profData.telegram_username || '',
          website: profData.website || '',
          location: profData.location || '',
        })
      } catch (err) {
        setError('Ma’lumotlarni yuklab bo‘lmadi.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updated = await updateProfile(formData)
      setProfile(updated)
      setSuccess('Profil muvaffaqiyatli yangilandi!')
    } catch (err) {
      setError(err.message || 'Yangilashda xatolik yuz berdi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="section-page">
        <div className="loading-container">
          <p className="muted-text">Profil yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="section-page profile-view">
      <div className="profile-container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', maxWidth: '1100px', margin: '40px auto' }}>
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card" style={{ background: '#fff', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div className="profile-avatar-large" style={{ width: '120px', height: '120px', background: '#0f264a', color: '#e9be64', borderRadius: '50%', margin: '0 auto 20px', display: 'grid', placeItems: 'center', fontSize: '3rem', fontWeight: '800' }}>
              {getInitials(user?.first_name || user?.username)}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '5px', color: '#0f264a' }}>
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="muted-text" style={{ marginBottom: '20px' }}>@{user?.username}</p>
            
            <div className="profile-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.2rem', color: '#0f264a' }}>{myArticles.length}</strong>
                <span style={{ fontSize: '0.8rem', color: '#61789c' }}>Maqolalar</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1.2rem', color: '#0f264a' }}>{myArticles.filter(a => a.status === 'published').length}</strong>
                <span style={{ fontSize: '0.8rem', color: '#61789c' }}>E'lon qilindi</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-content">
          <div className="profile-edit-form" style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '30px', color: '#0f264a', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>Shaxsiy ma’lumotlar</h2>
            
            {success && <p className="form-success" style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{success}</p>}
            {error && <p className="form-error" style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <label>
                  Telegram Username
                  <div style={{ position: 'relative', marginTop: '8px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#61789c' }}>@</span>
                    <input
                      type="text"
                      name="telegram_username"
                      value={formData.telegram_username}
                      onChange={handleChange}
                      placeholder="username"
                      style={{ paddingLeft: '30px', width: '100%' }}
                    />
                  </div>
                </label>
                <label>
                  Telefon raqam
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                    style={{ marginTop: '8px', width: '100%' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <label>
                  Veb-sayt
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    style={{ marginTop: '8px', width: '100%' }}
                  />
                </label>
                <label>
                  Manzil
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Toshkent, O'zbekiston"
                    style={{ marginTop: '8px', width: '100%' }}
                  />
                </label>
              </div>

              <label>
                Biografiya
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="O'zingiz haqingizda qisqacha..."
                  style={{ marginTop: '8px', width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e0e9f6' }}
                ></textarea>
              </label>

              <div style={{ marginTop: '10px' }}>
                <button type="submit" className="primary-btn" disabled={saving} style={{ padding: '12px 30px', fontSize: '1rem' }}>
                  {saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
                </button>
              </div>
            </form>
          </div>

          {/* My Articles Section */}
          <div className="profile-articles" style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '30px', color: '#0f264a', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>Yuborilgan maqolalar</h2>
            
            <div className="my-articles-list" style={{ display: 'grid', gap: '15px' }}>
              {myArticles.length === 0 ? (
                <p className="muted-text">Siz hali maqola yubormagansiz.</p>
              ) : (
                myArticles.map((article) => (
                  <div key={article.id} className="my-article-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                    <div>
                      <h4 style={{ color: '#0f264a', fontSize: '1.1rem', marginBottom: '5px' }}>
                        {article.status === 'published' ? (
                          <Link to={`/articles/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{article.title}</Link>
                        ) : (
                          article.title
                        )}
                      </h4>
                      <span style={{ fontSize: '0.85rem', color: '#61789c' }}>
                        📅 {article.status === 'published' && article.published_at 
                            ? article.published_at.slice(0, 10) 
                            : (article.created_at ? article.created_at.slice(0, 10) : 'Sana yo‘q')}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span 
                        style={{ 
                          padding: '5px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.85rem', 
                          fontWeight: '600',
                          color: statusMap[article.status]?.color,
                          background: statusMap[article.status]?.bg 
                        }}
                      >
                        {statusMap[article.status]?.label}
                      </span>
                      {article.status === 'rejected' && article.admin_notes && (
                        <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '5px', maxWidth: '200px' }}>
                          💡 {article.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <Link to="/submit-article" className="primary-btn" style={{ padding: '12px 35px', display: 'inline-block', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', boxShadow: '0 4px 12px rgba(233, 190, 100, 0.3)' }}>
                + Yangi maqola yuborish
              </Link>
            </div>
          </div>
        </main>

      </div>
    </section>
  )
}

export default ProfilePage
