import fetch from 'node-fetch'

export default defineEventHandler(async () => {
  const res = await fetch('http://127.0.0.1:8000/api/v1/citas')
  const data = await res.json()
  return data
})
