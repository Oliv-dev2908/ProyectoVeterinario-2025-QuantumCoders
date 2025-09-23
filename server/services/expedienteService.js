// server/services/expedienteService.js
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const config = useRuntimeConfig() // Esto funciona aquí porque estamos dentro de un service/server API
  return createClient(config.supabaseUrl, config.supabaseKey)
}

export const expedienteService = {
  async uploadArchivo(pacienteId, file) {
    const supabase = getSupabaseClient()

    const fileName = `${pacienteId}/${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from(process.env.BUCKET_NAME)
      .upload(fileName, file, { upsert: true })

    if (error) throw new Error(error.message)

    const { data: { publicUrl } } = supabase.storage
      .from(process.env.BUCKET_NAME)
      .getPublicUrl(fileName)

    return await $fetch(
      `https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/expedientes`,
      {
        method: 'POST',
        body: {
          paciente_id: pacienteId,
          nombre_archivo: file.name,
          url_publica: publicUrl,
          tipo_archivo: file.type
        }
      }
    )
  }
}
