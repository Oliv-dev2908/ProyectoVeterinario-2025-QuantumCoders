import { createServer } from 'http'
import express from 'express'
import { createApp } from '@nuxt/nitro'

const app = express()

// Configuración de Nitro (opcional)
app.use((req, res) => {
  const nitroApp = createApp()
  return nitroApp(req, res)
})

// Usar el puerto proporcionado por Render (o 3000 si no está configurado)
const port = process.env.PORT || 3000

const server = createServer(app)

// Escuchar en 0.0.0.0 y el puerto correcto
server.listen(port, '0.0.0.0', () => {
  console.log(`Servidor Nitro con Express corriendo en http://0.0.0.0:${port}`)
})
