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
	Textarea,
	SimpleGrid,
} from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { getPlantById } from '../data/plantDatabase'
import type { SoilMoisture, LeafCondition, CheckInAction } from '../types'

interface CheckInModalProps {
	plantId: string
	isOpen: boolean
	onClose: () => void
}

export function CheckInModal({ plantId, isOpen, onClose }: CheckInModalProps) {
	const plant = usePlantStore((state) => state.plants.find((p) => p.id === plantId))
	const addCheckIn = usePlantStore((state) => state.addCheckIn)

	const [soilMoisture, setSoilMoisture] = useState<SoilMoisture | null>(null)
	const [leafConditions, setLeafConditions] = useState<LeafCondition[]>([])
	const [actions, setActions] = useState<CheckInAction[]>([])
	const [notes, setNotes] = useState('')

	if (!plant) return null

	const species = getPlantById(plant.speciesId)
	if (!species) return null

	const handleToggleLeafCondition = (condition: LeafCondition) => {
		setLeafConditions((prev) =>
			prev.includes(condition)
				? prev.filter((c) => c !== condition)
				: [...prev, condition]
		)
	}

	const handleToggleAction = (action: CheckInAction) => {
		setActions((prev) =>
			prev.includes(action)
				? prev.filter((a) => a !== action)
				: [...prev, action]
		)
	}

	const handleSubmit = () => {
		if (!soilMoisture) {
			alert('Please check and record the soil moisture first')
			return
		}

		if (leafConditions.length === 0) {
			alert('Please select at least one leaf condition')
			return
		}

		addCheckIn({
			plantId: plant.id,
			soilMoisture,
			leafCondition: leafConditions,
			actionsTaken: actions,
			notes: notes.trim() || undefined,
		})

		handleClose()
	}

	const handleClose = () => {
		setSoilMoisture(null)
		setLeafConditions([])
		setActions([])
		setNotes('')
		onClose()
	}

	// Soil moisture options
	const soilOptions = [
		{ value: 'bone-dry' as SoilMoisture, label: 'Bone dry', emoji: '🏜️', desc: 'Completely dry, dusty' },
		{ value: 'dry' as SoilMoisture, label: 'Dry', emoji: '☀️', desc: 'Dry to touch' },
		{ value: 'slightly-moist' as SoilMoisture, label: 'Slightly moist', emoji: '💧', desc: 'Barely damp' },
		{ value: 'moist' as SoilMoisture, label: 'Moist', emoji: '💦', desc: 'Damp, holds shape' },
		{ value: 'wet' as SoilMoisture, label: 'Wet', emoji: '🌊', desc: 'Very wet, water visible' },
		{ value: 'soggy' as SoilMoisture, label: 'Soggy', emoji: '⚠️', desc: 'Waterlogged' },
	]

	// Leaf condition options
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

	// Action options
	const actionOptions = [
		{ value: 'watered' as CheckInAction, label: 'Watered', emoji: '💧' },
		{ value: 'fertilized' as CheckInAction, label: 'Fertilized', emoji: '🌱' },
		{ value: 'rotated' as CheckInAction, label: 'Rotated', emoji: '🔄' },
		{ value: 'misted' as CheckInAction, label: 'Misted', emoji: '💨' },
		{ value: 'pruned' as CheckInAction, label: 'Pruned', emoji: '✂️' },
		{ value: 'repotted' as CheckInAction, label: 'Repotted', emoji: '🪴' },
		{ value: 'nothing' as CheckInAction, label: 'Just observing', emoji: '👀' },
	]

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="xl">
			<DialogContent maxH="90vh">
				<DialogHeader>
					<DialogTitle>Check-in: {plant.customName}</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>

				<DialogBody overflowY="auto" maxH="60vh">
					<VStack gap={5} align="stretch">
						{/* Plant Info */}
						<Box bg="green.50" p={3} borderRadius="md">
							<Text fontSize="sm" fontWeight="bold" color="green.800">
								{species.commonName}
							</Text>
							<Text fontSize="xs" color="green.700">
								Check soil: {species.watering.soilCheckDepth} • Prefers: {species.watering.soilPreference} soil
							</Text>
						</Box>

						{/* Step 1: Soil Moisture */}
						<Box>
							<Text fontSize="md" fontWeight="bold" mb={2}>
								1. How moist is the soil?
							</Text>
							<Text fontSize="sm" color="gray.600" mb={3}>
								Stick your finger in the soil {species.watering.soilCheckDepth} deep
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

						{/* Step 2: Leaf Condition */}
						<Box>
							<Text fontSize="md" fontWeight="bold" mb={2}>
								2. How do the leaves look?
							</Text>
							<Text fontSize="sm" color="gray.600" mb={3}>
								Select all that apply
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

							{leafConditions.length > 0 && (
								<HStack mt={2} flexWrap="wrap" gap={1}>
									{leafConditions.map((condition) => {
										const option = leafOptions.find((o) => o.value === condition)
										return (
											<Badge key={condition} colorScheme={option?.color || 'gray'} fontSize="xs">
												{option?.emoji} {option?.label}
											</Badge>
										)
									})}
								</HStack>
							)}
						</Box>

						{/* Step 3: Actions Taken */}
						<Box>
							<Text fontSize="md" fontWeight="bold" mb={2}>
								3. What did you do today?
							</Text>
							<Text fontSize="sm" color="gray.600" mb={3}>
								Select all that apply (or "Just observing")
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

						{/* Step 4: Notes */}
						<Box>
							<Text fontSize="md" fontWeight="bold" mb={2}>
								4. Any notes? (optional)
							</Text>
							<Textarea
								placeholder="e.g., New growth appearing, moved closer to window..."
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={3}
								fontSize="sm"
							/>
						</Box>
					</VStack>
				</DialogBody>

				<DialogFooter>
					<Button variant="ghost" mr={3} onClick={handleClose}>
						Cancel
					</Button>
					<Button
						colorScheme="green"
						onClick={handleSubmit}
						disabled={!soilMoisture || leafConditions.length === 0}
					>
						Save Check-in
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	)
}
