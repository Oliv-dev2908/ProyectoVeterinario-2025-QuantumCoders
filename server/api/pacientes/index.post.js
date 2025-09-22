import { pacientesService } from "../../services/pacientesService";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await pacientesService.crearPaciente(body);
});
