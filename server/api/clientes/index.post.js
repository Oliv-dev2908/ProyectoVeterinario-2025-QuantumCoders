import { clientesService } from "../../services/clientesService";

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // leer JSON enviado desde el cliente
  return await clientesService.crearCliente(body);
});
