import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/auth'
import { RequireAuth } from './components/auth/RequireAuth'
import DashboardLayout from './components/dashboard/Layout'
import LoginPage from './app/auth/login/page'
import DashboardPage from './app/(dashboard)/page'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }>
          <Route path="/" element={<DashboardPage />} />
          {/* Thêm các routes khác sau khi có components */}
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
