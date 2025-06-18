import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { PrivateRoute } from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import { Home } from './pages/Home'
import { PublicBrains } from './pages/PublicBrainPage'
import { SharedBrainView } from './pages/SharedBrainView'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicRoute } from './components/PublicRoute'



function App() {
  
  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
      <Route path="/signin" element={
        <PublicRoute>
          <Signin />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
        } />
      <Route path="/" element={<Home />} />
      <Route path="/public-brains" element={<PublicBrains />} />
      <Route path="/brain/share/:shareLink" element={<SharedBrainView />} />
    </Routes>   
  </BrowserRouter>
  
}
// 2:34
export default App


// react-hook-forms
// react-query