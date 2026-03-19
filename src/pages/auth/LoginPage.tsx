import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useAuth } from '@app/app/context/AuthContext'

export function LoginPage() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username.trim(), password)
      navigate('/', { replace: true })
    } catch {
      // error já vem no state
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <VStack w="100%" maxW="400px" spacing={6} p={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          TruckFlow
        </Text>
        <Text color="gray.600">Entre com seu usuário e senha</Text>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!error} isRequired>
              <FormLabel>Usuário</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: manage@truckflow.com"
                autoComplete="username"
                autoFocus
              />
              {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </FormControl>

            <Button type="submit" colorScheme="purple" w="100%" isLoading={loading}>
              Entrar
            </Button>
          </Stack>
        </form>
      </VStack>
    </Box>
  )
}
