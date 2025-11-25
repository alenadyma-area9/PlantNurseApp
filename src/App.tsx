import { useEffect, useState } from 'react'
import { Box, Container, Heading, VStack, HStack, Button, NativeSelectRoot, NativeSelectField, IconButton, Toaster, Toast } from '@chakra-ui/react'
import { PlantList, type ViewMode } from './components/PlantList'
import { AddPlantModal } from './components/AddPlantModal'
import { SettingsModal } from './components/SettingsModal'
import { RoomManagementModal } from './components/RoomManagementModal'
import { useRoomStore } from './store/roomStore'
import { toaster } from './main'

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
						<Heading size={{ base: 'xl', md: '2xl' }} color="green.600">
							🌱 PlantNurse
						</Heading>
					</Box>

					{/* Controls Bar - Add, View, Settings */}
					<Box maxW="800px" mx="auto" width="100%">
						<HStack gap={2} flexWrap="nowrap" justify="space-between">
							{/* Add Plant Button */}
							<Button
								colorScheme="green"
								size="md"
								onClick={() => setIsAddPlantOpen(true)}
								flexShrink={0}
							>
								+ Add Plant
							</Button>

							{/* Right side controls: View Dropdown + Settings Icons */}
							<HStack gap={2} flexShrink={0}>
							{/* View Dropdown */}
							<NativeSelectRoot size={{ base: 'sm', md: 'md' }} width={{ base: '120px', sm: '140px', md: '160px' }}>
								<NativeSelectField
									value={viewMode}
									onChange={(e) => setViewMode(e.target.value as ViewMode)}
									borderWidth="1px"
									borderColor="gray.300"
									borderRadius="md"
									fontSize={{ base: 'xs', md: 'sm' }}
									_hover={{ borderColor: 'gray.400' }}
									_focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
								>
									<option value="all">📋 All</option>
									<option value="by-room">🏠 Room</option>
									<option value="by-health">💊 Health</option>
									<option value="by-next-check">📅 Check</option>
									<option value="by-care-level">🎓 Level</option>
								</NativeSelectField>
							</NativeSelectRoot>

							{/* Settings Icons */}
							<IconButton
								size={{ base: 'sm', md: 'md' }}
								variant="outline"
								onClick={() => setIsRoomManagementOpen(true)}
								aria-label="Room Management"
							>
								🏠
							</IconButton>
							<IconButton
								size={{ base: 'sm', md: 'md' }}
								variant="outline"
								onClick={() => setIsSettingsOpen(true)}
								aria-label="Settings"
							>
								⚙️
							</IconButton>
						</HStack>
						</HStack>
					</Box>

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

			{/* Toast Notifications */}
			<Toaster toaster={toaster}>
				{(toast) => (
					<Toast.Root
						key={toast.id}
						bg={toast.type === 'success' ? 'green.500' : toast.type === 'warning' ? 'yellow.500' : 'red.500'}
						color="white"
						borderRadius="md"
						p={4}
						boxShadow="lg"
						maxW="400px"
					>
						<VStack align="start" gap={1} pr={6}>
							{toast.title && <Toast.Title fontWeight="bold" fontSize="md">{toast.title}</Toast.Title>}
							{toast.description && <Toast.Description fontSize="sm">{toast.description}</Toast.Description>}
						</VStack>
						<Toast.CloseTrigger
							color="white"
							position="absolute"
							top={2}
							right={2}
						/>
					</Toast.Root>
				)}
			</Toaster>
		</Box>
	)
}

export default App
