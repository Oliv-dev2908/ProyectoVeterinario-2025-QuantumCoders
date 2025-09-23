import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default defineEventHandler(async (event) => {
  let { filename } = event.context.params
  filename = decodeURIComponent(filename)

  // Obtener URL temporal (signed URL)
  const { data, error } = await supabase.storage
    .from(process.env.BUCKET_NAME)
    .createSignedUrl(filename, 60) // URL válida 60 segundos

  if (error) return { statusCode: 400, message: error.message }

  return { url: data.signedUrl }
})
