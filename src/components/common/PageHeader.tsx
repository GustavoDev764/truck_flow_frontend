import type { ReactNode } from 'react'
import { Heading, Stack, Text } from '@chakra-ui/react'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} align="flex-start" justify="space-between" spacing={4} mb={6}>
      <Stack spacing={1}>
        <Heading size="lg">{title}</Heading>
        {subtitle ? (
          <Text color="gray.600" fontSize="sm">
            {subtitle}
          </Text>
        ) : null}
      </Stack>
      {actions}
    </Stack>
  )
}

