import type { TemperatureUnit, DistanceUnit } from '../store/settingsStore'

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(f: number): number {
	return Math.round((f - 32) * (5 / 9))
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(c: number): number {
	return Math.round((c * 9 / 5) + 32)
}

/**
 * Format temperature with unit
 */
export function formatTemperature(
	fahrenheit: number,
	unit: TemperatureUnit
): string {
	if (unit === 'celsius') {
		return `${fahrenheitToCelsius(fahrenheit)}°C`
	}
	return `${fahrenheit}°F`
}

/**
 * Format temperature range with unit
 */
export function formatTemperatureRange(
	minF: number,
	maxF: number,
	unit: TemperatureUnit
): string {
	if (unit === 'celsius') {
		return `${fahrenheitToCelsius(minF)}°C - ${fahrenheitToCelsius(maxF)}°C`
	}
	return `${minF}°F - ${maxF}°F`
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number): number {
	return Math.round(inches * 2.54)
}

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number): number {
	return Math.round(cm / 2.54)
}

/**
 * Format distance with unit
 */
export function formatDistance(
	description: string,
	unit: DistanceUnit
): string {
	if (unit === 'cm') {
		// Convert "top 1 inch" to "top 2.5 cm"
		// Convert "top 2 inches" to "top 5 cm"
		// Convert "top 2-3 inches" to "top 5-7.5 cm"

		return description
			.replace(/(\d+)-(\d+)\s*inch(es)?/gi, (_match, start, end) => {
				const startCm = inchesToCm(parseInt(start))
				const endCm = inchesToCm(parseInt(end))
				return `${startCm}-${endCm} cm`
			})
			.replace(/(\d+)\s*inch(es)?/gi, (_match, num) => {
				const cm = inchesToCm(parseInt(num))
				return `${cm} cm`
			})
	}
	return description
}

/**
 * Format ideal temperature string (e.g., "60-75°F" or "65-75°F")
 */
export function formatIdealTemperature(
	idealString: string,
	unit: TemperatureUnit
): string {
	if (unit === 'celsius') {
		// Parse "60-75°F" or "65-75°F" format
		const match = idealString.match(/(\d+)-(\d+)°F/)
		if (match) {
			const minF = parseInt(match[1])
			const maxF = parseInt(match[2])
			return `${fahrenheitToCelsius(minF)}-${fahrenheitToCelsius(maxF)}°C`
		}
	}
	return idealString
}
