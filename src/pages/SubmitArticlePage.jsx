import { useEffect, useMemo, useState } from 'react'
import { createArticle, fetchTags, fetchWriters } from '../services/api'

const initialForm = {
  title: '',
  writer: '',
  summary: '',
  content: '',
}

function SubmitArticlePage() {
  const [writers, setWriters] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [articleFile, setArticleFile] = useState(null)
  const [submitForReview, setSubmitForReview] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    async function loadMeta() {
      try {
        const [writersData, tagsData] = await Promise.all([fetchWriters(), fetchTags()])
        if (!active) return

        setWriters(writersData?.results || writersData || [])
        setTags(tagsData?.results || tagsData || [])
      } catch {
        if (!active) return
        setError('Yozuvchilar yoki teglar ro‘yxatini yuklab bo‘lmadi.')
      }
    }

    loadMeta()

    return () => {
      active = false
    }
  }, [])

  const hasToken = useMemo(() => Boolean(localStorage.getItem('access_token')), [])

  function toggleTag(tagId) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((item) => item !== tagId) : [...prev, tagId],
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!localStorage.getItem('access_token')) {
      setError('Avval login qiling, keyin maqola yuborishingiz mumkin.')
      return
    }

    if (!selectedTags.length) {
      setError('Kamida bitta teg tanlang.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('summary', form.summary)
      formData.append('content', form.content)

      if (form.writer) {
        formData.append('writer', form.writer)
      }

      selectedTags.forEach((tagId) => {
        formData.append('tags_data', tagId)
      })

      if (image) {
        formData.append('featured_image', image)
      }
      if (articleFile) {
        formData.append('article_file', articleFile)
      }
      formData.append('submit_for_review', String(submitForReview))

      await createArticle(formData)
      setSuccess(
        submitForReview
          ? 'Maqola moderatsiyaga yuborildi. Admin tasdiqlagach e’lon qilinadi.'
          : 'Maqola qoralama sifatida saqlandi.',
      )
      setForm(initialForm)
      setSelectedTags([])
      setImage(null)
      setArticleFile(null)
    } catch (err) {
      setError(err.message || 'Maqola yuborishda xatolik yuz berdi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section-page">
      <header className="page-top">
        <span className="page-kicker">Kontent</span>
        <h2>Maqola yuborish</h2>
        <p>
          Maqolangiz admin tomonidan ko‘rib chiqiladi va tasdiqlangandan keyin
          ochiq bazada e’lon qilinadi.
        </p>
      </header>

      {!hasToken ? (
        <p className="form-warning">
          Siz login qilmagansiz. Maqola yuborishdan oldin <a href="/login">kirish</a> sahifasiga o‘ting.
        </p>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}

      <form className="article-form" onSubmit={handleSubmit}>
        <label>
          Sarlavha
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
        </label>

        <label>
          Haqida yozuvchi
          <select
            value={form.writer}
            onChange={(event) => setForm((prev) => ({ ...prev, writer: event.target.value }))}
          >
            <option value="">Yozuvchini tanlang</option>
            {writers.map((writer) => (
              <option key={writer.id} value={writer.id}>
                {writer.full_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Qisqa tavsif
          <textarea
            value={form.summary}
            onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            rows={3}
            required
          />
        </label>

        <label>
          To‘liq matn
          <textarea
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            rows={8}
            required
          />
        </label>

        <div>
          <p className="label-title">Teglar</p>
          <div className="tag-grid">
            {tags.map((tag) => {
              const checked = selectedTags.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-chip ${checked ? 'is-selected' : ''}`}
                  onClick={() => toggleTag(tag.id)}
                >
                  #{tag.name}
                </button>
              )
            })}
          </div>
        </div>

        <label>
          Asosiy rasm (ixtiyoriy)
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
        </label>

        <label>
          Maqola fayli (ixtiyoriy: .pdf, .doc, .docx)
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => setArticleFile(event.target.files?.[0] || null)}
          />
        </label>

        <label className="inline-checkbox">
          <input
            type="checkbox"
            checked={submitForReview}
            onChange={(event) => setSubmitForReview(event.target.checked)}
          />
          Tayyor bo‘lsa admin moderatsiyasiga yuborilsin (`pending`)
        </label>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Yuborilmoqda...' : 'Maqolani yuborish'}
        </button>
      </form>
    </section>
  )
}

export default SubmitArticlePage
