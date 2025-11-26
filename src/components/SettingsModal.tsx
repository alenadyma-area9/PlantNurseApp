import {
	DialogRoot,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogFooter,
	DialogTitle,
	DialogCloseTrigger,
	DialogBackdrop,
} from '@chakra-ui/react'
import { Button, VStack, Text, Box, HStack, Separator } from '@chakra-ui/react'
import { useSettingsStore } from '../store/settingsStore'
import { usePlantStore } from '../store/plantStore'
import { useEscapeKey, useEnterKey } from '../hooks/useKeyboardShortcut'
import { useState, useEffect } from 'react'

interface SettingsModalProps {
	isOpen: boolean
	onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const temperatureUnit = useSettingsStore((state) => state.temperatureUnit)
	const distanceUnit = useSettingsStore((state) => state.distanceUnit)
	const toggleTemperatureUnit = useSettingsStore((state) => state.toggleTemperatureUnit)
	const toggleDistanceUnit = useSettingsStore((state) => state.toggleDistanceUnit)
	const deleteAllPlants = usePlantStore((state) => state.deleteAllPlants)
	const plants = usePlantStore((state) => state.plants)

	const [storageUsed, setStorageUsed] = useState(0)
	const [storageTotal] = useState(5) // 5MB typical localStorage limit

	// Calculate storage usage
	useEffect(() => {
		if (isOpen) {
			let total = 0
			for (let key in localStorage) {
				if (localStorage.hasOwnProperty(key)) {
					total += localStorage[key].length + key.length
				}
			}
			// Convert to MB
			setStorageUsed(total / (1024 * 1024))
		}
	}, [isOpen, plants])

	const storagePercent = (storageUsed / storageTotal) * 100
	const storageColor = storagePercent > 80 ? 'red' : storagePercent > 60 ? 'orange' : 'green'

	const handleDeleteAll = () => {
		const confirmed = window.confirm(
			`⚠️ WARNING: This will permanently delete ALL ${plants.length} plants and their data (check-ins, photos, history).\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?`
		)
		if (confirmed) {
			const doubleCheck = window.confirm('Last chance! Delete everything?')
			if (doubleCheck) {
				deleteAllPlants()
				onClose()
			}
		}
	}

	// Keyboard shortcuts
	useEscapeKey(onClose, isOpen)
	useEnterKey(onClose, isOpen)

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
			<DialogBackdrop />
			<DialogContent
				maxW={{ base: '90vw', sm: '85vw', md: '500px' }}
				maxH={{ base: '90vh', md: '85vh' }}
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

						<Separator />

						{/* Storage Usage */}
						<Box>
							<Text fontSize="md" fontWeight="bold" mb={2}>
								💾 Local Storage Usage
							</Text>
							<Box bg="gray.50" p={3} borderRadius="md">
								<HStack justify="space-between" mb={2}>
									<Text fontSize="sm" color="gray.700">Used:</Text>
									<Text fontSize="sm" fontWeight="bold" color={`${storageColor}.600`}>
										{storageUsed.toFixed(2)} MB / {storageTotal} MB
									</Text>
								</HStack>
								<Box w="full" h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
									<Box
										w={`${Math.min(storagePercent, 100)}%`}
										h="full"
										bg={`${storageColor}.500`}
										transition="all 0.3s"
									/>
								</Box>
								<Text fontSize="xs" color="gray.600" mt={2}>
									{storagePercent > 80 && '⚠️ Storage almost full! '}
									All data stored locally in your browser. Clearing browser data will delete everything.
								</Text>
							</Box>
						</Box>

						<Separator />

						{/* Danger Zone */}
						<Box>
							<Text fontSize="md" fontWeight="bold" mb={2} color="red.600">
								⚠️ Danger Zone
							</Text>
							<Box bg="red.50" p={3} borderRadius="md" borderWidth={1} borderColor="red.200">
								<Text fontSize="sm" color="red.800" mb={3}>
									<strong>Delete All Plants</strong> - This will permanently remove all {plants.length} plants, check-ins, photos, and history. This action cannot be undone!
								</Text>
								<Button
									colorScheme="red"
									variant="solid"
									size="sm"
									onClick={handleDeleteAll}
									width="full"
									disabled={plants.length === 0}
								>
									🗑️ Delete All Plants ({plants.length})
								</Button>
							</Box>
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
