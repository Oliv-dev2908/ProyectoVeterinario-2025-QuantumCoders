import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { uuid } = event.context.params

  if (!uuid) return { error: 'Falta UUID' }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/usuarios/${uuid}`)
    
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
