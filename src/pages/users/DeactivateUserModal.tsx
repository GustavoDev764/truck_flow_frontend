import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import React, { useRef } from 'react'
import type { User } from '@app/api/user_service'

type Props = {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeactivateUserModal({ isOpen, onClose, user, onConfirm, isLoading }: Props) {
  const cancelRef = useRef(null)
  if (!user) return null

  const isActive = user.is_active
  const action = isActive ? 'desativar' : 'ativar'

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef as unknown as React.RefObject<HTMLButtonElement>}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Confirmar {action}</AlertDialogHeader>
          <AlertDialogBody>
            Tem certeza que deseja {action} o usuário <strong>{user.username}</strong>?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme={isActive ? 'red' : 'green'}
              onClick={() => onConfirm()}
              ml={3}
              isLoading={isLoading}
            >
              {isActive ? 'Desativar' : 'Ativar'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
