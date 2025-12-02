import { pacientesService } from "../../services/pacientesService";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const body = await readBody(event);

  if (event.req.method === "PUT") {
    try {
      return await pacientesService.actualizarPaciente(id, body);
    } catch (e) {
      event.res.statusCode = 500;
      return { error: e.message };
    }
  }

  if (event.req.method === "GET") {
    return await pacientesService.obtenerPaciente(id);
  }

  event.res.statusCode = 405;
  return { error: "Método no permitido" };
});
