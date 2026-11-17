import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import api from '../services/api';
import Swal from 'sweetalert2';

const LectorQR = ({ onLoginSuccess, onCancelar }) => {
    const [data, setData] = useState('Escanea el código QR de acceso');

    const handleScan = async (result, error) => {
        if (result) {
            const qrText = result?.text || result;
            setData(qrText);
            
            try {
                // Enviar el identificador del QR escaneado al backend
                const payload = {
                    provider: 'qr',
                    provider_id: qrText,
                    email: `usuario_qr_${qrText}@ejemplo.com`,
                    nombre: 'Usuario',
                    apellido: 'QR',
                    usuario: `qr_${qrText.substring(0, 8)}`
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
            } catch (err) {
                Swal.fire('Error', 'El código QR no es válido o no está registrado.', 'error');
            }
        }

        if (error) {
            // Se pueden ignorar errores de lectura continua mientras no detecte código
            console.info(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Escanea tu Código QR</h3>
                
                <div className="overflow-hidden rounded-md mb-4 bg-black">
                    <QrReader
                        constraints={{ facingMode: 'user' }}
                        onResult={handleScan}
                        style={{ width: '100%' }}
                    />
                </div>

                <p className="text-sm text-gray-600 mb-4">{data}</p>

                <button
                    onClick={onCancelar}
                    className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                    Cancelar / Volver
                </button>
            </div>
        </div>
    );
};

export default LectorQR;
