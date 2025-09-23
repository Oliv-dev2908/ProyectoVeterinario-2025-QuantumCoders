const API_URL = "https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/expedientes"

export const expedienteRepository = {
  create(data) {
    return $fetch(`${API_URL}`, { method: "POST", body: data })
  },

  listByPaciente(pacienteId) {
    return $fetch(`${API_URL}${pacienteId}`)
  },

  remove(id) {
    return $fetch(`${API_URL}${id}`, { method: "DELETE" })
  }
}
