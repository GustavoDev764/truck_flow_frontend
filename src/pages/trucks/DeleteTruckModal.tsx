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
import type { Truck } from '@app/types/truck'

type Props = {
  isOpen: boolean
  onClose: () => void
  truck: Truck | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteTruckModal({ isOpen, onClose, truck, onConfirm, isLoading }: Props) {
  const cancelRef = useRef(null)
  if (!truck) return null

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef as unknown as React.RefObject<HTMLButtonElement>}>
      <AlertDialogOverlay>
        <AlertDialogContent data-test="delete-truck-modal">
          <AlertDialogHeader>Confirmar exclusão</AlertDialogHeader>
          <AlertDialogBody>
            Tem certeza que deseja excluir o caminhão <strong>{truck.license_plate}</strong> ({truck.brand} {truck.model}
            )?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} data-test="delete-truck-cancel">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={() => onConfirm()} ml={3} isLoading={isLoading} data-test="delete-truck-confirm">
              Deletar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
