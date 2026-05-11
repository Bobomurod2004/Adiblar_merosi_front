import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import SiteLayout from './components/SiteLayout'
import HomePage from './pages/HomePage'
import WritersPage from './pages/WritersPage'
import WorksPage from './pages/WorksPage'
import WorkDetailPage from './pages/WorkDetailPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import SubmitArticlePage from './pages/SubmitArticlePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import StipendiyaPage from './pages/StipendiyaPage'
import TestsPage from './pages/TestsPage'
import TestDetailPage from './pages/TestDetailPage'
import AIChatPage from './pages/AIChatPage'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <SiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writers" element={<WritersPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/works/:slug" element={<WorkDetailPage />} />
          <Route path="/scholarships" element={<StipendiyaPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/tests/:slug" element={<TestDetailPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/submit-article" element={<SubmitArticlePage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteLayout>
    </AuthProvider>
  )
}

export default App
