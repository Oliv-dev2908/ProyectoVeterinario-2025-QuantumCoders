import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default defineEventHandler(async (event) => {
  // Leer los archivos del multipart/form-data
  const files = await readMultipartFormData(event)

  if (!files || files.length === 0) {
    return sendError(event, createError({ statusCode: 400, message: 'No se subió ningún archivo' }))
  }

  const file = files[0]

  // Validación de tipo
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  if (!allowedTypes.includes(file.type)) {
    return sendError(event, createError({ statusCode: 400, message: 'Tipo de archivo no permitido' }))
  }

  // Validación de tamaño (50 MB)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    return sendError(event, createError({ statusCode: 400, message: 'Archivo demasiado grande (máx 50 MB)' }))
  }

  // Subir a Supabase
  const { data, error } = await supabase.storage
    .from(process.env.BUCKET_NAME)
    .upload(file.filename, file.data, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    return sendError(event, createError({ statusCode: 500, message: error.message }))
  }

  return { message: 'Archivo subido con éxito', file: data }
})
