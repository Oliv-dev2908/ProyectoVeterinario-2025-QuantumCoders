export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const API_URL = `https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/tratamientos/${id}`;
  
  return await $fetch(API_URL);
});
