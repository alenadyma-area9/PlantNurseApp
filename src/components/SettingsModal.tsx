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
import { Switch } from '@chakra-ui/react'
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
							<Text fontSize="md" fontWeight="bold" mb={3}>
								Temperature Unit
							</Text>
							<HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
								<VStack align="start" gap={1}>
									<Text fontSize="sm" fontWeight="medium">
										{temperatureUnit === 'fahrenheit' ? '🇺🇸 Fahrenheit (°F)' : '🌍 Celsius (°C)'}
									</Text>
									<Text fontSize="xs" color="gray.600">
										{temperatureUnit === 'fahrenheit'
											? 'US standard temperature scale'
											: 'Metric temperature scale'}
									</Text>
								</VStack>
								<Switch.Root
								  checked={temperatureUnit === 'celsius'}
								  onCheckedChange={() => toggleTemperatureUnit()}
								  colorPalette="green"
								>
								  <Switch.Thumb />
								</Switch.Root>
							</HStack>
						</Box>

						{/* Distance Unit */}
						<Box>
							<Text fontSize="md" fontWeight="bold" mb={3}>
								Distance Unit
							</Text>
							<HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
								<VStack align="start" gap={1}>
									<Text fontSize="sm" fontWeight="medium">
										{distanceUnit === 'inches' ? '📏 Inches' : '📐 Centimeters'}
									</Text>
									<Text fontSize="xs" color="gray.600">
										{distanceUnit === 'inches'
											? 'For soil depth measurements'
											: 'For soil depth measurements'}
									</Text>
								</VStack>
								<Switch.Root
								  checked={distanceUnit === 'cm'}
								  onCheckedChange={() => toggleDistanceUnit()}
								  colorPalette="green"
								>
								  <Switch.Thumb />
								</Switch.Root>
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
