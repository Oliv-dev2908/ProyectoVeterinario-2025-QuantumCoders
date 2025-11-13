import fetch from 'node-fetch'

export default defineEventHandler(async () => {
  const res = await fetch('https://apisproyectoveterinario-2025.onrender.com/ml/visuals?use_synthetic=false')
  const data = await res.json()
  return data
})
