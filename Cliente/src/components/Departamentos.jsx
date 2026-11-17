import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const Departamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [presupuesto, setPresupuesto] = useState('');
    const rol = localStorage.getItem('rol');

    const cargarDepartamentos = async () => {
        try {
            const res = await api.get('/departamentos/todos'); // O consulta general si se implementa
            setDepartamentos(res.data);
        } catch (error) {
            // Manejo silencioso o alerta si es necesario
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departamentos', { nombre, ciudad, presupuesto });
            Swal.fire('¡Éxito!', 'Departamento creado correctamente', 'success');
            setNombre('');
            setCiudad('');
            setPresupuesto('');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo crear el departamento', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Gestión de Departamentos</h2>
            
            {rol === 'administrador' && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre (Solo letras, puntos y espacios)</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input
                            type="text"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Presupuesto</label>
                        <input
                            type="number"
                            value={presupuesto}
                            onChange={(e) => setPresupuesto(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Crear Departamento
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Departamentos;
