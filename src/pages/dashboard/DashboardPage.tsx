import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { dashboard_service, type DashboardData, type DashboardTruck } from '@app/api/dashboard_service'
import { PageHeader } from '@app/components/common/PageHeader'
import { formatBRL } from '@app/utils/format'

function TruckCard({ title, truck }: { title: string; truck: DashboardTruck | null }) {
  if (!truck) {
    return (
      <Card h="100%" minH="160px" display="flex" flexDirection="column">
        <CardHeader><Text fontWeight="semibold">{title}</Text></CardHeader>
        <CardBody flex="1" display="flex" alignItems="center"><Text color="gray.500">Nenhum registro</Text></CardBody>
      </Card>
    )
  }
  return (
    <Card h="100%" minH="160px" display="flex" flexDirection="column">
      <CardHeader><Text fontWeight="semibold">{title}</Text></CardHeader>
      <CardBody flex="1">
        <Stack spacing={1}>
          <Text fontSize="sm">{truck.brand} {truck.model}</Text>
          <Text fontSize="sm" color="gray.600">Placa: {truck.license_plate}</Text>
          <Text fontWeight="bold" color="purple.600">{formatBRL(truck.fipe_price)}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')

  useEffect(() => {
    setLoading(true)
    dashboard_service.get(period).then(setData).finally(() => setLoading(false))
  }, [period])

  const chartData = data?.timeline ?? []

  return (
    <Box p={6}>
      <PageHeader
        title="Dashboard"
        subtitle="Relatórios da frota de caminhões"
      />

      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
        gap={6}
        mb={8}
        alignItems="stretch"
      >
        <Skeleton isLoaded={!loading} minH="160px">
          <TruckCard title="Caminhão mais barato" truck={data?.cheapest_truck ?? null} />
        </Skeleton>
        <Skeleton isLoaded={!loading} minH="160px">
          <TruckCard title="Caminhão mais caro" truck={data?.most_expensive_truck ?? null} />
        </Skeleton>
        <Skeleton isLoaded={!loading} minH="160px">
          <Card h="100%" minH="160px" display="flex" flexDirection="column">
            <CardHeader><Text fontWeight="semibold">Valor médio</Text></CardHeader>
            <CardBody flex="1" display="flex" flexDirection="column" justifyContent="center">
              <Text fontWeight="bold" fontSize="2xl" color="purple.600">
                {data ? formatBRL(String(data.average_value)) : '-'}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {data?.total_trucks ?? 0} caminhões cadastrados
              </Text>
            </CardBody>
          </Card>
        </Skeleton>
      </Grid>

      <Card>
        <CardHeader>
          <Stack direction="row" justify="space-between" align="center">
            <Heading size="md">Linha do tempo - Soma do valor FIPE por período</Heading>
            <ButtonGroup size="sm" isAttached>
              <Button variant={period === 'day' ? 'solid' : 'outline'} onClick={() => setPeriod('day')} colorScheme="purple">
                Dia
              </Button>
              <Button variant={period === 'week' ? 'solid' : 'outline'} onClick={() => setPeriod('week')} colorScheme="purple">
                Semana
              </Button>
              <Button variant={period === 'month' ? 'solid' : 'outline'} onClick={() => setPeriod('month')} colorScheme="purple">
                Mês
              </Button>
              <Button variant={period === 'year' ? 'solid' : 'outline'} onClick={() => setPeriod('year')} colorScheme="purple">
                Ano
              </Button>
            </ButtonGroup>
          </Stack>
        </CardHeader>
        <CardBody>
          <Skeleton isLoaded={!loading} minH="300px">
            {chartData.length > 0 ? (
              <Box h="350px" w="100%">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatBRL(String(value ?? 0)), 'Total FIPE']}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Line type="monotone" dataKey="total" stroke="#805AD5" strokeWidth={2} name="Total FIPE" dot={{ fill: '#805AD5' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Text color="gray.500" py={8} textAlign="center">
                Nenhum dado disponível para o período selecionado.
              </Text>
            )}
          </Skeleton>
        </CardBody>
      </Card>
    </Box>
  )
}
