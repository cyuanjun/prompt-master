import type { Feedback } from './validators'

export type DemoScenario = {
  key: string
  theme: string
  targetImageUrl: string
  attemptImageUrl: string
  feedback: Feedback
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    key: 'cyberpunk',
    theme: 'cyberpunk neon city street at night',
    targetImageUrl: '/demo/target-cyberpunk.svg',
    attemptImageUrl: '/demo/attempt-cyberpunk.svg',
    feedback: {
      score: 72,
      breakdown: {
        style: 16,
        composition: 14,
        lighting: 13,
        details: 15,
        atmosphere: 14,
      },
      what_worked: [
        'Captured the cyberpunk aesthetic with neon signage',
        'Rain reflections on the street pavement',
        'Strong sense of depth and perspective',
      ],
      what_to_improve: [
        'Target has steam rising from manhole covers — yours has none',
        'Missing the holographic billboard on the right side',
        'Color palette is more magenta in target, less blue',
      ],
      improved_prompt:
        'A rain-soaked cyberpunk street at night with magenta and pink neon signage reflecting on wet pavement, steam rising from manhole covers, and a large holographic billboard on the right side of the frame.',
    },
  },
  {
    key: 'forest',
    theme: 'cozy forest cabin in autumn',
    targetImageUrl: '/demo/target-forest.svg',
    attemptImageUrl: '/demo/attempt-forest.svg',
    feedback: {
      score: 78,
      breakdown: {
        style: 17,
        composition: 16,
        lighting: 14,
        details: 16,
        atmosphere: 15,
      },
      what_worked: [
        'Cabin shape and roof angle match the target well',
        'Warm tone in the sky reads as autumn',
        'Tree silhouettes give a sense of depth',
      ],
      what_to_improve: [
        'No smoke rising from the chimney — target has it clearly',
        'Foliage is too green; the target is burnt orange and red',
        'Missing fallen leaves scattered on the ground',
      ],
      improved_prompt:
        'A cozy log cabin in an autumn forest at golden hour, with smoke curling from the stone chimney, the surrounding trees in deep orange and crimson, and fallen leaves scattered across a soft path leading to the door.',
    },
  },
  {
    key: 'underwater',
    theme: 'underwater bioluminescent reef',
    targetImageUrl: '/demo/target-underwater.svg',
    attemptImageUrl: '/demo/attempt-underwater.svg',
    feedback: {
      score: 64,
      breakdown: {
        style: 14,
        composition: 13,
        lighting: 11,
        details: 13,
        atmosphere: 13,
      },
      what_worked: [
        'Got the deep ocean blue palette',
        'Coral shapes in the foreground are recognisable',
        'Depth fades into darkness reasonably',
      ],
      what_to_improve: [
        'No bioluminescence — target has glowing cyan and magenta corals',
        'Light beams from the surface are missing entirely',
        'Few/no fish silhouettes; target has small fish drifting through',
      ],
      improved_prompt:
        'An underwater bioluminescent reef in deep ocean blue, with corals glowing in cyan and magenta, soft light beams streaming down from the surface, and small silhouetted fish drifting through the scene.',
    },
  },
  {
    key: 'desert',
    theme: 'desert oasis at sunset',
    targetImageUrl: '/demo/target-desert.svg',
    attemptImageUrl: '/demo/attempt-desert.svg',
    feedback: {
      score: 84,
      breakdown: {
        style: 18,
        composition: 17,
        lighting: 17,
        details: 16,
        atmosphere: 16,
      },
      what_worked: [
        'Excellent sunset gradient — pink to amber matches target',
        'Palm tree silhouettes are well placed against the sky',
        'Reflection in the oasis water is a strong detail',
      ],
      what_to_improve: [
        'Sun in target sits lower on the horizon',
        'Sand dunes have a softer wave shape in target than yours',
        'Could use a couple of birds silhouetted in flight',
      ],
      improved_prompt:
        'A desert oasis at sunset with a low orange sun resting on the horizon, two palm trees silhouetted against a pink-to-amber sky, soft rolling dunes, the calm oasis water reflecting the colors above, and a pair of birds silhouetted in flight.',
    },
  },
  {
    key: 'castle',
    theme: 'medieval castle on a stormy cliff',
    targetImageUrl: '/demo/target-castle.svg',
    attemptImageUrl: '/demo/attempt-castle.svg',
    feedback: {
      score: 58,
      breakdown: {
        style: 13,
        composition: 13,
        lighting: 10,
        details: 11,
        atmosphere: 11,
      },
      what_worked: [
        'Castle silhouette on top of the cliff is correctly placed',
        'Sea is appropriately dark below',
      ],
      what_to_improve: [
        'No lightning — target has a clear bolt cutting through the sky',
        'Sky is too flat gray; target is dramatic with layered storm clouds',
        'Missing the white wave splashes against the cliff base',
        'Castle lacks the crenellations and tower detail visible in the target',
      ],
      improved_prompt:
        'A medieval stone castle perched on a jagged cliff during a violent storm, with a bright lightning bolt splitting the dark layered clouds, white waves crashing against the rocks below, and visible crenellations and a tall tower silhouetted against the sky.',
    },
  },
]

const SCENARIO_BY_KEY: Record<string, DemoScenario> = Object.fromEntries(
  DEMO_SCENARIOS.map((s) => [s.key, s]),
)

export function pickRandomScenario(): DemoScenario {
  return DEMO_SCENARIOS[Math.floor(Math.random() * DEMO_SCENARIOS.length)]
}

export function getScenarioByKey(key: string): DemoScenario | null {
  return SCENARIO_BY_KEY[key] ?? null
}

const DEMO_ID_PREFIX = 'demo'

export function buildDemoId(scenarioKey: string): string {
  return `${DEMO_ID_PREFIX}:${scenarioKey}:${crypto.randomUUID()}`
}

export function parseDemoId(id: string): string | null {
  const parts = id.split(':')
  if (parts.length < 3 || parts[0] !== DEMO_ID_PREFIX) return null
  return parts[1] ?? null
}

// Fallback used when the live judge call fails or scenario lookup misses.
// First scenario is the canonical default.
export const DEMO_FEEDBACK: Feedback = DEMO_SCENARIOS[0].feedback

export const isDemoMode = () =>
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
