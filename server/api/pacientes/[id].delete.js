import { pacientesService } from "../../services/pacientesService";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  console.log("🧩 ID recibido:", id);
  return await pacientesService.eliminarPaciente(id);
});

