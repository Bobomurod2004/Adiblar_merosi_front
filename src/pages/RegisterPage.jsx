import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telegram_username: '',
    password: '',
    password_confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.password_confirm) {
      setError('Parollar mos kelmadi.')
      setLoading(false)
      return
    }

    try {
      const data = await registerUser(formData)
      // Ro'yxatdan o'tgandan so'ng avtomatik login qilish (agar API tokenni ham qaytarsa)
      // Hozircha login sahifasiga yo'naltiramiz
      alert('Ro‘yxatdan muvaffaqiyatli o‘tdingiz! Endi login qilishingiz mumkin.')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-page">
      <div className="auth-container" style={{ maxWidth: '500px', margin: '40px auto' }}>
        <header className="page-top" style={{ textAlign: 'center' }}>
          <span className="page-kicker">Hisob yaratish</span>
          <h2>Ro‘yxatdan o‘tish</h2>
          <p>Adiblar Merosi platformasiga qo‘shiling</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="form-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
          
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <label>
              Ism
              <input
                type="text"
                name="first_name"
                placeholder="Ismingiz"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Familiya
              <input
                type="text"
                name="last_name"
                placeholder="Familiyangiz"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Username
            <input
              type="text"
              name="username"
              placeholder="user123"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Telegram Username
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#61789c' }}>@</span>
              <input
                type="text"
                name="telegram_username"
                placeholder="username"
                style={{ paddingLeft: '30px' }}
                value={formData.telegram_username}
                onChange={handleChange}
              />
            </div>
          </label>

          <label>
            Parol
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Parolni tasdiqlash
            <input
              type="password"
              name="password_confirm"
              placeholder="********"
              value={formData.password_confirm}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="primary-btn" disabled={loading} style={{ marginTop: '10px', height: '50px', fontSize: '1.1rem' }}>
            {loading ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#61789c' }}>
          Profilingiz bormi? <Link to="/login" style={{ color: '#d4a017', fontWeight: '700', textDecoration: 'none' }}>Kirish</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
