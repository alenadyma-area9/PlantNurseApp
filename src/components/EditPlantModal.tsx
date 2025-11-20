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
import {
	Button,
	Input,
	VStack,
	Text,
	Box,
	HStack,
	NativeSelectRoot,
	NativeSelectField,
} from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { useRoomStore } from '../store/roomStore'
import type { PlantSize, PlantCondition } from '../types'
import { PhotoUpload } from './PhotoUpload'

interface EditPlantModalProps {
	plantId: string
	isOpen: boolean
	onClose: () => void
}

export function EditPlantModal({ plantId, isOpen, onClose }: EditPlantModalProps) {
	const plant = usePlantStore((state) => state.plants.find((p) => p.id === plantId))
	const updatePlant = usePlantStore((state) => state.updatePlant)
	const rooms = useRoomStore((state) => state.rooms)

	const [customName, setCustomName] = useState('')
	const [selectedRoomId, setSelectedRoomId] = useState('')
	const [size, setSize] = useState<PlantSize>('small')
	const [condition, setCondition] = useState<PlantCondition>('just-added')
	const [notes, setNotes] = useState('')
	const [photoUrl, setPhotoUrl] = useState<string | undefined>()

	useEffect(() => {
		if (plant) {
			setCustomName(plant.customName)
			setSelectedRoomId(plant.roomId)
			setSize(plant.size)
			setCondition(plant.condition)
			setNotes(plant.notes || '')
			setPhotoUrl(plant.photoUrl)
		}
	}, [plant])

	if (!plant) return null

	// Keyboard shortcuts
	const handleEnter = useCallback(() => {
		if (customName.trim()) {
			handleSave()
		}
	}, [customName])

	useEnterKey(handleEnter, isOpen)
	useEscapeKey(onClose, isOpen)

	const handleSave = () => {
		updatePlant(plant.id, {
			customName: customName.trim(),
			roomId: selectedRoomId,
			size,
			condition,
			notes: notes.trim() || undefined,
			photoUrl,
		})
		onClose()
	}

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
			<DialogBackdrop zIndex={1450} />
			<DialogContent
				maxH={{ base: '95vh', md: '90vh' }}
				position="fixed"
				top="50%"
				left="50%"
				transform="translate(-50%, -50%)"
				zIndex={1500}
				bg="white"
				borderRadius="lg"
				boxShadow="xl"
			>
				<DialogHeader>
				  <DialogTitle>Edit {plant.customName}</DialogTitle>
				  <DialogCloseTrigger />
				</DialogHeader>

				<DialogBody overflowY="auto" maxH={{ base: '70vh', md: '60vh' }}>
					<VStack gap={4} align="stretch">
						<Box>
							<Text fontSize="sm" fontWeight="bold" mb={2}>
								Name:
							</Text>
							<Input
								value={customName}
								onChange={(e) => setCustomName(e.target.value)}
								placeholder="Plant name"
							/>
						</Box>

						<Box>
							<Text fontSize="sm" fontWeight="bold" mb={2}>
								Location:
							</Text>
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
								Condition:
							</Text>
							<VStack gap={2}>
								{([
									{ value: 'just-added', label: 'Just added', emoji: '🆕' },
									{ value: 'healthy', label: 'Healthy & thriving', emoji: '🌿' },
									{ value: 'needs-attention', label: 'Needs some attention', emoji: '⚠️' },
									{ value: 'struggling', label: 'Struggling / Not doing well', emoji: '🥀' },
								] as Array<{ value: PlantCondition; label: string; emoji: string }>).map((c) => (
									<Button
										key={c.value}
										size="sm"
										variant={condition === c.value ? 'solid' : 'outline'}
										colorScheme={condition === c.value ? 'green' : 'gray'}
										onClick={() => setCondition(c.value)}
										width="full"
										justifyContent="flex-start"
									>
										<Text mr={2}>{c.emoji}</Text>
										{c.label}
									</Button>
								))}
							</VStack>
						</Box>

						<Box>
						  <Text fontSize="sm" fontWeight="bold" mb={2}>
							Notes (optional):
						  </Text>
						  <Input
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Any additional notes..."
						  />
						</Box>

						<Box>
						  <PhotoUpload
							currentPhoto={photoUrl}
							onPhotoChange={setPhotoUrl}
							label="Plant Photo"
						  />
						</Box>
					</VStack>
				</DialogBody>

				<DialogFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="green" onClick={handleSave} disabled={!customName.trim()}>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	)
}
