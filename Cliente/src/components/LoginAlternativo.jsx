import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const LoginAlternativo = ({ onLoginSuccess }) => {
    const [cargando, setCargando] = useState(false);

    // Agrega el estado para mostrar el lector QR
    const [mostrarLectorQR, setMostrarLectorQR] = useState(false);

    {/* Renderizar el componente modal si está activo */}
{mostrarLectorQR && (
    <LectorQR 
        onLoginSuccess={onLoginSuccess} 
        onCancelar={() => setMostrarLectorQR(false)} 
    />
)}

    // 1. Simulación de Autenticación Social (Google, GitHub, Twitter, etc.)
    const handleLoginSocial = async (provider) => {
        setCargando(true);
        try {
            // Simulamos datos devueltos por el proveedor OAuth
            const payload = {
                provider,
                provider_id: `${provider}_id_${Math.floor(Math.random() * 100000)}`,
                email: `usuario_${provider}@ejemplo.com`,
                nombre: `Usuario`,
                apellido: provider.toUpperCase(),
                usuario: `user_${provider}_${Math.floor(Math.random() * 1000)}`
            };

            const response = await api.post('/auth/login-externo', payload);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('rol', response.data.rol);

            Swal.fire({
                icon: 'success',
                title: `¡Bienvenido vía ${provider}!`,
                timer: 1500,
                showConfirmButton: false
            });

            onLoginSuccess();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || `No se pudo autenticar con ${provider}`, 'error');
        } finally {
            setCargando(false);
        }
    };

    // 2. Simulación de Autenticación Biométrica (Huella Digital / WebAuthn o Huella de Voz)
    const handleLoginBiometrico = async (tipo) => {
        setCargando(true);
        try {
            // Simulación de validación biométrica exitosa
            const payload = {
                provider: tipo,
                provider_id: `${tipo}_bio_${Math.floor(Math.random() * 100000)}`,
                email: `usuario_${tipo}@biometrico.com`,
                nombre: 'Bio',
                apellido: tipo === 'huella_digital' ? 'Digital' : 'Voz',
                usuario: `bio_${Math.floor(Math.random() * 1000)}`
            };

            const response = await api.post('/auth/login-externo', payload);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('rol', response.data.rol);

            Swal.fire({
                icon: 'success',
                title: `¡Autenticación por ${tipo === 'huella_digital' ? 'Huella Digital' : 'Huella de Voz'} Exitosa!`,
                timer: 1500,
                showConfirmButton: false
            });

            onLoginSuccess();
        } catch (error) {
            Swal.fire('Error', 'Falló la verificación biométrica.', 'error');
        } finally {
            setCargando(false);
        }
    };

    // 3. Simulación de Escaneo de Código QR
    const handleLoginQR = () => {
        Swal.fire({
            title: 'Escaneo de Código QR',
            text: 'Acerca tu código QR a la cámara o sube la imagen.',
            input: 'text',
            inputPlaceholder: 'Ingresa el código del QR escaneado...',
            showCancelButton: true,
            confirmButtonText: 'Validar QR'
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    const payload = {
                        provider: 'qr',
                        provider_id: result.value,
                        email: `usuario_qr@ejemplo.com`,
                        nombre: 'Usuario',
                        apellido: 'QR',
                        usuario: `qr_user_${Math.floor(Math.random() * 1000)}`
                    };

                    const response = await api.post('/auth/login-externo', payload);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('rol', response.data.rol);

                    Swal.fire({
                        icon: 'success',
                        title: '¡Acceso con QR Exitoso!',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    onLoginSuccess();
                } catch (error) {
                    Swal.fire('Error', 'Código QR inválido o no reconocido.', 'error');
                }
            }
        });
    };

    return (
        <div className="mt-6 space-y-4">
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">O ingresa mediante</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Redes Sociales */}
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleLoginSocial('google')} disabled={cargando} className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center">
                    Google
                </button>
                <button onClick={() => handleLoginSocial('github')} disabled={cargando} className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center">
                    GitHub
                </button>
                <button onClick={() => handleLoginSocial('twitter')} disabled={cargando} className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center">
                    Twitter
                </button>
                <button onClick={() => handleLoginSocial('facebook')} disabled={cargando} className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center">
                    Facebook
                </button>
                <button onClick={() => handleLoginSocial('instagram')} disabled={cargando} className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center">
                    Instagram
                </button>
                <button onClick={() => handleLoginSocial('linkedin')} disabled={cargando} className="px-3 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center">
                    LinkedIn
                </button>
            </div>

            {/* Métodos Biométricos y QR */}
            <div className="grid grid-cols-3 gap-2 pt-2">
                <button onClick={() => handleLoginBiometrico('huella_digital')} disabled={cargando} className="px-2 py-2 bg-gray-800 text-white rounded-md text-xs font-medium hover:bg-gray-700">
                    Huella Digital
                </button>
                <button onClick={() => handleLoginBiometrico('huella_voz')} disabled={cargando} className="px-2 py-2 bg-gray-800 text-white rounded-md text-xs font-medium hover:bg-gray-700">
                    Huella de Voz
                </button>
                <button onClick={handleLoginQR} disabled={cargando} className="px-2 py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700">
                    Código QR
                </button>
// En la sección del botón QR:
<button onClick={() => setMostrarLectorQR(true)} className="px-2 py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700">
    Código QR
</button>
            </div>
        </div>
    );
};

export default LoginAlternativo;
