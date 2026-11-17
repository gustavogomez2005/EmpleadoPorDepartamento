import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import LoginAlternativo from './LoginAlternativo'; // <--- Importar componente

const Login = ({ onLoginSuccess }) => {
    const [identificador, setIdentificador] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { identificador, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('rol', response.data.rol);
            
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Sesión iniciada correctamente',
                timer: 1500,
                showConfirmButton: false
            });

            onLoginSuccess();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: error.response?.data?.error || 'Credenciales inválidas o cuenta bloqueada.'
            });
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Usuario, Email o Teléfono</label>
                    <input
                        type="text"
                        value={identificador}
                        onChange={(e) => setIdentificador(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese su usuario, correo o teléfono"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Ingresar
                </button>
            </form>

            {/* Opciones de acceso social, biométrico y QR */}
            <LoginAlternativo onLoginSuccess={onLoginSuccess} />
        </div>
    );
};

export default Login;
