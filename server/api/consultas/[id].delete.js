import fetch from 'node-fetch'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  const res = await fetch(`http://127.0.0.1:8000/api/v1/consultasCitas/${id}`, {
    method: 'DELETE'
  })

  const data = await res.json()
  return data
})
