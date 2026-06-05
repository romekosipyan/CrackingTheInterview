import { lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { initGA } from './lib/analytics'
import SiteLayout from './components/SiteLayout'
import './styles/site.css'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LaunchPage = lazy(() => import('./pages/LaunchPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const SuccessPage = lazy(() => import('./pages/SuccessPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))

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
