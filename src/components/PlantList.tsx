import { useState } from 'react'
import { Box, Text, VStack, Card, HStack, Badge, Button, Image as ChakraImage } from '@chakra-ui/react'
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
}: SortablePlantCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: plant.id,
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

export function PlantList() {
	const plants = usePlantStore((state) => state.plants)
	const getPlantStatus = usePlantStore((state) => state.getPlantStatus)
	const getPlantCheckIns = usePlantStore((state) => state.getPlantCheckIns)
	const reorderPlants = usePlantStore((state) => state.reorderPlants)
	const getRoom = useRoomStore((state) => state.getRoom)

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
			// Use last check-in date
			baseDate = new Date(checkIns[0].date)
		} else {
			// Use date added
			baseDate = new Date(plant.dateAdded)
		}

		const nextDate = new Date(baseDate)
		nextDate.setDate(nextDate.getDate() + checkFrequency)

		return nextDate
	}

	return (
		<>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={plants.map((p) => p.id)} strategy={verticalListSortingStrategy}>
					<VStack gap={4} align="stretch">
						{plants.map((plant) => {
							const species = getPlantById(plant.speciesId)
							const room = getRoom(plant.roomId)
							if (!species) return null

							const status = getPlantStatus(plant.id, species.watering.checkFrequency)
							const checkIns = getPlantCheckIns(plant.id)
							const hasCheckIns = checkIns.length > 0
							const nextCheckDate = getNextCheckDate(plant.id, species.watering.checkFrequency)

							return (
								<SortablePlantCard
									key={plant.id}
									plant={plant}
									species={species}
									room={room}
									status={status}
									checkIns={checkIns}
									hasCheckIns={hasCheckIns}
									nextCheckDate={nextCheckDate}
									onCheckIn={() => setCheckInPlantId(plant.id)}
									onDetails={() => setDetailsPlantId(plant.id)}
								/>
							)
						})}
					</VStack>
				</SortableContext>
			</DndContext>

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
