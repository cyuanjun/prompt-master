import { z } from 'zod'

export const FeedbackSchema = z.object({
  score: z.number().int().min(0).max(100),
  breakdown: z.object({
    style: z.number().int().min(0).max(20),
    composition: z.number().int().min(0).max(20),
    lighting: z.number().int().min(0).max(20),
    details: z.number().int().min(0).max(20),
    atmosphere: z.number().int().min(0).max(20),
  }),
  what_worked: z.array(z.string()).min(1).max(4),
  what_to_improve: z.array(z.string()).min(1).max(4),
  improved_prompt: z.string().min(10),
})

export type Feedback = z.infer<typeof FeedbackSchema>
