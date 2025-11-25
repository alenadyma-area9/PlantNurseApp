import { useRef, useState } from 'react'
import { Box, Button, HStack, Text, Image as ChakraImage, VStack } from '@chakra-ui/react'
import { compressImage, getImageInputAccept } from '../utils/imageUtils'

interface PhotoUploadProps {
	currentPhoto?: string
	onPhotoChange: (base64: string | undefined) => void
	label?: string
}

export function PhotoUpload({ currentPhoto, onPhotoChange, label = 'Photo' }: PhotoUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string>()

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setIsUploading(true)
		setError(undefined)

		try {
			// Compress image to reasonable size
			const base64 = await compressImage(file, 800, 0.8)
			onPhotoChange(base64)
		} catch (err) {
			setError('Failed to process image. Please try another.')
			console.error('Image processing error:', err)
		} finally {
			setIsUploading(false)
			// Reset input
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	const handleRemove = () => {
		onPhotoChange(undefined)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	return (
		<Box>
			{label && (
				<Text fontSize="sm" fontWeight="bold" mb={2}>
					{label} (optional)
				</Text>
			)}

			{currentPhoto ? (
				<VStack gap={2} align="stretch">
					<Box
						borderWidth={1}
						borderRadius="md"
						overflow="hidden"
						maxW="300px"
						position="relative"
					>
						<ChakraImage
							src={currentPhoto}
							alt="Plant photo"
							width="100%"
							height="auto"
							maxH="300px"
							objectFit="cover"
						/>
					</Box>
					<HStack gap={2}>
						<Button
							size="sm"
							variant="outline"
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploading}
						>
							Change Photo
						</Button>
						<Button
							size="sm"
							colorScheme="red"
							variant="ghost"
							onClick={handleRemove}
						>
							Remove
						</Button>
					</HStack>
				</VStack>
			) : (
				<Button
					size="sm"
					variant="outline"
					onClick={() => fileInputRef.current?.click()}
					disabled={isUploading}
					width="fit-content"
				>
					{isUploading ? '📤 Uploading...' : '📷 Add Photo'}
				</Button>
			)}

			{error && (
				<Text fontSize="xs" color="red.500" mt={2}>
					{error}
				</Text>
			)}

			<input
				ref={fileInputRef}
				type="file"
				accept={getImageInputAccept()}
				capture="environment" // Use back camera on mobile
				style={{ display: 'none' }}
				onChange={handleFileSelect}
			/>
		</Box>
	)
}
