import fetch from 'node-fetch'

export default defineEventHandler(async () => {
  const res = await fetch('https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/consultasCitas')
  const data = await res.json()
  return data
})
