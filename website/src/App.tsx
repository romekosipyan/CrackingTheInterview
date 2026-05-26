import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { initGA } from './lib/analytics'
import SiteLayout from './components/SiteLayout'
import LaunchPage from './pages/LaunchPage'
import LandingPage from './pages/LandingPage'
import PricingPage from './pages/PricingPage'
import SuccessPage from './pages/SuccessPage'
import AccountPage from './pages/AccountPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import './styles/site.css'

export default function App(): JSX.Element {
  useEffect(() => { initGA() }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/launch" element={<LaunchPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
