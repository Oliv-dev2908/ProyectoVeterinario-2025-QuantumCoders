// server/api/cirugias/paciente/[id].get.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  try {
    // Obtenemos las cirugías del paciente desde tu API remota
    const res = await fetch(`https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/tratamientos/paciente/${id}`)
    if (!res.ok) throw new Error('Error al obtener cirugías')
    const cirugias = await res.json()

    // Para cada cirugía, llamamos a la función de Supabase que obtiene el nombre del usuario
    const cirugiasConUsuario = await Promise.all(
      cirugias.map(async (c) => {
        try {
          const { data, error } = await supabase
            .rpc('get_nombre_usuario', { p_id_usuario: c.id_usuario })

          if (error) throw error
          
          // Si la función devuelve directamente el nombre como texto
          const nombreUsuario = typeof data === 'string' ? data : data?.nombre || 'Desconocido'

          return { ...c, usuario_nombre: nombreUsuario }
        } catch (err) {
          return { ...c, usuario_nombre: 'Desconocido' }
        }
      })
    )

    return cirugiasConUsuario
  } catch (err) {
    console.error(err)
    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})
