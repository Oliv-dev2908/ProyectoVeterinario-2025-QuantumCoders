export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);

  const API_URL = `https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/fisioterapia/${id}`;
  
  return await $fetch(API_URL, {
    method: "PUT",
    body
  });
});
