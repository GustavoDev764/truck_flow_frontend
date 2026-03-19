import { useToast } from '@chakra-ui/react'

export function useAppFeedback() {
  const toast = useToast()

  const showSuccess = (title: string) => {
    toast({
      title,
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  }

  const showError = (title: string) => {
    toast({
      title,
      status: 'error',
      duration: 4000,
      isClosable: true,
    })
  }

  return { showSuccess, showError }
}

