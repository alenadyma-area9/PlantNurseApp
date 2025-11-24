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
import { Button, Input, VStack, Text, Box, HStack, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore, DEFAULT_ROOM_ID } from '../store/roomStore'
import type { PlantSize, PlantCondition, LightLevel } from '../types'
import { PhotoUpload } from './PhotoUpload'
import { RoomManagementModal } from './RoomManagementModal'

interface CustomPlantModalProps {
	isOpen: boolean
	onClose: () => void
}

export function CustomPlantModal({ isOpen, onClose }: CustomPlantModalProps) {
	const [commonName, setCommonName] = useState('')
	const [scientificName, setScientificName] = useState('')
	const [checkFrequency, setCheckFrequency] = useState(7) // weekly default
	const [lightLevel, setLightLevel] = useState<LightLevel>('medium')
	const [selectedRoomId, setSelectedRoomId] = useState<string>(DEFAULT_ROOM_ID)
	const [size, setSize] = useState<PlantSize>('small')
	const [condition, setCondition] = useState<PlantCondition>('just-added')
	const [photoUrl, setPhotoUrl] = useState<string | undefined>()
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)

	const addPlant = usePlantStore((state) => state.addPlant)
	const rooms = useRoomStore((state) => state.rooms)

	// Set default room when modal opens
	useEffect(() => {
		if (isOpen && rooms.length > 0) {
			setSelectedRoomId(rooms[0].id)
		}
	}, [isOpen, rooms])

	const handleAddPlant = () => {
		if (commonName.trim() && selectedRoomId) {
			addPlant({
				speciesId: '', // No species ID for custom plants
				customName: commonName.trim(),
				roomId: selectedRoomId,
				size,
				condition,
				photoUrl,
				isCustomPlant: true,
				customScientificName: scientificName.trim() || undefined,
				customCheckFrequency: checkFrequency,
				customLightLevel: lightLevel,
			})
			handleClose()
		}
	}

	const handleClose = () => {
		setCommonName('')
		setScientificName('')
		setCheckFrequency(7)
		setLightLevel('medium')
		setSelectedRoomId(DEFAULT_ROOM_ID)
		setSize('small')
		setCondition('just-added')
		setPhotoUrl(undefined)
		onClose()
	}

	// Keyboard shortcuts
	const handleEnter = useCallback(() => {
		if (commonName.trim()) {
			handleAddPlant()
		}
	}, [commonName])

	useEnterKey(handleEnter, isOpen)
	useEscapeKey(handleClose, isOpen)

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="xl" placement="center">
			<DialogBackdrop />
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
					<DialogTitle>🌱 Add Custom Plant</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>

				<DialogBody overflowY="auto" maxH={{ base: '70vh', md: '60vh' }}>
					<VStack gap={4} align="stretch">
						<Box bg="blue.50" p={3} borderRadius="md">
							<Text fontSize="sm" color="blue.700">
								Can't find your plant in our database? Add it here with custom care instructions.
							</Text>
						</Box>

						{/* Plant Names */}
						<Box>
							<Text fontSize="sm" fontWeight="bold" mb={2}>
								Plant name: <Text as="span" color="red.500">*</Text>
							</Text>
							<Input
								placeholder="e.g., String of Hearts, African Violet..."
								value={commonName}
								onChange={(e) => setCommonName(e.target.value)}
								autoFocus
							/>
						</Box>

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

						{/* Care Instructions */}
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
										{light.label}
									</Button>
								))}
							</HStack>
						</Box>

						{/* Location & Details */}
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
											{room.name} ({room.lightLevel} light, {room.temperature})
										</option>
									))}
								</NativeSelectField>
							</NativeSelectRoot>
						</Box>

						<Box>
							<Text fontSize="sm" fontWeight="bold" mb={2}>
								Size:
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
							<HStack gap={2} flexWrap="wrap">
								{([
									{ value: 'just-added', label: '🆕 Just added' },
									{ value: 'healthy', label: '🌿 Healthy' },
									{ value: 'needs-attention', label: '⚠️ Needs attention' },
									{ value: 'struggling', label: '🥀 Struggling' },
								] as Array<{ value: PlantCondition; label: string }>).map((c) => (
									<Button
										key={c.value}
										size="sm"
										variant={condition === c.value ? 'solid' : 'outline'}
										colorScheme={condition === c.value ? 'green' : 'gray'}
										onClick={() => setCondition(c.value)}
										flex={1}
										minW="120px"
									>
										{c.label}
									</Button>
								))}
							</HStack>
						</Box>

						<Box>
							<PhotoUpload
								currentPhoto={photoUrl}
								onPhotoChange={setPhotoUrl}
								label="Plant Photo (optional)"
							/>
						</Box>
					</VStack>
				</DialogBody>

				<DialogFooter>
					<Button variant="ghost" mr={3} onClick={handleClose}>
						Cancel
					</Button>
					<Button
						colorScheme="green"
						onClick={handleAddPlant}
						disabled={!commonName.trim()}
					>
						Add Custom Plant
					</Button>
				</DialogFooter>
			</DialogContent>

			{/* Room Management Modal */}
			<RoomManagementModal
				isOpen={isRoomModalOpen}
				onClose={() => {
					setIsRoomModalOpen(false)
					if (rooms.length > 0) {
						setSelectedRoomId(rooms[rooms.length - 1].id)
					}
				}}
				nested={true}
			/>
		</DialogRoot>
	)
}
