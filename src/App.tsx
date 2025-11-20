import { useEffect, useState } from 'react'
import { Box, Container, Heading, VStack, HStack, Button, IconButton } from '@chakra-ui/react'
import { PlantList } from './components/PlantList'
import { AddPlantButton } from './components/AddPlantButton'
import { SettingsModal } from './components/SettingsModal'
import { RoomManagementModal } from './components/RoomManagementModal'
import { useRoomStore } from './store/roomStore'

function App() {
	const initializeDefaultRoom = useRoomStore((state) => state.initializeDefaultRoom)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [isRoomManagementOpen, setIsRoomManagementOpen] = useState(false)

	// Initialize default room on first load
	useEffect(() => {
		initializeDefaultRoom()
	}, [initializeDefaultRoom])

	return (
		<Box minH="100vh" bg="gray.50">
			<Container maxW="container.lg" py={{ base: 4, md: 8 }} px={{ base: 3, md: 4 }}>
				<VStack gap={{ base: 4, md: 6 }} align="stretch">
					{/* Header */}
					<Box textAlign="center" position="relative">
						{/* Action Buttons - Top Right */}
						<HStack
							position="absolute"
							top={0}
							right={0}
							gap={2}
							display={{ base: 'none', sm: 'flex' }}
						>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setIsRoomManagementOpen(true)}
							>
								🏠 Rooms
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setIsSettingsOpen(true)}
							>
								⚙️ Settings
							</Button>
						</HStack>

						{/* Mobile Action Buttons */}
						<HStack
							justify="center"
							gap={2}
							mb={2}
							display={{ base: 'flex', sm: 'none' }}
						>
							<IconButton
								size="sm"
								variant="ghost"
								onClick={() => setIsRoomManagementOpen(true)}
								aria-label="Room Management"
							>
								🏠
							</IconButton>
							<IconButton
								size="sm"
								variant="ghost"
								onClick={() => setIsSettingsOpen(true)}
								aria-label="Settings"
							>
								⚙️
							</IconButton>
						</HStack>

						<Heading size={{ base: 'xl', md: '2xl' }} color="green.600" mb={2}>
							🌱 PlantNurse
						</Heading>
						<Heading
							size={{ base: 'xs', md: 'sm' }}
							color="gray.600"
							fontWeight="normal"
							px={{ base: 4, md: 0 }}
						>
							Learn to care for your plants, one check-in at a time
						</Heading>
					</Box>

					{/* Add Plant Button */}
					<AddPlantButton />

					{/* Plant List */}
					<PlantList />
				</VStack>
			</Container>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>

			{/* Room Management Modal */}
			<RoomManagementModal
				isOpen={isRoomManagementOpen}
				onClose={() => setIsRoomManagementOpen(false)}
			/>
		</Box>
	)
}

export default App
