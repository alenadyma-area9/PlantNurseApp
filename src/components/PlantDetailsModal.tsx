import { useState } from 'react'
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
	VStack,
	Text,
	Box,
	HStack,
	Badge,
	Card,
	Image as ChakraImage,
	Textarea,
	SimpleGrid,
} from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore } from '../store/roomStore'
import { useSettingsStore } from '../store/settingsStore'
import { getPlantById } from '../data/plantDatabase'
import { EditPlantModal } from './EditPlantModal'
import { PhotoUpload } from './PhotoUpload'
import { formatTemperatureRange, formatDistance, formatIdealTemperature } from '../utils/unitConversion'
import type { SoilMoisture, LeafCondition, CheckInAction, PlantCondition } from '../types'
import { toaster } from '../main'

interface PlantDetailsModalProps {
	plantId: string
	isOpen: boolean
	onClose: () => void
}

export function PlantDetailsModal({ plantId, isOpen, onClose }: PlantDetailsModalProps) {
	const plant = usePlantStore((state) => state.plants.find((p) => p.id === plantId))
	const removePlant = usePlantStore((state) => state.removePlant)
	const getPlantHistory = usePlantStore((state) => state.getPlantHistory)
	const getDaysSinceLastCheckIn = usePlantStore((state) => state.getDaysSinceLastCheckIn)
	const getPlantCheckIns = usePlantStore((state) => state.getPlantCheckIns)
	const addCheckIn = usePlantStore((state) => state.addCheckIn)
	const updatePlant = usePlantStore((state) => state.updatePlant)
	const getRoom = useRoomStore((state) => state.getRoom)
	const temperatureUnit = useSettingsStore((state) => state.temperatureUnit)
	const distanceUnit = useSettingsStore((state) => state.distanceUnit)
	const rooms = useRoomStore((state) => state.rooms)

	const [isEditOpen, setIsEditOpen] = useState(false)
	const [activeTab, setActiveTab] = useState<'care' | 'check-in' | 'history' | 'tips'>('care')

	// Check-in form state
	const [plantCondition, setPlantCondition] = useState<PlantCondition>(plant?.condition || 'healthy')
	const [soilMoisture, setSoilMoisture] = useState<SoilMoisture | null>(null)
	const [leafConditions, setLeafConditions] = useState<LeafCondition[]>([])
	const [actions, setActions] = useState<CheckInAction[]>([])
	const [notes, setNotes] = useState('')
	const [photoUrl, setPhotoUrl] = useState<string | undefined>()

	if (!plant) return null

	const species = plant.isCustomPlant ? null : getPlantById(plant.speciesId)
	const room = getRoom(plant.roomId)
	const history = getPlantHistory(plant.id)
	const daysSince = getDaysSinceLastCheckIn(plant.id)

	// For custom plants, species will be null - that's OK

	const handleDelete = () => {
		if (window.confirm(`Are you sure you want to delete ${plant.customName}? This cannot be undone.`)) {
			removePlant(plant.id)
			onClose()
		}
	}

	const handleCheckInSubmit = () => {
		// Check if anything was recorded or condition changed
		const hasObservation = soilMoisture || leafConditions.length > 0 || actions.length > 0 || notes.trim() || photoUrl
		const conditionChanged = plantCondition !== plant.condition

		if (!hasObservation && !conditionChanged) {
			toaster.create({
				title: 'Nothing to save',
				description: 'Please update the plant condition or add at least one observation',
				type: 'warning',
				duration: 5000,
			})
			return
		}

		addCheckIn({
			plantId: plant.id,
			soilMoisture: soilMoisture || undefined,
			leafCondition: leafConditions.length > 0 ? leafConditions : undefined,
			actionsTaken: actions,
			notes: notes.trim() || undefined,
			photoUrl,
		})

		// Update plant condition if it changed
		if (conditionChanged) {
			updatePlant(plant.id, { condition: plantCondition })
		}

		// If plant has no photo yet, use the check-in photo as plant photo
		if (!plant.photoUrl && photoUrl) {
			updatePlant(plant.id, { photoUrl })
		}

		// Check if problems were reported and we have solutions
		const hasProblems = leafConditions.length > 0 ||
			soilMoisture === 'soggy' || soilMoisture === 'wet' || soilMoisture === 'bone-dry' ||
			plantCondition === 'struggling' || plantCondition === 'needs-attention'

		// Reset form
		setSoilMoisture(null)
		setLeafConditions([])
		setActions([])
		setNotes('')
		setPhotoUrl(undefined)
		setPlantCondition(plant.condition)

		// Switch to appropriate tab and show success message
		if (hasProblems && !plant.isCustomPlant) {
			setActiveTab('tips')
			toaster.create({
				title: 'Check-in saved!',
				description: 'See the Tips tab for suggested solutions.',
				type: 'success',
				duration: 5000,
			})
		} else {
			setActiveTab('history')
			toaster.create({
				title: 'Check-in saved!',
				type: 'success',
				duration: 5000,
			})
		}
	}

	const handleToggleLeafCondition = (condition: LeafCondition) => {
		setLeafConditions((prev) =>
			prev.includes(condition)
				? prev.filter((c) => c !== condition)
				: [...prev, condition]
		)
	}

	// Simple smart issue detection
	const getRelevantIssues = () => {
		if (!species || plant.isCustomPlant) return []

		const checkIns = getPlantCheckIns(plant.id)
		if (checkIns.length === 0) return []

		// Get last check-in only
		const lastCheckIn = checkIns[0]
		const matchedIssues: typeof species.commonIssues = []

		// Simple direct matching
		species.commonIssues.forEach(issue => {
			const symptom = issue.symptom.toLowerCase()

			// Match soil moisture problems
			if (lastCheckIn.soilMoisture === 'soggy' || lastCheckIn.soilMoisture === 'wet') {
				if (symptom.includes('yellow') || symptom.includes('mushy') || symptom.includes('rot')) {
					matchedIssues.push(issue)
					return
				}
			}

			// Match leaf conditions
			lastCheckIn.leafCondition?.forEach(condition => {
				if (condition === 'yellowing' && symptom.includes('yellow')) {
					matchedIssues.push(issue)
				}
				else if (condition === 'brown-tips' && symptom.includes('brown') && symptom.includes('tip')) {
					matchedIssues.push(issue)
				}
				else if (condition === 'brown-edges' && symptom.includes('brown') && symptom.includes('edge')) {
					matchedIssues.push(issue)
				}
				else if (condition === 'drooping' && symptom.includes('droop')) {
					matchedIssues.push(issue)
				}
				else if (condition === 'wilting' && symptom.includes('wilt')) {
					matchedIssues.push(issue)
				}
				else if (condition === 'spotted' && symptom.includes('spot')) {
					matchedIssues.push(issue)
				}
				else if (condition === 'crispy' && (symptom.includes('crisp') || symptom.includes('dry'))) {
					matchedIssues.push(issue)
				}
			})
		})

		// Remove duplicates
		return Array.from(new Set(matchedIssues))
	}

	const relevantIssues = plant.isCustomPlant ? [] : getRelevantIssues()
	const hasRelevantIssues = relevantIssues.length > 0

	const handleToggleAction = (action: CheckInAction) => {
		setActions((prev) =>
			prev.includes(action)
				? prev.filter((a) => a !== action)
				: [...prev, action]
		)
	}

	// Condition emoji
	const conditionEmoji = {
		'just-added': '🆕',
		'healthy': '🌿',
		'needs-attention': '⚠️',
		'struggling': '🥀',
	}

	// Format field name for display
	const formatFieldName = (field: string): string => {
		const fieldMap: Record<string, string> = {
			customName: 'Name',
			roomId: 'Location',
			size: 'Size',
			condition: 'Condition',
			notes: 'Notes',
			photoUrl: 'Photo',
		}
		return fieldMap[field] || field
	}

	// Format field value for display
	const formatFieldValue = (field: string, value: string): string => {
		if (field === 'roomId') {
			const room = rooms.find(r => r.id === value)
			return room?.name || value
		}
		if (field === 'condition') {
			return value.replace('-', ' ')
		}
		if (field === 'photoUrl') {
			return value ? 'Updated' : 'Removed'
		}
		return value || '(none)'
	}

	// Check-in form options
	const conditionOptions = [
		{ value: 'healthy', label: 'Healthy & thriving', emoji: '🌿', color: 'green' },
		{ value: 'needs-attention', label: 'Needs some attention', emoji: '⚠️', color: 'yellow' },
		{ value: 'struggling', label: 'Struggling / Not doing well', emoji: '🥀', color: 'red' },
	] as Array<{ value: PlantCondition; label: string; emoji: string; color: string }>

	const soilOptions = [
		{ value: 'bone-dry' as SoilMoisture, label: 'Bone dry', emoji: '🏜️', desc: 'Completely dry' },
		{ value: 'dry' as SoilMoisture, label: 'Dry', emoji: '☀️', desc: 'Dry to touch' },
		{ value: 'slightly-moist' as SoilMoisture, label: 'Slightly moist', emoji: '💧', desc: 'Barely damp' },
		{ value: 'moist' as SoilMoisture, label: 'Moist', emoji: '💦', desc: 'Damp' },
		{ value: 'wet' as SoilMoisture, label: 'Wet', emoji: '🌊', desc: 'Very wet' },
		{ value: 'soggy' as SoilMoisture, label: 'Soggy', emoji: '⚠️', desc: 'Waterlogged' },
	]

	const leafOptions = [
		{ value: 'healthy' as LeafCondition, label: 'Healthy', emoji: '🌿', color: 'green' },
		{ value: 'drooping' as LeafCondition, label: 'Drooping', emoji: '⬇️', color: 'yellow' },
		{ value: 'yellowing' as LeafCondition, label: 'Yellowing', emoji: '🟡', color: 'yellow' },
		{ value: 'brown-tips' as LeafCondition, label: 'Brown tips', emoji: '🟤', color: 'orange' },
		{ value: 'brown-edges' as LeafCondition, label: 'Brown edges', emoji: '🔶', color: 'orange' },
		{ value: 'spotted' as LeafCondition, label: 'Spotted', emoji: '⚫', color: 'orange' },
		{ value: 'crispy' as LeafCondition, label: 'Crispy', emoji: '🍂', color: 'red' },
		{ value: 'wilting' as LeafCondition, label: 'Wilting', emoji: '🥀', color: 'red' },
	]

	const actionOptions = [
		{ value: 'watered' as CheckInAction, label: 'Watered', emoji: '💧' },
		{ value: 'fertilized' as CheckInAction, label: 'Fertilized', emoji: '🌱' },
		{ value: 'rotated' as CheckInAction, label: 'Rotated', emoji: '🔄' },
		{ value: 'misted' as CheckInAction, label: 'Misted', emoji: '💨' },
		{ value: 'pruned' as CheckInAction, label: 'Pruned', emoji: '✂️' },
		{ value: 'repotted' as CheckInAction, label: 'Repotted', emoji: '🪴' },
		{ value: 'nothing' as CheckInAction, label: 'Just observing', emoji: '👀' },
	]

	const currentCondition = conditionOptions.find((c) => c.value === plant.condition)

	return (
	<>
	  <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg" placement="center">
		<DialogBackdrop />
		<DialogContent
		  maxW={{ base: '95vw', sm: '90vw', md: '600px' }}
		  maxH="90vh"
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
							{conditionEmoji[plant.condition]} {plant.customName}
						</DialogTitle>
						<DialogCloseTrigger />
					</DialogHeader>

					<DialogBody overflowY="auto" maxH="70vh">
						 <VStack gap={4} align="stretch">
						{/* Plant Info Header */}
						<Box bg="green.50" p={4} borderRadius="md">
						  <HStack align="start" gap={4}>
							{/* Plant Photo */}
							{plant.photoUrl && (
							  <Box flexShrink={0}>
								<ChakraImage
								  src={plant.photoUrl}
								  alt={plant.customName}
								  width="120px"
								  height="120px"
								  objectFit="cover"
								  borderRadius="md"
								  border="2px solid"
								  borderColor="green.200"
								/>
							  </Box>
							)}

							<VStack align="start" gap={2} flex={1}>
							  <Text fontSize="lg" fontWeight="bold" color="green.800">
								{plant.isCustomPlant ? plant.customName : species?.commonName}
							  </Text>
									{plant.isCustomPlant ? (
										<>
											{plant.customScientificName && (
												<Text fontSize="sm" color="green.700">
													{plant.customScientificName}
												</Text>
											)}
											<Badge colorScheme="blue" fontSize="xs" width="fit-content">
												🌱 Custom plant
											</Badge>
										</>
									) : (
										<>
											<Text fontSize="sm" color="green.700">
												{species?.scientificName}
											</Text>
											<HStack flexWrap="wrap" gap={2}>
												<Badge colorScheme="green" fontSize="xs">
													{species?.careLevel === 'beginner' ? '🌱 Easy care' :
													 species?.careLevel === 'intermediate' ? '🌿 Moderate care' :
													 '🔥 Needs attention'}
												</Badge>
												{species?.petSafe && (
													<Badge colorScheme="blue" fontSize="xs">
														🐾 Pet safe
													</Badge>
												)}
											</HStack>
										</>
									)}

									<Box width="full" pt={2} borderTopWidth={1} borderColor="green.200">
										<VStack align="stretch" gap={1} fontSize="sm">
											<HStack justify="space-between">
												<Text color="gray.600">Location:</Text>
												<Text fontWeight="medium">{room?.name || 'Unknown'}</Text>
											</HStack>
											<HStack justify="space-between">
												<Text color="gray.600">Size:</Text>
												<Text fontWeight="medium" textTransform="capitalize">{plant.size}</Text>
											</HStack>
											<HStack justify="space-between">
												<Text color="gray.600">Last check-in:</Text>
												<Text fontWeight="medium">
													{daysSince === 0 ? 'Today' : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`}
												</Text>
											</HStack>
											<HStack justify="space-between">
												<Text color="gray.600">Total history:</Text>
												<Text fontWeight="medium">{history.length} event{history.length !== 1 ? 's' : ''}</Text>
											</HStack>
								  </VStack>
								</Box>
								</VStack>
							  </HStack>
							</Box>

							{/* Tab Buttons */}
							<HStack gap={{ base: 1, md: 2 }} borderBottomWidth={1} pb={2} flexWrap="nowrap" overflowX="auto">
								<Button
									size={{ base: 'xs', md: 'sm' }}
									variant={activeTab === 'care' ? 'solid' : 'ghost'}
									colorScheme={activeTab === 'care' ? 'green' : 'gray'}
									onClick={() => setActiveTab('care')}
									flexShrink={0}
								>
									<Text display={{ base: 'none', md: 'block' }}>Care Guide</Text>
									<Text display={{ base: 'block', md: 'none' }}>Care</Text>
								</Button>
								<Button
									size={{ base: 'xs', md: 'sm' }}
									variant={activeTab === 'check-in' ? 'solid' : 'ghost'}
									colorScheme={activeTab === 'check-in' ? 'green' : 'gray'}
									onClick={() => setActiveTab('check-in')}
									flexShrink={0}
								>
									✓ <Text display={{ base: 'none', sm: 'inline' }}>Check-in</Text>
								</Button>
								<Button
									size={{ base: 'xs', md: 'sm' }}
									variant={activeTab === 'history' ? 'solid' : 'ghost'}
									colorScheme={activeTab === 'history' ? 'green' : 'gray'}
									onClick={() => setActiveTab('history')}
									flexShrink={0}
								>
									<Text display={{ base: 'none', sm: 'inline' }}>History</Text>
									<Text display={{ base: 'inline', sm: 'none' }}>📜</Text>
									{history.length > 0 && <Text ml={1}>({history.length})</Text>}
								</Button>
								<Button
									size={{ base: 'xs', md: 'sm' }}
									variant={activeTab === 'tips' ? 'solid' : 'ghost'}
									colorScheme={activeTab === 'tips' ? 'green' : 'gray'}
									onClick={() => setActiveTab('tips')}
									flexShrink={0}
								>
									<HStack gap={1}>
										<Text>Tips</Text>
										{hasRelevantIssues && (
											<Badge colorScheme="red" fontSize="2xs" px={1}>!</Badge>
										)}
									</HStack>
								</Button>
							</HStack>

							{/* Care Guide Tab */}
							{activeTab === 'care' && (
								<VStack gap={3} align="stretch">
									{plant.isCustomPlant ? (
										// Custom plant care guide
										<>
											{/* Custom Plant Appearance */}
											{(plant.customLeafShape || plant.customLeafSize || plant.customGrowthPattern || plant.customSpecialFeatures) && (
												<Card.Root variant="outline">
													<Card.Body>
														<Text fontSize="md" fontWeight="bold" mb={3}>
															🌿 What it looks like
														</Text>
														<VStack align="stretch" gap={2} fontSize="sm">
															{plant.customLeafShape && (
																<HStack>
																	<Text color="gray.600" minW="80px">Leaves:</Text>
																	<Text fontWeight="medium" textTransform="capitalize">
																		{plant.customLeafShape}
																		{plant.customLeafSize && `, ${plant.customLeafSize}`}
																	</Text>
																</HStack>
															)}
															{!plant.customLeafShape && plant.customLeafSize && (
																<HStack>
																	<Text color="gray.600" minW="80px">Leaf size:</Text>
																	<Text fontWeight="medium" textTransform="capitalize">
																		{plant.customLeafSize}
																	</Text>
																</HStack>
															)}
															{plant.customGrowthPattern && (
																<HStack>
																	<Text color="gray.600" minW="80px">Growth:</Text>
																	<Text fontWeight="medium" textTransform="capitalize">
																		{plant.customGrowthPattern}
																	</Text>
																</HStack>
															)}
															{plant.customSpecialFeatures && plant.customSpecialFeatures.length > 0 && (
																<HStack align="start">
																	<Text color="gray.600" minW="80px">Features:</Text>
																	<HStack flexWrap="wrap" gap={1.5}>
																		{plant.customSpecialFeatures.map((feature, idx) => (
																			<Badge key={idx} colorScheme="purple" fontSize="xs">
																				{feature}
																			</Badge>
																		))}
																	</HStack>
																</HStack>
															)}
														</VStack>
													</Card.Body>
												</Card.Root>
											)}

											<Card.Root variant="outline">
												<Card.Body>
													<Text fontSize="md" fontWeight="bold" mb={2}>
														💧 Watering
													</Text>
													<VStack align="stretch" gap={2} fontSize="sm">
														<Box>
															<Text color="gray.600" fontSize="xs">Check frequency:</Text>
															<Text fontWeight="medium">
																Every {plant.customCheckFrequency || 7} days
															</Text>
														</Box>
													</VStack>
												</Card.Body>
											</Card.Root>

											<Card.Root variant="outline">
												<Card.Body>
													<Text fontSize="md" fontWeight="bold" mb={2}>
														☀️ Light
													</Text>
													<Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
														{plant.customLightLevel || 'medium'} light
													</Text>
												</Card.Body>
											</Card.Root>

											{/* Care Instructions */}
											{plant.customCareNotes ? (
												<Card.Root variant="outline">
													<Card.Body>
														<Text fontSize="md" fontWeight="bold" mb={2}>
															📝 Care Instructions
														</Text>
														<Text fontSize="sm" whiteSpace="pre-wrap">{plant.customCareNotes}</Text>
													</Card.Body>
												</Card.Root>
											) : (
												<Box bg="blue.50" p={3} borderRadius="md">
													<Text fontSize="sm" color="blue.700">
														💡 This is a custom plant. Click "Edit" to add your care instructions.
													</Text>
												</Box>
											)}

											{/* Personal Notes */}
											{plant.notes && (
												<Card.Root variant="outline">
													<Card.Body>
														<Text fontSize="md" fontWeight="bold" mb={2}>
															📓 Your Notes
														</Text>
														<Text fontSize="sm" whiteSpace="pre-wrap">{plant.notes}</Text>
													</Card.Body>
												</Card.Root>
											)}


										</>
									) : (
										// Database plant care guide
										<>
											{/* Plant Appearance */}
											<Card.Root variant="outline">
												<Card.Body>
													<Text fontSize="md" fontWeight="bold" mb={3}>
														🌿 What it looks like
													</Text>
													<VStack align="stretch" gap={2} fontSize="sm">
														<HStack>
															<Text color="gray.600" minW="80px">Leaves:</Text>
															<Text fontWeight="medium" textTransform="capitalize">
																{species?.characteristics.leafShape.replace('-', ' ')} shape, {species?.characteristics.leafSize} size
															</Text>
														</HStack>
														<HStack>
															<Text color="gray.600" minW="80px">Growth:</Text>
															<Text fontWeight="medium" textTransform="capitalize">
																{species?.characteristics.growthPattern}
															</Text>
														</HStack>
														{species?.characteristics.specialFeatures && species.characteristics.specialFeatures.length > 0 && (
															<HStack align="start">
																<Text color="gray.600" minW="80px">Features:</Text>
																<HStack flexWrap="wrap" gap={1.5}>
																	{species.characteristics.specialFeatures.map((feature) => (
																		<Badge key={feature} colorScheme="purple" fontSize="xs">
																			{feature}
																		</Badge>
																	))}
																</HStack>
															</HStack>
														)}
													</VStack>
												</Card.Body>
											</Card.Root>

											{/* Watering */}
											<Card.Root variant="outline">
												<Card.Body>
													<Text fontSize="md" fontWeight="bold" mb={2}>
														💧 Watering
													</Text>
													<VStack align="stretch" gap={2} fontSize="sm">
														<Box>
															<Text color="gray.600" fontSize="xs">Check frequency:</Text>
															<Text fontWeight="medium">
																Every {species?.watering.checkFrequency} days
															</Text>
														</Box>
														<Box>
														  <Text color="gray.600" fontSize="xs">How to check:</Text>
														  <Text fontWeight="medium">
															Stick finger in soil {formatDistance(species?.watering.soilCheckDepth || '', distanceUnit)}
														  </Text>
														</Box>
														<Box>
															<Text color="gray.600" fontSize="xs">Soil preference:</Text>
															<Text fontWeight="medium" textTransform="capitalize">
																{species?.watering.soilPreference.replace('-', ' ')}
															</Text>
														</Box>
														{species?.watering.seasonalNotes && (
															<Box>
																<Text color="gray.600" fontSize="xs">Seasonal notes:</Text>
																<Text>{species.watering.seasonalNotes}</Text>
															</Box>
														)}
											</VStack>
										</Card.Body>
									</Card.Root>

									{/* Light */}
									<Card.Root variant="outline">
										<Card.Body>
											<Text fontSize="md" fontWeight="bold" mb={2}>
												☀️ Light
											</Text>
											<VStack align="stretch" gap={2} fontSize="sm">
												<Box>
													<Text color="gray.600" fontSize="xs">Light level:</Text>
													<Text fontWeight="medium" textTransform="capitalize">
														{species?.light.level.replace('-', ' ')}
													</Text>
												</Box>
												<Text>{species?.light.description}</Text>
											</VStack>
										</Card.Body>
									</Card.Root>

									{/* Temperature & Humidity */}
									<Card.Root variant="outline">
										<Card.Body>
											<Text fontSize="md" fontWeight="bold" mb={2}>
												🌡️ Temperature & Humidity
											</Text>
											<VStack align="stretch" gap={3} fontSize="sm">
												<Box>
												  <Text color="gray.600" fontSize="xs">Temperature range:</Text>
												  <Text fontWeight="medium">
													{formatTemperatureRange(species?.temperature.min || 60, species?.temperature.max || 80, temperatureUnit)}
												  </Text>
												  <Text fontSize="xs" color="gray.500">
													Ideal: {formatIdealTemperature(species?.temperature.ideal || '60-75°F', temperatureUnit)}
												  </Text>
												</Box>
												<Box>
													<Text color="gray.600" fontSize="xs">Humidity preference:</Text>
													<Text fontWeight="medium" textTransform="capitalize">
														{species?.humidity.preference}
													</Text>
													<Text fontSize="xs">{species?.humidity.description}</Text>
												</Box>
											</VStack>
										</Card.Body>
									</Card.Root>

									{/* Personal Notes (for database plants) */}
									{plant.notes && (
										<Card.Root variant="outline">
											<Card.Body>
												<Text fontSize="md" fontWeight="bold" mb={2}>
													📓 Your Notes
												</Text>
												<Text fontSize="sm" whiteSpace="pre-wrap">{plant.notes}</Text>
											</Card.Body>
										</Card.Root>
									)}
										</>
									)}
								</VStack>
							)}

							{/* Check-in Tab */}
							{activeTab === 'check-in' && (
								<VStack gap={4} align="stretch">
									{/* Current Status Info */}
									<Box bg="blue.50" p={3} borderRadius="md">
										<HStack justify="space-between" fontSize="sm">
											<Text color="gray.700">Current status:</Text>
											<Badge
												colorScheme={currentCondition?.color || 'gray'}
												fontSize="xs"
												display="flex"
												alignItems="center"
												gap={1}
											>
												<Text>{currentCondition?.emoji}</Text>
												<Text>{plant.condition.replace('-', ' ')}</Text>
											</Badge>
										</HStack>
									</Box>

									{/* 1. Overall Condition */}
									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											1. How is your plant doing overall?
										</Text>
										<VStack gap={2}>
											{conditionOptions.map((c) => (
												<Button
													key={c.value}
													size="sm"
													variant={plantCondition === c.value ? 'solid' : 'outline'}
													colorScheme={plantCondition === c.value ? c.color : 'gray'}
													onClick={() => setPlantCondition(c.value)}
													width="full"
													justifyContent="flex-start"
												>
													<Text mr={2}>{c.emoji}</Text>
													{c.label}
												</Button>
											))}
										</VStack>
									</Box>

									{/* 2. Soil Moisture */}
									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											2. How moist is the soil? (optional)
										</Text>
										<SimpleGrid columns={{ base: 2, sm: 3 }} gap={2}>
											{soilOptions.map((option) => (
												<Button
													key={option.value}
													size="sm"
													variant={soilMoisture === option.value ? 'solid' : 'outline'}
													colorScheme={soilMoisture === option.value ? 'green' : 'gray'}
													onClick={() => setSoilMoisture(option.value)}
													height="auto"
													py={2}
													flexDirection="column"
												>
													<Text fontSize="lg">{option.emoji}</Text>
													<Text fontSize="xs" fontWeight="bold">{option.label}</Text>
													<Text fontSize="2xs" color="gray.500">{option.desc}</Text>
												</Button>
											))}
										</SimpleGrid>
									</Box>

									{/* 3. Leaf Condition */}
									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											3. How do the leaves look? (optional)
										</Text>
										<SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={2}>
											{leafOptions.map((option) => (
												<Button
													key={option.value}
													size="sm"
													variant={leafConditions.includes(option.value) ? 'solid' : 'outline'}
													colorScheme={leafConditions.includes(option.value) ? 'green' : 'gray'}
													onClick={() => handleToggleLeafCondition(option.value)}
													height="auto"
													py={2}
													flexDirection="column"
												>
													<Text fontSize="lg">{option.emoji}</Text>
													<Text fontSize="xs">{option.label}</Text>
												</Button>
											))}
										</SimpleGrid>
									</Box>

									{/* 4. Actions Taken */}
									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											4. What did you do today? (optional)
										</Text>
										<SimpleGrid columns={{ base: 2, sm: 3 }} gap={2}>
											{actionOptions.map((option) => (
												<Button
													key={option.value}
													size="sm"
													variant={actions.includes(option.value) ? 'solid' : 'outline'}
													colorScheme={actions.includes(option.value) ? 'blue' : 'gray'}
													onClick={() => handleToggleAction(option.value)}
													justifyContent="flex-start"
												>
													<Text mr={2}>{option.emoji}</Text>
													{option.label}
												</Button>
											))}
										</SimpleGrid>
									</Box>

									{/* 5. Notes */}
									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											5. Any notes? (optional)
										</Text>
										<Textarea
											placeholder="e.g., New growth appearing, moved closer to window..."
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
											rows={3}
											fontSize="sm"
										/>
									</Box>

									{/* 6. Photo */}
									<Box>
										<Text fontSize="sm" fontWeight="bold" mb={2}>
											6. Add a photo (optional)
										</Text>
										<PhotoUpload
											currentPhoto={photoUrl}
											onPhotoChange={setPhotoUrl}
											label=""
										/>
									</Box>

								</VStack>
							)}

							{/* History Tab */}
							{activeTab === 'history' && (
								<VStack gap={3} align="stretch">
									{history.length === 0 ? (
										<Box textAlign="center" py={8}>
											<Text fontSize="lg" color="gray.500">
												No history yet
											</Text>
											<Text fontSize="sm" color="gray.400">
												Start tracking your plant's progress!
											</Text>
										</Box>
									) : (
										history.map((entry, index) => {
											// Plant Created
											if (entry.type === 'created') {
												return (
													<Card.Root key={`created-${index}`} variant="outline" size="sm">
														<Card.Body>
															<HStack align="start" gap={3}>
																<Box fontSize="xl">🌱</Box>
																<VStack align="stretch" gap={1} flex={1}>
																	<HStack justify="space-between">
																		<Text fontSize="sm" fontWeight="bold" color="green.600">
																			Plant Added
																		</Text>
																		<Text fontSize="xs" color="gray.500">
																			{new Date(entry.date).toLocaleDateString('en-US', {
																				month: 'short',
																				day: 'numeric',
																				year: 'numeric',
																			})}
																		</Text>
																	</HStack>
																	<Text fontSize="xs" color="gray.600">
																		Started caring for this plant
																	</Text>
																</VStack>
															</HStack>
														</Card.Body>
													</Card.Root>
												)
											}

											// Plant Edited
											if (entry.type === 'edit') {
												return (
													<Card.Root key={entry.data.id} variant="outline" size="sm">
														<Card.Body>
															<HStack align="start" gap={3}>
																<Box fontSize="xl">✏️</Box>
																<VStack align="stretch" gap={2} flex={1}>
																	<HStack justify="space-between">
																		<Text fontSize="sm" fontWeight="bold" color="blue.600">
																			Plant Updated
																		</Text>
																		<Text fontSize="xs" color="gray.500">
																			{new Date(entry.data.date).toLocaleDateString('en-US', {
																				month: 'short',
																				day: 'numeric',
																				year: 'numeric',
																			})}
																		</Text>
																	</HStack>
																	<VStack align="stretch" gap={1}>
																		{entry.data.changes.map((change, idx) => (
																			<Box key={idx}>
																				<Text fontSize="xs" color="gray.600">
																					{formatFieldName(change.field)}:{' '}
																					<Text as="span" textDecoration="line-through" color="red.500">
																						{formatFieldValue(change.field, change.oldValue)}
																					</Text>{' '}
																					→{' '}
																					<Text as="span" color="green.600" fontWeight="medium">
																						{formatFieldValue(change.field, change.newValue)}
																					</Text>
																				</Text>
																			</Box>
																		))}
																	</VStack>
																</VStack>
															</HStack>
														</Card.Body>
													</Card.Root>
												)
											}

											// Check-in
											if (entry.type === 'check-in') {
												const checkIn = entry.data
												return (
													<Card.Root key={checkIn.id} variant="outline" size="sm">
														<Card.Body>
															<HStack align="start" gap={3}>
																{/* Check-in Photo */}
																{checkIn.photoUrl && (
																	<Box flexShrink={0}>
																		<ChakraImage
																			src={checkIn.photoUrl}
																			alt="Check-in photo"
																			width="60px"
																			height="60px"
																			objectFit="cover"
																			borderRadius="md"
																		/>
																	</Box>
																)}

																<VStack align="stretch" gap={2} flex={1}>
																	<HStack justify="space-between">
																		<Text fontSize="sm" fontWeight="bold" color="green.700">
																			✓ Check-in
																		</Text>
																		<Text fontSize="xs" color="gray.500">
																			{new Date(checkIn.date).toLocaleDateString('en-US', {
																				month: 'short',
																				day: 'numeric',
																				year: 'numeric',
																			})}
																		</Text>
																	</HStack>

																	{(checkIn.soilMoisture || (checkIn.leafCondition && checkIn.leafCondition.length > 0)) && (
																		<HStack flexWrap="wrap" gap={2} fontSize="xs">
																			{checkIn.soilMoisture && (
																				<Badge colorScheme="blue">
																					💧 {checkIn.soilMoisture.replace('-', ' ')}
																				</Badge>
																			)}
																			{checkIn.leafCondition?.map((condition) => (
																				<Badge
																					key={condition}
																					colorScheme={
																						condition === 'healthy'
																							? 'green'
																							: ['drooping', 'yellowing'].includes(condition)
																							? 'yellow'
																							: 'red'
																					}
																				>
																					{condition.replace('-', ' ')}
																				</Badge>
																			))}
																		</HStack>
																	)}

																	{checkIn.actionsTaken.length > 0 && (
																		<Box>
																			<Text fontSize="xs" color="gray.600" mb={1}>
																				Actions:
																			</Text>
																			<HStack flexWrap="wrap" gap={1}>
																				{checkIn.actionsTaken.map((action) => (
																					<Text key={action} fontSize="xs" color="gray.700">
																						• {action}
																					</Text>
																				))}
																			</HStack>
																		</Box>
																	)}

																	{checkIn.notes && (
																		<Box>
																			<Text fontSize="xs" color="gray.600" mb={1}>
																				Notes:
																			</Text>
																			<Text fontSize="xs">{checkIn.notes}</Text>
																		</Box>
																	)}
																</VStack>
															</HStack>
														</Card.Body>
													</Card.Root>
												)
											}

											return null
										})
									)}
								</VStack>
							)}

							{/* Tips Tab */}
							{activeTab === 'tips' && (
								<VStack gap={4} align="stretch">
									{plant.isCustomPlant ? (
										<>
											{/* General Plant Care Tips */}
											<Box>
												<Text fontSize="md" fontWeight="bold" mb={3}>
													💡 General Plant Care Tips
												</Text>
												<VStack align="stretch" gap={2}>
													<Card.Root variant="subtle" size="sm">
														<Card.Body>
															<Text fontSize="sm" fontWeight="medium" mb={1}>💧 Watering Issues</Text>
															<Text fontSize="xs">Most problems come from watering. Check soil before watering - stick your finger 1-2 inches deep. Water thoroughly when dry, but never let it sit in water.</Text>
														</Card.Body>
													</Card.Root>
													<Card.Root variant="subtle" size="sm">
														<Card.Body>
															<Text fontSize="sm" fontWeight="medium" mb={1}>☀️ Light Problems</Text>
															<Text fontSize="xs">If leaves are pale or stretching, move to brighter light. If leaves are burned or fading, move away from direct sun.</Text>
														</Card.Body>
													</Card.Root>
													<Card.Root variant="subtle" size="sm">
														<Card.Body>
															<Text fontSize="sm" fontWeight="medium" mb={1}>🟡 Yellow Leaves</Text>
															<Text fontSize="xs">Usually overwatering or natural aging. Check if soil is too wet. Lower leaves yellowing naturally is normal.</Text>
														</Card.Body>
													</Card.Root>
													<Card.Root variant="subtle" size="sm">
														<Card.Body>
															<Text fontSize="sm" fontWeight="medium" mb={1}>🟤 Brown Tips/Edges</Text>
															<Text fontSize="xs">Often from low humidity, tap water chemicals, or inconsistent watering. Use filtered water and maintain regular schedule.</Text>
														</Card.Body>
													</Card.Root>
													<Card.Root variant="subtle" size="sm">
														<Card.Body>
															<Text fontSize="sm" fontWeight="medium" mb={1}>⬇️ Drooping Leaves</Text>
															<Text fontSize="xs">Usually thirsty or overwatered. Check soil: if dry → water; if wet → stop watering and improve drainage.</Text>
														</Card.Body>
													</Card.Root>
												</VStack>
											</Box>

											{/* Your Care Instructions */}
											{plant.customCareNotes ? (
												<Card.Root variant="outline" borderColor="blue.300">
													<Card.Body>
														<Text fontSize="md" fontWeight="bold" mb={2} color="blue.800">
															📝 Your Care Instructions
														</Text>
														<Text fontSize="sm" whiteSpace="pre-wrap">{plant.customCareNotes}</Text>
													</Card.Body>
												</Card.Root>
											) : (
												<Box bg="blue.50" p={4} borderRadius="md">
													<Text fontSize="sm" color="blue.700">
														💡 Click "Edit" to add your care instructions for this plant.
													</Text>
												</Box>
											)}
										</>
									) : (
										<>
											{/* Suggested Solutions (Smart - based on recent check-ins) */}
											{hasRelevantIssues && (
												<Box bg="red.50" borderWidth={2} borderColor="red.300" p={4} borderRadius="md">
													<HStack mb={3}>
														<Badge colorScheme="red" fontSize="sm" px={2} py={1}>
															❗ NEEDS ATTENTION
														</Badge>
														<Text fontSize="md" fontWeight="bold" color="red.800">
															Suggested Solutions
														</Text>
													</HStack>
													<Text fontSize="xs" color="red.700" mb={3}>
														Based on your recent check-ins, these issues might help:
													</Text>
													<VStack align="stretch" gap={3}>
														{relevantIssues.map((issue, index) => (
															<Card.Root key={`relevant-${index}`} variant="outline" borderColor="red.300">
																<Card.Body bg="white">
																	<VStack align="stretch" gap={2} fontSize="sm">
																		<HStack>
																			<Badge colorScheme="red" fontSize="xs">!</Badge>
																			<Text fontWeight="bold" color="red.700">
																				{issue.symptom}
																			</Text>
																		</HStack>
																		<Box>
																			<Text color="orange.600" fontWeight="medium" fontSize="xs">
																				Likely cause:
																			</Text>
																			<Text>{issue.cause}</Text>
																		</Box>
																		<Box bg="green.50" p={2} borderRadius="md">
																			<Text color="green.700" fontWeight="medium" fontSize="xs" mb={1}>
																				✓ What to do:
																			</Text>
																			<Text color="green.800">{issue.solution}</Text>
																		</Box>
																	</VStack>
																</Card.Body>
															</Card.Root>
														))}
													</VStack>
												</Box>
											)}

											{/* Quick Tips */}
											<Box>
												<Text fontSize="md" fontWeight="bold" mb={3}>
													💡 Quick Tips
												</Text>
												<VStack align="stretch" gap={2}>
													{species?.quickTips.map((tip, index) => (
														<Card.Root key={index} variant="subtle" size="sm">
															<Card.Body>
																<Text fontSize="sm">{tip}</Text>
															</Card.Body>
														</Card.Root>
													))}
												</VStack>
											</Box>

											{/* All Common Issues */}
											<Box>
												<Text fontSize="md" fontWeight="bold" mb={3}>
													🩺 All Common Issues
												</Text>
												<VStack align="stretch" gap={3}>
													{species?.commonIssues.map((issue, index) => (
														<Card.Root key={index} variant="outline">
															<Card.Body>
																<VStack align="stretch" gap={2} fontSize="sm">
																	<Text fontWeight="bold" color="red.600">
																		{issue.symptom}
																	</Text>
																	<Box>
																		<Text color="orange.600" fontWeight="medium" fontSize="xs">
																			Cause:
																		</Text>
																		<Text>{issue.cause}</Text>
																	</Box>
																	<Box>
																		<Text color="green.600" fontWeight="medium" fontSize="xs">
																			Solution:
																		</Text>
																		<Text>{issue.solution}</Text>
																	</Box>
																</VStack>
															</Card.Body>
														</Card.Root>
													))}
												</VStack>
											</Box>


										</>
									)}
								</VStack>
							)}
						</VStack>
					</DialogBody>

					<DialogFooter>
						{activeTab === 'check-in' ? (
							// Check-in tab footer with prominent Save button
							<HStack width="full" justify="space-between" gap={2}>
								<Button size="md" variant="ghost" onClick={onClose}>
									Cancel
								</Button>
								<Button
									size="md"
									colorScheme="green"
									onClick={handleCheckInSubmit}
									fontWeight="bold"
									px={8}
								>
									✓ Save Check-in
								</Button>
							</HStack>
						) : (
							// Other tabs footer
							<HStack width="full" justify="space-between" flexWrap="wrap" gap={2}>
								<Button size="sm" colorScheme="red" variant="ghost" onClick={handleDelete}>
									Delete
								</Button>
								<HStack>
									<Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
										Edit
									</Button>
									<Button size="sm" colorScheme="green" onClick={onClose}>
										Close
									</Button>
								</HStack>
							</HStack>
						)}
					</DialogFooter>
				</DialogContent>
			</DialogRoot>

			{/* Edit Modal */}
			{isEditOpen && (
				<EditPlantModal
					plantId={plant.id}
					isOpen={isEditOpen}
					onClose={() => setIsEditOpen(false)}
				/>
			)}
		</>
	)
}
