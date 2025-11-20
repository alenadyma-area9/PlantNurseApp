import {
	DialogRoot,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogFooter,
	DialogTitle,
	DialogCloseTrigger,
} from '@chakra-ui/react'
import { Button, VStack, Text, Box, HStack } from '@chakra-ui/react'
import { useSettingsStore } from '../store/settingsStore'
import { useEscapeKey, useEnterKey } from '../hooks/useKeyboardShortcut'

interface SettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const temperatureUnit = useSettingsStore((state) => state.temperatureUnit)
	const distanceUnit = useSettingsStore((state) => state.distanceUnit)
	const toggleTemperatureUnit = useSettingsStore((state) => state.toggleTemperatureUnit)
	const toggleDistanceUnit = useSettingsStore((state) => state.toggleDistanceUnit)

	// Keyboard shortcuts
	useEscapeKey(onClose, isOpen)
	useEnterKey(onClose, isOpen)

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
			<DialogContent
				position="fixed"
				top="50%"
				left="50%"
				transform="translate(-50%, -50%)"
				zIndex={1400}
				bg="white"
				borderRadius="lg"
				boxShadow="xl"
			>
				<DialogHeader>
					<DialogTitle>⚙️ Settings</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>

				<DialogBody>
					 <VStack gap={5} align="stretch">
					{/* Temperature Unit */}
					<Box>
					  <Text fontSize="md" fontWeight="bold" mb={2}>
						Temperature Unit
					  </Text>
					  <HStack gap={2}>
						<Button
						  flex={1}
						  variant={temperatureUnit === 'fahrenheit' ? 'solid' : 'outline'}
						  colorScheme={temperatureUnit === 'fahrenheit' ? 'green' : 'gray'}
						  onClick={() => temperatureUnit !== 'fahrenheit' && toggleTemperatureUnit()}
						>
						  <VStack gap={0}>
							<Text fontSize="sm" fontWeight="bold">°F</Text>
							<Text fontSize="xs">Fahrenheit</Text>
						  </VStack>
						</Button>
						<Button
						  flex={1}
						  variant={temperatureUnit === 'celsius' ? 'solid' : 'outline'}
						  colorScheme={temperatureUnit === 'celsius' ? 'green' : 'gray'}
						  onClick={() => temperatureUnit !== 'celsius' && toggleTemperatureUnit()}
						>
						  <VStack gap={0}>
							<Text fontSize="sm" fontWeight="bold">°C</Text>
							<Text fontSize="xs">Celsius</Text>
						  </VStack>
						</Button>
					  </HStack>
					</Box>

						{/* Distance Unit */}
						<Box>
						  <Text fontSize="md" fontWeight="bold" mb={2}>
							Distance Unit
						  </Text>
						  <HStack gap={2}>
							<Button
							  flex={1}
							  variant={distanceUnit === 'inches' ? 'solid' : 'outline'}
							  colorScheme={distanceUnit === 'inches' ? 'green' : 'gray'}
							  onClick={() => distanceUnit !== 'inches' && toggleDistanceUnit()}
							>
							  <VStack gap={0}>
								<Text fontSize="sm" fontWeight="bold">in</Text>
								<Text fontSize="xs">Inches</Text>
							  </VStack>
							</Button>
							<Button
							  flex={1}
							  variant={distanceUnit === 'cm' ? 'solid' : 'outline'}
							  colorScheme={distanceUnit === 'cm' ? 'green' : 'gray'}
							  onClick={() => distanceUnit !== 'cm' && toggleDistanceUnit()}
							>
							  <VStack gap={0}>
								<Text fontSize="sm" fontWeight="bold">cm</Text>
								<Text fontSize="xs">Centimeters</Text>
							  </VStack>
							</Button>
						  </HStack>
						</Box>

						{/* Info Box */}
						<Box bg="blue.50" p={3} borderRadius="md">
							<Text fontSize="xs" color="blue.800">
								💡 <strong>Tip:</strong> Settings apply to all temperature and distance displays throughout the app.
							</Text>
						</Box>
					</VStack>
				</DialogBody>

				<DialogFooter>
					<Button colorScheme="green" onClick={onClose}>
						Done
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	)
}
