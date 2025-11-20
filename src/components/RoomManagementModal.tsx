import { useState, useCallback } from 'react'
import { useEscapeKey, useEnterKey } from '../hooks/useKeyboardShortcut'
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
	Card,
	Badge,
	Input,
	NativeSelectRoot,
	NativeSelectField,
} from '@chakra-ui/react'
import { Tooltip } from './Tooltip'
import { useRoomStore, DEFAULT_ROOM_ID } from '../store/roomStore'
import { usePlantStore } from '../store/plantStore'
import type { LightLevel, WindowDirection, RoomTemperature } from '../types'

interface RoomManagementModalProps {
	isOpen: boolean
	onClose: () => void
	nested?: boolean // Indicates if this modal is opened from another modal
}

type ViewMode = 'list' | 'add' | 'edit'

export function RoomManagementModal({ isOpen, onClose, nested = false }: RoomManagementModalProps) {
	const rooms = useRoomStore((state) => state.rooms)
	const addRoom = useRoomStore((state) => state.addRoom)
	const updateRoom = useRoomStore((state) => state.updateRoom)
	const removeRoom = useRoomStore((state) => state.removeRoom)
	const plants = usePlantStore((state) => state.plants)

	const [viewMode, setViewMode] = useState<ViewMode>('list')
	const [editingRoomId, setEditingRoomId] = useState<string | null>(null)

	// Form state
	const [name, setName] = useState('')
	const [lightLevel, setLightLevel] = useState<LightLevel>('medium')
	const [windowDirection, setWindowDirection] = useState<WindowDirection | ''>('')
	const [temperature, setTemperature] = useState<RoomTemperature>('moderate')
	const [humidity, setHumidity] = useState<'low' | 'medium' | 'high'>('medium')
	const [notes, setNotes] = useState('')

	// Use higher z-index when nested
	const zIndex = nested ? 1600 : 1400
	const backdropZIndex = nested ? 1550 : 1350

	const handleAddNew = () => {
		setViewMode('add')
		setName('')
		setLightLevel('medium')
		setWindowDirection('')
		setTemperature('moderate')
		setHumidity('medium')
		setNotes('')
	}

	const handleEdit = (roomId: string) => {
		const room = rooms.find((r) => r.id === roomId)
		if (room) {
			setEditingRoomId(roomId)
			setName(room.name)
			setLightLevel(room.lightLevel)
			setWindowDirection(room.windowDirection || '')
			setTemperature(room.temperature)
			setHumidity(room.humidity || 'medium')
			setNotes(room.notes || '')
			setViewMode('edit')
		}
	}

	const handleSave = () => {
		if (!name.trim()) return

		if (viewMode === 'add') {
			addRoom({
				name: name.trim(),
				lightLevel,
				windowDirection: windowDirection || undefined,
				temperature,
				humidity,
				notes: notes.trim() || undefined,
			})
		} else if (viewMode === 'edit' && editingRoomId) {
			updateRoom(editingRoomId, {
				name: name.trim(),
				lightLevel,
				windowDirection: windowDirection || undefined,
				temperature,
				humidity,
				notes: notes.trim() || undefined,
			})
		}

		setViewMode('list')
		setEditingRoomId(null)
	}

	const handleDelete = (roomId: string) => {
		const plantsInRoom = plants.filter((p) => p.roomId === roomId)
		if (plantsInRoom.length > 0) {
			alert(`Cannot delete room: ${plantsInRoom.length} plant(s) are located here. Move them first.`)
			return
		}

		if (window.confirm('Are you sure you want to delete this room?')) {
			removeRoom(roomId)
		}
	}

	const handleCancel = () => {
		setViewMode('list')
		setEditingRoomId(null)
	}

	const getPlantsInRoom = (roomId: string) => {
		return plants.filter((p) => p.roomId === roomId).length
	}

	// Keyboard shortcuts
	const handleEnter = useCallback(() => {
		if (viewMode === 'list') {
			onClose()
		} else if ((viewMode === 'add' || viewMode === 'edit') && name.trim()) {
			handleSave()
		}
	}, [viewMode, name])

	useEscapeKey(() => {
		if (viewMode === 'list') {
			onClose()
		} else {
			handleCancel()
		}
	}, isOpen)

	useEnterKey(handleEnter, isOpen)

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="md" placement="center">
			<DialogBackdrop zIndex={backdropZIndex} />
			<DialogContent
				maxW={{ base: '95vw', sm: '90vw', md: '500px' }}
				maxH="90vh"
				position="fixed"
				top="50%"
				left="50%"
				transform="translate(-50%, -50%)"
				zIndex={zIndex}
				bg="white"
				borderRadius="lg"
				boxShadow="xl"
			>
				<DialogHeader>
					<DialogTitle>
						{viewMode === 'list' ? '🏠 Room Management' : viewMode === 'add' ? '➕ Add New Room' : '✏️ Edit Room'}
					</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>

				<DialogBody overflowY="auto" maxH="60vh">
					{/* List View */}
					{viewMode === 'list' && (
						<VStack gap={3} align="stretch">
							{rooms.map((room) => {
								const plantCount = getPlantsInRoom(room.id)
								const plantsInRoom = plants.filter((p) => p.roomId === room.id)
								const plantNames = plantsInRoom.map((p) => p.customName).join(', ')
								const isDefault = room.id === DEFAULT_ROOM_ID

								return (
									<Card.Root key={room.id} variant="outline">
										<Card.Body p={3}>
											<VStack align="stretch" gap={2}>
												<HStack justify="space-between" align="start">
													<VStack align="start" gap={1} flex={1}>
														<HStack>
															<Text fontWeight="bold" fontSize="sm">{room.name}</Text>
															{isDefault && (
																<Badge colorScheme="blue" fontSize="xs">
																	Default
																</Badge>
															)}
														</HStack>
														<HStack gap={2} fontSize="xs" color="gray.600" flexWrap="wrap">
															<Text>💡 {room.lightLevel}</Text>
															<Text>🌡️ {room.temperature}</Text>
														</HStack>
													</VStack>

													<VStack gap={1} align="end">
														<Tooltip
															content={plantCount > 0 ? plantNames : 'No plants'}
															positioning={{ placement: 'top' }}
														>
															<Badge colorScheme="green" fontSize="xs" cursor="help">
																{plantCount} plant{plantCount !== 1 ? 's' : ''}
															</Badge>
														</Tooltip>
														<HStack gap={1}>
															<Button size="xs" variant="outline" onClick={() => handleEdit(room.id)}>
																Edit
															</Button>
															{!isDefault && (
																<Button
																	size="xs"
																	colorScheme="red"
																	variant="ghost"
																	onClick={() => handleDelete(room.id)}
																>
																	Delete
																</Button>
															)}
														</HStack>
													</VStack>
												</HStack>
											</VStack>
										</Card.Body>
									</Card.Root>
								)
							})}

							<Button colorScheme="green" onClick={handleAddNew} mt={2}>
								+ Add New Room
							</Button>
						</VStack>
					)}

					{/* Add/Edit Form */}
					{(viewMode === 'add' || viewMode === 'edit') && (
						<VStack gap={4} align="stretch">
							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Room Name *
								</Text>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g., Living Room, Bedroom, Kitchen"
									autoFocus
								/>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Light Level *
								</Text>
								<NativeSelectRoot>
									<NativeSelectField
										value={lightLevel}
										onChange={(e) => setLightLevel(e.target.value as LightLevel)}
									>
										<option value="low">Low - Minimal natural light</option>
										<option value="medium">Medium - Some natural light</option>
										<option value="bright-indirect">Bright Indirect - Lots of light, no direct sun</option>
										<option value="direct">Direct Sun - Sunny window</option>
									</NativeSelectField>
								</NativeSelectRoot>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Window Direction (Optional)
								</Text>
								<NativeSelectRoot>
									<NativeSelectField
										value={windowDirection}
										onChange={(e) => setWindowDirection(e.target.value as WindowDirection | '')}
									>
										<option value="">No window / Not sure</option>
										<option value="north">North</option>
										<option value="east">East - Morning sun</option>
										<option value="south">South</option>
										<option value="west">West - Afternoon sun</option>
									</NativeSelectField>
								</NativeSelectRoot>
								<Text fontSize="xs" color="gray.500" mt={1}>
									💡 In Northern Hemisphere (USA, Europe): South = most sun, North = least sun
								</Text>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Temperature *
								</Text>
								<NativeSelectRoot>
									<NativeSelectField
										value={temperature}
										onChange={(e) => setTemperature(e.target.value as RoomTemperature)}
									>
										<option value="cold">Cold - Below 60°F / 15°C</option>
										<option value="cool">Cool - 60-65°F / 15-18°C</option>
										<option value="moderate">Moderate - 65-75°F / 18-24°C</option>
										<option value="warm">Warm - 75-80°F / 24-27°C</option>
										<option value="hot">Hot - Above 80°F / 27°C</option>
									</NativeSelectField>
								</NativeSelectRoot>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Humidity (Optional)
								</Text>
								<NativeSelectRoot>
									<NativeSelectField
										value={humidity}
										onChange={(e) => setHumidity(e.target.value as 'low' | 'medium' | 'high')}
									>
										<option value="low">Low - Dry air</option>
										<option value="medium">Medium - Average</option>
										<option value="high">High - Humid (bathroom, kitchen)</option>
									</NativeSelectField>
								</NativeSelectRoot>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Notes (Optional)
								</Text>
								<Input
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="Any additional details..."
								/>
							</Box>
						</VStack>
					)}
				</DialogBody>

				<DialogFooter>
					{viewMode === 'list' ? (
						<Button colorScheme="green" onClick={onClose}>
							Done
						</Button>
					) : (
						<HStack>
							<Button variant="ghost" onClick={handleCancel}>
								Cancel
							</Button>
							<Button colorScheme="green" onClick={handleSave} disabled={!name.trim()}>
								{viewMode === 'add' ? 'Add Room' : 'Save Changes'}
							</Button>
						</HStack>
					)}
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	)
}
