import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  const res = await fetch(`http://127.0.0.1:8000/api/v1/recordatorios/${id}`, {
    method: 'DELETE'
  })

  // 🧠 Si el servidor respondió con error (500, 404, etc)
  if (!res.ok) {
    const text = await res.text()
    console.error("❌ Error al eliminar consulta:", text)
    throw createError({
      statusCode: res.status,
      statusMessage: `Error al eliminar consulta: ${text}`
    })
  }

  // ✅ Si todo bien, devolver JSON
  const data = await res.json()
  return data
})
