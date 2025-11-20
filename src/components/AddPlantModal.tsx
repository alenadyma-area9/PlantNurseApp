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
import { Button, Input, VStack, Text, SimpleGrid, Card, Box } from '@chakra-ui/react'
import { usePlantStore } from '../store/plantStore'
import { PLANT_DATABASE } from '../data/plantDatabase'

interface AddPlantModalProps {
	isOpen: boolean
	onClose: () => void
}

export function AddPlantModal({ isOpen, onClose }: AddPlantModalProps) {
	const [step, setStep] = useState<'select' | 'name'>('select')
	const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('')
	const [customName, setCustomName] = useState('')
	const addPlant = usePlantStore((state) => state.addPlant)

	const handleSelectPlant = (speciesId: string) => {
		setSelectedSpeciesId(speciesId)
		const species = PLANT_DATABASE.find((p) => p.id === speciesId)
		if (species) {
			setCustomName(species.commonName) // Default to species name
		}
		setStep('name')
	}

	const handleAddPlant = () => {
		if (selectedSpeciesId && customName.trim()) {
			addPlant({
				speciesId: selectedSpeciesId,
				customName: customName.trim(),
			})
			handleClose()
		}
	}

	const handleClose = () => {
		setStep('select')
		setSelectedSpeciesId('')
		setCustomName('')
		onClose()
	}

	const selectedSpecies = PLANT_DATABASE.find((p) => p.id === selectedSpeciesId)

	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="xl">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{step === 'select' ? 'Choose Your Plant Type' : 'Name Your Plant'}
					</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>

				<DialogBody>
					{step === 'select' ? (
						<VStack gap={4} align="stretch">
							<Text fontSize="sm" color="gray.600">
								Select your plant from our database:
							</Text>

							<SimpleGrid columns={2} gap={3}>
								{PLANT_DATABASE.map((plant) => (
									<Card.Root
										key={plant.id}
										variant="outline"
										cursor="pointer"
										onClick={() => handleSelectPlant(plant.id)}
										_hover={{ borderColor: 'green.400', shadow: 'md' }}
									>
										<Card.Body p={3}>
										  <VStack align="start" gap={1}>
												<Text fontWeight="bold" fontSize="sm">
													{plant.commonName}
												</Text>
												<Text fontSize="xs" color="gray.600">
													{plant.scientificName}
												</Text>
												<Text fontSize="xs" color="green.600">
													{plant.careLevel}
												</Text>
											</VStack>
										</Card.Body>
									</Card.Root>
								))}
							</SimpleGrid>
						</VStack>
					) : (
						<VStack gap={4} align="stretch">
							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={1}>
									Plant Type:
								</Text>
								<Text fontSize="sm" color="gray.600">
									{selectedSpecies?.commonName} ({selectedSpecies?.scientificName})
								</Text>
							</Box>

							<Box>
								<Text fontSize="sm" fontWeight="bold" mb={2}>
									Give your plant a friendly name:
								</Text>
								<Input
									placeholder="e.g., Monty, Fred, Steve..."
									value={customName}
									onChange={(e) => setCustomName(e.target.value)}
									autoFocus
								/>
								<Text fontSize="xs" color="gray.500" mt={1}>
									This helps you identify your plant
								</Text>
							</Box>
						</VStack>
					)}
				</DialogBody>

				<DialogFooter>
					{step === 'name' && (
						<>
							<Button variant="ghost" mr={3} onClick={() => setStep('select')}>
								Back
							</Button>
							<Button
								colorScheme="green"
								onClick={handleAddPlant}
								disabled={!customName.trim()}
							>
								Add Plant
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	)
}
