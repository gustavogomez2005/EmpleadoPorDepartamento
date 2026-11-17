import pool from '../config/db.js';

export const crearEmpleado = async (req, res) => {
    try {
        const { nombre, apellido, dni, sexo, fecha_nacimiento, fecha_incorporacion, sueldo, comision, cargo, codigo_departamento, codigo_jefe } = req.body;
        const [result] = await pool.query(
            `INSERT INTO Empleado (nombre, apellido, dni, sexo, fecha_nacimiento, fecha_incorporacion, sueldo, comision, cargo, codigo_departamento, codigo_jefe) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, dni, sexo, fecha_nacimiento, fecha_incorporacion, sueldo, comision || 0, cargo, codigo_departamento, codigo_jefe || null]
        );
        res.status(201).json({ mensaje: 'Empleado creado exitosamente', codigo: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const consultarEmpleado = async (req, res) => {
    try {
        const { criterio } = req.params; // código, DNI o apellido y nombre
        const [rows] = await pool.query(
            `SELECT * FROM Empleado WHERE codigo = ? OR dni = ? OR CONCAT(apellido, ' ', nombre) LIKE ? OR apellido LIKE ? OR nombre LIKE ?`,
            [criterio, criterio, `%${criterio}%`, `%${criterio}%`, `%${criterio}%`]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const modificarEmpleado = async (req, res) => {
    try {
        const { criterio } = req.params; // Buscar por código, dni o nombre/apellido
        const { nombre, apellido, dni, sexo, fecha_nacimiento, fecha_incorporacion, sueldo, comision, cargo, codigo_departamento, codigo_jefe } = req.body;
        
        const [result] = await pool.query(
            `UPDATE Empleado SET nombre = ?, apellido = ?, dni = ?, sexo = ?, fecha_nacimiento = ?, fecha_incorporacion = ?, sueldo = ?, comision = ?, cargo = ?, codigo_departamento = ?, codigo_jefe = ? 
             WHERE codigo = ? OR dni = ? OR CONCAT(apellido, ' ', nombre) LIKE ?`,
            [nombre, apellido, dni, sexo, fecha_nacimiento, fecha_incorporacion, sueldo, comision, cargo, codigo_departamento, codigo_jefe, criterio, criterio, `%${criterio}%`]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
        res.json({ mensaje: 'Empleado actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarEmpleado = async (req, res) => {
    try {
        const { codigo } = req.params;
        const [result] = await pool.query(`DELETE FROM Empleado WHERE codigo = ?`, [codigo]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
        res.json({ mensaje: 'Empleado eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

