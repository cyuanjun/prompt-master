export const THEMES = [
  'cyberpunk neon city street at night',
  'cozy forest cabin in autumn',
  'underwater bioluminescent reef',
  'desert oasis at sunset',
  'medieval castle on a stormy cliff',
  'space station overlooking earth',
  'bustling night market with food stalls',
  'misty mountain temple at dawn',
  'art deco hotel lobby',
  'abandoned greenhouse reclaimed by nature',
  'arctic research base under aurora',
  'steampunk airship dock',
  'tropical beach with bioluminescent waves',
  'gothic cathedral interior at midnight',
  'futuristic farm with robotic harvesters',
  'tea house in a bamboo grove',
  'neon-lit ramen shop in the rain',
  'crystal cave with underground river',
  'rooftop garden in a megacity',
  'lighthouse during a thunderstorm',
  'volcanic landscape with lava rivers',
  'snowy village during winter festival',
  'ancient library with floating books',
  'busy diner at 3am',
  '80s arcade with crt glow',
  'wizard\'s workshop with potions and tomes',
  'submarine corridor with red emergency lights',
  'desert highway under a meteor shower',
  'hot air balloon festival at golden hour',
  'pirate cove with a beached galleon',
] as const

export type Theme = (typeof THEMES)[number]

export function pickRandomTheme(): Theme {
  return THEMES[Math.floor(Math.random() * THEMES.length)]
}
