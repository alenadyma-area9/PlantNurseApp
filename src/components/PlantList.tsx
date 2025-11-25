import { useState } from 'react'
import { Box, Text, VStack, Card, HStack, Badge, Button, Image as ChakraImage, Heading } from '@chakra-ui/react'
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
import { getLightLevelIcon } from '../utils/lightLevelUtils'

export type ViewMode = 'all' | 'by-room' | 'by-health' | 'by-next-check' | 'by-care-level'

interface SortablePlantCardProps {
	plant: any
	species: any
	room: any
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

	// Plant HEALTH condition - how the plant is feeling (most important!)
	const conditionConfig = {
		'healthy': { color: 'green', icon: '✓', label: 'Healthy' },
		'needs-attention': { color: 'orange', icon: '⚠️', label: 'Needs attention' },
		'struggling': { color: 'red', icon: '🥀', label: 'Struggling' },
	}
	// Fallback to 'healthy' for old 'just-added' conditions or any invalid conditions
	const plantCondition = conditionConfig[plant.condition as keyof typeof conditionConfig] || conditionConfig['healthy']

	return (
		<Card.Root
			key={plant.id}
			variant="outline"
			ref={setNodeRef}
			style={style}
			userSelect="none"
			maxW="800px"
			mx="auto"
			width="100%"
		>
			<Card.Body p={{ base: 3, md: 4 }}>
				<VStack gap={3} align="stretch" userSelect="auto">
					{/* Header: Drag handle + Plant Name */}
					<HStack gap={2}>
						{!isDragDisabled && (
							<Box
								{...attributes}
								{...listeners}
								cursor="grab"
								_active={{ cursor: 'grabbing' }}
								color="gray.400"
								fontSize="xl"
								userSelect="none"
								flexShrink={0}
							>
								⋮⋮
							</Box>
						)}
						<Box
							flex={1}
							cursor="pointer"
							onClick={onDetails}
							_hover={{ bg: 'green.50' }}
							borderRadius="md"
							px={2}
							py={1}
							mx={-2}
							transition="background-color 0.2s"
						>
							<Text
								fontSize={{ base: 'lg', md: 'xl' }}
								fontWeight="bold"
								lineClamp={1}
								color="gray.800"
								_groupHover={{ color: 'green.600' }}
							>
								{plant.customName}
							</Text>
						</Box>
					</HStack>

					{/* Content Row: Photo + Plant Info */}
					<HStack gap={4} align="start">
						{/* Photo - Fixed space - Clickable */}
						<Box
							flexShrink={0}
							width="80px"
							height="80px"
							cursor="pointer"
							onClick={onDetails}
							_hover={{ opacity: 0.8, transform: 'scale(1.05)' }}
							transition="all 0.2s"
						>
							{plant.photoUrl ? (
								<ChakraImage
									src={plant.photoUrl}
									alt={plant.customName}
									width="80px"
									height="80px"
									objectFit="cover"
									borderRadius="md"
								/>
							) : (
								<Box
									width="80px"
									height="80px"
									bg="gray.100"
									borderRadius="md"
									display="flex"
									alignItems="center"
									justifyContent="center"
									color="gray.400"
									fontSize="2xl"
								>
									🪴
								</Box>
							)}
						</Box>

						{/* Plant Info */}
						<VStack align="start" gap={2} flex={1} minW={0}>
							{/* MOST IMPORTANT: Plant Health Status */}
							<Badge colorScheme={plantCondition.color} fontSize="sm" px={2} py={1}>
								{plantCondition.icon} {plantCondition.label}
							</Badge>

							{/* Less important info */}
							<VStack align="start" gap={1} fontSize="xs" color="gray.600">
								{/* Species Name + Care Level on same row */}
								{!plant.isCustomPlant && species && (
									<HStack gap={2} flexWrap="wrap">
										<Text lineClamp={1} fontWeight="medium">
											{species.commonName}
										</Text>
										<Badge
											colorScheme={
												species.careLevel === 'beginner' ? 'green' :
												species.careLevel === 'intermediate' ? 'yellow' :
												'purple'
											}
											fontSize="xs"
										>
											{species.careLevel === 'beginner' ? '🌱 Easy care' :
											 species.careLevel === 'intermediate' ? '🌿 Moderate care' :
											 '🎓 Advanced'}
										</Badge>
									</HStack>
								)}

								{/* Custom plant: scientific name + badge */}
								{plant.isCustomPlant && (
									<HStack gap={2} flexWrap="wrap">
										{plant.customScientificName && (
											<Text lineClamp={1} fontWeight="medium">
												{plant.customScientificName}
											</Text>
										)}
										<Badge colorScheme="blue" fontSize="xs">
											🌱 Custom plant
										</Badge>
									</HStack>
								)}

								{/* Room Info */}
								{room && (
									<Text lineClamp={1}>
										📍 {room.name} ({getLightLevelIcon(room.lightLevel)} {room.lightLevel})
									</Text>
								)}
							</VStack>
						</VStack>
					</HStack>

					{/* Footer: Time + Check Schedule + Buttons */}
					<HStack
						gap={2}
						flexWrap="wrap"
						justify="space-between"
						align="center"
						pt={2}
						borderTopWidth={1}
						borderColor="gray.100"
					>
						<VStack align="start" gap={0.5} flex={1} minW={0} fontSize="xs" color="gray.600">
							<Text lineClamp={1}>
								{hasCheckIns
									? `Last check: ${formatTimeAgo(checkIns[0].date)}`
									: `Added ${formatTimeAgo(plant.dateAdded)}`}
							</Text>
							{nextCheckDate && (
								<Text lineClamp={1}>
									Next check: {nextCheckDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (every {plant.isCustomPlant ? plant.customCheckFrequency : species?.watering.checkFrequency} days)
								</Text>
							)}
						</VStack>

						{/* Action Buttons */}
						<Box
							flexShrink={0}
							onPointerDown={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
						>
							<HStack gap={2}>
								<Button
									size={{ base: 'md', md: 'sm' }}
									variant="outline"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										onDetails()
									}}
									onPointerDown={(e) => e.stopPropagation()}
									minH="44px"
								>
									Details
								</Button>
								<Button
									size={{ base: 'md', md: 'sm' }}
									colorScheme="green"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										onCheckIn()
									}}
									onPointerDown={(e) => e.stopPropagation()}
									minH="44px"
								>
									Check-in
								</Button>
							</HStack>
						</Box>
					</HStack>
				</VStack>
			</Card.Body>
		</Card.Root>
	)
}

interface PlantListProps {
	viewMode: ViewMode
}

export function PlantList({ viewMode }: PlantListProps) {
	const plants = usePlantStore((state) => state.plants)
	const getPlantStatus = usePlantStore((state) => state.getPlantStatus)
	const getPlantCheckIns = usePlantStore((state) => state.getPlantCheckIns)
	const reorderPlants = usePlantStore((state) => state.reorderPlants)
	const getRoom = useRoomStore((state) => state.getRoom)
	const rooms = useRoomStore((state) => state.rooms)

	const [checkInPlantId, setCheckInPlantId] = useState<string | null>(null)
	const [detailsPlantId, setDetailsPlantId] = useState<string | null>(null)

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
		// For custom plants, species will be null - that's OK
		const species = plant.isCustomPlant ? null : getPlantById(plant.speciesId)

		// Skip if it's a database plant but species not found (data issue)
		if (!plant.isCustomPlant && !species) return null

		const checkFrequency = plant.isCustomPlant
			? (plant.customCheckFrequency || 7)
			: (species?.watering.checkFrequency || 7)

		const status = getPlantStatus(plant.id, checkFrequency)
		const checkIns = getPlantCheckIns(plant.id)
		const room = getRoom(plant.roomId)
		const hasCheckIns = checkIns.length > 0
		const nextCheckDate = getNextCheckDate(plant.id, checkFrequency)

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
			const healthOrder = { 'struggling': 0, 'needs-attention': 1, 'healthy': 2 }
			const sortedByHealth = [...plantsWithData].sort((a, b) => {
				return healthOrder[a.plant.condition as keyof typeof healthOrder] -
				       healthOrder[b.plant.condition as keyof typeof healthOrder]
			})
			organizedPlants = [{ title: 'By Health (Worse → Better)', plants: sortedByHealth }]
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
				custom: [],
			}
			plantsWithData.forEach(item => {
				if (item.plant.isCustomPlant) {
					careLevelGroups['custom'].push(item)
				} else if (item.species) {
					careLevelGroups[item.species.careLevel].push(item)
				}
			})
			organizedPlants = Object.entries(careLevelGroups)
				.filter(([_, plants]) => plants.length > 0)
				.map(([level, plants]) => ({
					title: level === 'custom'
						? 'Custom Plants'
						: `${level.charAt(0).toUpperCase() + level.slice(1)} Plants`,
					plants,
				}))
			break
	}

	const isDragEnabled = viewMode === 'all'

	return (
		<>
			{/* Plant Lists */}
			<VStack gap={6} align="stretch">
				{organizedPlants.map((group, groupIndex) => (
					<Box key={groupIndex}>
						{group.title && (
							<Box maxW="800px" mx="auto" width="100%">
								<Heading size="sm" mb={3} color="gray.700">
									{group.title}
								</Heading>
							</Box>
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
