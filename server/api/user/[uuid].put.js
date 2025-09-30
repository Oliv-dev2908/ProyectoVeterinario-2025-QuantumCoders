import fetch from "node-fetch"

export default defineEventHandler(async (event) => {
  const { uuid } = event.context.params
  const body = await readBody(event)

  if (!uuid) return { error: "Falta UUID" }

  try {
    const response = await fetch(`https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/usuarios/${uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { error: `Error al actualizar usuario: ${errorText}` }
    }

    return await response.json()
  } catch (err) {
    console.error("Error en PUT /api/user/[uuid]:", err)
    return { error: err.message }
  }
})
