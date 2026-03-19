import { useState } from 'react'
import type { Truck } from '@app/types/truck'
import { TruckTable } from '@app/pages/trucks/components/TruckTable'
import { DeleteTruckModal } from '@app/pages/trucks/DeleteTruckModal'
import { useTrucksList } from '@app/pages/trucks/hooks/useTrucksList'
import { Alert, Box, Button, HStack, Stack, useDisclosure } from '@chakra-ui/react'
import { PageHeader } from '@app/components/common/PageHeader'

export function ListTrucksPage({
  onCreate,
  onEdit,
}: {
  onCreate: () => void
  onEdit: (truck: Truck) => void
}) {
  const { trucks, pagination, loading, error, refreshTrucks, deleteTruck } = useTrucksList()
  const [truckToDelete, setTruckToDelete] = useState<Truck | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const deleteModal = useDisclosure()

  const handleDeleteClick = (truck: Truck) => {
    setTruckToDelete(truck)
    deleteModal.onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!truckToDelete) return
    setDeleteLoading(true)
    try {
      await deleteTruck(truckToDelete.id)
      deleteModal.onClose()
      setTruckToDelete(null)
    } catch {
      // error handled by context
    } finally {
      setDeleteLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    refreshTrucks(page)
  }

  return (
    <Box as="main" w="100%" maxW="100%" px={{ base: 4, md: 8 }} py={8}>
      <PageHeader
        title="Caminhões"
        subtitle="Frota de caminhões"
        actions={
          <Button colorScheme="purple" onClick={onCreate} data-test="create-truck-btn">
            Cadastrar
          </Button>
        }
      />

      {error ? (
        <Alert status="error" variant="left-accent" mt={4}>
          {error}
        </Alert>
      ) : null}

      <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden" mt={6} data-test="trucks-table-container">
        <Stack p={4}>
          <TruckTable trucks={trucks} loading={loading} onEdit={onEdit} onDelete={handleDeleteClick} />
        </Stack>

        {pagination.totalPages > 1 ? (
          <HStack justify="flex-end" p={4} borderTopWidth="1px">
            <Button
              size="sm"
              isDisabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Anterior
            </Button>
            <span>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              size="sm"
              isDisabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Próxima
            </Button>
          </HStack>
        ) : null}
      </Box>

      <DeleteTruckModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        truck={truckToDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
      />
    </Box>
  )
}

