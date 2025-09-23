import { createServer } from 'http'
import express from 'express'
import { createApp } from '@nuxt/nitro'
const port = process.env.PORT || 4000 
const app = express()

// Configuración de Nitro (opcional)
app.use((req, res) => {
  const nitroApp = createApp()
  return nitroApp(req, res)
})

const server = createServer(app)

server.listen(port, () => {
  console.log('Servidor Nitro con Express corriendo en http://localhost:${port}')
})
