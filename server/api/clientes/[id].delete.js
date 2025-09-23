import { clientesService } from "../../services/clientesService";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  return await clientesService.eliminarCliente(id);
});
