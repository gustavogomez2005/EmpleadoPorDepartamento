import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registrar = async (req, res) => {
    try {
        const { usuario, password, apellido, nombre, dni, telefono, email, rol } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO Usuario (usuario, password, apellido, nombre, dni, telefono, email, rol) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuario, hashedPassword, apellido, nombre, dni, telefono, email, rol || 'operador']
        );

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { identificador, password } = req.body; // identificador puede ser usuario, email o telefono

        const [rows] = await pool.query(
            `SELECT * FROM Usuario WHERE usuario = ? OR email = ? OR telefono = ?`,
            [identificador, identificador, identificador]
        );

        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        const user = rows[0];

        if (user.bloqueado) {
            return res.status(403).json({ error: 'Cuenta bloqueada por múltiples intentos fallidos.' });
        }

        const passwordValida = await bcrypt.compare(password, user.password);

        if (!passwordValida) {
            const intentos = user.intentos_fallidos + 1;
            let bloqueado = false;
            if (intentos >= 3) bloqueado = true;

            await pool.query(`UPDATE Usuario SET intentos_fallidos = ?, bloqueado = ? WHERE codigo = ?`, [intentos, bloqueado, user.codigo]);

            return res.status(401).json({ error: `Credenciales inválidas. Intentos fallidos: ${intentos}/3` });
        }

        // Resetear intentos fallidos en login exitoso
        await pool.query(`UPDATE Usuario SET intentos_fallidos = 0, bloqueado = FALSE WHERE codigo = ?`, [user.codigo]);

        const token = jwt.sign(
            { codigo: user.codigo, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ mensaje: 'Login exitoso', token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    // Al usar JWT, el cierre de sesión se maneja principalmente en el cliente eliminando el token, 
    // pero se puede registrar o invalidar mediante listas negras si se requiere.
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
};

