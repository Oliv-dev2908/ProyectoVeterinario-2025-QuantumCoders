import fetch from 'node-fetch'

export default defineEventHandler(async () => {
  const res = await fetch('https://apisproyectoveterinario-2025.onrender.com/ml/visuals?use_synthetic=true&n_samples=10000')
  const data = await res.json()
  return data
})
