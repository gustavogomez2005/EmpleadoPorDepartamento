import pool from '../config/db.js';

const ejecutarReporte = async (req, res, query, params = []) => {
    try {
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const reporte1 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, apellido FROM Empleado`);
const reporte2 = (req, res) => ejecutarReporte(req, res, `SELECT DISTINCT apellido FROM Empleado`);
const reporte3 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE apellido = 'Lopez'`);
const reporte4 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE apellido IN ('Lopez', 'Perez')`);
const reporte5 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, codigo AS clave_empleado FROM Empleado WHERE codigo_departamento = 4`);
const reporte6 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE codigo_departamento IN (1, 3) ORDER BY nombre ASC`);
const reporte7 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, apellido FROM Empleado WHERE apellido LIKE 'H%'`);
const reporte8 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Departamento WHERE presupuesto BETWEEN 50000 AND 70000`);
const reporte9 = (req, res) => ejecutarReporte(req, res, `SELECT e.codigo AS clave_empleado, e.nombre, e.apellido FROM Empleado e JOIN Departamento d ON e.codigo_departamento = d.codigo WHERE d.nombre = 'Contabilidad'`);
const reporte10 = (req, res) => ejecutarReporte(req, res, `SELECT e.nombre, e.apellido, d.nombre AS departamento FROM Empleado e JOIN Departamento d ON e.codigo_departamento = d.codigo`);
const reporte11 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado`);
const reporte12 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Departamento`);
const reporte13 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE cargo = 'Secretaria'`);
const reporte14 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, sueldo AS salario FROM Empleado`);
const reporte15 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE cargo = 'Vendedor' ORDER BY nombre ASC`);
const reporte16 = (req, res) => ejecutarReporte(req, res, `SELECT nombre FROM Departamento`);
const reporte17 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, cargo FROM Empleado ORDER BY sueldo ASC`);
const reporte18 = (req, res) => ejecutarReporte(req, res, `SELECT sueldo, comision FROM Empleado WHERE codigo_departamento = 2000 ORDER BY comision ASC`);
const reporte19 = (req, res) => ejecutarReporte(req, res, `SELECT comision FROM Empleado WHERE comision > 0`);
const reporte20 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, apellido, (sueldo + 500000) AS valor_total_pagar FROM Empleado WHERE codigo_departamento = 3000 ORDER BY nombre ASC`);
const reporte21 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE comision > sueldo`);
const reporte22 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE comision <= (sueldo * 0.30)`);
const reporte23 = (req, res) => ejecutarReporte(req, res, `SELECT CONCAT('Nombre: ', nombre, ' - Cargo: ', cargo) AS info FROM Empleado`);
const reporte24 = (req, res) => ejecutarReporte(req, res, `SELECT sueldo AS salario, comision FROM Empleado WHERE CAST(dni AS UNSIGNED) > 19709802`);
const reporte25 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, cargo FROM Empleado WHERE LEFT(nombre, 1) BETWEEN 'J' AND 'Z' ORDER BY nombre ASC`);
const reporte26 = (req, res) => ejecutarReporte(req, res, `SELECT sueldo AS salario, comision, (sueldo + comision) AS salario_total, dni, nombre FROM Empleado WHERE comision > 1000000 ORDER BY dni ASC`);
const reporte27 = (req, res) => ejecutarReporte(req, res, `SELECT sueldo AS salario, comision, (sueldo + comision) AS salario_total, dni, nombre FROM Empleado WHERE comision = 0 OR comision IS NULL ORDER BY dni ASC`);
const reporte28 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE nombre NOT LIKE '%MA%'`);
const reporte29 = (req, res) => ejecutarReporte(req, res, `SELECT nombre FROM Departamento WHERE nombre NOT IN ('Ventas', 'Investigación', 'MANTENIMIENTO')`);
const reporte30 = (req, res) => ejecutarReporte(req, res, `SELECT e.nombre, d.nombre AS departamento FROM Empleado e JOIN Departamento d ON e.codigo_departamento = d.codigo WHERE e.cargo IN ('Secretaria', 'Vendedor') AND d.nombre <> 'PRODUCCION' AND e.sueldo > 1000000 ORDER BY e.fecha_incorporacion ASC`);
const reporte31 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE CHAR_LENGTH(nombre) = 11`);
const reporte32 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE CHAR_LENGTH(nombre) >= 11`);
const reporte33 = (req, res) => ejecutarReporte(req, res, `SELECT e.* FROM Empleado e JOIN Departamento d ON e.codigo_departamento = d.codigo WHERE e.nombre LIKE 'M%' AND (e.sueldo > 800000 OR e.comision > 0) AND d.nombre = 'Ventas'`);
const reporte34 = (req, res) => ejecutarReporte(req, res, `SELECT nombre, sueldo, comision FROM Empleado WHERE sueldo BETWEEN (comision / 2) AND comision`);
const reporte35 = (req, res) => ejecutarReporte(req, res, `SELECT MAX(sueldo) AS salario_maximo FROM Empleado`);
const reporte36 = (req, res) => ejecutarReporte(req, res, `SELECT comision, COUNT(*) AS numero_empleados FROM Empleado WHERE comision > 0 GROUP BY comision`);
const reporte37 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado ORDER BY nombre DESC LIMIT 1`);
const reporte38 = (req, res) => ejecutarReporte(req, res, `SELECT MAX(sueldo) AS salario_maximo, MIN(sueldo) AS salario_minimo, (MAX(sueldo) - MIN(sueldo)) AS diferencia FROM Empleado`);
const reporte39 = (req, res) => ejecutarReporte(req, res, `SELECT codigo_departamento, SUM(CASE WHEN sexo = 'Femenino' THEN 1 ELSE 0 END) AS total_femenino, SUM(CASE WHEN sexo = 'Masculino' THEN 1 ELSE 0 END) AS total_masculino FROM Empleado GROUP BY codigo_departamento`);
const reporte40 = (req, res) => ejecutarReporte(req, res, `SELECT codigo_departamento, AVG(sueldo) AS salario_promedio FROM Empleado GROUP BY codigo_departamento`);
const reporte41 = (req, res) => ejecutarReporte(req, res, `SELECT * FROM Empleado WHERE sueldo >= (SELECT AVG(sueldo) FROM Empleado) ORDER BY codigo_departamento`);
const reporte42 = (req, res) => ejecutarReporte(req, res, `SELECT codigo_departamento, COUNT(*) AS total_empleados FROM Empleado GROUP BY codigo_departamento HAVING COUNT(*) > 3`);
const reporte43 = (req, res) => ejecutarReporte(req, res, `SELECT e.codigo_jefe AS codigo_jefe, j.nombre AS nombre_jefe, COUNT(*) AS empleados_a_cargo FROM Empleado e JOIN Empleado j ON e.codigo_jefe = j.codigo GROUP BY e.codigo_jefe HAVING COUNT(*) >= 2`);
const reporte44 = (req, res) => ejecutarReporte(req, res, `SELECT d.* FROM Departamento d LEFT JOIN Empleado e ON d.codigo = e.codigo_departamento WHERE e.codigo IS NULL`);
const reporte45 = (req, res) => ejecutarReporte(req, res, `SELECT d.nombre, SUM(e.sueldo) AS suma_salarios FROM Departamento d JOIN Empleado e ON d.codigo = e.codigo_departamento GROUP BY d.codigo ORDER BY suma_salarios DESC LIMIT 1`);

const reporte = {
 reporte1, reporte2, reporte3, reporte4, reporte5, reporte6, reporte7,reporte8, reporte9, 
    reporte10, reporte11, reporte12, reporte13, reporte14, reporte15, reporte16, reporte17, reporte18, reporte19,
    reporte20, reporte21, reporte22, reporte23, reporte24, reporte25, reporte26, reporte27, reporte28, reporte29,
    reporte30, reporte31, reporte32, reporte33, reporte34, reporte35, reporte36, reporte37, reporte38, reporte39,
    reporte40, reporte41, reporte42, reporte43, reporte44, reporte45

}

export default reporte;