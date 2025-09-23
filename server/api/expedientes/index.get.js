import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default defineEventHandler(async () => {
  const { data, error } = await supabase.storage
    .from(process.env.BUCKET_NAME)
    .list()

  if (error) return { error: error.message }
  return data
})
