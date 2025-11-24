// Plant care types

export type CareLevel = 'beginner' | 'intermediate' | 'advanced'

export type PlantSize = 'small' | 'medium' | 'large'

export type PlantCondition = 'healthy' | 'needs-attention' | 'struggling' | 'just-added'

export type WindowDirection = 'north' | 'south' | 'east' | 'west' | 'none'

export type RoomTemperature = 'cold' | 'cool' | 'moderate' | 'warm' | 'hot'

export type LightLevel = 'low' | 'medium' | 'bright-indirect' | 'direct'

export type SoilPreference = 'dry' | 'slightly-moist' | 'moist' | 'wet'

export type SoilMoisture = 'bone-dry' | 'dry' | 'slightly-moist' | 'moist' | 'wet' | 'soggy'

export type LeafCondition =
	| 'healthy'
	| 'drooping'
	| 'yellowing'
	| 'brown-tips'
	| 'brown-edges'
	| 'spotted'
	| 'crispy'
	| 'wilting'

export type CheckInAction =
	| 'watered'
	| 'fertilized'
	| 'rotated'
	| 'misted'
	| 'pruned'
	| 'repotted'
	| 'nothing'

export type PlantStatus =
	| 'needs-attention'      // Overdue for check-in
	| 'check-soon'           // Within check window
	| 'recently-checked'     // All good
	| 'may-have-issue'       // Pattern suggests problem

// Plant species database structure
export interface PlantSpecies {
	id: string
	commonName: string
	scientificName: string
	aliases: string[] // alternative names for identification

	// Care Requirements
	watering: {
		checkFrequency: number // days between checks (not watering!)
		soilCheckDepth: string // "top 1 inch", "top 2 inches"
		soilPreference: SoilPreference
		seasonalNotes: string
	}

	light: {
		level: LightLevel
		description: string
	}

	humidity: {
		preference: 'low' | 'medium' | 'high'
		description: string
	}

	temperature: {
		min: number // °F
		max: number // °F
		ideal: string
	}

	// Identification help
	characteristics: {
		leafShape: 'heart' | 'round' | 'long-narrow' | 'oval' | 'hand-shaped' | 'spiky'
		leafSize: 'small' | 'medium' | 'large'
		growthPattern: 'upright' | 'bushy' | 'trailing' | 'climbing'
		specialFeatures: Array<'variegated' | 'waxy' | 'fuzzy' | 'holes' | 'succulent' | 'colored'>
	}

	// Quick reference
	careLevel: CareLevel
	petSafe: boolean

	// Educational
	commonIssues: Array<{
		symptom: string
		cause: string
		solution: string
	}>

	quickTips: string[]
}

// Room/Location where plants are kept
export interface Room {
	id: string
	name: string // "Living Room", "Bedroom", "Kitchen"
	lightLevel: LightLevel // actual light in this room
	windowDirection?: WindowDirection
	temperature: RoomTemperature
	humidity?: 'low' | 'medium' | 'high'
	notes?: string
}

// User's plant instance
export interface UserPlant {
	id: string
	speciesId: string // reference to PlantSpecies OR 'custom' for custom plants
	customName: string // user's nickname for the plant
	dateAdded: string // ISO date

	// Location & Environment
	roomId: string // reference to Room

	// Current Status
	size: PlantSize
	condition: PlantCondition

	// Custom plant fields (when isCustomPlant === true)
	isCustomPlant?: boolean
	customScientificName?: string // optional scientific name for custom plants
	customCheckFrequency?: number // check frequency in days for custom plants
	customLightLevel?: LightLevel // light requirements for custom plants
	customCareNotes?: string // user's own care instructions

	// Custom plant appearance (optional)
	customLeafShape?: string // free text description of leaf shape
	customLeafSize?: string // free text description of leaf size
	customGrowthPattern?: string // free text description of growth pattern
	customSpecialFeatures?: string[] // array of feature descriptions

	// Optional
	notes?: string // user's personal notes
	photoUrl?: string // optional user photo
}

// Check-in record
export interface PlantCheckIn {
	id: string
	plantId: string // reference to UserPlant
	date: string // ISO date

	// Observations (all optional - can just observe or take photo)
	soilMoisture?: SoilMoisture
	leafCondition?: LeafCondition[]
	notes?: string

	// Actions taken
	actionsTaken: CheckInAction[]

	// Optional photo
	photoUrl?: string
}

// Plant edit history
export interface PlantEditHistory {
	id: string
	plantId: string
	date: string // ISO date
	changes: {
		field: string
		oldValue: string
		newValue: string
	}[]
}

// Unified history entry (for display)
export type PlantHistoryEntry =
	| { type: 'check-in'; data: PlantCheckIn }
	| { type: 'edit'; data: PlantEditHistory }
	| { type: 'created'; date: string }

// Plant identification questions
export interface IdentificationQuestion {
	id: string
	question: string
	options: Array<{
		value: string
		label: string
		emoji?: string
	}>
}

// For filtering plants during identification
export interface PlantFilter {
	leafType?: string
	growthPattern?: string
	specialFeatures?: string[]
}
