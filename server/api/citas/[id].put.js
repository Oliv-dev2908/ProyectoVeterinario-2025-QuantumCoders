import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const body = await readBody(event)

  const res = await fetch(`https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/citas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  return data
})
