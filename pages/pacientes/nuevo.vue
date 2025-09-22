<template>
    <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-4">Nuevo Paciente</h1>

        <form @submit.prevent="crearPaciente" class="space-y-4">

            <div>
                <label class="block font-medium">Cliente</label>
                <select v-model="paciente.id_cliente" required class="border p-2 w-full rounded">
                    <option value="" disabled>Selecciona un cliente</option>
                    <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
                        {{ c.nombres }} {{ c.apellidos }}
                    </option>
                </select>
            </div>


            <div>
                <label class="block font-medium">Nombre</label>
                <input type="text" v-model="paciente.nombre" required class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Especie</label>
                <input type="text" v-model="paciente.especie" required class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Raza</label>
                <input type="text" v-model="paciente.raza" required class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Edad</label>
                <input type="number" v-model="paciente.edad" required class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Sexo</label>
                <select v-model="paciente.sexo" class="border p-2 w-full rounded">
                    <option :value="true">Macho</option>
                    <option :value="false">Hembra</option>
                </select>
            </div>

            <div>
                <label class="block font-medium">Color</label>
                <input type="text" v-model="paciente.color" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Tamaño (cm)</label>
                <input type="number" v-model="paciente.tamanocm" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Estado Reproductivo</label>
                <input type="text" v-model="paciente.estado_reproductivo" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Gestación</label>
                <select v-model="paciente.gestacion" class="border p-2 w-full rounded">
                    <option :value="true">Sí</option>
                    <option :value="false">No</option>
                </select>
            </div>

            <div>
                <label class="block font-medium">Alimentación</label>
                <input type="text" v-model="paciente.alimentacion" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Cirugías Previas</label>
                <input type="text" v-model="paciente.cirugiasprevias" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Estado</label>
                <input type="text" v-model="paciente.estado" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Estado Corporal</label>
                <input type="text" v-model="paciente.estado_corporal" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Peso (kg)</label>
                <input type="number" step="0.1" v-model="paciente.peso" class="border p-2 w-full rounded" />
            </div>

            <div>
                <label class="block font-medium">Foto URL</label>
                <input type="text" v-model="paciente.foto_url" class="border p-2 w-full rounded" />
            </div>

            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Crear Paciente
            </button>

            <p v-if="mensaje" class="text-green-500">{{ mensaje }}</p>
            <p v-if="error" class="text-red-500">{{ error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const clientes = ref([]); // lista de clientes
const paciente = ref({
    id_cliente: null,
    nombre: "",
    especie: "",
    raza: "",
    edad: null,
    sexo: true,
    color: "",
    tamanocm: null,
    estado_reproductivo: "",
    gestacion: false,
    alimentacion: "",
    cirugiasprevias: "",
    estado: "",
    estado_corporal: "",
    peso: null,
    foto_url: "",
});

const mensaje = ref("");
const error = ref("");

// Traer clientes al montar el componente
onMounted(async () => {
    try {
        clientes.value = await $fetch("/api/clientes");
    } catch (e) {
        console.error("Error al obtener clientes", e);
    }
});

</script>
