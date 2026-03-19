import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, HStack, Stack, useDisclosure } from '@chakra-ui/react'
import { user_service, type User } from '@app/api/user_service'
import { useAuth } from '@app/app/context/AuthContext'
import { PageHeader } from '@app/components/common/PageHeader'
import { DeactivateUserModal } from '@app/pages/users/DeactivateUserModal'
import { UserPasswordModal } from '@app/pages/users/UserPasswordModal'
import { UserTable } from '@app/pages/users/UserTable'

const PAGE_SIZE = 10

export function ListUsersPage() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deactivateLoading, setDeactivateLoading] = useState(false)
  const deactivateModal = useDisclosure()
  const passwordModal = useDisclosure()

  const totalPages = Math.ceil(count / PAGE_SIZE) || 1

  const loadUsers = async (pageNum = 1) => {
    setLoading(true)
    try {
      const data = await user_service.list(pageNum)
      setUsers(data.results)
      setCount(data.count)
      setPage(pageNum)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreate = () => navigate('/users/new')

  const handleEdit = (user: User) => navigate(`/users/${user.id}/edit`)

  const handleChangePassword = (user: User) => {
    setSelectedUser(user)
    passwordModal.onOpen()
  }

  const handlePasswordChanged = () => {
    passwordModal.onClose()
    loadUsers(page)
  }

  const handleDesativarClick = (user: User) => {
    setSelectedUser(user)
    deactivateModal.onOpen()
  }

  const handleDesativarConfirm = async () => {
    if (!selectedUser) return
    setDeactivateLoading(true)
    try {
      await user_service.deactivate(selectedUser.id, !selectedUser.is_active)
      await refreshUser()
      loadUsers(page)
      deactivateModal.onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setDeactivateLoading(false)
    }
  }

  return (
    <Box as="main" w="100%" maxW="100%" px={{ base: 4, md: 8 }} py={8}>
      <PageHeader
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
        actions={
          <Button colorScheme="purple" onClick={handleCreate} data-test="create-user-btn">
            Cadastrar
          </Button>
        }
      />

      <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden" mt={6} data-test="users-table-container">
        <Stack p={4}>
          <UserTable
            users={users}
            loading={loading}
            onEdit={handleEdit}
            onChangePassword={handleChangePassword}
            onDesativar={handleDesativarClick}
          />
        </Stack>

        {totalPages > 1 ? (
          <HStack justify="flex-end" p={4} borderTopWidth="1px">
            <Button size="sm" isDisabled={page <= 1} onClick={() => loadUsers(page - 1)}>
              Anterior
            </Button>
            <span>
              Página {page} de {totalPages}
            </span>
            <Button size="sm" isDisabled={page >= totalPages} onClick={() => loadUsers(page + 1)}>
              Próxima
            </Button>
          </HStack>
        ) : null}
      </Box>

      <DeactivateUserModal
        isOpen={deactivateModal.isOpen}
        onClose={deactivateModal.onClose}
        user={selectedUser}
        onConfirm={handleDesativarConfirm}
        isLoading={deactivateLoading}
      />
      <UserPasswordModal
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.onClose}
        user={selectedUser}
        onSaved={handlePasswordChanged}
      />
    </Box>
  )
}
