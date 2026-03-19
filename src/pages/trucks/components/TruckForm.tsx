import type { Truck } from '@app/types/truck'
import {
  validateManufacturingYear,
  validateNonEmpty,
  validatePlate,
  normalizePlate,
} from '@app/utils/validators'
import { formatPlateInput } from '@app/utils/plateMask'
import {
  Alert,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { SearchableSelect } from '@app/components/common/SearchableSelect'
import { useFipeCatalog } from '@app/pages/trucks/hooks/useFipeCatalog'

type FormValues = {
  license_plate: string
  brand: string
  model: string
  manufacturing_year: number
}

export function TruckForm({
  mode,
  initialTruck,
  isSubmitting,
  apiError,
  onSubmit,
}: {
  mode: 'create' | 'edit'
  initialTruck?: Truck
  isSubmitting: boolean
  apiError: string | null
  onSubmit: (values: FormValues) => Promise<void>
}) {
  const initialValues = useMemo<FormValues>(() => {
    const plate = initialTruck?.license_plate ?? ''
    return {
      license_plate: plate ? formatPlateInput(plate) : '',
      brand: initialTruck?.brand ?? '',
      model: initialTruck?.model ?? '',
      manufacturing_year: initialTruck?.manufacturing_year ?? new Date().getUTCFullYear(),
    }
  }, [initialTruck])

  const [values, setValues] = useState<FormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({})

  const {
    brands,
    models,
    years,
    loadingBrands,
    loadingModels,
    loadingYears,
    selectBrand,
    selectModel,
  } = useFipeCatalog(initialTruck?.brand, initialTruck?.model)

  useEffect(() => {
    setValues(initialValues)
    setFieldErrors({})
  }, [initialValues])

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {}

    if (mode === 'create') {
      const plateError = validatePlate(values.license_plate)
      if (plateError) nextErrors.license_plate = plateError
    }

    const brandError = validateNonEmpty(values.brand, 'Marca')
    if (brandError) nextErrors.brand = brandError

    const modelError = validateNonEmpty(values.model, 'Modelo')
    if (modelError) nextErrors.model = modelError

    const yearError = validateManufacturingYear(values.manufacturing_year)
    if (yearError) nextErrors.manufacturing_year = yearError

    return nextErrors
  }

  const submit = async () => {
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    const normalized: FormValues = {
      ...values,
      license_plate: normalizePlate(values.license_plate),
    }

    await onSubmit(normalized)
  }

  const handleBrandChange = (name: string | number, code?: string) => {
    setValues((v) => ({
      ...v,
      brand: String(name),
      model: '',
      manufacturing_year: 0,
    }))
    selectBrand(code)
  }

  const handleModelChange = (name: string | number, code?: string) => {
    setValues((v) => ({
      ...v,
      model: String(name),
      manufacturing_year: 0,
    }))
    selectModel(code)
  }

  const handleYearChange = (year: string | number) => {
    setValues((v) => ({
      ...v,
      manufacturing_year: typeof year === 'number' ? year : parseInt(String(year), 10) || 0,
    }))
  }

  return (
    <Stack spacing={4} data-test="truck-form">
      {apiError ? (
        <Alert status="error" variant="left-accent">
          {apiError}
        </Alert>
      ) : null}

      <Text fontWeight="semibold" data-test="truck-form-title">{mode === 'create' ? 'Cadastro de Caminhão' : 'Atualização de Caminhão'}</Text>

      <Stack spacing={4} direction={{ base: 'column', md: 'row' }} align="flex-start">
        <FormControl isInvalid={!!fieldErrors.license_plate} isDisabled={mode === 'edit'}>
          <FormLabel>Placa</FormLabel>
          <Input
            value={values.license_plate}
            onChange={(e) => setValues((v) => ({ ...v, license_plate: formatPlateInput(e.target.value) }))}
            placeholder="ABC-1234 ou ABC1D23"
            maxLength={8}
            data-test="truck-form-license-plate"
          />
          <FormErrorMessage>{fieldErrors.license_plate}</FormErrorMessage>
        </FormControl>

        <SearchableSelect
          options={brands}
          value={values.brand}
          onChange={handleBrandChange}
          getLabel={(b) => b.name}
          getValue={(b) => b.name}
          getCode={(b) => b.code}
          label="Marca"
          placeholder="Buscar marca..."
          isLoading={loadingBrands}
          error={fieldErrors.brand}
          isRequired
          dataTestId="truck-form-brand"
        />
      </Stack>

      <Stack spacing={4} direction={{ base: 'column', md: 'row' }} align="flex-start">
        <SearchableSelect
          options={models}
          value={values.model}
          onChange={handleModelChange}
          getLabel={(m) => m.name}
          getValue={(m) => m.name}
          getCode={(m) => m.code}
          label="Modelo"
          placeholder="Buscar modelo..."
          isLoading={loadingModels}
          isDisabled={!values.brand}
          error={fieldErrors.model}
          isRequired
          dataTestId="truck-form-model"
        />

        <SearchableSelect
          options={years}
          value={values.manufacturing_year}
          onChange={handleYearChange}
          getLabel={(y) => String(y.year)}
          getValue={(y) => y.year}
          label="Ano"
          placeholder="Buscar ano..."
          isLoading={loadingYears}
          isDisabled={!values.model}
          error={fieldErrors.manufacturing_year}
          isRequired
          dataTestId="truck-form-year"
        />
      </Stack>

      <Stack direction={{ base: 'column', sm: 'row' }} justify="flex-end" spacing={3}>
        <Button onClick={() => setValues(initialValues)} variant="outline" isDisabled={isSubmitting} data-test="truck-form-clear">
          Limpar
        </Button>
        <Button onClick={submit} colorScheme="purple" isLoading={isSubmitting} data-test="truck-form-submit">
          {mode === 'create' ? 'Cadastrar' : 'Atualizar'}
        </Button>
      </Stack>
    </Stack>
  )
}
