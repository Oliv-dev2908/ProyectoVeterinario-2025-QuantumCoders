// server/api/whatsapp/send.js
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let { phone, message } = body

  if (!phone || !message) {
    return { error: "Faltan datos: teléfono o mensaje" }
  }

  // Asegurarse de que phone tenga solo números y el prefijo '+'
  phone = phone.toString().replace(/\D/g, "") // eliminamos todo lo que no sea número
  phone = `+${phone}` // agregamos el '+'

  try {
    const API_KEY = process.env.WASENDER_API_KEY
    if (!API_KEY) throw new Error("Falta la variable de entorno WASENDER_API_KEY")

    const response = await $fetch("https://wasenderapi.com/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: {
        to: phone,
        text: message,
      },
    })

    return { success: true, data: response }
  } catch (error) {
    console.error("Error al enviar mensaje:", error.data || error)
    return { error: "No se pudo enviar el mensaje" }
  }
})
