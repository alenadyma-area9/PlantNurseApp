import { Box, Text, VStack, Card, HStack, Badge, Button } from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { getPlantById } from '../data/plantDatabase'

export function PlantList() {
	const plants = usePlantStore((state) => state.plants)
	const getPlantStatus = usePlantStore((state) => state.getPlantStatus)
	const getDaysSinceLastCheckIn = usePlantStore((state) => state.getDaysSinceLastCheckIn)

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
		<VStack gap={4} align="stretch">
			{plants.map((plant) => {
				const species = getPlantById(plant.speciesId)
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

				return (
					<Card.Root key={plant.id} variant="outline">
						<Card.Body>
							<HStack justify="space-between" align="start">
								<VStack align="start" gap={1} flex={1}>
									<HStack>
										<Text fontSize="xl" fontWeight="bold">
											{plant.customName}
										</Text>
										<Badge colorScheme={currentStatus.color} fontSize="xs">
											{currentStatus.icon} {currentStatus.label}
										</Badge>
									</HStack>

									<Text fontSize="sm" color="gray.600">
										{species.commonName} • {species.careLevel}
									</Text>

									<Text fontSize="xs" color="gray.500">
										Last check: {daysSince === 0 ? 'Today' : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`}
									</Text>

									{species.watering.checkFrequency && (
										<Text fontSize="xs" color="gray.500">
											Check every {species.watering.checkFrequency} days
										</Text>
									)}
								</VStack>

								<VStack>
									<Button size="sm" colorScheme="green">
										Check-in
									</Button>
									<Button size="sm" variant="ghost">
										Details
									</Button>
								</VStack>
							</HStack>
						</Card.Body>
					</Card.Root>
				)
			})}
		</VStack>
	)
}
