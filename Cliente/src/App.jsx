import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import RecuperarPassword from './components/RecuperarPassword';
import Dashboard from './components/Dashboard';
import Departamentos from './components/Departamentos';
import Empleados from './components/Empleados';
import Reportes from './components/Reportes';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                {/* Ruta de Inicio de Sesión */}
                <Route 
                    path="/login" 
                    element={
                        !isAuthenticated ? (
                            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-8">
                                <Login onLoginSuccess={handleLoginSuccess} />
                                <div className="mt-4 space-x-4 text-sm text-gray-600">
                                    <Link to="/registro" className="text-blue-600 font-medium hover:underline">
                                        Regístrate
                                    </Link>
                                    <span>•</span>
                                    <Link to="/recuperar-password" className="text-blue-600 font-medium hover:underline">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/dashboard/empleados" replace />
                        )
                    } 
                />

                {/* Ruta de Registro */}
                <Route 
                    path="/registro" 
                    element={
                        !isAuthenticated ? (
                            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-8">
                                <Registro onRegistroSuccess={() => window.location.href = '/login'} />
                                <p className="mt-4 text-sm text-gray-600">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                        Inicia sesión
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <Navigate to="/dashboard/empleados" replace />
                        )
                    } 
                />

                {/* Ruta de Recuperación de Contraseña */}
                <Route 
                    path="/recuperar-password" 
                    element={
                        !isAuthenticated ? (
                            <RecuperarPassword onVolverLogin={() => window.location.href = '/login'} />
                        ) : (
                            <Navigate to="/dashboard/empleados" replace />
                        )
                    } 
                />

                {/* Rutas Protegidas del Dashboard */}
                <Route 
                    path="/dashboard/*" 
                    element={
                        isAuthenticated ? (
                            <Dashboard onLogout={handleLogout}>
                                <Routes>
                                    <Route path="departamentos" element={<Departamentos />} />
                                    <Route path="empleados" element={<Empleados />} />
                                    <Route path="reportes" element={<Reportes />} />
                                    <Route path="*" element={<Navigate to="empleados" replace />} />
                                </Routes>
                            </Dashboard>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard/empleados" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;