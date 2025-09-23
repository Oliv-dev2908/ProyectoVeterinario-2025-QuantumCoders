// server/api/expedientes/asignar.post.js
export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { paciente_id, nombre_archivo, url_publica, tipo_archivo }

  try {
    const result = await $fetch('https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/expedientes/', {
      method: 'POST',
      body
    })
    return result
  } catch (error) {
    return { statusCode: 500, message: error.message }
  }
})
