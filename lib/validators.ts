import { z } from 'zod'

// Accepts either an array of strings (preferred) or a single string
// (fallback — gpt-5.5 occasionally returns one in place of the other).
const StringOrArray = z
  .union([
    z.array(z.string().min(1)).min(1).max(4),
    z.string().min(1).transform((s) => [s]),
  ])
  .pipe(z.array(z.string().min(1)).min(1).max(4))

export const FeedbackSchema = z.object({
  score: z.number().int().min(0).max(100),
  breakdown: z.object({
    style: z.number().int().min(0).max(20),
    composition: z.number().int().min(0).max(20),
    lighting: z.number().int().min(0).max(20),
    details: z.number().int().min(0).max(20),
    atmosphere: z.number().int().min(0).max(20),
  }),
  what_worked: StringOrArray,
  what_to_improve: StringOrArray,
  improved_prompt: z.string().min(10),
  prompting_tips: StringOrArray,
})

export type Feedback = z.infer<typeof FeedbackSchema>
