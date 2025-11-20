import { useState } from 'react'
import { Box, Text, VStack, Card, HStack, Badge, Button } from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore } from '../store/roomStore'
import { getPlantById } from '../data/plantDatabase'
import { CheckInModal } from './CheckInModal'

export function PlantList() {
	const plants = usePlantStore((state) => state.plants)
	const getPlantStatus = usePlantStore((state) => state.getPlantStatus)
	const getDaysSinceLastCheckIn = usePlantStore((state) => state.getDaysSinceLastCheckIn)
	const getRoom = useRoomStore((state) => state.getRoom)

	const [checkInPlantId, setCheckInPlantId] = useState<string | null>(null)

	if (plants.length === 0) {
		return (
			<Box textAlign="center" py={12}>
				<Text fontSize="4xl" mb={2}>🪴</Text>
				<Text fontSize="lg" color="gray.600" mb={1}>
					No plants yet
				</Text>
				<Text fontSize="sm" color="gray.500">
					Add your first plant to get started!
				</Text>
			</Box>
		)
	}

	return (
		<>
			<VStack gap={4} align="stretch">
				{plants.map((plant) => {
					const species = getPlantById(plant.speciesId)
					const room = getRoom(plant.roomId)
					if (!species) return null

					const status = getPlantStatus(plant.id, species.watering.checkFrequency)
					const daysSince = getDaysSinceLastCheckIn(plant.id)

					// Status colors
					const statusConfig = {
						'needs-attention': { color: 'red', icon: '🔴', label: 'Needs attention' },
						'check-soon': { color: 'yellow', icon: '🟡', label: 'Check soon' },
						'recently-checked': { color: 'green', icon: '🟢', label: 'Recently checked' },
						'may-have-issue': { color: 'orange', icon: '⚠️', label: 'May have issue' },
					}

					const currentStatus = statusConfig[status]

					// Condition emoji
					const conditionEmoji = {
						'just-added': '🆕',
						'healthy': '🌿',
						'needs-attention': '⚠️',
						'struggling': '🥀',
					}

					return (
						<Card.Root key={plant.id} variant="outline">
							<Card.Body p={{ base: 3, md: 4 }}>
								<VStack gap={3} align="stretch">
									{/* Header */}
									<HStack justify="space-between" align="start" flexWrap="wrap" gap={2}>
										<VStack align="start" gap={1} flex={1} minW="0">
											<HStack flexWrap="wrap" gap={2}>
												<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" lineClamp={1}>
													{conditionEmoji[plant.condition]} {plant.customName}
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

										<VStack gap={2} minW={{ base: 'full', sm: 'auto' }}>
											<Button
												size="sm"
												colorScheme="green"
												width={{ base: 'full', sm: 'auto' }}
												onClick={() => setCheckInPlantId(plant.id)}
											>
												Check-in
											</Button>
											<Button
												size="sm"
												variant="ghost"
												width={{ base: 'full', sm: 'auto' }}
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
											Last check: {daysSince === 0 ? 'Today' : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`}
										</Text>
										{species.watering.checkFrequency && (
											<Text>
												• Check every {species.watering.checkFrequency} days
											</Text>
										)}
									</HStack>
								</VStack>
							</Card.Body>
						</Card.Root>
					)
				})}
			</VStack>

			{/* Check-in Modal */}
			{checkInPlantId && (
				<CheckInModal
					plantId={checkInPlantId}
					isOpen={!!checkInPlantId}
					onClose={() => setCheckInPlantId(null)}
				/>
			)}
		</>
	)
}
