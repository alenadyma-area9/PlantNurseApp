import { useEffect } from 'react'

/**
 * Hook to handle keyboard shortcuts
 */
export function useKeyboardShortcut(
	key: string,
	callback: () => void,
	enabled: boolean = true
) {
	useEffect(() => {
		if (!enabled) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === key) {
				event.preventDefault()
				callback()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [key, callback, enabled])
}

/**
 * Hook to handle Enter key for form submission
 */
export function useEnterKey(callback: () => void, enabled: boolean = true) {
	useKeyboardShortcut('Enter', callback, enabled)
}

/**
 * Hook to handle Escape key for closing modals
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
	useKeyboardShortcut('Escape', callback, enabled)
}
