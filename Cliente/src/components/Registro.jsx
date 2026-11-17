import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const Registro = ({ onRegistroSuccess }) => {
    const [formData, setFormData] = useState({
        usuario: '',
        password: '',
        apellido: '',
        nombre: '',
        dni: '',
        telefono: '',
        email: '',
        rol: 'operador'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/registro', formData);
            
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: 'Usuario creado correctamente. Ya puedes iniciar sesión.',
                timer: 2000,
                showConfirmButton: false
            });

            if (onRegistroSuccess) {
                onRegistroSuccess();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el Registro',
                text: error.response?.data?.error || 'Verifique que el usuario, DNI, teléfono o email no estén duplicados.'
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registro de Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nombre"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Apellido"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de Usuario (Único)</label>
                        <input
                            type="text"
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="usuario123"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">DNI (Único)</label>
                            <input
                                type="text"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="12345678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono (Único)</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="3001234567"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo Electrónico (Único)</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rol del Sistema</label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="operador">Operador</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200 font-medium"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Registro;
