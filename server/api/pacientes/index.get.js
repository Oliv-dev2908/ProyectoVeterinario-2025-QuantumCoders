import { pacientesService } from "../../services/pacientesService";

export default defineEventHandler(async () => {
  return await pacientesService.listarPacientes();
});
