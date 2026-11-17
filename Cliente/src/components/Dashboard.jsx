import React, { useState } from 'react';
import Departamentos from './Departamentos';
import Empleados from './Empleados';
import Reportes from './Reportes';
import Swal from 'sweetalert2';

const Dashboard = ({ onLogout }) => {
    const [vistaActiva, setVistaActiva] = useState('departamentos');
    const rol = localStorage.getItem('rol');

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('rol');
                onLogout();
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Sistema de Gestión - Empleados por Departamento</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 capitalize">Rol: <b>{rol}</b></span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 flex space-x-8">
                    <button
                        onClick={() => setVistaActiva('departamentos')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${vistaActiva === 'departamentos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Departamentos
                    </button>
                    <button
                        onClick={() => setVistaActiva('empleados')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${vistaActiva === 'empleados' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Empleados
                    </button>
                    <button
                        onClick={() => setVistaActiva('reportes')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${vistaActiva === 'reportes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Reportes Analíticos (45)
                    </button>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto p-6">
                {vistaActiva === 'departamentos' && <Departamentos />}
                {vistaActiva === 'empleados' && <Empleados />}
                {vistaActiva === 'reportes' && <Reportes />}
            </main>
        </div>
    );
};

export default Dashboard;
