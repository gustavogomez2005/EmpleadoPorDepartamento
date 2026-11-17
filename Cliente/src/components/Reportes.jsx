import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const Reportes = () => {
    const [reporteId, setReporteId] = useState('1');
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Listado de los 45 reportes solicitados
    const listaReportes = [
        { id: 1, label: '1. Nombres y apellidos de los empleados' },
        { id: 2, label: '2. Apellidos de los empleados sin repeticiones' },
        { id: 3, label: '3. Empleados que se apellidan ‘Lopez’' },
        { id: 4, label: '4. Empleados que se apellidan ‘Lopez’ o ‘Perez’' },
        { id: 5, label: '5. Nombre y clave de empleados del departamento 4' },
        { id: 6, label: '6. Empleados del departamento 1 o 3 ordenados alfabéticamente' },
        { id: 7, label: '7. Nombres y apellidos cuyo apellido comienza con ‘H’' },
        { id: 8, label: '8. Departamentos con presupuesto entre $50,000 y $70,000' },
        { id: 9, label: '9. Empleados que trabajan en el departamento de Contabilidad' },
        { id: 10, label: '10. Empleados y su respectivo departamento' },
        { id: 11, label: '11. Datos completos de los empleados' },
        { id: 12, label: '12. Datos completos de los departamentos' },
        { id: 13, label: '13. Empleados con cargo ‘Secretaria’' },
        { id: 14, label: '14. Nombre y salario de los empleados' },
        { id: 15, label: '15. Empleados vendedores ordenados por nombre' },
        { id: 16, label: '16. Listar nombres de los departamentos' },
        { id: 17, label: '17. Nombre y cargo ordenados por salario' },
        { id: 18, label: '18. Salarios y comisiones del departamento 2000' },
        { id: 19, label: '19. Listar todas las comisiones' },
        { id: 20, label: '20. Valor total a pagar con bonificación (Depto 3000)' },
        { id: 21, label: '21. Empleados que ganan comisión superior a su sueldo' },
        { id: 22, label: '22. Empleados con comisión menor o igual al 30% del sueldo' },
        { id: 23, label: '23. Formato estricto ‘Nombre’ y ‘Cargo’' },
        { id: 24, label: '24. Salario y comisión con DNI superior a 19.709.802' },
        { id: 25, label: '25. Empleados con nombre entre J y Z ordenados' },
        { id: 26, label: '26. Salario, comisión, total y DNI (Comisión > 1M)' },
        { id: 27, label: '27. Empleados que NO tienen comisión' },
        { id: 28, label: '28. Empleados cuyo nombre no contiene “MA”' },
        { id: 29, label: '29. Departamentos excepto Ventas, Investigación y Mantenimiento' },
        { id: 30, label: '30. Secretaria/Vendedor fuera de Producción (Sueldo > 1M)' },
        { id: 31, label: '31. Empleados con nombre de exactamente 11 caracteres' },
        { id: 32, label: '32. Empleados con nombre de al menos 11 caracteres' },
        { id: 33, label: '33. Nombre inicia con M, sueldo > 800k o comisión en Ventas' },
        { id: 34, label: '34. Salario entre la mitad de la comisión y la comisión' },
        { id: 35, label: '35. Salario más alto de la empresa' },
        { id: 36, label: '36. Comisiones y número de empleados que las reciben' },
        { id: 37, label: '37. Nombre del último empleado por orden alfabético' },
        { id: 38, label: '38. Salario más alto, más bajo y diferencia' },
        { id: 39, label: '39. Empleados por sexo y departamento' },
        { id: 40, label: '40. Salario promedio por departamento' },
        { id: 41, label: '41. Empleados con salario mayor o igual al promedio' },
        { id: 42, label: '42. Departamentos con más de tres empleados' },
        { id: 43, label: '43. Jefes que dirigen más de dos empleados' },
        { id: 44, label: '44. Departamentos que no tienen empleados' },
        { id: 45, label: '45. Departamento con la suma de salarios más alta' }
    ];

    const consultarReporte = async () => {
        setCargando(true);
        try {
            const response = await api.get(`/reportes/${reporteId}`);
            setDatos(response.data);
            if (response.data.length === 0) {
                Swal.fire('Información', 'El reporte no arrojó resultados.', 'info');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar el reporte seleccionado.', 'error');
        } finally {
            setCargando(false);
        }
    };

    const exportarCSV = () => {
        if (datos.length === 0) return;
        const keys = Object.keys(datos[0]);
        const csvContent = [
            keys.join(','),
            ...datos.map(row => keys.map(key => JSON.stringify(row[key] ?? '')).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_${reporteId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Reportes Analíticos del Sistema</h2>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center">
                <select
                    value={reporteId}
                    onChange={(e) => setReporteId(e.target.value)}
                    className="w-full md:w-3/4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {listaReportes.map((rep) => (
                        <option key={rep.id} value={rep.id}>
                            {rep.label}
                        </option>
                    ))}
                </select>
                <div className="flex space-x-2 w-full md:w-1/4">
                    <button
                        onClick={consultarReporte}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        {cargando ? 'Cargando...' : 'Ejecutar'}
                    </button>
                    {datos.length > 0 && (
                        <button
                            onClick={exportarCSV}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Exportar CSV
                        </button>
                    )}
                </div>
            </div>

            {datos.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {Object.keys(datos[0]).map((key) => (
                                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {datos.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).map((val, i) => (
                                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {val !== null ? val.toString() : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reportes;
