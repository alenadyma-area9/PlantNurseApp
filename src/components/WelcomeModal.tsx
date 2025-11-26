import {
	DialogRoot,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogFooter,
	DialogTitle,
	DialogBackdrop,
} from '@chakra-ui/react'
import { Button, VStack, Text, Box, HStack } from '@chakra-ui/react'

interface WelcomeModalProps {
	isOpen: boolean
	onClose: () => void
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
	return (
		<DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
			<DialogBackdrop />
			<DialogContent
				maxW={{ base: '90vw', sm: '85vw', md: '600px' }}
				maxH={{ base: '90vh', md: '85vh' }}
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
					<DialogTitle>🌱 Welcome to PlantNurse!</DialogTitle>
				</DialogHeader>

				<DialogBody overflowY="auto">
					<VStack gap={4} align="stretch">
						<Box bg="green.50" p={4} borderRadius="md" borderWidth={1} borderColor="green.200">
							<Text fontSize="md" fontWeight="bold" color="green.800" mb={2}>
								Your Plant Care Companion
							</Text>
							<Text fontSize="sm" color="green.700">
								Track your plants, log check-ins, and learn how to care for them. All data is stored locally in your browser - no account needed!
							</Text>
						</Box>

						<Box>
							<Text fontSize="md" fontWeight="bold" mb={3}>
								📚 Quick Tutorial:
							</Text>

							<VStack gap={3} align="stretch">
								<HStack align="start" gap={3}>
									<Text fontSize="lg">1️⃣</Text>
									<Box>
										<Text fontSize="sm" fontWeight="bold">Add Your Plants</Text>
										<Text fontSize="xs" color="gray.600">
											Click "+ Add Plant" to add plants from our database or create custom ones. Give them names and assign them to rooms.
										</Text>
									</Box>
								</HStack>

								<HStack align="start" gap={3}>
									<Text fontSize="lg">2️⃣</Text>
									<Box>
										<Text fontSize="sm" fontWeight="bold">Check In Regularly</Text>
										<Text fontSize="xs" color="gray.600">
											The Check-in tab turns <strong style={{color: 'orange'}}>orange</strong> when it's time to check your plant. Log soil moisture, leaf condition, and actions taken.
										</Text>
									</Box>
								</HStack>

								<HStack align="start" gap={3}>
									<Text fontSize="lg">3️⃣</Text>
									<Box>
										<Text fontSize="sm" fontWeight="bold">Get Smart Suggestions</Text>
										<Text fontSize="xs" color="gray.600">
											If you report issues (yellowing leaves, drooping, etc.), the app suggests solutions in the Tips tab.
										</Text>
									</Box>
								</HStack>

								<HStack align="start" gap={3}>
									<Text fontSize="lg">4️⃣</Text>
									<Box>
										<Text fontSize="sm" fontWeight="bold">Track Growth with Photos</Text>
										<Text fontSize="xs" color="gray.600">
											Upload photos during check-ins or from the Photos tab to create a visual timeline of your plant's journey.
										</Text>
									</Box>
								</HStack>

								<HStack align="start" gap={3}>
									<Text fontSize="lg">5️⃣</Text>
									<Box>
										<Text fontSize="sm" fontWeight="bold">Organize Your Way</Text>
										<Text fontSize="xs" color="gray.600">
											Use the view dropdown to sort by room, health, next check date, or care level. Drag and drop to reorder in the default view.
										</Text>
									</Box>
								</HStack>
							</VStack>
						</Box>

						<Box bg="blue.50" p={3} borderRadius="md">
							<Text fontSize="xs" color="blue.800">
								💡 <strong>Tip:</strong> Click any plant name to see detailed care guides, full history, and troubleshooting tips!
							</Text>
						</Box>

						<Box bg="orange.50" p={3} borderRadius="md" borderWidth={1} borderColor="orange.200">
							<Text fontSize="xs" color="orange.800">
								⚠️ <strong>Important:</strong> All data is stored locally in your browser. Clearing browser data will delete everything. Consider taking screenshots of your plants!
							</Text>
						</Box>
					</VStack>
				</DialogBody>

				<DialogFooter>
					<Button colorScheme="green" onClick={onClose} size="lg" width="full">
						🚀 Get Started!
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	)
}
