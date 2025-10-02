export default defineEventHandler(async () => {
  const API_URL = "https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/tratamientos/";
  return await $fetch(API_URL);
});
