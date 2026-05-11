import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

    try {
      const data = await loginUser(formData)
      // data: { access, refresh, user }
      login(data.user, data.access, data.refresh)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login yoki parol xato.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-page">
      <div className="auth-container" style={{ maxWidth: '420px', margin: '60px auto' }}>
        <header className="page-top" style={{ textAlign: 'center' }}>
          <span className="page-kicker">Xush kelibsiz</span>
          <h2>Tizimga kirish</h2>
          <p>Profilingizga kiring va maqolalar yuboring</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="form-error" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
          
          <label>
            Foydalanuvchi nomi
            <input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
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

          <button type="submit" className="primary-btn" disabled={loading} style={{ height: '50px', fontSize: '1.1rem', marginTop: '10px' }}>
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', color: '#61789c' }}>
          Profilingiz yo‘qmi? <Link to="/register" style={{ color: '#d4a017', fontWeight: '700', textDecoration: 'none' }}>Ro‘yxatdan o‘tish</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
