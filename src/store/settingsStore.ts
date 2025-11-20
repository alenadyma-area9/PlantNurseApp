import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TemperatureUnit = 'fahrenheit' | 'celsius'
export type DistanceUnit = 'inches' | 'cm'

interface Settings {
	temperatureUnit: TemperatureUnit
	distanceUnit: DistanceUnit
}

interface SettingsStore extends Settings {
	setTemperatureUnit: (unit: TemperatureUnit) => void
	setDistanceUnit: (unit: DistanceUnit) => void
	toggleTemperatureUnit: () => void
	toggleDistanceUnit: () => void
}

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			// Default to Celsius and cm (Metric/European) for NEW users only
			// Existing users keep their manually chosen settings
			temperatureUnit: 'celsius',
			distanceUnit: 'cm',

			setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
			setDistanceUnit: (unit) => set({ distanceUnit: unit }),

			toggleTemperatureUnit: () =>
				set((state) => ({
					temperatureUnit: state.temperatureUnit === 'fahrenheit' ? 'celsius' : 'fahrenheit',
				})),

			toggleDistanceUnit: () =>
				set((state) => ({
					distanceUnit: state.distanceUnit === 'inches' ? 'cm' : 'inches',
				})),
		}),
		{
			name: 'plant-nurse-settings',
		}
	)
)
