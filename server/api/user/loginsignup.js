// server/api/user/loginsignup.js
import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { uuid, name, email } = getQuery(event)

  if (!uuid || !name || !email) {
    return { error: "Faltan datos necesarios" }
  }

  try {
    // 1. Verificar si ya existe en la API (buscar por supabase_user_id)
    let existingUserRes = await fetch(`https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/usuarios/${uuid}`)
    if (existingUserRes.ok) {
      const existingUser = await existingUserRes.json()
      if (existingUser) {
        return existingUser // ✅ ya existe en la BD → lo devolvemos
      }
    }

    // 2. Si no existe → creamos usuario
    const response = await fetch('https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/usuarios/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: name,
        email: email,
        rol_id: 1, // rol por defecto
        activo: true,
        supabase_user_id: uuid
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { error: `Error en API usuarios: ${errorText}` }
    }

    return await response.json()

  } catch (err) {
    console.error("Error en loginsignup:", err)
    return { error: err.message }
  }
})
