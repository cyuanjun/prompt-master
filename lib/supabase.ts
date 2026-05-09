import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let _browser: SupabaseClient | null = null
let _server: SupabaseClient | null = null

export function getBrowserClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error('Supabase URL / anon key not set. Check .env.local.')
  }
  _browser ??= createClient(url, anonKey)
  return _browser
}

export function getServerClient(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error('Supabase URL / service role key not set. Check .env.local.')
  }
  _server ??= createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
  return _server
}

export const STORAGE_BUCKET = 'images'

export async function uploadImage(
  buffer: Buffer,
  path: string,
  contentType = 'image/png',
): Promise<string> {
  const supabase = getServerClient()
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, { contentType, upsert: false })
  if (error) throw error

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
