import { Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Legal from './routes/Legal'
import Settings from './routes/Settings'
import Interview from './routes/Interview'

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/terms" element={<Legal />} />
      <Route path="/privacy" element={<Legal />} />
      <Route path="/interview" element={<Interview />} />
    </Routes>
  )
}
