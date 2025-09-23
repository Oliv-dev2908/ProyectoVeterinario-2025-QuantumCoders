import axios from "axios";

const API_URL = "https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/pacientes";

export const pacientesService = {
  listarPacientes: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  crearPaciente: async (paciente) => {
    const res = await axios.post(API_URL, paciente);
    return res.data;
  },

  obtenerPaciente: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  actualizarPaciente: async (id, paciente) => {
    const res = await axios.put(`${API_URL}/${id}`, paciente);
    return res.data;
  },

  eliminarPaciente: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
