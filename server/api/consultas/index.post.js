import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const res = await fetch('https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/consultasCitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    // Verificar si la respuesta es correcta
    if (!res.ok) {
      const text = await res.text() // leer el cuerpo como texto
      throw new Error(`Error al crear cirugía: ${text}`)
    }

    const data = await res.json()
    return data

  } catch (err) {
    console.error(err)
    return { error: err.message }
  }
})
