import { useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import { user_service, type User } from '@app/api/user_service'

type Props = {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSaved: () => void
}

export function UserPasswordModal({ isOpen, onClose, user, onSaved }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPassword('')
    setConfirm('')
    setError(null)
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (!user) return
    setLoading(true)
    try {
      await user_service.changePassword(user.id, password)
      onSaved()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Erro ao alterar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Trocar senha {user ? `- ${user.username}` : ''}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {error ? (
                <FormControl isInvalid>
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
              ) : null}

              <FormControl isRequired>
                <FormLabel>Nova senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirmar senha</FormLabel>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="purple" type="submit" isLoading={loading}>
              Alterar senha
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
