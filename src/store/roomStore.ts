import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Room } from '../types'

interface RoomStore {
	rooms: Room[]

	addRoom: (room: Omit<Room, 'id'>) => string // returns new room ID
	updateRoom: (id: string, updates: Partial<Omit<Room, 'id'>>) => void
	removeRoom: (id: string) => void
	getRoom: (id: string) => Room | undefined

	// Initialize with default room
	initializeDefaultRoom: () => void
}

export const DEFAULT_ROOM_ID = 'default-room'

export const useRoomStore = create<RoomStore>()(
	persist(
		(set, get) => ({
			rooms: [],

			addRoom: (roomData) => {
				const newRoom: Room = {
					...roomData,
					id: crypto.randomUUID(),
				}
				set((state) => ({
					rooms: [...state.rooms, newRoom],
				}))
				return newRoom.id
			},

			updateRoom: (id, updates) => {
				set((state) => ({
					rooms: state.rooms.map((room) =>
						room.id === id ? { ...room, ...updates } : room
					),
				}))
			},

			removeRoom: (id) => {
				// Don't allow removing default room
				if (id === DEFAULT_ROOM_ID) return

				set((state) => ({
					rooms: state.rooms.filter((room) => room.id !== id),
				}))
			},

			getRoom: (id) => {
				return get().rooms.find((room) => room.id === id)
			},

			initializeDefaultRoom: () => {
				const rooms = get().rooms
				if (rooms.length === 0) {
					// Create default room
					const defaultRoom: Room = {
						id: DEFAULT_ROOM_ID,
						name: 'My Room',
						lightLevel: 'medium',
						temperature: 'moderate',
						notes: 'Default room - you can edit this or add more rooms',
					}
					set({ rooms: [defaultRoom] })
				}
			},
		}),
		{
			name: 'plant-nurse-rooms',
		}
	)
)
