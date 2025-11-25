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
import type { PlantSize, PlantCondition } from '../types'
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

	useEffect(() => {
		if (plant) {
			setCustomName(plant.customName)
			setSelectedRoomId(plant.roomId)
			setSize(plant.size)
			setCondition(plant.condition)
			setCareNotes(plant.customCareNotes || '')
			setNotes(plant.notes || '')
			setPhotoUrl(plant.photoUrl)
		}
	}, [plant])

	if (!plant) return null

	const checkIns = getPlantCheckIns(plant.id)
	const checkInPhotos = checkIns
		.filter((checkIn) => checkIn.photoUrl)
		.map((checkIn) => ({
			id: checkIn.id,
			url: checkIn.photoUrl!,
			date: checkIn.date,
		}))

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

		// For custom plants, also save care notes
		if (plant.isCustomPlant) {
			updates.customCareNotes = careNotes.trim() || undefined
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

							  {/* Previous Check-in Photos */}
							  {checkInPhotos.length > 0 && (
								<Box mt={3}>
								  <Text fontSize="xs" color="gray.600" mb={2}>
									Or select from check-in photos:
								  </Text>
								  <SimpleGrid columns={{ base: 3, sm: 4 }} gap={2}>
									{checkInPhotos.map((photo) => (
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
									  >
										<ChakraImage
										  src={photo.url}
										  alt={`Check-in from ${new Date(photo.date).toLocaleDateString()}`}
										  width="100%"
										  height="60px"
										  objectFit="cover"
										/>
										<Text fontSize="2xs" textAlign="center" py={1} color="gray.500">
										  {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
