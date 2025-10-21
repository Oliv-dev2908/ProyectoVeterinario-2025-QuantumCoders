// server/api/whatsapp/send.js
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    let { phone, message } = body

    if (!phone || !message) {
      return { error: "Faltan datos: teléfono o mensaje" }
    }

    // Limpiar el teléfono y agregar '+'
    phone = phone.toString().replace(/\D/g, "")
    phone = `+${phone}`

    const API_KEY = process.env.WASENDER_API_KEY
    if (!API_KEY) throw new Error("Falta la variable de entorno WASENDER_API_KEY")

    // Llamada a la API de WhatsApp
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
    console.error("Error al enviar mensaje:", error.response?.data || error.message || error)
    console.log("API Key:", API_KEY)
    console.log("Phone:", phone)
    console.log("Message:", message)
    return { error: "No se pudo enviar el mensaje" }
  }
})

