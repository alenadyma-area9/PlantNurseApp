/**
 * Compress and convert image to base64
 */
export async function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = (e) => {
			const img = new Image()

			img.onload = () => {
				const canvas = document.createElement('canvas')
				let width = img.width
				let height = img.height

				// Calculate new dimensions
				if (width > maxWidth) {
					height = (height * maxWidth) / width
					width = maxWidth
				}

				canvas.width = width
				canvas.height = height

				const ctx = canvas.getContext('2d')
				if (!ctx) {
					reject(new Error('Could not get canvas context'))
					return
				}

				ctx.drawImage(img, 0, 0, width, height)

				// Convert to base64
				const base64 = canvas.toDataURL('image/jpeg', quality)
				resolve(base64)
			}

			img.onerror = () => reject(new Error('Failed to load image'))
			img.src = e.target?.result as string
		}

		reader.onerror = () => reject(new Error('Failed to read file'))
		reader.readAsDataURL(file)
	})
}

/**
 * Check if device has camera
 */
export function hasCamera(): boolean {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

/**
 * Get appropriate input accept attribute for mobile/desktop
 */
export function getImageInputAccept(): string {
	// On mobile, allow camera capture
	if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		return 'image/*'
	}
	// On desktop, just images
	return 'image/jpeg,image/png,image/webp'
}

/**
 * Calculate size of base64 string in KB
 */
export function getBase64Size(base64: string): number {
	const base64Length = base64.length - (base64.indexOf(',') + 1)
	const padding = (base64.charAt(base64.length - 2) === '=' ? 2 : base64.charAt(base64.length - 1) === '=' ? 1 : 0)
	return Math.round((base64Length * 0.75 - padding) / 1024)
}
