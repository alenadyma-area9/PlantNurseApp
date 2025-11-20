import { useState } from 'react'
import { Button, Box } from '@chakra-ui/react'
import { AddPlantModal } from './AddPlantModal'

export function AddPlantButton() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Box>
			<Button
				colorScheme="green"
				size="lg"
				width="full"
				onClick={() => setIsOpen(true)}
			>
				+ Add Plant
			</Button>

			<AddPlantModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</Box>
	)
}
