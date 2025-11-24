import { useEffect, useState } from 'react'
import { Box, Container, Heading, VStack, HStack, Button, NativeSelectRoot, NativeSelectField, IconButton } from '@chakra-ui/react'
import { PlantList, type ViewMode } from './components/PlantList'
import { AddPlantModal } from './components/AddPlantModal'
import { SettingsModal } from './components/SettingsModal'
import { RoomManagementModal } from './components/RoomManagementModal'
import { useRoomStore } from './store/roomStore'

function App() {
	const initializeDefaultRoom = useRoomStore((state) => state.initializeDefaultRoom)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [isRoomManagementOpen, setIsRoomManagementOpen] = useState(false)
	const [isAddPlantOpen, setIsAddPlantOpen] = useState(false)
	const [viewMode, setViewMode] = useState<ViewMode>('all')

	// Initialize default room on first load
	useEffect(() => {
		initializeDefaultRoom()
	}, [initializeDefaultRoom])

	return (
		<Box minH="100vh" bg="gray.50">
			<Container maxW="container.lg" py={{ base: 4, md: 8 }} px={{ base: 3, md: 4 }}>
				<VStack gap={{ base: 4, md: 6 }} align="stretch">
					{/* Header */}
					<Box textAlign="center">
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

					{/* Controls Bar - Add, View, Settings */}
					<HStack gap={2} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
						{/* Add Plant Button */}
						<Button
							colorScheme="green"
							size={{ base: 'md', md: 'md' }}
							onClick={() => setIsAddPlantOpen(true)}
							flexShrink={0}
						>
							+ Add Plant
						</Button>

						{/* View Dropdown */}
						<NativeSelectRoot size={{ base: 'md', md: 'md' }} flex={1} minW={{ base: 'full', md: '200px' }}>
							<NativeSelectField
								value={viewMode}
								onChange={(e) => setViewMode(e.target.value as ViewMode)}
							>
								<option value="all">📋 All Plants</option>
								<option value="by-room">🏠 By Room</option>
								<option value="by-health">💊 By Health</option>
								<option value="by-next-check">📅 By Next Check</option>
								<option value="by-care-level">🎓 By Care Level</option>
							</NativeSelectField>
						</NativeSelectRoot>

						{/* Settings Buttons - Desktop */}
						<Button
							size="md"
							variant="outline"
							onClick={() => setIsRoomManagementOpen(true)}
							display={{ base: 'none', md: 'flex' }}
							flexShrink={0}
						>
							🏠
						</Button>
						<Button
							size="md"
							variant="outline"
							onClick={() => setIsSettingsOpen(true)}
							display={{ base: 'none', md: 'flex' }}
							flexShrink={0}
						>
							⚙️
						</Button>

						{/* Settings Buttons - Mobile */}
						<IconButton
							size="md"
							variant="outline"
							onClick={() => setIsRoomManagementOpen(true)}
							display={{ base: 'flex', md: 'none' }}
							aria-label="Room Management"
						>
							🏠
						</IconButton>
						<IconButton
							size="md"
							variant="outline"
							onClick={() => setIsSettingsOpen(true)}
							display={{ base: 'flex', md: 'none' }}
							aria-label="Settings"
						>
							⚙️
						</IconButton>
					</HStack>

					{/* Plant List */}
					<PlantList viewMode={viewMode} />
				</VStack>
			</Container>

			{/* Add Plant Modal */}
			<AddPlantModal
				isOpen={isAddPlantOpen}
				onClose={() => setIsAddPlantOpen(false)}
			/>

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
