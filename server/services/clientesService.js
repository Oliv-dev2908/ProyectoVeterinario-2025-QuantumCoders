// server/services/clientesService.js
import axios from "axios";

const API_URL = "https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/clientes";

export const clientesService = {
  listarClientes: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  crearCliente: async (cliente) => {
    const res = await axios.post(API_URL, cliente);
    return res.data;
  },

  obtenerCliente: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  actualizarCliente: async (id, cliente) => {
    const res = await axios.put(`${API_URL}/${id}`, cliente);
    return res.data;
  },

  eliminarCliente: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
