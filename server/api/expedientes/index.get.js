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

  // Hacer fetch de los metadatos de la API de expedientes para ver asignaciones
  const archivosAsignados = await $fetch('https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/expedientes/')
  
  const archivosNoAsignados = data
    .filter(file => !archivosAsignados.some(a => a.nombre_archivo === file.name))
    .map(file => ({
      ...file,
      selectedPaciente: '',
      url_publica: supabase.storage.from(process.env.BUCKET_NAME).getPublicUrl(file.name).data.publicUrl
    }))

  return archivosNoAsignados
})
