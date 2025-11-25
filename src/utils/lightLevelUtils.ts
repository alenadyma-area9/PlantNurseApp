import type { LightLevel } from '../types'

export function getLightLevelDisplay(lightLevel: LightLevel): { icon: string; label: string } {
	const displays: Record<LightLevel, { icon: string; label: string }> = {
		low: { icon: '🌙', label: 'Low' },
		medium: { icon: '⛅', label: 'Medium' },
		'bright-indirect': { icon: '☀️', label: 'Bright' },
		direct: { icon: '🌞', label: 'Direct' },
	}
	return displays[lightLevel]
}

export function getLightLevelIcon(lightLevel: LightLevel): string {
	return getLightLevelDisplay(lightLevel).icon
}

export function getLightLevelLabel(lightLevel: LightLevel): string {
	return getLightLevelDisplay(lightLevel).label
}
