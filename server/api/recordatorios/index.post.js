// server/api/recordatorios/index.post.js
import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const res = await fetch('http://127.0.0.1:8000/api/v1/recordatorios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Error al crear recordatorio: ${text}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
    return { error: err.message }
  }
})
