import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default defineEventHandler(async (event) => {
  let { filename } = event.context.params
  filename = decodeURIComponent(filename) // muy importante

  const { data, error } = await supabase.storage
    .from(process.env.BUCKET_NAME)
    .remove([filename])

  if (error) return { statusCode: 400, message: error.message }

  return { message: 'Archivo eliminado con éxito', data }
})
