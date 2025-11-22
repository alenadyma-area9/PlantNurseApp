import { useState } from 'react'
import { Box, Text, VStack, Card, HStack, Badge, Button, Image as ChakraImage, Heading, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore } from '../store/roomStore'
import { getPlantById } from '../data/plantDatabase'
import { CheckInModal } from './CheckInModal'
import { PlantDetailsModal } from './PlantDetailsModal'
import { formatTimeAgo } from '../utils/timeUtils'
type ViewMode = 'all' | 'by-room' | 'by-health' | 'by-priority' | 'by-next-check' | 'by-care-level'

interface SortablePlantCardProps {
	plant: any
	species: any
	room: any
	status: any
	checkIns: any[]
	hasCheckIns: boolean
	nextCheckDate: Date | null
	onCheckIn: () => void
	onDetails: () => void
	isDragDisabled?: boolean
}

function SortablePlantCard({
	plant,
	species,
	room,
	status,
	checkIns,
	hasCheckIns,
	nextCheckDate,
	onCheckIn,
	onDetails,
	isDragDisabled = false,
}: SortablePlantCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: plant.id,
		disabled: isDragDisabled,
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	}

	// Status colors - adjust label for newly added plants
	const statusConfig = {
		'needs-attention': { color: 'red', icon: '🔴', label: 'Needs attention' },
		'check-soon': { color: 'yellow', icon: '🟡', label: 'Check soon' },
		'recently-checked': {
			color: 'green',
			icon: '🟢',
			label: hasCheckIns ? 'Recently checked' : 'Recently added',
		},
		'may-have-issue': { color: 'orange', icon: '⚠️', label: 'May have issue' },
	}

	const currentStatus = statusConfig[status as keyof typeof statusConfig]

	// Condition emoji
	const conditionEmoji = {
		'just-added': '🆕',
		healthy: '🌿',
		'needs-attention': '⚠️',
		struggling: '🥀',
	}

	return (
		<Card.Root key={plant.id} variant="outline" ref={setNodeRef} style={style}>
			<Card.Body p={{ base: 3, md: 4 }}>
				<HStack gap={3} align="start">
					{/* Drag Handle */}
					{!isDragDisabled && (
						<Box
							{...attributes}
							{...listeners}
							cursor="grab"
							_active={{ cursor: 'grabbing' }}
							color="gray.400"
							fontSize="xl"
							userSelect="none"
							pt={2}
						>
							⋮⋮
						</Box>
					)}

					{/* Plant Photo */}
					{plant.photoUrl && (
						<Box flexShrink={0}>
							<ChakraImage
								src={plant.photoUrl}
								alt={plant.customName}
								width="80px"
								height="80px"
								objectFit="cover"
								borderRadius="md"
							/>
						</Box>
					)}

					<VStack gap={3} align="stretch" flex={1}>
						{/* Header */}
						<HStack justify="space-between" align="start" flexWrap="wrap" gap={2}>
							<VStack align="start" gap={1} flex={1} minW="0">
								<HStack flexWrap="wrap" gap={2}>
									<Text
										fontSize={{ base: 'lg', md: 'xl' }}
										fontWeight="bold"
										lineClamp={1}
										cursor="pointer"
										onClick={onDetails}
										_hover={{ color: 'green.600', textDecoration: 'underline' }}
									>
										{conditionEmoji[plant.condition as keyof typeof conditionEmoji]}{' '}
										{plant.customName}
									</Text>
									<Badge colorScheme={currentStatus.color} fontSize="xs">
										{currentStatus.icon} {currentStatus.label}
									</Badge>
								</HStack>

								<Text fontSize="sm" color="gray.600">
									{species.commonName} • {species.careLevel} • {plant.size}
								</Text>

								{room && (
									<Text fontSize="xs" color="gray.500">
										📍 {room.name} ({room.lightLevel} light)
									</Text>
								)}
							</VStack>

							<VStack gap={2} minW={{ base: 'full', sm: 'auto' }} pointerEvents="auto">
								<Button
									size="sm"
									colorScheme="green"
									width={{ base: 'full', sm: 'auto' }}
									onClick={(e) => {
										e.stopPropagation()
										onCheckIn()
									}}
									pointerEvents="auto"
								>
									Check-in
								</Button>
								<Button
									size="sm"
									variant="ghost"
									width={{ base: 'full', sm: 'auto' }}
									onClick={(e) => {
										e.stopPropagation()
										onDetails()
									}}
									pointerEvents="auto"
								>
									Details
								</Button>
							</VStack>
						</HStack>

						{/* Info */}
						<HStack
							fontSize="xs"
							color="gray.500"
							flexWrap="wrap"
							gap={3}
							pt={2}
							borderTopWidth={1}
							borderColor="gray.100"
						>
							<Text>
								{hasCheckIns
									? `Last check: ${formatTimeAgo(checkIns[0].date)}`
									: `Added ${formatTimeAgo(plant.dateAdded)}`}
							</Text>
							{species.watering.checkFrequency && nextCheckDate && (
								<Text>
									• Check every {species.watering.checkFrequency} days, next:{' '}
									{nextCheckDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
								</Text>
							)}
						</HStack>
					</VStack>
				</HStack>
			</Card.Body>
		</Card.Root>
	)
}

interface PlantListProps {
	onOpenSettings: () => void
	onOpenRoomManagement: () => void
}

export function PlantList({ onOpenSettings, onOpenRoomManagement }: PlantListProps) {
	const plants = usePlantStore((state) => state.plants)
	const getPlantStatus = usePlantStore((state) => state.getPlantStatus)
	const getPlantCheckIns = usePlantStore((state) => state.getPlantCheckIns)
	const reorderPlants = usePlantStore((state) => state.reorderPlants)
	const getRoom = useRoomStore((state) => state.getRoom)
	const rooms = useRoomStore((state) => state.rooms)

	const [checkInPlantId, setCheckInPlantId] = useState<string | null>(null)
	const [detailsPlantId, setDetailsPlantId] = useState<string | null>(null)
	const [viewMode, setViewMode] = useState<ViewMode>('all')

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = plants.findIndex((p) => p.id === active.id)
			const newIndex = plants.findIndex((p) => p.id === over.id)

			const newOrder = arrayMove(plants, oldIndex, newIndex)
			reorderPlants(newOrder.map((p) => p.id))
		}
	}

	if (plants.length === 0) {
		return (
			<Box textAlign="center" py={12}>
				<Text fontSize="4xl" mb={2}>
					🪴
				</Text>
				<Text fontSize="lg" color="gray.600" mb={1}>
					No plants yet
				</Text>
				<Text fontSize="sm" color="gray.500">
					Add your first plant to get started!
				</Text>
			</Box>
		)
	}

	// Calculate next check date
	const getNextCheckDate = (plantId: string, checkFrequency: number) => {
		const checkIns = getPlantCheckIns(plantId)
		const plant = plants.find((p) => p.id === plantId)

		if (!plant) return null

		let baseDate: Date
		if (checkIns.length > 0) {
			baseDate = new Date(checkIns[0].date)
		} else {
			baseDate = new Date(plant.dateAdded)
		}

		const nextDate = new Date(baseDate)
		nextDate.setDate(nextDate.getDate() + checkFrequency)

		return nextDate
	}

	// Prepare plant data with metadata
	const plantsWithData = plants.map((plant) => {
		const species = getPlantById(plant.speciesId)
		if (!species) return null

		const status = getPlantStatus(plant.id, species.watering.checkFrequency)
		const checkIns = getPlantCheckIns(plant.id)
		const room = getRoom(plant.roomId)
		const hasCheckIns = checkIns.length > 0
		const nextCheckDate = getNextCheckDate(plant.id, species.watering.checkFrequency)

		return {
			plant,
			species,
			room,
			status,
			checkIns,
			hasCheckIns,
			nextCheckDate,
		}
	}).filter((item): item is NonNullable<typeof item> => item !== null)

	// Apply view-specific sorting/grouping
	let organizedPlants: Array<{
		title?: string
		plants: typeof plantsWithData
	}> = []

	switch (viewMode) {
		case 'all':
			organizedPlants = [{ plants: plantsWithData }]
			break

		case 'by-room':
			// Group by room
			const roomGroups = new Map<string, typeof plantsWithData>()
			rooms.forEach(room => {
				roomGroups.set(room.id, [])
			})
			plantsWithData.forEach(item => {
				const group = roomGroups.get(item.plant.roomId)
				if (group) group.push(item)
			})
			organizedPlants = Array.from(roomGroups.entries()).map(([roomId, plants]) => ({
				title: getRoom(roomId)?.name || 'Unknown Room',
				plants,
			})).filter(group => group.plants.length > 0)
			break

		case 'by-health':
			// Sort by health condition (worse to better)
			const healthOrder = { 'struggling': 0, 'needs-attention': 1, 'just-added': 2, 'healthy': 3 }
			const sortedByHealth = [...plantsWithData].sort((a, b) => {
				return healthOrder[a.plant.condition as keyof typeof healthOrder] -
				       healthOrder[b.plant.condition as keyof typeof healthOrder]
			})
			organizedPlants = [{ title: 'By Health (Worse → Better)', plants: sortedByHealth }]
			break

		case 'by-priority':
			// Sort by check-in priority
			const priorityOrder = { 'needs-attention': 0, 'may-have-issue': 1, 'check-soon': 2, 'recently-checked': 3 }
			const sortedByPriority = [...plantsWithData].sort((a, b) => {
				return priorityOrder[a.status as keyof typeof priorityOrder] -
				       priorityOrder[b.status as keyof typeof priorityOrder]
			})
			organizedPlants = [{ title: 'By Check Priority', plants: sortedByPriority }]
			break

		case 'by-next-check':
			// Sort by next check date (soonest first)
			const sortedByNextCheck = [...plantsWithData].sort((a, b) => {
				if (!a.nextCheckDate) return 1
				if (!b.nextCheckDate) return -1
				return a.nextCheckDate.getTime() - b.nextCheckDate.getTime()
			})
			organizedPlants = [{ title: 'By Next Check Date', plants: sortedByNextCheck }]
			break

		case 'by-care-level':
			// Group by care level
			const careLevelGroups: Record<string, typeof plantsWithData> = {
				beginner: [],
				intermediate: [],
				advanced: [],
			}
			plantsWithData.forEach(item => {
				careLevelGroups[item.species.careLevel].push(item)
			})
			organizedPlants = Object.entries(careLevelGroups)
				.filter(([_, plants]) => plants.length > 0)
				.map(([level, plants]) => ({
					title: `${level.charAt(0).toUpperCase() + level.slice(1)} Plants`,
					plants,
				}))
			break
	}

	const isDragEnabled = viewMode === 'all'

	return (
		<>
			{/* View Selector and Actions */}
			<Box mb={4}>
				<HStack justify="space-between" flexWrap="wrap" gap={3}>
					{/* View Dropdown */}
					<HStack gap={2} flex={1} minW={{ base: 'full', sm: '200px' }}>
						<Text fontSize="sm" fontWeight="medium" color="gray.700" flexShrink={0}>
							View:
						</Text>
						<NativeSelectRoot size="sm" flex={1}>
							<NativeSelectField
								value={viewMode}
								onChange={(e) => setViewMode(e.target.value as ViewMode)}
							>
								<option value="all">📋 All Plants</option>
								<option value="by-room">🏠 By Room</option>
								<option value="by-health">💊 By Health</option>
								<option value="by-priority">🔴 By Priority</option>
								<option value="by-next-check">📅 By Next Check</option>
								<option value="by-care-level">🎓 By Care Level</option>
							</NativeSelectField>
						</NativeSelectRoot>
					</HStack>

					{/* Settings and Room Management Buttons */}
					<HStack gap={2}>
						<Button
							size="sm"
							variant="outline"
							onClick={onOpenRoomManagement}
							display={{ base: 'none', sm: 'flex' }}
						>
							🏠 Rooms
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={onOpenSettings}
							display={{ base: 'none', sm: 'flex' }}
						>
							⚙️ Settings
						</Button>

						{/* Mobile Icons */}
						<Button
							size="sm"
							variant="outline"
							onClick={onOpenRoomManagement}
							display={{ base: 'flex', sm: 'none' }}
							px={2}
						>
							🏠
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={onOpenSettings}
							display={{ base: 'flex', sm: 'none' }}
							px={2}
						>
							⚙️
						</Button>
					</HStack>
				</HStack>

				{viewMode !== 'all' && (
					<Text fontSize="xs" color="gray.500" mt={2}>
						💡 Drag and drop is only available in "All" view
					</Text>
				)}
			</Box>

			{/* Plant Lists */}
			<VStack gap={6} align="stretch">
				{organizedPlants.map((group, groupIndex) => (
					<Box key={groupIndex}>
						{group.title && (
							<Heading size="sm" mb={3} color="gray.700">
								{group.title}
							</Heading>
						)}

						{group.plants.length === 0 ? (
							<Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
								No plants in this group
							</Text>
						) : isDragEnabled ? (
							<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
								<SortableContext items={group.plants.map((item) => item.plant.id)} strategy={verticalListSortingStrategy}>
									<VStack gap={4} align="stretch">
										{group.plants.map((item) => (
											<SortablePlantCard
												key={item.plant.id}
												plant={item.plant}
												species={item.species}
												room={item.room}
												status={item.status}
												checkIns={item.checkIns}
												hasCheckIns={item.hasCheckIns}
												nextCheckDate={item.nextCheckDate}
												onCheckIn={() => setCheckInPlantId(item.plant.id)}
												onDetails={() => setDetailsPlantId(item.plant.id)}
												isDragDisabled={false}
											/>
										))}
									</VStack>
								</SortableContext>
							</DndContext>
						) : (
							<VStack gap={4} align="stretch">
								{group.plants.map((item) => (
									<SortablePlantCard
										key={item.plant.id}
										plant={item.plant}
										species={item.species}
										room={item.room}
										status={item.status}
										checkIns={item.checkIns}
										hasCheckIns={item.hasCheckIns}
										nextCheckDate={item.nextCheckDate}
										onCheckIn={() => setCheckInPlantId(item.plant.id)}
										onDetails={() => setDetailsPlantId(item.plant.id)}
										isDragDisabled={true}
									/>
								))}
							</VStack>
						)}
					</Box>
				))}
			</VStack>

			{/* Check-in Modal */}
			{checkInPlantId && (
				<CheckInModal
					plantId={checkInPlantId}
					isOpen={!!checkInPlantId}
					onClose={() => setCheckInPlantId(null)}
				/>
			)}

			{/* Plant Details Modal */}
			{detailsPlantId !== null && (
				<PlantDetailsModal
					plantId={detailsPlantId}
					isOpen={true}
					onClose={() => setDetailsPlantId(null)}
				/>
			)}
		</>
	)
}
