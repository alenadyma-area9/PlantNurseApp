import { useState } from 'react'
import {
	DialogRoot,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogFooter,
	DialogTitle,
	DialogCloseTrigger,
} from '@chakra-ui/react'
import {
	Button,
	VStack,
	Text,
	Box,
	HStack,
	Badge,
	Card,
} from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore } from '../store/roomStore'
import { getPlantById } from '../data/plantDatabase'
import { EditPlantModal } from './EditPlantModal'

interface PlantDetailsModalProps {
	plantId: string
	isOpen: boolean
	onClose: () => void
}

export function PlantDetailsModal({ plantId, isOpen, onClose }: PlantDetailsModalProps) {
	const plant = usePlantStore((state) => state.plants.find((p) => p.id === plantId))
	const removePlant = usePlantStore((state) => state.removePlant)
	const getPlantCheckIns = usePlantStore((state) => state.getPlantCheckIns)
	const getDaysSinceLastCheckIn = usePlantStore((state) => state.getDaysSinceLastCheckIn)
	const getRoom = useRoomStore((state) => state.getRoom)

	const [isEditOpen, setIsEditOpen] = useState(false)
	const [activeTab, setActiveTab] = useState<'care' | 'history' | 'tips'>('care')

	if (!plant) return null

	const species = getPlantById(plant.speciesId)
	const room = getRoom(plant.roomId)
	const checkIns = getPlantCheckIns(plant.id)
	const daysSince = getDaysSinceLastCheckIn(plant.id)

	if (!species) return null

	const handleDelete = () => {
		if (window.confirm(`Are you sure you want to delete ${plant.customName}? This cannot be undone.`)) {
			removePlant(plant.id)
			onClose()
		}
	}

	// Condition emoji
	const conditionEmoji = {
		'just-added': '🆕',
		'healthy': '🌿',
		'needs-attention': '⚠️',
		'struggling': '🥀',
	}

  return (
	<>
	  <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl" placement="center">
		<DialogContent
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
								<VStack align="start" gap={2}>
									<Text fontSize="lg" fontWeight="bold" color="green.800">
										{species.commonName}
									</Text>
									<Text fontSize="sm" color="green.700">
										{species.scientificName}
									</Text>
									<HStack flexWrap="wrap" gap={2}>
										<Badge colorScheme="green" fontSize="xs">
											{species.careLevel}
										</Badge>
										<Badge colorScheme="blue" fontSize="xs">
											{plant.size}
										</Badge>
										{species.petSafe && (
											<Badge colorScheme="purple" fontSize="xs">
												Pet safe
											</Badge>
										)}
									</HStack>

									<Box width="full" pt={2} borderTopWidth={1} borderColor="green.200">
										<VStack align="stretch" gap={1} fontSize="sm">
											<HStack justify="space-between">
												<Text color="gray.600">Location:</Text>
												<Text fontWeight="medium">{room?.name || 'Unknown'}</Text>
											</HStack>
											<HStack justify="space-between">
												<Text color="gray.600">Last check-in:</Text>
												<Text fontWeight="medium">
													{daysSince === 0 ? 'Today' : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`}
												</Text>
											</HStack>
											<HStack justify="space-between">
												<Text color="gray.600">Total check-ins:</Text>
												<Text fontWeight="medium">{checkIns.length}</Text>
											</HStack>
										</VStack>
									</Box>
								</VStack>
							</Box>

							{/* Tab Buttons */}
							<HStack gap={2} borderBottomWidth={1} pb={2}>
								<Button
									size="sm"
									variant={activeTab === 'care' ? 'solid' : 'ghost'}
									colorScheme={activeTab === 'care' ? 'green' : 'gray'}
									onClick={() => setActiveTab('care')}
								>
									Care Guide
								</Button>
								<Button
									size="sm"
									variant={activeTab === 'history' ? 'solid' : 'ghost'}
									colorScheme={activeTab === 'history' ? 'green' : 'gray'}
									onClick={() => setActiveTab('history')}
								>
									History ({checkIns.length})
								</Button>
								<Button
									size="sm"
									variant={activeTab === 'tips' ? 'solid' : 'ghost'}
									colorScheme={activeTab === 'tips' ? 'green' : 'gray'}
									onClick={() => setActiveTab('tips')}
								>
									Tips
								</Button>
							</HStack>

							{/* Care Guide Tab */}
							{activeTab === 'care' && (
								<VStack gap={3} align="stretch">
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
														Every {species.watering.checkFrequency} days
													</Text>
												</Box>
												<Box>
													<Text color="gray.600" fontSize="xs">How to check:</Text>
													<Text fontWeight="medium">
														Stick finger in soil {species.watering.soilCheckDepth}
													</Text>
												</Box>
												<Box>
													<Text color="gray.600" fontSize="xs">Soil preference:</Text>
													<Text fontWeight="medium" textTransform="capitalize">
														{species.watering.soilPreference.replace('-', ' ')}
													</Text>
												</Box>
												{species.watering.seasonalNotes && (
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
														{species.light.level.replace('-', ' ')}
													</Text>
												</Box>
												<Text>{species.light.description}</Text>
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
														{species.temperature.min}°F - {species.temperature.max}°F
													</Text>
													<Text fontSize="xs" color="gray.500">
														Ideal: {species.temperature.ideal}
													</Text>
												</Box>
												<Box>
													<Text color="gray.600" fontSize="xs">Humidity preference:</Text>
													<Text fontWeight="medium" textTransform="capitalize">
														{species.humidity.preference}
													</Text>
													<Text fontSize="xs">{species.humidity.description}</Text>
												</Box>
											</VStack>
										</Card.Body>
									</Card.Root>
								</VStack>
							)}

							{/* History Tab */}
							{activeTab === 'history' && (
								<VStack gap={3} align="stretch">
									{checkIns.length === 0 ? (
										<Box textAlign="center" py={8}>
											<Text fontSize="lg" color="gray.500">
												No check-ins yet
											</Text>
											<Text fontSize="sm" color="gray.400">
												Start tracking your plant's progress!
											</Text>
										</Box>
									) : (
										checkIns.map((checkIn) => (
											<Card.Root key={checkIn.id} variant="outline" size="sm">
												<Card.Body>
													<VStack align="stretch" gap={2}>
														<HStack justify="space-between">
															<Text fontSize="sm" fontWeight="bold">
																{new Date(checkIn.date).toLocaleDateString('en-US', {
																	month: 'short',
																	day: 'numeric',
																	year: 'numeric',
																})}
															</Text>
															<Text fontSize="xs" color="gray.500">
																{new Date(checkIn.date).toLocaleTimeString('en-US', {
																	hour: 'numeric',
																	minute: '2-digit',
																})}
															</Text>
														</HStack>

														<HStack flexWrap="wrap" gap={2} fontSize="xs">
															<Badge colorScheme="blue">
																💧 {checkIn.soilMoisture.replace('-', ' ')}
															</Badge>
															{checkIn.leafCondition.map((condition) => (
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
												</Card.Body>
											</Card.Root>
										))
									)}
								</VStack>
							)}

							{/* Tips Tab */}
							{activeTab === 'tips' && (
								<VStack gap={4} align="stretch">
									{/* Quick Tips */}
									<Box>
										<Text fontSize="md" fontWeight="bold" mb={3}>
											💡 Quick Tips
										</Text>
										<VStack align="stretch" gap={2}>
											{species.quickTips.map((tip, index) => (
												<Card.Root key={index} variant="subtle" size="sm">
													<Card.Body>
														<Text fontSize="sm">{tip}</Text>
													</Card.Body>
												</Card.Root>
											))}
										</VStack>
									</Box>

									{/* Common Issues */}
									<Box>
										<Text fontSize="md" fontWeight="bold" mb={3}>
											🩺 Common Issues
										</Text>
										<VStack align="stretch" gap={3}>
											{species.commonIssues.map((issue, index) => (
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
								</VStack>
							)}
						</VStack>
					</DialogBody>

					<DialogFooter>
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
