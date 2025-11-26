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
import {
	Button,
	Input,
	VStack,
	Text,
	Box,
	HStack,
	NativeSelectRoot,
	NativeSelectField,
	SimpleGrid,
	Image as ChakraImage,
	Textarea,
} from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore } from '../store/roomStore'
import { useSettingsStore } from '../store/settingsStore'
import type { PlantSize, PlantCondition, LightLevel } from '../types'
import { PhotoUpload } from './PhotoUpload'
import { RoomManagementModal } from './RoomManagementModal'
import { getLightLevelIcon } from '../utils/lightLevelUtils'

interface EditPlantModalProps {
	plantId: string
	isOpen: boolean
	onClose: () => void
}

export function EditPlantModal({ plantId, isOpen, onClose }: EditPlantModalProps) {
	const plant = usePlantStore((state) => state.plants.find((p) => p.id === plantId))
	const updatePlant = usePlantStore((state) => state.updatePlant)
	const getPlantCheckIns = usePlantStore((state) => state.getPlantCheckIns)
	const rooms = useRoomStore((state) => state.rooms)
	const distanceUnit = useSettingsStore((state) => state.distanceUnit)

	const [customName, setCustomName] = useState('')
	const [selectedRoomId, setSelectedRoomId] = useState('')
	const [size, setSize] = useState<PlantSize>('small')
	const [condition, setCondition] = useState<PlantCondition>('healthy')
	const [careNotes, setCareNotes] = useState('')
	const [notes, setNotes] = useState('')
	const [photoUrl, setPhotoUrl] = useState<string | undefined>()
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)

	// Custom plant specific fields
	const [scientificName, setScientificName] = useState('')
	const [checkFrequency, setCheckFrequency] = useState(7)
	const [lightLevel, setLightLevel] = useState<LightLevel>('medium')
	const [leafShape, setLeafShape] = useState('')
	const [leafSize, setLeafSize] = useState('')
	const [growthPattern, setGrowthPattern] = useState('')
	const [specialFeatures, setSpecialFeatures] = useState('')

	useEffect(() => {
		if (plant) {
			setCustomName(plant.customName)
			setSelectedRoomId(plant.roomId)
			setSize(plant.size)
			setCondition(plant.condition)
			setCareNotes(plant.customCareNotes || '')
			setNotes(plant.notes || '')
			setPhotoUrl(plant.photoUrl)

			// Custom plant specific fields
			if (plant.isCustomPlant) {
				setScientificName(plant.customScientificName || '')
				setCheckFrequency(plant.customCheckFrequency || 7)
				setLightLevel(plant.customLightLevel || 'medium')
				setLeafShape(plant.customLeafShape || '')
				setLeafSize(plant.customLeafSize || '')
				setGrowthPattern(plant.customGrowthPattern || '')
				setSpecialFeatures(plant.customSpecialFeatures?.join(', ') || '')
			}
		}
	}, [plant])

	if (!plant) return null

	// Collect all photos (current plant photo + check-in photos, avoiding duplicates)
	const checkIns = getPlantCheckIns(plant.id)
	const allPhotos: Array<{ id: string; url: string; date: string; label: string }> = []
	const photoUrls = new Set<string>()

	// Add current plant photo first (if exists)
	if (plant.photoUrl) {
		allPhotos.push({
			id: 'current',
			url: plant.photoUrl,
			date: plant.dateAdded,
			label: 'Current'
		})
		photoUrls.add(plant.photoUrl)
	}

	// Add check-in photos (avoiding duplicates)
	checkIns.forEach((checkIn) => {
		if (checkIn.photoUrl && !photoUrls.has(checkIn.photoUrl)) {
			allPhotos.push({
				id: checkIn.id,
				url: checkIn.photoUrl,
				date: checkIn.date,
				label: 'Check-in'
			})
			photoUrls.add(checkIn.photoUrl)
		}
	})

	// Keyboard shortcuts
	const handleEnter = useCallback(() => {
		if (customName.trim()) {
			handleSave()
		}
	}, [customName])

	useEnterKey(handleEnter, isOpen)
	useEscapeKey(onClose, isOpen)

	const handleSave = () => {
		const updates: any = {
			customName: customName.trim(),
			roomId: selectedRoomId,
			size,
			condition,
			photoUrl,
			notes: notes.trim() || undefined,
		}

		// For custom plants, also save all custom fields
		if (plant.isCustomPlant) {
			updates.customCareNotes = careNotes.trim() || undefined
			updates.customScientificName = scientificName.trim() || undefined
			updates.customCheckFrequency = checkFrequency
			updates.customLightLevel = lightLevel
			updates.customLeafShape = leafShape.trim() || undefined
			updates.customLeafSize = leafSize.trim() || undefined
			updates.customGrowthPattern = growthPattern.trim() || undefined

			// Parse special features from comma-separated string
			const featuresArray = specialFeatures
				.split(',')
				.map(f => f.trim())
				.filter(f => f.length > 0)
			updates.customSpecialFeatures = featuresArray.length > 0 ? featuresArray : undefined
		}

		updatePlant(plant.id, updates)
		onClose()
	}

	return (
		<>
			<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
				<DialogBackdrop zIndex={1450} />
				<DialogContent
					maxH={{ base: '95vh', md: '90vh' }}
					position="fixed"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
					zIndex={1500}
					bg="white"
					borderRadius="lg"
					boxShadow="xl"
				>
					<DialogHeader>
					  <DialogTitle>Edit {plant.customName}</DialogTitle>
					  <DialogCloseTrigger />
					</DialogHeader>

					<DialogBody overflowY="auto" maxH={{ base: '70vh', md: '60vh' }}>
						<VStack gap={4} align="stretch">
							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Name:
								</Text>
								<Input
									value={customName}
									onChange={(e) => setCustomName(e.target.value)}
									placeholder="Plant name"
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
								<NativeSelectRoot>
									<NativeSelectField
										value={selectedRoomId}
										onChange={(e) => setSelectedRoomId(e.target.value)}
									>
										{rooms.map((room) => (
											<option key={room.id} value={room.id}>
												{room.name} ({getLightLevelIcon(room.lightLevel)} {room.lightLevel}, {room.temperature})
											</option>
										))}
									</NativeSelectField>
								</NativeSelectRoot>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Size:
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
									Condition:
								</Text>
								<VStack gap={2}>
									{([
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

							{/* Custom plant specific fields */}
							{plant.isCustomPlant && (
								<>
									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											Scientific name (optional):
										</Text>
										<Input
											placeholder="e.g., Ceropegia woodii"
											value={scientificName}
											onChange={(e) => setScientificName(e.target.value)}
										/>
									</Box>

									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											Check-in frequency:
										</Text>
										<NativeSelectRoot>
											<NativeSelectField
												value={checkFrequency}
												onChange={(e) => setCheckFrequency(Number(e.target.value))}
											>
												<option value={3}>Every 3 days</option>
												<option value={5}>Every 5 days</option>
												<option value={7}>Every week</option>
												<option value={10}>Every 10 days</option>
												<option value={14}>Every 2 weeks</option>
												<option value={21}>Every 3 weeks</option>
												<option value={30}>Every month</option>
											</NativeSelectField>
										</NativeSelectRoot>
										<Text fontSize="xs" color="gray.500" mt={1}>
											How often should you check on it?
										</Text>
									</Box>

									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											Light needs:
										</Text>
										<HStack gap={2} flexWrap="wrap">
											{([
												{ value: 'low', label: 'Low' },
												{ value: 'medium', label: 'Medium' },
												{ value: 'bright-indirect', label: 'Bright' },
												{ value: 'direct', label: 'Direct Sun' },
											] as Array<{ value: LightLevel; label: string }>).map((light) => (
												<Button
													key={light.value}
													size="sm"
													variant={lightLevel === light.value ? 'solid' : 'outline'}
													colorScheme={lightLevel === light.value ? 'green' : 'gray'}
													onClick={() => setLightLevel(light.value)}
													flex={1}
													minW="80px"
												>
													{getLightLevelIcon(light.value)} {light.label}
												</Button>
											))}
										</HStack>
									</Box>

									{/* Visual Characteristics (Optional) */}
									<Box borderTop="1px solid" borderColor="gray.200" pt={4} mt={2}>
										<Text fontSize="sm" fontWeight="bold" mb={3} color="gray.700">
											🌿 What it looks like (optional)
										</Text>
										<VStack gap={3} align="stretch">
											{/* Leaf Shape */}
											<Box>
												<Text fontSize="xs" fontWeight="medium" mb={1.5} color="gray.600">
													Leaf shape:
												</Text>
												<HStack gap={1.5} flexWrap="wrap">
													{['heart', 'oval', 'round', 'long-narrow', 'spiky', 'hand-shaped'].map((shape) => (
														<Button
															key={shape}
															size="xs"
															variant={leafShape === shape ? 'solid' : 'outline'}
															colorScheme={leafShape === shape ? 'purple' : 'gray'}
															onClick={() => setLeafShape(shape)}
														>
															{shape}
														</Button>
													))}
													<Input
														placeholder="or custom..."
														value={!['heart', 'oval', 'round', 'long-narrow', 'spiky', 'hand-shaped'].includes(leafShape) ? leafShape : ''}
														onChange={(e) => setLeafShape(e.target.value)}
														size="xs"
														maxW="150px"
														flex="0 1 auto"
													/>
												</HStack>
											</Box>

											{/* Leaf Size */}
											<Box>
												<Text fontSize="xs" fontWeight="medium" mb={1.5} color="gray.600">
													Leaf size:
												</Text>
												<HStack gap={1.5} flexWrap="wrap">
													{['small', 'medium', 'large'].map((sz) => (
														<Button
															key={sz}
															size="xs"
															variant={leafSize === sz ? 'solid' : 'outline'}
															colorScheme={leafSize === sz ? 'purple' : 'gray'}
															onClick={() => setLeafSize(sz)}
															minW="70px"
														>
															{sz}
														</Button>
													))}
													<Input
														placeholder="or custom..."
														value={!['small', 'medium', 'large'].includes(leafSize) ? leafSize : ''}
														onChange={(e) => setLeafSize(e.target.value)}
														size="xs"
														maxW="150px"
														flex="0 1 auto"
													/>
												</HStack>
											</Box>

											{/* Growth Pattern */}
											<Box>
												<Text fontSize="xs" fontWeight="medium" mb={1.5} color="gray.600">
													Growth pattern:
												</Text>
												<HStack gap={1.5} flexWrap="wrap">
													{['upright', 'trailing', 'climbing', 'bushy'].map((pattern) => (
														<Button
															key={pattern}
															size="xs"
															variant={growthPattern === pattern ? 'solid' : 'outline'}
															colorScheme={growthPattern === pattern ? 'purple' : 'gray'}
															onClick={() => setGrowthPattern(pattern)}
															minW="70px"
														>
															{pattern}
														</Button>
													))}
													<Input
														placeholder="or custom..."
														value={!['upright', 'trailing', 'climbing', 'bushy'].includes(growthPattern) ? growthPattern : ''}
														onChange={(e) => setGrowthPattern(e.target.value)}
														size="xs"
														maxW="150px"
														flex="0 1 auto"
													/>
												</HStack>
											</Box>

											{/* Special Features */}
											<Box>
												<Text fontSize="xs" fontWeight="medium" mb={1.5} color="gray.600">
													Special features:
												</Text>
												<HStack gap={1.5} flexWrap="wrap" mb={2}>
													{['variegated', 'succulent', 'waxy', 'fuzzy', 'fragrant', 'flowering'].map((feature) => {
														const isSelected = specialFeatures.split(',').map(f => f.trim()).includes(feature)
														return (
															<Button
																key={feature}
																size="xs"
																variant={isSelected ? 'solid' : 'outline'}
																colorScheme={isSelected ? 'purple' : 'gray'}
																onClick={() => {
																	const features = specialFeatures.split(',').map(f => f.trim()).filter(f => f)
																	if (isSelected) {
																		setSpecialFeatures(features.filter(f => f !== feature).join(', '))
																	} else {
																		setSpecialFeatures([...features, feature].join(', '))
																	}
																}}
															>
																{feature}
															</Button>
														)
													})}
												</HStack>
												<Input
													placeholder="Add custom features (comma-separated)"
													value={specialFeatures}
													onChange={(e) => setSpecialFeatures(e.target.value)}
													size="xs"
												/>
											</Box>
										</VStack>
									</Box>
								</>
							)}

							{/* Care notes for custom plants */}
							{plant.isCustomPlant && (
								<Box>
									<Text fontSize="sm" fontWeight="bold" mb={2}>
										Care instructions (optional):
									</Text>
									<Textarea
										value={careNotes}
										onChange={(e) => setCareNotes(e.target.value)}
										placeholder="e.g., Water thoroughly, let soil dry between waterings, prefers humidity..."
										rows={3}
										fontSize="sm"
									/>
									<Text fontSize="xs" color="gray.500" mt={1}>
										Care instructions (shown in Care Guide & Tips tabs)
									</Text>
								</Box>
							)}

							{/* Personal notes for all plants */}
							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Notes (optional):
								</Text>
								<Textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="e.g., Gift from mom, bought at local nursery, special memories..."
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

							  {/* Select from existing photos */}
							  {allPhotos.length > 0 && (
								<Box mt={3}>
								  <Text fontSize="xs" color="gray.600" mb={2}>
									Or select from your photos:
								  </Text>
								  <SimpleGrid columns={{ base: 3, sm: 4 }} gap={2}>
									{allPhotos.map((photo) => (
									  <Box
										key={photo.id}
										cursor="pointer"
										onClick={() => setPhotoUrl(photo.url)}
										borderRadius="md"
										overflow="hidden"
										borderWidth={2}
										borderColor={photoUrl === photo.url ? 'green.500' : 'transparent'}
										transition="all 0.2s"
										_hover={{ borderColor: 'green.300' }}
										position="relative"
									  >
										<ChakraImage
										  src={photo.url}
										  alt={photo.label}
										  width="100%"
										  height="60px"
										  objectFit="cover"
										/>
										<Text fontSize="2xs" textAlign="center" py={1} color="gray.500">
										  {photo.label === 'Current' ? '✓ Current' : new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										</Text>
									  </Box>
									))}
								  </SimpleGrid>
								</Box>
							  )}
							</Box>
						</VStack>
					</DialogBody>

					<DialogFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="green" onClick={handleSave} disabled={!customName.trim()}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</DialogRoot>

			{/* Room Management Modal */}
			<RoomManagementModal
				isOpen={isRoomModalOpen}
				onClose={() => {
					setIsRoomModalOpen(false)
					// Update to first room if current room was deleted
					if (rooms.length > 0 && !rooms.find(r => r.id === selectedRoomId)) {
						setSelectedRoomId(rooms[0].id)
					}
				}}
				nested={true}
			/>
		</>
	)
}
