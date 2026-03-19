import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { Truck } from '@app/types/truck'
import { usePageTitle } from '@app/hooks/usePageTitle'
import { DashboardPage } from '@app/pages/dashboard/DashboardPage'
import { ListTrucksPage } from '@app/pages/trucks/ListTrucksPage'
import { TruckUpsertPage } from '@app/pages/trucks/TruckUpsertPage'
import { ListUsersPage } from '@app/pages/users/ListUsersPage'
import { UserUpsertPage } from '@app/pages/users/UserUpsertPage'
import { LoginPage } from '@app/pages/auth/LoginPage'
import { AdminLayout } from '@app/components/layout/AdminLayout'
import { useAuth } from '@app/app/context/AuthContext'

function TruckEditRoute({ onCancel, onSaved }: { onCancel: () => void; onSaved: () => void }) {
  const location = useLocation()
  const truck = (location.state as { truck?: Truck } | null)?.truck
  if (!truck) {
    return <Navigate to="/trucks" replace />
  }
  return <TruckUpsertPage mode="edit" initialTruck={truck} onCancel={onCancel} onSaved={onSaved} />
}

function ProtectedApp() {
  const { user, loading, logout, isManage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleNavigate = (menu: 'trucks' | 'users' | 'dashboard') => {
    if (menu === 'dashboard') navigate('/dashboard')
    else if (menu === 'users') navigate('/users')
    else navigate('/trucks')
  }

  const activeMenu = pathname.startsWith('/users')
    ? 'users'
    : pathname.startsWith('/dashboard')
      ? 'dashboard'
      : 'trucks'

  if (loading || !user) return null

  return (
    <AdminLayout
      activeMenu={activeMenu}
      onNavigate={handleNavigate}
      showUsersMenu={isManage}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/trucks"
          element={
            <ListTrucksPage
              onCreate={() => navigate('/trucks/new')}
              onEdit={(truck: Truck) => navigate(`/trucks/${truck.id}/edit`, { state: { truck } })}
            />
          }
        />
        <Route
          path="/trucks/new"
          element={
            <TruckUpsertPage
              mode="create"
              onCancel={() => navigate('/trucks')}
              onSaved={() => navigate('/trucks')}
            />
          }
        />
        <Route path="/trucks/:id/edit" element={<TruckEditRoute onCancel={() => navigate('/trucks')} onSaved={() => navigate('/trucks')} />} />
        {isManage ? (
          <>
            <Route path="/users" element={<ListUsersPage />} />
            <Route path="/users/new" element={<UserUpsertPage />} />
            <Route path="/users/:id/edit" element={<UserUpsertPage />} />
          </>
        ) : null}
        <Route path="*" element={<Navigate to="/trucks" replace />} />
      </Routes>
    </AdminLayout>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()
  usePageTitle()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7fafc',
        }}
      >
        Carregando...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/*" element={user ? <ProtectedApp /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
