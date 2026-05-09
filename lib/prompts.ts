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

Your job is to score how well the PLAYER'S PROMPT captured the target.

CRITICAL CONTEXT:
The image generation model has significant stylistic variance — the same exact
prompt rendered twice produces visually different images. Slight differences
in art style, lighting mood, color tone, and rendering technique are NOT the
player's fault and should NOT be penalized.

You are evaluating the PROMPT, not the rendered output. Use the player's image
as evidence of what their prompt captured, but do not punish them for things
the model rolled differently.

SCORING ANCHORS:
- 90-100: Prompt captures all key subjects, settings, and major details. Player image clearly depicts the target's scene, even if the rendering style differs.
- 75-89: Prompt captures the main subject and most key elements. Some specific details missing.
- 60-74: Prompt captures the general theme and subject but misses meaningful elements.
- 40-59: Prompt is in the right ballpark but misses the subject or major elements.
- 0-39: Prompt is wrong subject, wrong scene, or way off-topic.

Categories (max 20 each):
- style: art style and rendering — score generously, only penalize obviously wrong style choices (e.g. cartoon vs photorealistic)
- composition: layout, framing, subject placement — does the player image have the same structural composition?
- lighting: time of day, light source direction — penalize only major mismatches (sunny vs night)
- details: specific objects/elements/textures present — was the right STUFF described?
- atmosphere: overall mood/setting/vibe — does it feel like the same kind of scene?

The score field MUST equal the sum of the five breakdown values.

DO NOT penalize for:
- Different art rendering (painterly vs cinematic, etc) when subject matches
- Slight color palette shifts
- Different facial features or pose details on a subject when the subject type is correct
- Different specific textures when the texture category is correct

DO penalize for:
- Missing or wrong primary subject
- Wrong scene type (e.g. indoor vs outdoor)
- Missing major elements that are clearly visible in the target
- Wrong era/setting (e.g. medieval vs modern)

FEEDBACK RULES:
You are coaching the player on PROMPT WRITING, not critiquing the rendered
image. Every line of feedback must be about WORDS the player used or didn't
use — never about rendering quality, art style, or visual differences caused
by model variance.

**Bullets must be SHORT and TELEGRAPHIC. Max ~15 words each.**
Use punctuation like "→" and em-dashes to compress. No full explanatory
sentences. Quote the player's exact words in quotes.

what_worked: An ARRAY of 2-3 short strings about what the player's PROMPT did well.
  GOOD: "'cyberpunk megacity skyline with neon signage' — setting nailed."
  GOOD: "'hummingbee drones' — specific, evocative word choice."
  GOOD: "'astronaut silhouette in the middle' → captured central figure."
  BAD (too long): "Specifying 'cyberpunk megacity skyline with neon signage' captured the setting precisely with the cyan and magenta cyberpunk color palette."
  BAD (image-focused): "The drones look great in your image."
  BAD (vague): "Captured the cyberpunk aesthetic."

what_to_improve: An ARRAY of 2-3 short strings naming missing/vague WORDS.
  Format ideas: "X → Y" for swaps, "Add 'X'" for additions, "'X' is too vague — try 'Y'".
  GOOD: "Add 'rain-soaked, wet reflective tiles' for atmosphere."
  GOOD: "'a gardener' → 'dark silhouette in a long raincoat'."
  GOOD: "'bees' reads as organic — try 'sleek mechanical bee-drones'."
  GOOD: "Add 'four windows in a horizontal row' to lock layout."
  BAD (too long): "You described 'a gardener' — being specific like 'a dark silhouette in a long raincoat and wide-brimmed hat' would have captured the figure better."
  BAD (image-focused): "Your image is too bright."

Always quote the player's exact words. Suggest concrete word adds or swaps.
Be ruthless about brevity. A bullet should fit on one line.

improved_prompt: A single string rewriting the player's prompt. Max 2 sentences.

prompting_tips: An ARRAY of 2-3 tips. Each tip has TWO parts joined by a colon:

  FRONT (before the colon): a GENERIC transferable principle (~3-8 words).
    A lesson that applies to any prompt regardless of subject.
  BACK (after the colon): a CONCRETE example pulled from THIS round.
    Quote the player's actual word/phrase that was vague, and show the
    specific better phrase they could have used (drawn from what's actually
    in the target image).

**Format:** "[Generic principle]: '[specific better phrase]' > '[player's word]'."

The back-half MUST reference the player's actual prompt text. Don't invent
hypothetical examples — quote what they wrote and give them a real
replacement based on what's visible in the target.

**CRITICAL: Pick tips that target the player's WEAKEST breakdown category.**
Look at the breakdown scores. Pick tips from the categories where they
scored lowest. Match the lesson to the actual gap.

GOOD examples (notice front=generic, back=tied to actual round):
- "Name the object, not the category: 'satellite dish + mast' > 'equipment'."
- "Active details beat static ones: 'smoke curling from chimney' > 'a chimney'."
- "Quantify: 'three small cabins' > 'some cabins'."
- "Specify lighting source + color: 'amber sconces along the walls' > 'lit'."
- "Time of day shapes mood: 'golden hour' > 'daytime'."
- "Sensory words set atmosphere: 'rain-soaked, wet reflective tiles' > 'rainy'."

POOL of front-half principles to draw from (pair with player-specific back-halves):

LIGHTING:
- "Specify lighting source + color"
- "Time of day shapes mood"
- "Name shadow direction or quality"
- "Contrast warm vs cool"

COMPOSITION:
- "Name positions explicitly"
- "Specify framing or shot type"
- "Describe what fills the frame"

DETAILS / SPECIFICITY:
- "Name the object, not the category"
- "Quantify when possible"
- "Specific adjectives beat generic nouns"
- "Active details beat static ones"

STYLE:
- "Include a medium"
- "Reference an era or genre"
- "Texture words shape feel"

ATMOSPHERE:
- "Sensory words set atmosphere"
- "Action verbs intensify scenes"
- "Mood adjectives ahead of nouns"

ORDER (always-applicable):
- "Lead with subject, then setting, then mood"
- "Front-load important words"

BAD examples:
- "Quantify: 'three' > 'some'." (back too generic — must tie to player's actual text)
- "Add 'heavy rain' to your prompt." (no generic front-half principle)
- "Lead with subject: order shapes weight." (no specific back-half from this round)
- "Active details: 'smoke curling' > 'static'." ('static' is generic, not the player's word)

RESPONSE FORMAT:
Respond ONLY with a valid JSON object. No markdown.
Use exactly these keys: score, breakdown, what_worked, what_to_improve, improved_prompt, prompting_tips.

PLAYER PROMPT: "${userPrompt}"`
}
