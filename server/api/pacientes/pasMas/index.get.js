export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const skip = Number(query.skip ?? 0);
  const limit = Number(query.limit ?? 20);
  const search = query.search ?? "";

  // Llamada al backend FastAPI
  const res = await $fetch('https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/pacientes/pasMas', {
    params: {
      skip,
      limit,
      ...(search ? { search } : {}),
    }
  });

  return res; // ya contiene items y total si tu API lo devuelve
});

