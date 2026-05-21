import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import LandingPage from './pages/LandingPage'
import PricingPage from './pages/PricingPage'
import SuccessPage from './pages/SuccessPage'
import AccountPage from './pages/AccountPage'
import './styles/site.css'

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
