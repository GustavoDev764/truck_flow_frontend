import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'

export type AdminMenuKey = 'trucks' | 'users' | 'dashboard'

const TruckIcon = () => (
  <Box as="span" display="inline-flex" w="20px" h="20px" flexShrink={0}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18h2" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    </svg>
  </Box>
)

const UserIcon = () => (
  <Box as="span" display="inline-flex" w="20px" h="20px" flexShrink={0}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  </Box>
)

const ChartIcon = () => (
  <Box as="span" display="inline-flex" w="20px" h="20px" flexShrink={0}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  </Box>
)

export function AdminLayout({
  children,
  activeMenu,
  onNavigate,
  brand,
  showUsersMenu = false,
  onLogout,
}: {
  children: ReactNode
  activeMenu: AdminMenuKey
  onNavigate: (menu: AdminMenuKey) => void
  brand?: string
  showUsersMenu?: boolean
  onLogout?: () => void
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sidebarWidth = useMemo(() => (sidebarOpen ? '260px' : '84px'), [sidebarOpen])

  return (
    <Flex minH="100vh" w="100%" maxW="100%" bg="gray.50" align="stretch">
      <Box
        w={sidebarWidth}
        minH="100vh"
        flexShrink={0}
        bg="gray.900"
        color="white"
        transition="width 200ms ease"
        display="flex"
        flexDirection="column"
      >
        <Flex h="60px" align="center" justify="space-between" px={sidebarOpen ? 4 : 2}>
          <Text fontWeight="bold" fontSize="sm" display={sidebarOpen ? 'block' : 'none'}>
            {brand ?? 'TruckFlow'}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'gray.700' }}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? 'Fechar' : 'Abrir'}
          </Button>
        </Flex>

        <Stack spacing={2} px={sidebarOpen ? 3 : 1} mt={2} align="stretch" flex="1">
          <SidebarItem
            icon={<ChartIcon />}
            label="Dashboard"
            isActive={activeMenu === 'dashboard'}
            sidebarOpen={sidebarOpen}
            onClick={() => onNavigate('dashboard')}
          />
          <SidebarItem
            icon={<TruckIcon />}
            label="Caminhões"
            isActive={activeMenu === 'trucks'}
            sidebarOpen={sidebarOpen}
            onClick={() => onNavigate('trucks')}
          />
          {showUsersMenu ? (
            <SidebarItem
              icon={<UserIcon />}
              label="Usuários"
              isActive={activeMenu === 'users'}
              sidebarOpen={sidebarOpen}
              onClick={() => onNavigate('users')}
            />
          ) : null}
        </Stack>

        {onLogout ? (
          <Box p={sidebarOpen ? 3 : 2} borderTopWidth="1px" borderColor="gray.700">
            <Button
              size="sm"
              variant="ghost"
              color="white"
              w="100%"
              _hover={{ bg: 'gray.700' }}
              onClick={onLogout}
            >
              <Text fontSize="sm" display={sidebarOpen ? 'inline' : 'none'}>
                Sair
              </Text>
            </Button>
          </Box>
        ) : null}
      </Box>

      <Box flex="1" minW={0} w="100%" minH="100vh">
        {children}
      </Box>
    </Flex>
  )
}

function SidebarItem({
  icon,
  label,
  isActive,
  onClick,
  sidebarOpen,
}: {
  icon: ReactNode
  label: string
  isActive: boolean
  sidebarOpen: boolean
  onClick: () => void
}) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      justifyContent="flex-start"
      w="100%"
      bg={isActive ? 'gray.700' : 'transparent'}
      _hover={{ bg: 'gray.700' }}
      color="white"
      borderRadius="md"
      px={sidebarOpen ? 3 : 2}
      gap={3}
    >
      {icon}
      <Text fontSize="sm" display={sidebarOpen ? 'inline' : 'none'}>
        {label}
      </Text>
    </Button>
  )
}

