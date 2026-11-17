import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const RecuperarPassword = ({ onVolverLogin }) => {
    const [step, setStep] = useState(1); // Paso 1: Solicitar email, Paso 2: Cambiar password
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');

    const handleSolicitar = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/recuperar-password', { email });
            Swal.fire({
                icon: 'success',
                title: 'Token Generado',
                text: 'Se ha generado el enlace de recuperación. (Revisa la consola/respuesta para pruebas).',
            });
            // Si el backend devuelve un token simulado para pruebas, podemos autocompletarlo o pedirlo
            if (res.data.resetToken) {
                setToken(res.data.resetToken);
            }
            setStep(2);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo procesar la solicitud', 'error');
        }
    };

    const handleRestablecer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/restablecer-password', { token, nuevaPassword });
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña Restablecida!',
                text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
                timer: 2000,
                showConfirmButton: false
            });
            onVolverLogin();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'El token es inválido o ha expirado', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
                </h2>

                {step === 1 ? (
                    <form onSubmit={handleSolicitar} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Enviar Enlace de Recuperación
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRestablecer} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Token de Recuperación</label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa el token recibido"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200"
                        >
                            Restablecer Contraseña
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <button
                        onClick={onVolverLogin}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Volver al Inicio de Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword;
