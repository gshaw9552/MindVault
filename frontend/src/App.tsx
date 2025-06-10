import { PrivateRoute } from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import { Home } from './pages/Home'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'

import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  
  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
        } />
      <Route path="/" element={<Home />} />
    </Routes>   
  </BrowserRouter>
  
}
// 2:34
export default App


// react-hook-forms
// react-query