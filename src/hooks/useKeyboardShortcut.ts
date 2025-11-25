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
 * Ignores Enter in textarea elements to allow line breaks
 */
export function useEnterKey(callback: () => void, enabled: boolean = true) {
	useEffect(() => {
		if (!enabled) return

		const handleKeyDown = (event: KeyboardEvent) => {
			// Ignore if Enter is pressed in textarea or contentEditable
			const target = event.target as HTMLElement
			if (
				target.tagName === 'TEXTAREA' ||
				target.isContentEditable
			) {
				return
			}

			if (event.key === 'Enter') {
				event.preventDefault()
				callback()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [callback, enabled])
}

/**
 * Hook to handle Escape key for closing modals
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
	useKeyboardShortcut('Escape', callback, enabled)
}

/**
 * Hook to handle Ctrl+Enter for form submission
 * Works in textareas too (allows submitting without leaving textarea)
 */
export function useCtrlEnterKey(callback: () => void, enabled: boolean = true) {
	useEffect(() => {
		if (!enabled) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
				event.preventDefault()
				callback()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [callback, enabled])
}
