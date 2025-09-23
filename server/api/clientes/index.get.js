import { clientesService } from "../../services/clientesService";

export default defineEventHandler(async (event) => {
  return await clientesService.listarClientes();
});
