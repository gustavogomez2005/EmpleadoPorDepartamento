import pool from '../config/db.js';

export const crearDepartamento = async (req, res) => {
    try {
        const { nombre, ciudad, presupuesto } = req.body;
        const [result] = await pool.query(
            `INSERT INTO Departamento (nombre, ciudad, presupuesto) VALUES (?, ?, ?)`,
            [nombre, ciudad, presupuesto || 0]
        );
        res.status(201).json({ mensaje: 'Departamento creado', codigo: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const consultarDepartamento = async (req, res) => {
    try {
        const { criterio } = req.params; // código o nombre
        const [rows] = await pool.query(
            `SELECT * FROM Departamento WHERE codigo = ? OR nombre LIKE ?`,
            [criterio, `%${criterio}%`]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const modificarDepartamento = async (req, res) => {
    try {
        const { criterio } = req.params;
        const { nombre, ciudad, presupuesto } = req.body;
        const [result] = await pool.query(
            `UPDATE Departamento SET nombre = ?, ciudad = ?, presupuesto = ? WHERE codigo = ? OR nombre = ?`,
            [nombre, ciudad, presupuesto, criterio, criterio]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Departamento no encontrado' });
        res.json({ mensaje: 'Departamento actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarDepartamento = async (req, res) => {
    try {
        const { codigo } = req.params;
        // Verificar si tiene empleados asignados
        const [empleados] = await pool.query(`SELECT COUNT(*) as total FROM Empleado WHERE codigo_departamento = ?`, [codigo]);
        if (empleados[0].total > 0) {
            return res.status(400).json({ error: 'No se pueden eliminar departamentos con empleados asignados.' });
        }

        const [result] = await pool.query(`DELETE FROM Departamento WHERE codigo = ?`, [codigo]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Departamento no encontrado' });
        res.json({ mensaje: 'Departamento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

