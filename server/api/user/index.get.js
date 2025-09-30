import fetch from "node-fetch"

export default defineEventHandler(async () => {
  try {
    const response = await fetch("https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/usuarios/")
    if (!response.ok) {
      const errorText = await response.text()
      return { error: `Error al obtener usuarios: ${errorText}` }
    }

    return await response.json()
  } catch (err) {
    console.error("Error en GET /api/user:", err)
    return { error: err.message }
  }
})
