import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const APP_NAME = 'TruckFlow'

const TITLE_MAP: Record<string, string> = {
  '/login': 'Login',
  '/dashboard': 'Dashboard',
  '/trucks': 'Caminhões',
  '/trucks/new': 'Novo Caminhão',
  '/users': 'Usuários',
  '/users/new': 'Novo Usuário',
}

function getTitleFromPath(pathname: string): string {
  if (TITLE_MAP[pathname]) return `${TITLE_MAP[pathname]} | ${APP_NAME}`

  const trucksEditMatch = pathname.match(/^\/trucks\/[^/]+\/edit$/)
  if (trucksEditMatch) return `Editar Caminhão | ${APP_NAME}`

  const usersEditMatch = pathname.match(/^\/users\/[^/]+\/edit$/)
  if (usersEditMatch) return `Editar Usuário | ${APP_NAME}`

  return APP_NAME
}

export function usePageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = getTitleFromPath(pathname)
  }, [pathname])
}
