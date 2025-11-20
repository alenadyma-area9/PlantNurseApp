import { useState, useEffect, useCallback } from 'react'
import { useEnterKey, useEscapeKey } from '../hooks/useKeyboardShortcut'
import {
	DialogRoot,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogFooter,
	DialogTitle,
	DialogCloseTrigger,
} from '@chakra-ui/react'
import { Button, Input, VStack, Text, SimpleGrid, Card, Box, HStack, Badge, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore, DEFAULT_ROOM_ID } from '../store/roomStore'
import { PLANT_DATABASE } from '../data/plantDatabase'
import type { PlantSize, PlantCondition } from '../types'

interface AddPlantModalProps {
	isOpen: boolean
	onClose: () => void
}

type Step = 'select-plant' | 'details'

export function AddPlantModal({ isOpen, onClose }: AddPlantModalProps) {
	const [step, setStep] = useState<Step>('select-plant')
	const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('')
	const [selectedRoomId, setSelectedRoomId] = useState<string>(DEFAULT_ROOM_ID)
	const [customName, setCustomName] = useState('')
	const [size, setSize] = useState<PlantSize>('small')
	const [condition, setCondition] = useState<PlantCondition>('just-added')

	const addPlant = usePlantStore((state) => state.addPlant)
	const rooms = useRoomStore((state) => state.rooms)

	// Set default room when modal opens
	useEffect(() => {
		if (isOpen && rooms.length > 0) {
			setSelectedRoomId(rooms[0].id)
		}
	}, [isOpen, rooms])

	const handleSelectPlant = (speciesId: string) => {
		setSelectedSpeciesId(speciesId)
		const species = PLANT_DATABASE.find((p) => p.id === speciesId)
		if (species) {
			setCustomName(species.commonName) // Default to species name
		}
		setStep('details')
	}

	const handleAddPlant = () => {
		if (selectedSpeciesId && customName.trim() && selectedRoomId) {
			addPlant({
				speciesId: selectedSpeciesId,
				customName: customName.trim(),
				roomId: selectedRoomId,
				size,
				condition,
			})
			handleClose()
		}
	}

	const handleClose = () => {
		setStep('select-plant')
		setSelectedSpeciesId('')
		setSelectedRoomId(DEFAULT_ROOM_ID)
		setCustomName('')
		setSize('small')
		setCondition('just-added')
		onClose()
	}

	const selectedSpecies = PLANT_DATABASE.find((p) => p.id === selectedSpeciesId)

	// Keyboard shortcuts
	const handleEnter = useCallback(() => {
		if (step === 'details' && customName.trim()) {
			handleAddPlant()
		}
	}, [step, customName])

	useEnterKey(handleEnter, isOpen)
	useEscapeKey(handleClose, isOpen)

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="xl" placement="center">
			<DialogContent
				maxH={{ base: '95vh', md: '90vh' }}
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
					<DialogTitle>
						{step === 'select-plant' ? 'Choose Your Plant Type' : 'Plant Details'}
					</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>

				<DialogBody overflowY="auto" maxH={{ base: '70vh', md: '60vh' }}>
					{/* STEP 1: Select Plant */}
					{step === 'select-plant' && (
						<VStack gap={4} align="stretch">
							<Text fontSize="sm" color="gray.600">
								Select your plant type:
							</Text>

							<SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
								{PLANT_DATABASE.map((plant) => (
									<Card.Root
										key={plant.id}
										variant="outline"
										cursor="pointer"
										onClick={() => handleSelectPlant(plant.id)}
										_hover={{ borderColor: 'green.400', shadow: 'md' }}
									>
										<Card.Body p={3}>
											<VStack align="start" gap={1}>
												<Text fontWeight="bold" fontSize="sm">
													{plant.commonName}
												</Text>
												<Text fontSize="xs" color="gray.600">
													{plant.scientificName}
												</Text>
												<HStack>
													<Badge colorScheme="green" fontSize="xs">
														{plant.careLevel}
													</Badge>
													{plant.petSafe && (
														<Badge colorScheme="blue" fontSize="xs">
															Pet safe
														</Badge>
													)}
												</HStack>
											</VStack>
										</Card.Body>
									</Card.Root>
								))}
							</SimpleGrid>
						</VStack>
					)}

					{/* STEP 2: All Details */}
					{step === 'details' && (
						<VStack gap={4} align="stretch">
							<Box bg="green.50" p={3} borderRadius="md">
								<Text fontSize="sm" fontWeight="bold" color="green.800">
									{selectedSpecies?.commonName}
								</Text>
								<Text fontSize="xs" color="green.700">
									{selectedSpecies?.scientificName} • {selectedSpecies?.careLevel}
								</Text>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Give your plant a friendly name:
								</Text>
								<Input
									placeholder="e.g., Monty, Fred, Steve..."
									value={customName}
									onChange={(e) => setCustomName(e.target.value)}
									autoFocus
								/>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Location:
								</Text>
								<NativeSelectRoot>
									<NativeSelectField
										value={selectedRoomId}
										onChange={(e) => setSelectedRoomId(e.target.value)}
									>
										{rooms.map((room) => (
											<option key={room.id} value={room.id}>
												{room.name} ({room.lightLevel} light, {room.temperature})
											</option>
										))}
									</NativeSelectField>
								</NativeSelectRoot>
								<Text fontSize="xs" color="gray.500" mt={1}>
									Where will you keep this plant?
								</Text>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Current size:
								</Text>
								<HStack gap={2}>
									{(['small', 'medium', 'large'] as PlantSize[]).map((s) => (
										<Button
											key={s}
											size="sm"
											variant={size === s ? 'solid' : 'outline'}
											colorScheme={size === s ? 'green' : 'gray'}
											onClick={() => setSize(s)}
											flex={1}
										>
											{s}
										</Button>
									))}
								</HStack>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Current condition:
								</Text>
								<VStack gap={2}>
									{([
										{ value: 'just-added', label: 'Just added', emoji: '🆕' },
										{ value: 'healthy', label: 'Healthy & thriving', emoji: '🌿' },
										{ value: 'needs-attention', label: 'Needs some attention', emoji: '⚠️' },
										{ value: 'struggling', label: 'Struggling / Not doing well', emoji: '🥀' },
									] as Array<{ value: PlantCondition; label: string; emoji: string }>).map((c) => (
										<Button
											key={c.value}
											size="sm"
											variant={condition === c.value ? 'solid' : 'outline'}
											colorScheme={condition === c.value ? 'green' : 'gray'}
											onClick={() => setCondition(c.value)}
											width="full"
											justifyContent="flex-start"
										>
											<Text mr={2}>{c.emoji}</Text>
											{c.label}
										</Button>
									))}
								</VStack>
							</Box>
						</VStack>
					)}
				</DialogBody>

				<DialogFooter>
					{step === 'details' && (
						<>
							<Button
								variant="ghost"
								mr={3}
								onClick={() => setStep('select-plant')}
							>
								Back
							</Button>
							<Button
								colorScheme="green"
								onClick={handleAddPlant}
								disabled={!customName.trim()}
							>
								Add Plant
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	)
}
