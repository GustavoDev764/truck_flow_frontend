import {
  Badge,
  Box,
  Button,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react'
import type { User } from '@app/api/user_service'

export function UserTable({
  users,
  loading,
  onEdit,
  onChangePassword,
  onDesativar,
}: {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onChangePassword: (user: User) => void
  onDesativar: (user: User) => void
}) {
  if (loading) {
    return (
      <Table variant="simple" data-test="users-table">
        <Thead>
          <Tr>
            <Th>Usuário</Th>
            <Th>Nome</Th>
            <Th>Grupos</Th>
            <Th>Status</Th>
            <Th textAlign="right">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <Tr key={i}>
              <Td><Skeleton height="20px" /></Td>
              <Td><Skeleton height="20px" /></Td>
              <Td><Skeleton height="20px" /></Td>
              <Td><Skeleton height="20px" /></Td>
              <Td textAlign="right"><Skeleton height="20px" display="inline-block" w="100px" /></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }

  if (!users.length) {
    return <Text color="gray.500" data-test="users-empty">Nenhum usuário cadastrado.</Text>
  }

  return (
    <Table variant="simple" data-test="users-table">
      <Thead>
        <Tr>
          <Th>Usuário</Th>
          <Th>Nome</Th>
          <Th>Grupos</Th>
          <Th>Status</Th>
          <Th textAlign="right">Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((u) => (
          <Tr key={u.id}>
            <Td>{u.username}</Td>
            <Td>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '-'}</Td>
            <Td>
              <Box display="flex" gap={1} flexWrap="wrap">
                {(u.groups_display ?? []).map((g) => (
                  <Badge key={g} colorScheme="purple" size="sm">
                    {g}
                  </Badge>
                ))}
              </Box>
            </Td>
            <Td>
              <Badge colorScheme={u.is_active ? 'green' : 'red'}>{u.is_active ? 'Ativo' : 'Inativo'}</Badge>
            </Td>
            <Td textAlign="right">
              <Button size="sm" variant="ghost" mr={2} onClick={() => onEdit(u)} data-test="user-edit-btn">
                Editar
              </Button>
              <Button size="sm" variant="ghost" mr={2} onClick={() => onChangePassword(u)}>
                Trocar senha
              </Button>
              <Button
                size="sm"
                variant="ghost"
                colorScheme={u.is_active ? 'red' : 'green'}
                onClick={() => onDesativar(u)}
                data-test="user-deactivate-btn"
              >
                {u.is_active ? 'Desativar' : 'Ativar'}
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
