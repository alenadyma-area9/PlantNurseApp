import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserPlant, PlantCheckIn, PlantStatus } from '../types'

interface PlantStore {
	// User's plants
	plants: UserPlant[]

	// Check-in history
	checkIns: PlantCheckIn[]

	// Plant actions
	addPlant: (plant: Omit<UserPlant, 'id' | 'dateAdded'>) => void
	updatePlant: (id: string, updates: Partial<Omit<UserPlant, 'id'>>) => void
	removePlant: (id: string) => void

	// Check-in actions
	addCheckIn: (checkIn: Omit<PlantCheckIn, 'id' | 'date'>) => void
	getPlantCheckIns: (plantId: string) => PlantCheckIn[]
	getLastCheckIn: (plantId: string) => PlantCheckIn | undefined

	// Utility
	getPlantStatus: (plantId: string, speciesCheckFrequency: number) => PlantStatus
	getDaysSinceLastCheckIn: (plantId: string) => number
}

export const usePlantStore = create<PlantStore>()(
	persist(
		(set, get) => ({
			plants: [],
			checkIns: [],

			addPlant: (plantData) => {
				const newPlant: UserPlant = {
					...plantData,
					id: crypto.randomUUID(),
					dateAdded: new Date().toISOString(),
				}
				set((state) => ({
					plants: [...state.plants, newPlant],
				}))
			},

			updatePlant: (id, updates) => {
				set((state) => ({
					plants: state.plants.map((plant) =>
						plant.id === id ? { ...plant, ...updates } : plant
					),
				}))
			},

			removePlant: (id) => {
				set((state) => ({
					plants: state.plants.filter((plant) => plant.id !== id),
					// Also remove associated check-ins
					checkIns: state.checkIns.filter((checkIn) => checkIn.plantId !== id),
				}))
			},

			addCheckIn: (checkInData) => {
				const newCheckIn: PlantCheckIn = {
					...checkInData,
					id: crypto.randomUUID(),
					date: new Date().toISOString(),
				}
				set((state) => ({
					checkIns: [...state.checkIns, newCheckIn],
				}))
			},

			getPlantCheckIns: (plantId) => {
				const checkIns = get().checkIns.filter((c) => c.plantId === plantId)
				// Sort by date descending (most recent first)
				return checkIns.sort((a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
				)
			},

			getLastCheckIn: (plantId) => {
				const checkIns = get().getPlantCheckIns(plantId)
				return checkIns[0] // Most recent
			},

			getDaysSinceLastCheckIn: (plantId) => {
				const lastCheckIn = get().getLastCheckIn(plantId)
				if (!lastCheckIn) {
					// If no check-in, use date added
					const plant = get().plants.find((p) => p.id === plantId)
					if (!plant) return 0

					const daysSinceAdded = Math.floor(
						(Date.now() - new Date(plant.dateAdded).getTime()) / (1000 * 60 * 60 * 24)
					)
					return daysSinceAdded
				}

				const daysSince = Math.floor(
					(Date.now() - new Date(lastCheckIn.date).getTime()) / (1000 * 60 * 60 * 24)
				)
				return daysSince
			},

			getPlantStatus: (plantId, speciesCheckFrequency) => {
				const daysSince = get().getDaysSinceLastCheckIn(plantId)

				// Calculate status based on check frequency
				if (daysSince > speciesCheckFrequency * 1.5) {
					return 'needs-attention' // Significantly overdue
				} else if (daysSince >= speciesCheckFrequency) {
					return 'check-soon' // Time to check
				} else if (daysSince < 1) {
					return 'recently-checked' // Checked today
				}

				// Check if there's a concerning pattern
				const recentCheckIns = get().getPlantCheckIns(plantId).slice(0, 3)
				if (recentCheckIns.length >= 2) {
					// If last 2 check-ins showed concerning conditions
					const lastTwo = recentCheckIns.slice(0, 2)
					const hasConcerns = lastTwo.every((c) =>
						c.leafCondition.some((cond) =>
							['yellowing', 'brown-tips', 'brown-edges', 'spotted', 'crispy', 'wilting'].includes(cond)
						)
					)
					if (hasConcerns) {
						return 'may-have-issue'
					}
				}

				return 'recently-checked'
			},
		}),
		{
			name: 'plant-nurse-storage', // localStorage key
		}
	)
)
