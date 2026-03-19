import type { Truck } from '@app/types/truck'
import { formatBRL } from '@app/utils/format'
import {
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

export function TruckTable({
  trucks,
  loading,
  onEdit,
  onDelete,
}: {
  trucks: Truck[]
  loading: boolean
  onEdit: (truck: Truck) => void
  onDelete: (truck: Truck) => void
}) {
  if (loading) {
    return (
      <Table variant="simple" data-test="trucks-table">
        <Thead>
          <Tr>
            <Th>Placa</Th>
            <Th>Marca</Th>
            <Th>Modelo</Th>
            <Th>Ano</Th>
            <Th>FIPE</Th>
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
              <Td><Skeleton height="20px" /></Td>
              <Td textAlign="right"><Skeleton height="20px" display="inline-block" w="80px" /></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }

  if (!trucks.length) {
    return <Text color="gray.500" data-test="trucks-empty">Nenhum caminhão cadastrado.</Text>
  }

  return (
    <Table variant="simple" data-test="trucks-table">
      <Thead>
        <Tr>
          <Th>Placa</Th>
          <Th>Marca</Th>
          <Th>Modelo</Th>
          <Th>Ano</Th>
          <Th>FIPE</Th>
          <Th textAlign="right">Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {trucks.map((t) => (
          <Tr key={t.id}>
            <Td>{t.license_plate}</Td>
            <Td>{t.brand}</Td>
            <Td>{t.model}</Td>
            <Td>{t.manufacturing_year}</Td>
            <Td>{formatBRL(t.fipe_price)}</Td>
            <Td textAlign="right">
              <Button size="sm" variant="ghost" mr={2} onClick={() => onEdit(t)} data-test="truck-edit-btn">
                Editar
              </Button>
              <Button size="sm" variant="ghost" colorScheme="red" onClick={() => onDelete(t)} data-test="truck-delete-btn">
                Deletar
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

