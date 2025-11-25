import { useState, useEffect, useCallback } from 'react'
import { useCtrlEnterKey, useEscapeKey } from '../hooks/useKeyboardShortcut'
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
import { Button, Input, VStack, Text, Box, HStack, NativeSelectRoot, NativeSelectField, Textarea } from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore, DEFAULT_ROOM_ID } from '../store/roomStore'
import { useSettingsStore } from '../store/settingsStore'
import type { PlantSize, PlantCondition, LightLevel } from '../types'
import { PhotoUpload } from './PhotoUpload'
import { RoomManagementModal } from './RoomManagementModal'
import { getLightLevelIcon } from '../utils/lightLevelUtils'

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

	// Visual characteristics (optional)
	const [leafShape, setLeafShape] = useState('')
	const [leafSize, setLeafSize] = useState('')
	const [growthPattern, setGrowthPattern] = useState('')
	const [specialFeatures, setSpecialFeatures] = useState('')
	const [careNotes, setCareNotes] = useState('')
	const [notes, setNotes] = useState('')

	const addPlant = usePlantStore((state) => state.addPlant)
	const rooms = useRoomStore((state) => state.rooms)
	const distanceUnit = useSettingsStore((state) => state.distanceUnit)

	// Set default room when modal opens
	useEffect(() => {
		if (isOpen && rooms.length > 0) {
			setSelectedRoomId(rooms[0].id)
		}
	}, [isOpen, rooms])

	const handleAddPlant = () => {
		if (commonName.trim() && selectedRoomId) {
			// Parse special features from comma-separated string
			const featuresArray = specialFeatures
				.split(',')
				.map(f => f.trim())
				.filter(f => f.length > 0)

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
				customLeafShape: leafShape.trim() || undefined,
				customLeafSize: leafSize.trim() || undefined,
				customGrowthPattern: growthPattern.trim() || undefined,
				customSpecialFeatures: featuresArray.length > 0 ? featuresArray : undefined,
				customCareNotes: careNotes.trim() || undefined,
				notes: notes.trim() || undefined,
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
		setLeafShape('')
		setLeafSize('')
		setGrowthPattern('')
		setSpecialFeatures('')
		setCareNotes('')
		setNotes('')
		onClose()
	}

	// Keyboard shortcuts
	const handleCtrlEnter = useCallback(() => {
		if (commonName.trim()) {
			handleAddPlant()
		}
	}, [commonName])

	useCtrlEnterKey(handleCtrlEnter, isOpen)
	useEscapeKey(handleClose, isOpen)

	return (
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
									<HStack gap={1.5} flexWrap="wrap">
										{['variegated', 'waxy', 'fuzzy', 'succulent', 'holes', 'colorful'].map((feature) => (
											<Button
												key={feature}
												size="xs"
												variant={specialFeatures.includes(feature) ? 'solid' : 'outline'}
												colorScheme={specialFeatures.includes(feature) ? 'purple' : 'gray'}
												onClick={() => {
													const features = specialFeatures.split(',').map(f => f.trim()).filter(f => f)
													if (features.includes(feature)) {
														setSpecialFeatures(features.filter(f => f !== feature).join(', '))
													} else {
														setSpecialFeatures([...features, feature].join(', '))
													}
												}}
											>
												{feature}
											</Button>
										))}
										<Input
											placeholder="add more..."
											value={specialFeatures}
											onChange={(e) => setSpecialFeatures(e.target.value)}
											size="xs"
											maxW="150px"
											flex="0 1 auto"
										/>
									</HStack>
									<Text fontSize="2xs" color="gray.500" mt={1}>
										Click tags or type features (comma-separated)
									</Text>
								</Box>
							</VStack>
						</Box>

						{/* Location & Details */}
						<Box borderTop="1px solid" borderColor="gray.200" pt={4} mt={2}>
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
							<Text fontSize="sm" fontWeight="bold" mb={2}>
								Care notes (optional):
							</Text>
							<Textarea
								placeholder="e.g., Water thoroughly, let soil dry between waterings, prefers humidity..."
								value={careNotes}
								onChange={(e) => setCareNotes(e.target.value)}
								rows={3}
								fontSize="sm"
							/>
							<Text fontSize="xs" color="gray.500" mt={1}>
								Care instructions shown in Care Guide tab
							</Text>
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
								label="Plant Photo (optional)"
							/>
						</Box>
					</VStack>
				</DialogBody>

				<DialogFooter flexDirection="column" alignItems="stretch" gap={2}>
					<HStack justify="space-between" width="full">
						<Button variant="ghost" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							colorScheme="green"
							onClick={handleAddPlant}
							disabled={!commonName.trim()}
						>
							Add Custom Plant
						</Button>
					</HStack>
					<Text fontSize="xs" color="gray.500" textAlign="center">
						Press Ctrl+Enter to save quickly
					</Text>
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
