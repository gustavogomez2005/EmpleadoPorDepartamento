import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [criterioBusqueda, setCriterioBusqueda] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        sexo: 'Femenino',
        fecha_nacimiento: '',
        fecha_incorporacion: '',
        sueldo: '',
        comision: '',
        cargo: '',
        codigo_departamento: ''
    });
    const [editandoCodigo, setEditandoCodigo] = useState(null);
    const rol = localStorage.getItem('rol');

    const buscarEmpleados = async (criterio = '') => {
        try {
            const endpoint = criterio ? `/empleados/${criterio}` : '/empleados/todos';
            const res = await api.get(endpoint);
            setEmpleados(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (error) {
            setEmpleados([]);
        }
    };

    useEffect(() => {
        buscarEmpleados();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editandoCodigo) {
                await api.put(`/empleados/${editandoCodigo}`, formData);
                Swal.fire('¡Actualizado!', 'Empleado modificado correctamente', 'success');
            } else {
                await api.post('/empleados', formData);
                Swal.fire('¡Creado!', 'Empleado registrado exitosamente', 'success');
            }
            setFormData({
                nombre: '', apellido: '', dni: '', sexo: 'Femenino',
                fecha_nacimiento: '', fecha_incorporacion: '', sueldo: '',
                comision: '', cargo: '', codigo_departamento: ''
            });
            setEditandoCodigo(null);
            buscarEmpleados();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar el empleado', 'error');
        }
    };

    const handleEditar = (emp) => {
        setFormData(emp);
        setEditandoCodigo(emp.codigo);
    };

    const handleEliminar = async (codigo) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará al empleado del sistema.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/empleados/${codigo}`);
                Swal.fire('Eliminado', 'El empleado ha sido borrado.', 'success');
                buscarEmpleados();
            } catch (error) {
                Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Gestión de Empleados</h2>

            {/* Barra de Búsqueda */}
            <div className="flex gap-2 bg-white p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Buscar por código, DNI o nombre..."
                    value={criterioBusqueda}
                    onChange={(e) => setCriterioBusqueda(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                />
                <button
                    onClick={() => buscarEmpleados(criterioBusqueda)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Buscar
                </button>
                <button
                    onClick={() => { setCriterioBusqueda(''); buscarEmpleados(); }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    Limpiar
                </button>
            </div>

            {/* Formulario de Alta / Modificación (Solo Administradores) */}
            {rol === 'administrador' && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="nombre" placeholder="Nombre (Solo letras)" value={formData.nombre} onChange={handleChange} required className="px-3 py-2 border rounded-md" />
                    <input type="text" name="apellido" placeholder="Apellido (Solo letras)" value={formData.apellido} onChange={handleChange} required className="px-3 py-2 border rounded-md" />
                    <input type="text" name="dni" placeholder="DNI (Solo números)" value={formData.dni} onChange={handleChange} required className="px-3 py-2 border rounded-md" />
                    
                    <select name="sexo" value={formData.sexo} onChange={handleChange} className="px-3 py-2 border rounded-md">
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                    </select>

                    <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento?.split('T')[0]} onChange={handleChange} required className="px-3 py-2 border rounded-md" />
                    <input type="date" name="fecha_incorporacion" value={formData.fecha_incorporacion?.split('T')[0]} onChange={handleChange} required className="px-3 py-2 border rounded-md" />
                    
                    <input type="number" name="sueldo" placeholder="Sueldo" value={formData.sueldo} onChange={handleChange} required className="px-3 py-2 border rounded-md" />
                    <input type="number" name="comision" placeholder="Comisión" value={formData.comision} onChange={handleChange} className="px-3 py-2 border rounded-md" />
                    <input type="text" name="cargo" placeholder="Cargo (Solo letras)" value={formData.cargo} onChange={handleChange} required className="px-3 py-2 border rounded-md" />
                    
                    <input type="number" name="codigo_departamento" placeholder="Código de Departamento" value={formData.codigo_departamento} onChange={handleChange} required className="px-3 py-2 border rounded-md" />

                    <div className="md:col-span-3 flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            {editandoCodigo ? 'Actualizar Empleado' : 'Registrar Empleado'}
                        </button>
                        {editandoCodigo && (
                            <button type="button" onClick={() => { setEditandoCodigo(null); setFormData({ nombre: '', apellido: '', dni: '', sexo: 'Femenino', fecha_nacimiento: '', fecha_incorporacion: '', sueldo: '', comision: '', cargo: '', codigo_departamento: '' }); }} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            )}

            {/* Listado de Empleados */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre y Apellido</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sueldo</th>
                            {rol === 'administrador' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {empleados.map((emp) => (
                            <tr key={emp.codigo}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.codigo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.nombre} {emp.apellido}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.dni}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.cargo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${emp.sueldo}</td>
                                {rol === 'administrador' && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleEditar(emp)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                        <button onClick={() => handleEliminar(emp.codigo)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Empleados;
