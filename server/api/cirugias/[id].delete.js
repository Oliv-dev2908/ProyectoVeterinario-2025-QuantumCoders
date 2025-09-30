import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  const res = await fetch(`https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/cirugias/${id}`, {
    method: 'DELETE'
  })

  const data = await res.json()
  return data
})
