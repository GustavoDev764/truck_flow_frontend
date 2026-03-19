import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react'
import { user_service, type User } from '@app/api/user_service'
import { useAuth } from '@app/app/context/AuthContext'
import { PageHeader } from '@app/components/common/PageHeader'

const GROUPS = ['cliente', 'manage']

export function UserUpsertPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const isEdit = !!id
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [group, setGroup] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [loadUser, setLoadUser] = useState(isEdit)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && id) {
      user_service
        .get(parseInt(id, 10))
        .then((u) => {
          setUser(u)
          setUsername(u.username)
          setEmail(u.email ?? '')
          setFirstName(u.first_name ?? '')
          setLastName(u.last_name ?? '')
          setGroup((u.groups_display ?? [])[0] ?? '')
        })
        .catch(() => setError('Usuário não encontrado.'))
        .finally(() => setLoadUser(false))
    }
  }, [isEdit, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isEdit && user) {
        await user_service.update(user.id, {
          email: email || undefined,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          groups: group ? [group] : [],
        })
      } else {
        if (!password || password.length < 8) {
          setError('Senha deve ter no mínimo 8 caracteres.')
          setLoading(false)
          return
        }
        await user_service.create({
          username,
          email: email || undefined,
          password,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          groups: group ? [group] : [],
        })
      }
      await refreshUser()
      navigate('/users', { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: Record<string, unknown> } })?.response?.data as Record<string, unknown> | undefined
      const detail = (msg?.detail ?? msg?.username ?? msg?.password) as string | undefined
      setError(detail ?? 'Erro ao salvar usuário.')
    } finally {
      setLoading(false)
    }
  }

  if (loadUser) {
    return (
      <Box p={6}>
        <PageHeader title={isEdit ? 'Carregando...' : 'Novo usuário'} />
      </Box>
    )
  }

  return (
    <Box p={6} display="flex" flexDirection="column" h="100%" minH="calc(100vh - 60px)">
      <PageHeader
        title={isEdit ? 'Editar usuário' : 'Novo usuário'}
        actions={
          <Button variant="outline" onClick={() => navigate('/users')}>
            Voltar
          </Button>
        }
      />

      <Box
        bg="white"
        borderRadius="md"
        shadow="sm"
        p={6}
        flex="1"
        w="100%"
        maxW="100%"
        display="flex"
        flexDirection="column"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Stack spacing={4} flex="1">
            {error ? (
              <Alert status="error" variant="left-accent">
                {error}
              </Alert>
            ) : null}

            <FormControl isRequired={!isEdit}>
              <FormLabel>Usuário (login)</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: usuario@email.com"
                isDisabled={isEdit}
              />
            </FormControl>

            <FormControl>
              <FormLabel>E-mail</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nome" />
            </FormControl>

            <FormControl>
              <FormLabel>Sobrenome</FormLabel>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sobrenome" />
            </FormControl>

            {!isEdit ? (
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
              </FormControl>
            ) : null}

            <FormControl>
              <FormLabel>Grupo</FormLabel>
              <Select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Selecione um grupo"
              >
                {GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={3} pt={4}>
              <Button variant="outline" onClick={() => navigate('/users')}>
                Cancelar
              </Button>
              <Button colorScheme="purple" type="submit" isLoading={loading}>
                Salvar
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
