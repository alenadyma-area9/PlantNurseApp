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
	DialogBackdrop,
} from '@chakra-ui/react'
import { Button, Input, VStack, Text, SimpleGrid, Card, Box, HStack, Badge, NativeSelectRoot, NativeSelectField, Textarea } from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore, DEFAULT_ROOM_ID } from '../store/roomStore'
import { useSettingsStore } from '../store/settingsStore'
import { PLANT_DATABASE } from '../data/plantDatabase'
import type { PlantSize, PlantCondition } from '../types'
import { PhotoUpload } from './PhotoUpload'
import { RoomManagementModal } from './RoomManagementModal'
import { CustomPlantModal } from './CustomPlantModal'
import { getLightLevelIcon } from '../utils/lightLevelUtils'
import { toaster } from '../main'

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
	const [condition, setCondition] = useState<PlantCondition>('healthy')
	const [notes, setNotes] = useState('')
	const [photoUrl, setPhotoUrl] = useState<string | undefined>()
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
	const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const addPlant = usePlantStore((state) => state.addPlant)
	const rooms = useRoomStore((state) => state.rooms)
	const distanceUnit = useSettingsStore((state) => state.distanceUnit)

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
		if (selectedSpeciesId && customName.trim() && selectedRoomId && !isSubmitting) {
			setIsSubmitting(true)
			try {
				addPlant({
					speciesId: selectedSpeciesId,
					customName: customName.trim(),
					roomId: selectedRoomId,
					size,
					condition,
					photoUrl,
					notes: notes.trim() || undefined,
				})
				handleClose()
			} catch (error) {
				console.error('Error adding plant:', error)
				toaster.create({
					title: 'Storage full',
					description: 'Try removing some photos to free up space',
					type: 'error',
					duration: 5000,
				})
				setIsSubmitting(false)
			}
		}
	}

	const handleClose = () => {
		setStep('select-plant')
		setSelectedSpeciesId('')
		setSelectedRoomId(DEFAULT_ROOM_ID)
		setCustomName('')
		setSize('small')
		setCondition('healthy')
		setNotes('')
		setPhotoUrl(undefined)
		setIsSubmitting(false)
		onClose()
	}

	const handleCustomPlantClick = () => {
		setIsCustomModalOpen(true)
	}

	const handleCustomPlantClose = () => {
		setIsCustomModalOpen(false)
		handleClose() // Close parent modal too
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
		<>
			<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="xl" placement="center">
				<DialogBackdrop />
				<DialogContent
					maxW={{ base: '90vw', sm: '85vw', md: '700px' }}
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
						<DialogTitle>
							{step === 'select-plant' ? 'Choose Your Plant Type' : 'Plant Details'}
						</DialogTitle>
						<DialogCloseTrigger />
					</DialogHeader>

					<DialogBody overflowY="auto" maxH={{ base: '70vh', md: '60vh' }}>
						{/* STEP 1: Select Plant */}
						{step === 'select-plant' && (
							<VStack gap={3} align="stretch">
								<Box>
									<Text fontSize="sm" fontWeight="medium" mb={1}>
										Select your plant type:
									</Text>
									<Text fontSize="xs" color="gray.500">
										Choose from 15 beginner-friendly to advanced plants
									</Text>
								</Box>

								<SimpleGrid columns={{ base: 1, sm: 2 }} gap={2.5}>
									{PLANT_DATABASE.map((plant) => (
										<Card.Root
											key={plant.id}
											variant="outline"
											cursor="pointer"
											onClick={() => handleSelectPlant(plant.id)}
											_hover={{ borderColor: 'green.400', shadow: 'md', bg: 'green.50' }}
											transition="all 0.2s"
										>
											<Card.Body p={3}>
												<VStack align="stretch" gap={2} width="full">
													{/* Header: Name + Care Level */}
													<HStack justify="space-between" align="start">
														<Box flex={1} minW={0}>
															<Text fontWeight="bold" fontSize="sm" lineHeight="1.2">
																{plant.commonName}
															</Text>
															<Text fontSize="2xs" color="gray.500" lineClamp={1} mt={0.5}>
																{plant.scientificName}
															</Text>
														</Box>
														<Badge colorScheme="green" fontSize="2xs" px={2} flexShrink={0} alignSelf="start">
															{plant.careLevel}
														</Badge>
													</HStack>

													{/* Labeled Characteristics */}
													<VStack align="stretch" gap={0.5} fontSize="xs">
														<HStack gap={1}>
															<Text color="gray.500" minW="50px" fontWeight="medium">Leaves:</Text>
															<Text color="gray.700" textTransform="capitalize">
																{plant.characteristics.leafShape.replace('-', ' ')}, {plant.characteristics.leafSize}
															</Text>
														</HStack>
														<HStack gap={1}>
															<Text color="gray.500" minW="50px" fontWeight="medium">Growth:</Text>
															<Text color="gray.700" textTransform="capitalize">
																{plant.characteristics.growthPattern}
															</Text>
														</HStack>
														{plant.characteristics.specialFeatures.length > 0 && (
															<HStack gap={1} align="start">
																<Text color="gray.500" minW="50px" fontWeight="medium">Features:</Text>
																<HStack flexWrap="wrap" gap={1}>
																	{plant.characteristics.specialFeatures.map((feature) => (
																		<Badge key={feature} colorScheme="purple" fontSize="2xs" px={1.5}>
																			{feature}
																		</Badge>
																	))}
																	{plant.petSafe && (
																		<Badge colorScheme="blue" fontSize="2xs" px={1.5}>
																			🐾 pet safe
																		</Badge>
																	)}
																</HStack>
															</HStack>
														)}
													</VStack>
												</VStack>
											</Card.Body>
										</Card.Root>
									))}
								</SimpleGrid>

								<Box borderTop="1px solid" borderColor="gray.200" pt={3} mt={1}>
									<Button
										variant="outline"
										colorScheme="blue"
										width="full"
										onClick={handleCustomPlantClick}
										size="sm"
										height="auto"
										py={3}
									>
										<VStack gap={0.5}>
											<Text fontSize="sm" fontWeight="medium">🌱 Can't find your plant?</Text>
											<Text fontSize="xs" fontWeight="normal" color="blue.600">Add a custom one</Text>
										</VStack>
									</Button>
								</Box>
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
									<HStack justify="space-between" align="start" mb={2}>
										<Text fontSize="sm" fontWeight="bold">
											Location:
										</Text>
										<Button
											size="xs"
											variant="ghost"
											colorScheme="green"
											onClick={() => setIsRoomModalOpen(true)}
											px={2}
										>
											🏠 Manage Rooms
										</Button>
									</HStack>
									<NativeSelectRoot size={{ base: 'md', md: 'sm' }}>
										<NativeSelectField
											value={selectedRoomId}
											onChange={(e) => setSelectedRoomId(e.target.value)}
											minH="44px"
										>
											{rooms.map((room) => (
												<option key={room.id} value={room.id}>
													{room.name} ({getLightLevelIcon(room.lightLevel)} {room.lightLevel}, {room.temperature})
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
									<HStack gap={2} flexWrap="wrap">
										{(['small', 'medium', 'large'] as PlantSize[]).map((s) => {
											const sizeLabel = distanceUnit === 'cm'
												? s === 'small' ? 'Small (10-15cm)'
												: s === 'medium' ? 'Medium (15-25cm)'
												: 'Large (25cm+)'
												: s === 'small' ? 'Small (4-6")'
												: s === 'medium' ? 'Medium (6-10")'
												: 'Large (10"+)'

											return (
												<Button
													key={s}
													size={{ base: 'md', md: 'sm' }}
													variant={size === s ? 'solid' : 'outline'}
													colorScheme={size === s ? 'green' : 'gray'}
													onClick={() => setSize(s)}
													flex={1}
													fontSize="xs"
													height="auto"
													py={2}
													whiteSpace="normal"
													textAlign="center"
													lineHeight="short"
													minH="44px"
												>
													{sizeLabel}
												</Button>
											)
										})}
									</HStack>
								</Box>

								<Box>
									<Text fontSize="sm" fontWeight="bold" mb={2}>
										Current condition:
									</Text>
									<VStack gap={2}>
										{([
											{ value: 'healthy', label: 'Healthy & thriving', emoji: '🌿' },
											{ value: 'needs-attention', label: 'Needs some attention', emoji: '⚠️' },
											{ value: 'struggling', label: 'Struggling / Not doing well', emoji: '🥀' },
										] as Array<{ value: PlantCondition; label: string; emoji: string }>).map((c) => (
											<Button
												key={c.value}
												size={{ base: 'md', md: 'sm' }}
												variant={condition === c.value ? 'solid' : 'outline'}
												colorScheme={condition === c.value ? 'green' : 'gray'}
												onClick={() => setCondition(c.value)}
												width="full"
												justifyContent="flex-start"
												minH="44px"
											>
												<Text mr={2}>{c.emoji}</Text>
												{c.label}
											</Button>
										))}
									</VStack>
								</Box>

								<Box>
									<Text fontSize="sm" fontWeight="bold" mb={2}>
										Notes (optional):
									</Text>
									<Textarea
										placeholder="e.g., Gift from mom, bought at local nursery, special memories..."
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										rows={2}
										fontSize="sm"
									/>
									<Text fontSize="xs" color="gray.500" mt={1}>
										Personal notes about this plant
									</Text>
								</Box>

								<Box>
									<PhotoUpload
										currentPhoto={photoUrl}
										onPhotoChange={setPhotoUrl}
										label="Plant Photo"
									/>
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

				{/* Room Management Modal */}
				<RoomManagementModal
					isOpen={isRoomModalOpen}
					onClose={() => {
						setIsRoomModalOpen(false)
						// Select the newly added room if one was added
						if (rooms.length > 0) {
							setSelectedRoomId(rooms[rooms.length - 1].id)
						}
					}}
					nested={true}
				/>
			</DialogRoot>

			{/* Custom Plant Modal */}
			<CustomPlantModal isOpen={isCustomModalOpen} onClose={handleCustomPlantClose} />
		</>
	)
}
