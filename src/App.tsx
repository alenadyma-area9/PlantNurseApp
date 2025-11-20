import { Box, Container, Heading, VStack } from '@chakra-ui/react'
import { PlantList } from './components/PlantList'
import { AddPlantButton } from './components/AddPlantButton'

function App() {
	return (
		<Box minH="100vh" bg="gray.50">
			<Container maxW="container.lg" py={8}>
				<VStack gap={6} align="stretch">
					{/* Header */}
					<Box textAlign="center">
						<Heading size="2xl" color="green.600" mb={2}>
							🌱 PlantNurse
						</Heading>
						<Heading size="sm" color="gray.600" fontWeight="normal">
							Learn to care for your plants, one check-in at a time
						</Heading>
					</Box>

					{/* Add Plant Button */}
					<AddPlantButton />

					{/* Plant List */}
					<PlantList />
				</VStack>
			</Container>
		</Box>
	)
}

export default App
