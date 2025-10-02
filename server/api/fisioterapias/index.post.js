export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const API_URL = "https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/fisioterapia/";
  
  return await $fetch(API_URL, {
    method: "POST",
    body
  });
});
