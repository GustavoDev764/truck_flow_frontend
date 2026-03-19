import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import '@app/index.css'
import App from '@app/App.tsx'
import { AppProvider } from '@app/app/providers/AppProvider'
import { theme } from '@app/styles/chakraTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <AppProvider>
        <App />
      </AppProvider>
    </ChakraProvider>
  </StrictMode>,
)
