import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserPlant, PlantCheckIn, PlantStatus, PlantEditHistory, PlantHistoryEntry } from '../types'

interface PlantStore {
	// User's plants
	plants: UserPlant[]

	// Check-in history
	checkIns: PlantCheckIn[]

	// Edit history
	editHistory: PlantEditHistory[]

	// Plant actions
	addPlant: (plant: Omit<UserPlant, 'id' | 'dateAdded'>) => void
	updatePlant: (id: string, updates: Partial<Omit<UserPlant, 'id'>>) => void
	removePlant: (id: string) => void
	reorderPlants: (plantIds: string[]) => void

	// Check-in actions
	addCheckIn: (checkIn: Omit<PlantCheckIn, 'id' | 'date'>) => void
	getPlantCheckIns: (plantId: string) => PlantCheckIn[]
	getLastCheckIn: (plantId: string) => PlantCheckIn | undefined

	// History
	getPlantHistory: (plantId: string) => PlantHistoryEntry[]

	// Utility
	getPlantStatus: (plantId: string, speciesCheckFrequency: number) => PlantStatus
	getDaysSinceLastCheckIn: (plantId: string) => number
}

export const usePlantStore = create<PlantStore>()(
	persist(
		(set, get) => ({
			plants: [],
			checkIns: [],
			editHistory: [],

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
				const plant = get().plants.find((p) => p.id === id)
				if (!plant) return

				// Track changes for history
				const changes: PlantEditHistory['changes'] = []
				Object.entries(updates).forEach(([field, newValue]) => {
					const oldValue = plant[field as keyof UserPlant]
					if (oldValue !== newValue && field !== 'id' && field !== 'dateAdded') {
						changes.push({
							field,
							oldValue: String(oldValue || ''),
							newValue: String(newValue || ''),
						})
					}
				})

				// Add to edit history if there are changes
				if (changes.length > 0) {
					const editEntry: PlantEditHistory = {
						id: crypto.randomUUID(),
						plantId: id,
						date: new Date().toISOString(),
						changes,
					}
					set((state) => ({
						editHistory: [...state.editHistory, editEntry],
					}))
				}

				// Update the plant
				set((state) => ({
					plants: state.plants.map((plant) =>
						plant.id === id ? { ...plant, ...updates } : plant
					),
				}))
			},

			removePlant: (id) => {
				set((state) => ({
					plants: state.plants.filter((plant) => plant.id !== id),
					// Also remove associated check-ins and edit history
					checkIns: state.checkIns.filter((checkIn) => checkIn.plantId !== id),
					editHistory: state.editHistory.filter((edit) => edit.plantId !== id),
				}))
			},

			reorderPlants: (plantIds) => {
				set((state) => {
					const reordered = plantIds
						.map((id) => state.plants.find((p) => p.id === id))
						.filter((p): p is UserPlant => p !== undefined)
					return { plants: reordered }
				})
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

			getPlantHistory: (plantId) => {
				const plant = get().plants.find((p) => p.id === plantId)
				const checkIns = get().checkIns.filter((c) => c.plantId === plantId)
				const edits = get().editHistory.filter((e) => e.plantId === plantId)

				const history: PlantHistoryEntry[] = []

				// Add plant creation
				if (plant) {
					history.push({ type: 'created', date: plant.dateAdded })
				}

				// Add check-ins
				checkIns.forEach((checkIn) => {
					history.push({ type: 'check-in', data: checkIn })
				})

				// Add edits
				edits.forEach((edit) => {
					history.push({ type: 'edit', data: edit })
				})

				// Sort by date descending (most recent first)
				return history.sort((a, b) => {
					const dateA = a.type === 'created' ? a.date : a.data.date
					const dateB = b.type === 'created' ? b.date : b.data.date
					return new Date(dateB).getTime() - new Date(dateA).getTime()
				})
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
						c.leafCondition?.some((cond) =>
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
