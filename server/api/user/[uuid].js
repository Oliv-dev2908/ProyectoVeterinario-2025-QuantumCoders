import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { uuid } = event.context.params

  if (!uuid) return { error: 'Falta UUID' }

  try {
    const response = await fetch(`https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/usuarios/${uuid}`)
    
    if (!response.ok) {
      const text = await response.text()
      return { error: `Error al obtener usuario: ${text}` }
    }

    const data = await response.json()
    return data

  } catch (err) {
    console.error('Error al obtener usuario:', err)
    return { error: err.message }
  }
})
