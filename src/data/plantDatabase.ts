import type { PlantSpecies } from '../types'

export const PLANT_DATABASE: PlantSpecies[] = [
	// === BEGINNER PLANTS ===
	{
		id: 'snake-plant',
		commonName: 'Snake Plant',
		scientificName: 'Sansevieria trifasciata',
		aliases: ['Mother-in-Law\'s Tongue', 'Sansevieria', 'Viper\'s Bowstring Hemp'],
		watering: {
			checkFrequency: 14, // every 2 weeks
			soilCheckDepth: 'top 2 inches',
			soilPreference: 'dry',
			seasonalNotes: 'Water even less in winter (every 3-4 weeks). Drought tolerant - when in doubt, skip watering.',
		},
		light: {
			level: 'low',
			description: 'Tolerates low light but grows faster in indirect bright light. Very adaptable.',
		},
		humidity: {
			preference: 'low',
			description: 'Thrives in dry air. No misting needed.',
		},
		temperature: {
			min: 55,
			max: 85,
			ideal: '60-75°F',
		},
		characteristics: {
			leafShape: 'Tall, upright sword-like leaves',
			leafColor: 'Dark green with light green horizontal bands',
			growthPattern: 'Upright rosette',
			specialFeatures: ['Extremely hardy', 'Air purifying', 'Grows slowly'],
		},
		careLevel: 'beginner',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Yellow, mushy leaves',
				cause: 'Overwatering - roots are rotting',
				solution: 'Let soil dry completely. Water less frequently. May need to repot in fresh, dry soil.',
			},
			{
				symptom: 'Brown, crispy tips',
				cause: 'Normal aging or inconsistent watering',
				solution: 'Trim brown tips. Establish consistent watering schedule.',
			},
		],
		quickTips: [
			'Nearly impossible to kill',
			'Can go 2-3 weeks without water',
			'Prefers being pot-bound',
			'Propagates easily from leaf cuttings',
		],
	},
	{
		id: 'pothos',
		commonName: 'Pothos',
		scientificName: 'Epipremnum aureum',
		aliases: ['Devil\'s Ivy', 'Golden Pothos', 'Money Plant'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 1-2 inches',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Leaves will droop when thirsty - excellent indicator. In winter, check less often.',
		},
		light: {
			level: 'medium',
			description: 'Thrives in medium to bright indirect light. Tolerates low light but grows slower.',
		},
		humidity: {
			preference: 'medium',
			description: 'Average household humidity is fine. Enjoys occasional misting.',
		},
		temperature: {
			min: 60,
			max: 85,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Heart-shaped, glossy leaves',
			leafColor: 'Green with yellow/white variegation (variety dependent)',
			growthPattern: 'Trailing vine',
			specialFeatures: ['Fast growing', 'Air purifying', 'Easy to propagate'],
		},
		careLevel: 'beginner',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Drooping leaves',
				cause: 'Thirsty! Needs water',
				solution: 'Water thoroughly. Leaves should perk up within hours.',
			},
			{
				symptom: 'Yellow leaves',
				cause: 'Overwatering or natural aging',
				solution: 'Check soil moisture. If wet, let dry out. Yellow leaves are normal occasionally.',
			},
			{
				symptom: 'Brown spots on leaves',
				cause: 'Leaf spot disease from overwatering',
				solution: 'Remove affected leaves. Reduce watering. Ensure good air circulation.',
			},
			{
				symptom: 'Losing variegation',
				cause: 'Insufficient light',
				solution: 'Move to brighter location. New growth will be more variegated.',
			},
		],
		quickTips: [
			'Leaves droop when thirsty - perfect indicator',
			'Very easy to propagate in water',
			'Grows 12-18 inches per month in good conditions',
			'Can be trained to climb or trail',
		],
	},
	{
		id: 'zz-plant',
		commonName: 'ZZ Plant',
		scientificName: 'Zamioculcas zamiifolia',
		aliases: ['Zanzibar Gem', 'Zuzu Plant', 'Eternity Plant'],
		watering: {
			checkFrequency: 14, // every 2 weeks
			soilCheckDepth: 'top 2-3 inches',
			soilPreference: 'dry',
			seasonalNotes: 'Water sparingly year-round. Can survive a month without water. Better to underwater than overwater.',
		},
		light: {
			level: 'low',
			description: 'Tolerates very low light. Grows faster in bright indirect light.',
		},
		humidity: {
			preference: 'low',
			description: 'Thrives in dry conditions. No special humidity needs.',
		},
		temperature: {
			min: 60,
			max: 85,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Glossy, oval leaflets along stems',
			leafColor: 'Deep, waxy green',
			growthPattern: 'Upright stems from rhizomes',
			specialFeatures: ['Extremely drought tolerant', 'Slow growing', 'Stores water in rhizomes'],
		},
		careLevel: 'beginner',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Yellow stems/leaves',
				cause: 'Overwatering - rhizome rot',
				solution: 'Stop watering immediately. Let soil dry completely. Remove affected stems.',
			},
			{
				symptom: 'Brown leaf tips',
				cause: 'Low humidity or chlorine in water',
				solution: 'Use filtered water. Mist occasionally if air is very dry.',
			},
		],
		quickTips: [
			'Perfect for forgetful waterers',
			'Stores water in potato-like rhizomes',
			'Grows new stems slowly (1-2 per year)',
			'Wipe leaves occasionally to keep them shiny',
		],
	},
	{
		id: 'spider-plant',
		commonName: 'Spider Plant',
		scientificName: 'Chlorophytum comosum',
		aliases: ['Airplane Plant', 'Ribbon Plant', 'Spider Ivy'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 1 inch',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Water when top inch is dry. Reduce frequency in winter.',
		},
		light: {
			level: 'medium',
			description: 'Prefers bright, indirect light. Tolerates some shade.',
		},
		humidity: {
			preference: 'medium',
			description: 'Enjoys humidity but adapts to average household levels.',
		},
		temperature: {
			min: 55,
			max: 80,
			ideal: '60-75°F',
		},
		characteristics: {
			leafShape: 'Long, arching, grass-like leaves',
			leafColor: 'Green or variegated green and white',
			growthPattern: 'Arching rosette with plantlets',
			specialFeatures: ['Produces baby plants', 'Air purifying', 'Fast growing'],
		},
		careLevel: 'beginner',
		petSafe: true,
		commonIssues: [
			{
				symptom: 'Brown leaf tips',
				cause: 'Fluoride/chlorine in tap water or low humidity',
				solution: 'Use filtered or distilled water. Trim brown tips. Increase humidity.',
			},
			{
				symptom: 'Pale leaves, no variegation',
				cause: 'Too much direct sun',
				solution: 'Move to location with indirect light.',
			},
		],
		quickTips: [
			'Produces baby "spiderettes" that can be propagated',
			'Non-toxic to pets',
			'Great for hanging baskets',
			'Removes formaldehyde from air',
		],
	},
	{
		id: 'aloe-vera',
		commonName: 'Aloe Vera',
		scientificName: 'Aloe barbadensis miller',
		aliases: ['True Aloe', 'Medicine Plant', 'Burn Plant'],
		watering: {
			checkFrequency: 14, // every 2 weeks
			soilCheckDepth: 'top 2 inches',
			soilPreference: 'dry',
			seasonalNotes: 'Succulent - stores water in leaves. Water deeply but infrequently. Every 3 weeks in winter.',
		},
		light: {
			level: 'bright-indirect',
			description: 'Needs bright light. Can handle some direct sun. Will etiolate (stretch) in low light.',
		},
		humidity: {
			preference: 'low',
			description: 'Prefers dry air. No misting needed.',
		},
		temperature: {
			min: 55,
			max: 85,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Thick, fleshy, pointed leaves',
			leafColor: 'Gray-green with small white spots',
			growthPattern: 'Rosette, produces offsets (pups)',
			specialFeatures: ['Medicinal gel inside leaves', 'Succulent', 'Produces pups'],
		},
		careLevel: 'beginner',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Brown, mushy leaves',
				cause: 'Overwatering - root rot',
				solution: 'Let soil dry completely. Repot in cactus soil. Water less frequently.',
			},
			{
				symptom: 'Thin, pale, stretching leaves',
				cause: 'Not enough light',
				solution: 'Move to brighter location. May need grow light.',
			},
			{
				symptom: 'Red/brown leaves',
				cause: 'Too much direct sun',
				solution: 'Move to location with bright indirect light.',
			},
		],
		quickTips: [
			'Use gel for minor burns and skin irritation',
			'Water only when soil is completely dry',
			'Needs well-draining cactus/succulent soil',
			'Produces "pups" that can be separated and repotted',
		],
	},

	// === INTERMEDIATE PLANTS ===
	{
		id: 'monstera',
		commonName: 'Monstera Deliciosa',
		scientificName: 'Monstera deliciosa',
		aliases: ['Swiss Cheese Plant', 'Split Leaf Philodendron'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 2 inches',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Water when top 2 inches are dry. Less frequent in winter. Likes consistent moisture but not soggy.',
		},
		light: {
			level: 'bright-indirect',
			description: 'Bright, indirect light for best fenestrations (leaf holes). Tolerates medium light.',
		},
		humidity: {
			preference: 'high',
			description: 'Prefers 60%+ humidity. Mist regularly or use humidifier.',
		},
		temperature: {
			min: 65,
			max: 85,
			ideal: '70-75°F',
		},
		characteristics: {
			leafShape: 'Large, heart-shaped with splits and holes',
			leafColor: 'Deep glossy green',
			growthPattern: 'Climbing vine with aerial roots',
			specialFeatures: ['Develops holes (fenestrations) as it matures', 'Fast grower', 'Needs support pole'],
		},
		careLevel: 'intermediate',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Yellow leaves',
				cause: 'Overwatering or natural aging',
				solution: 'Check soil moisture. Reduce watering if soil is soggy. One yellow leaf occasionally is normal.',
			},
			{
				symptom: 'Brown, crispy edges',
				cause: 'Low humidity or underwatering',
				solution: 'Increase humidity with misting or humidifier. Check watering schedule.',
			},
			{
				symptom: 'No holes in new leaves',
				cause: 'Young plant or insufficient light',
				solution: 'Be patient if plant is young. Ensure bright indirect light. Fenestrations develop with maturity.',
			},
			{
				symptom: 'Drooping leaves',
				cause: 'Thirsty or root-bound',
				solution: 'Water if soil is dry. Check if roots are coming out of drainage holes.',
			},
		],
		quickTips: [
			'Leaf holes develop as plant matures - not on young leaves',
			'Wipe leaves monthly to keep them glossy',
			'Provide moss pole for climbing',
			'Can grow 1-2 feet per year',
		],
	},
	{
		id: 'rubber-plant',
		commonName: 'Rubber Plant',
		scientificName: 'Ficus elastica',
		aliases: ['Rubber Tree', 'Rubber Fig'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 2 inches',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Water when top 2 inches dry. Reduce watering in winter.',
		},
		light: {
			level: 'bright-indirect',
			description: 'Bright indirect light. Variegated varieties need more light.',
		},
		humidity: {
			preference: 'medium',
			description: 'Average humidity is fine. Wipe leaves to prevent dust buildup.',
		},
		temperature: {
			min: 60,
			max: 85,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Large, oval, thick and glossy',
			leafColor: 'Deep green, burgundy, or variegated',
			growthPattern: 'Upright tree-like',
			specialFeatures: ['Bold statement plant', 'Large leaves', 'Can grow very tall'],
		},
		careLevel: 'intermediate',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Dropping leaves',
				cause: 'Change in environment, overwatering, or underwatering',
				solution: 'Ficus are dramatic about change. Keep conditions consistent. Check soil moisture.',
			},
			{
				symptom: 'Brown spots on leaves',
				cause: 'Overwatering or cold draft',
				solution: 'Let soil dry more between waterings. Move away from cold windows/AC.',
			},
		],
		quickTips: [
			'Wipe leaves monthly - they collect dust',
			'Don\'t move it around - they hate change',
			'Prune to encourage bushier growth',
			'Milky sap is normal but can irritate skin',
		],
	},
	{
		id: 'dracaena',
		commonName: 'Dracaena',
		scientificName: 'Dracaena spp.',
		aliases: ['Dragon Tree', 'Corn Plant', 'Janet Craig'],
		watering: {
			checkFrequency: 10, // every 10 days
			soilCheckDepth: 'top 2 inches',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Allow soil to dry between waterings. Less water in winter.',
		},
		light: {
			level: 'medium',
			description: 'Medium to bright indirect light. Tolerates lower light.',
		},
		humidity: {
			preference: 'medium',
			description: 'Average humidity. Mist occasionally if air is very dry.',
		},
		temperature: {
			min: 65,
			max: 80,
			ideal: '70-75°F',
		},
		characteristics: {
			leafShape: 'Long, narrow, arching leaves',
			leafColor: 'Green, often with white, yellow, or red stripes',
			growthPattern: 'Upright with cane-like stems',
			specialFeatures: ['Air purifying', 'Multiple varieties', 'Slow growing'],
		},
		careLevel: 'intermediate',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Brown leaf tips',
				cause: 'Fluoride in tap water or low humidity',
				solution: 'Use filtered or distilled water. Increase humidity. Trim brown tips.',
			},
			{
				symptom: 'Yellow lower leaves',
				cause: 'Natural aging or overwatering',
				solution: 'A few yellow lower leaves are normal. Check soil - reduce watering if soggy.',
			},
		],
		quickTips: [
			'Very effective air purifier',
			'Sensitive to fluoride in water',
			'Can grow quite tall (6+ feet)',
			'Lower leaves naturally yellow and drop with age',
		],
	},
	{
		id: 'peace-lily',
		commonName: 'Peace Lily',
		scientificName: 'Spathiphyllum spp.',
		aliases: ['Spathiphyllum', 'White Sail Plant'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 1 inch',
			soilPreference: 'moist',
			seasonalNotes: 'Dramatic when thirsty - leaves droop visibly. Prefers consistently moist (not soggy) soil.',
		},
		light: {
			level: 'low',
			description: 'One of the best low-light plants. Bright indirect light encourages blooming.',
		},
		humidity: {
			preference: 'high',
			description: 'Loves humidity. Mist regularly or use humidifier for best results.',
		},
		temperature: {
			min: 65,
			max: 85,
			ideal: '68-75°F',
		},
		characteristics: {
			leafShape: 'Large, glossy, lance-shaped',
			leafColor: 'Deep green',
			growthPattern: 'Clumping',
			specialFeatures: ['White flowers (spathes)', 'Tells you when thirsty', 'Air purifying'],
		},
		careLevel: 'intermediate',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Drooping leaves',
				cause: 'Thirsty! Clear signal',
				solution: 'Water immediately. Leaves will perk up within hours.',
			},
			{
				symptom: 'Brown leaf tips',
				cause: 'Low humidity, chlorine in water, or underwatering',
				solution: 'Use filtered water. Increase humidity. Water more consistently.',
			},
			{
				symptom: 'Yellow leaves',
				cause: 'Overwatering or aging',
				solution: 'Let soil dry slightly more. Remove yellow leaves.',
			},
			{
				symptom: 'No flowers',
				cause: 'Insufficient light or young plant',
				solution: 'Move to brighter location. Be patient - blooms come with maturity.',
			},
		],
		quickTips: [
			'Excellent for beginners - tells you when thirsty',
			'Non-toxic appearance but actually toxic to pets',
			'White "flowers" are actually modified leaves',
			'One of NASA\'s top air-purifying plants',
		],
	},
	{
		id: 'philodendron',
		commonName: 'Philodendron',
		scientificName: 'Philodendron spp.',
		aliases: ['Heartleaf Philodendron', 'Brasil Philodendron'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 1-2 inches',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Keep soil lightly moist but not soggy. Reduce watering in winter.',
		},
		light: {
			level: 'medium',
			description: 'Medium to bright indirect light. Variegated types need more light.',
		},
		humidity: {
			preference: 'medium',
			description: 'Average humidity is fine. Benefits from occasional misting.',
		},
		temperature: {
			min: 65,
			max: 80,
			ideal: '70-75°F',
		},
		characteristics: {
			leafShape: 'Heart-shaped, glossy leaves',
			leafColor: 'Green or variegated',
			growthPattern: 'Trailing or climbing vine',
			specialFeatures: ['Fast growing', 'Easy to propagate', 'Many varieties'],
		},
		careLevel: 'intermediate',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Yellow leaves',
				cause: 'Overwatering',
				solution: 'Let soil dry more between waterings. Check drainage.',
			},
			{
				symptom: 'Leggy growth',
				cause: 'Insufficient light',
				solution: 'Move to brighter location. Prune to encourage bushiness.',
			},
		],
		quickTips: [
			'Similar care to Pothos',
			'Can be trained to climb or trail',
			'Propagates easily in water',
			'Grows quickly in good conditions',
		],
	},

	// === SPECIFIC CARE PLANTS ===
	{
		id: 'fiddle-leaf-fig',
		commonName: 'Fiddle Leaf Fig',
		scientificName: 'Ficus lyrata',
		aliases: ['Fiddle Leaf', 'FLF'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 2 inches',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Water when top 2 inches dry. Consistency is key - irregular watering causes brown spots.',
		},
		light: {
			level: 'bright-indirect',
			description: 'Needs bright, consistent indirect light. Rotate regularly for even growth.',
		},
		humidity: {
			preference: 'medium',
			description: 'Prefers 40-60% humidity. Wipe leaves regularly.',
		},
		temperature: {
			min: 60,
			max: 80,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Large, fiddle/violin-shaped',
			leafColor: 'Deep green with prominent veining',
			growthPattern: 'Upright tree-like',
			specialFeatures: ['Dramatic statement plant', 'Large architectural leaves', 'Slow growing'],
		},
		careLevel: 'advanced',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Brown spots on leaves',
				cause: 'Inconsistent watering, root rot, or bacterial infection',
				solution: 'Establish consistent watering schedule. Ensure good drainage. Remove affected leaves.',
			},
			{
				symptom: 'Dropping leaves',
				cause: 'Change in environment, drafts, or watering issues',
				solution: 'Avoid moving plant. Keep away from AC/heating vents. Maintain consistent care.',
			},
			{
				symptom: 'Brown edges',
				cause: 'Low humidity or underwatering',
				solution: 'Increase humidity. Check watering - soil should not completely dry out.',
			},
		],
		quickTips: [
			'Very particular about consistency',
			'Don\'t move it once you find a good spot',
			'Wipe leaves weekly - they collect dust',
			'Rotate 1/4 turn each week for even growth',
		],
	},
	{
		id: 'succulent',
		commonName: 'Succulents',
		scientificName: 'Various genera',
		aliases: ['Echeveria', 'Sedum', 'Jade Plant', 'Haworthia'],
		watering: {
			checkFrequency: 14, // every 2 weeks
			soilCheckDepth: 'soil completely dry',
			soilPreference: 'dry',
			seasonalNotes: 'Water deeply but infrequently. Every 3-4 weeks in winter. Soil must be completely dry between waterings.',
		},
		light: {
			level: 'bright-indirect',
			description: 'Need lots of bright light. Many can handle direct sun. Will stretch (etiolate) in low light.',
		},
		humidity: {
			preference: 'low',
			description: 'Prefer dry air. Never mist.',
		},
		temperature: {
			min: 60,
			max: 85,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Thick, fleshy, varied shapes',
			leafColor: 'Various - green, blue, purple, pink',
			growthPattern: 'Rosettes, trailing, or upright',
			specialFeatures: ['Store water in leaves', 'Colorful varieties', 'Slow growing'],
		},
		careLevel: 'intermediate',
		petSafe: true,
		commonIssues: [
			{
				symptom: 'Mushy, translucent leaves',
				cause: 'Overwatering - fatal for succulents',
				solution: 'Stop watering. May be too late. Propagate healthy leaves if possible.',
			},
			{
				symptom: 'Stretched, leggy growth',
				cause: 'Not enough light',
				solution: 'Move to much brighter location or add grow light.',
			},
			{
				symptom: 'Shriveled leaves',
				cause: 'Underwatered (rare)',
				solution: 'Water thoroughly. Wait for soil to fully dry before next watering.',
			},
		],
		quickTips: [
			'When in doubt, don\'t water',
			'Need well-draining cactus/succulent soil',
			'Drainage holes essential',
			'Many varieties can be propagated from single leaves',
		],
	},
	{
		id: 'cactus',
		commonName: 'Cactus',
		scientificName: 'Various genera',
		aliases: ['Desert Cactus', 'Prickly Pear', 'Barrel Cactus'],
		watering: {
			checkFrequency: 21, // every 3 weeks
			soilCheckDepth: 'soil completely dry throughout',
			soilPreference: 'dry',
			seasonalNotes: 'Water sparingly. Once a month spring-fall. Every 6-8 weeks in winter dormancy.',
		},
		light: {
			level: 'direct',
			description: 'Need very bright light. Most handle direct sun well.',
		},
		humidity: {
			preference: 'low',
			description: 'Desert plants - prefer very dry air.',
		},
		temperature: {
			min: 50,
			max: 95,
			ideal: '65-85°F (cooler in winter for dormancy)',
		},
		characteristics: {
			leafShape: 'Spines, no traditional leaves',
			leafColor: 'Green, sometimes blue-green',
			growthPattern: 'Columnar, spherical, or segmented',
			specialFeatures: ['Spines instead of leaves', 'Extremely drought tolerant', 'May flower'],
		},
		careLevel: 'intermediate',
		petSafe: true,
		commonIssues: [
			{
				symptom: 'Soft, mushy base',
				cause: 'Root rot from overwatering',
				solution: 'Stop watering. May not be salvageable. Cut healthy top to propagate if possible.',
			},
			{
				symptom: 'Wrinkled, shriveled',
				cause: 'Severely underwatered (takes months)',
				solution: 'Water thoroughly. Should plump up.',
			},
			{
				symptom: 'No growth, pale color',
				cause: 'Insufficient light',
				solution: 'Move to brightest possible location.',
			},
		],
		quickTips: [
			'Extremely low maintenance',
			'Must have well-draining cactus soil',
			'Need winter dormancy (cooler, less water) to bloom',
			'Can survive extreme neglect',
		],
	},
	{
		id: 'fern',
		commonName: 'Ferns',
		scientificName: 'Various genera',
		aliases: ['Boston Fern', 'Maidenhair Fern', 'Birds Nest Fern'],
		watering: {
			checkFrequency: 5, // every 5 days
			soilCheckDepth: 'top 1 inch',
			soilPreference: 'moist',
			seasonalNotes: 'Keep soil consistently moist but not soggy. Never let dry out completely - they hate it.',
		},
		light: {
			level: 'medium',
			description: 'Medium to bright indirect light. No direct sun - will scorch.',
		},
		humidity: {
			preference: 'high',
			description: 'Need high humidity (50-70%+). Mist daily or use humidifier. Perfect for bathrooms.',
		},
		temperature: {
			min: 60,
			max: 75,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Delicate, feathery fronds',
			leafColor: 'Bright to dark green',
			growthPattern: 'Arching, fountain-like',
			specialFeatures: ['Ancient plant group', 'Humidity lovers', 'No flowers'],
		},
		careLevel: 'advanced',
		petSafe: true,
		commonIssues: [
			{
				symptom: 'Brown, crispy fronds',
				cause: 'Low humidity or letting soil dry out',
				solution: 'Increase humidity dramatically. Mist daily. Keep soil moist. Trim dead fronds.',
			},
			{
				symptom: 'Yellow fronds',
				cause: 'Overwatering or poor drainage',
				solution: 'Ensure pot has drainage. Let soil surface dry slightly between waterings.',
			},
		],
		quickTips: [
			'Challenging - need high humidity',
			'Perfect for humid bathrooms',
			'Mist daily if humidity is low',
			'Non-toxic to pets',
		],
	},
	{
		id: 'money-tree',
		commonName: 'Money Tree',
		scientificName: 'Pachira aquatica',
		aliases: ['Pachira', 'Guiana Chestnut', 'Braided Money Tree'],
		watering: {
			checkFrequency: 7, // weekly
			soilCheckDepth: 'top 2-3 inches',
			soilPreference: 'slightly-moist',
			seasonalNotes: 'Water when top 2-3 inches dry. Less in winter. Dislikes soggy soil.',
		},
		light: {
			level: 'bright-indirect',
			description: 'Bright indirect light. Can tolerate medium light but grows slower.',
		},
		humidity: {
			preference: 'medium',
			description: 'Average humidity is fine. Enjoys occasional misting.',
		},
		temperature: {
			min: 65,
			max: 80,
			ideal: '65-75°F',
		},
		characteristics: {
			leafShape: 'Palmlike with 5-7 leaflets',
			leafColor: 'Bright green',
			growthPattern: 'Upright with braided trunk',
			specialFeatures: ['Often sold with braided trunk', 'Symbol of good luck', 'Can grow tall'],
		},
		careLevel: 'intermediate',
		petSafe: false,
		commonIssues: [
			{
				symptom: 'Yellow leaves falling',
				cause: 'Overwatering or temperature shock',
				solution: 'Let soil dry more between waterings. Avoid cold drafts.',
			},
			{
				symptom: 'Brown leaf tips',
				cause: 'Low humidity or inconsistent watering',
				solution: 'Increase humidity. Maintain consistent watering schedule.',
			},
		],
		quickTips: [
			'Trunk is usually braided when young',
			'Rotates toward light - rotate plant regularly',
			'Can grow 6-8 feet indoors',
			'Believed to bring good luck and prosperity',
		],
	},
]

// Helper function to search plants by name or alias
export function searchPlants(query: string): PlantSpecies[] {
	const lowercaseQuery = query.toLowerCase()
	return PLANT_DATABASE.filter(
		(plant) =>
			plant.commonName.toLowerCase().includes(lowercaseQuery) ||
			plant.scientificName.toLowerCase().includes(lowercaseQuery) ||
			plant.aliases.some((alias) => alias.toLowerCase().includes(lowercaseQuery))
	)
}

// Helper to get plant by ID
export function getPlantById(id: string): PlantSpecies | undefined {
	return PLANT_DATABASE.find((plant) => plant.id === id)
}
