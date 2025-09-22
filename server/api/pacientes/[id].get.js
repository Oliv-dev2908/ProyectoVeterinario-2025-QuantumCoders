import { pacientesService } from "../../services/pacientesService";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  return await pacientesService.obtenerPaciente(id);
});
