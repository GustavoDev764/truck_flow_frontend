import type { Truck } from '@app/types/truck'
import { TruckForm } from '@app/pages/trucks/components/TruckForm'
import { useTruckUpsert } from '@app/pages/trucks/hooks/useTruckUpsert'
import { Box, Button } from '@chakra-ui/react'
import { PageHeader } from '@app/components/common/PageHeader'
import { useAppFeedback } from '@app/hooks/useAppFeedback'

export function TruckUpsertPage({
  mode,
  initialTruck,
  onCancel,
  onSaved,
}: {
  mode: 'create' | 'edit'
  initialTruck?: Truck
  onCancel: () => void
  onSaved: () => void
}) {
  const { showSuccess, showError } = useAppFeedback()
  const { submit, isSubmitting, apiError } = useTruckUpsert({ mode, initialTruck })

  const handleSubmit = async (values: {
    license_plate: string
    brand: string
    model: string
    manufacturing_year: number
  }) => {
    try {
      await submit(values)
      showSuccess(mode === 'create' ? 'Caminhão cadastrado' : 'Caminhão atualizado')
      onSaved()
    } catch {
      showError('Falha ao salvar')
    }
  }

  return (
    <Box as="main" p={6} display="flex" flexDirection="column" w="100%" maxW="100%" minH="calc(100vh - 60px)">
      <PageHeader
        title={mode === 'create' ? 'Cadastrar Caminhão' : 'Atualizar Caminhão'}
        actions={
          <Button variant="outline" onClick={onCancel} isDisabled={isSubmitting}>
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
        <TruckForm mode={mode} initialTruck={initialTruck} apiError={apiError} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </Box>
    </Box>
  )
}

