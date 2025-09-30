// server/api/user/loginsignup.js
import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { uuid, name, email } = getQuery(event)

  if (!uuid || !name || !email) {
    return { error: "Faltan datos necesarios" }
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/usuarios/', { //NO OLVIDAR CUANDO ESTE EL RENDER
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: name,
        email: email,
        rol_id: 1,
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
    console.error("Error al insertar usuario:", err)
    return { error: err.message }
  }
})
