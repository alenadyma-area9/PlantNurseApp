import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem, createToaster } from '@chakra-ui/react'
import App from './App.tsx'

export const toaster = createToaster({
	placement: 'top',
	duration: 5000,
	overlap: true,
})

// Only create root once, even during HMR
const rootElement = document.getElementById('root')!
const key = '__reactRoot'
if (!(rootElement as any)[key]) {
	const root = createRoot(rootElement)
	;(rootElement as any)[key] = root

	root.render(
		<StrictMode>
			<ChakraProvider value={defaultSystem}>
				<App />
			</ChakraProvider>
		</StrictMode>,
	)
}
