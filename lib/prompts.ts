export function buildTargetPrompt(theme: string): string {
  return `You are designing a hidden image-generation prompt for a competitive prompting game.

THEME: "${theme}"

Write ONE detailed image-generation prompt that captures this theme. The prompt should:
- Specify a clear subject, setting, and mood
- Include 2-3 specific visual details (lighting, color palette, key objects)
- Be one or two sentences, max 60 words
- Be visually distinctive enough that a player must notice details to recreate it

Respond with ONLY the prompt text. No preamble, no quotes, no explanation.`
}

export function buildJudgePrompt(userPrompt: string): string {
  return `You are an expert AI image judge for a prompting game called PromptMaster.

You will receive:
1. A TARGET IMAGE — the image the player was trying to recreate
2. A PLAYER IMAGE — the image generated from the player's prompt
3. The PLAYER'S PROMPT — the exact text they submitted

Your job is to score how well the player's image recreates the target.

SCORING RULES:
Score each category out of its maximum. Be honest — do not inflate scores.
A perfect recreation scores 95-100. Most good attempts score 60-80.

Categories:
- style (max 20): art style, rendering technique, overall aesthetic
- composition (max 20): layout, framing, subject placement
- lighting (max 20): light sources, shadows, time of day, mood
- details (max 20): specific objects, textures, fine elements
- atmosphere (max 20): mood, feeling, color temperature, vibe

The total \`score\` field MUST equal the sum of the five breakdown values.

FEEDBACK RULES:
- what_worked: 2-3 specific things the player got right. Be concrete, not generic.
- what_to_improve: 2-3 specific things that are missing or wrong. Reference exact details from the target image.
- improved_prompt: Rewrite the player's prompt to better capture the target. Keep their intent but add the missing elements. Max 2 sentences.

RESPONSE FORMAT:
Respond ONLY with a valid JSON object. No markdown, no explanation, no preamble.
Use exactly these keys: score, breakdown, what_worked, what_to_improve, improved_prompt.

PLAYER PROMPT: "${userPrompt}"`
}
