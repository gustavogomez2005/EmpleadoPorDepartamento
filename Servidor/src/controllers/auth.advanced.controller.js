import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 1. Recuperación de Contraseña - Paso 1: Solicitar Token
export const solicitarRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;
        const [rows] = await pool.query(`SELECT * FROM Usuario WHERE email = ?`, [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No existe un usuario registrado con este correo electrónico.' });
        }

        const user = rows[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 3600000); // 1 hora de expiración

        await pool.query(
            `UPDATE Usuario SET reset_token = ?, reset_token_expires = ? WHERE codigo = ?`,
            [resetToken, tokenExpires, user.codigo]
        );

        // En un entorno real, aquí se enviaría el correo electrónico (ej. usando Nodemailer)
        // Simulamos la respuesta devolviendo el token para fines de prueba o desarrollo:
        res.json({ 
            mensaje: 'Se ha generado el enlace/token de recuperación.', 
            resetToken,
            enlaceSimulado: `https://tudominio.com/reset-password?token=${resetToken}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Recuperación de Contraseña - Paso 2: Restablecer nueva contraseña
export const restablecerPassword = async (req, res) => {
    try {
        const { token, nuevaPassword } = req.body;

        const [rows] = await pool.query(
            `SELECT * FROM Usuario WHERE reset_token = ? AND reset_token_expires > NOW()`,
            [token]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: 'El token de recuperación es inválido o ha expirado.' });
        }

        const user = rows[0];
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

        await pool.query(
            `UPDATE Usuario SET password = ?, reset_token = NULL, reset_token_expires = NULL, intentos_fallidos = 0, bloqueado = FALSE WHERE codigo = ?`,
            [hashedPassword, user.codigo]
        );

        res.json({ mensaje: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Autenticación Social (Google, GitHub, Twitter, etc.) o por QR / Huella
export const loginSocialOExterno = async (req, res) => {
    try {
        const { provider, provider_id, email, nombre, apellido, telefono, dni, usuario } = req.body;

        // Verificar si el usuario ya existe con este proveedor o email
        let [rows] = await pool.query(
            `SELECT * FROM Usuario WHERE (provider = ? AND provider_id = ?) OR email = ?`,
            [provider, provider_id, email]
        );

        let user;

        if (rows.length > 0) {
            user = rows[0];
        } else {
            // Si no existe, lo registramos automáticamente (Social Sign-Up / Registro JIT)
            const passwordDummy = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
            
            const [result] = await pool.query(
                `INSERT INTO Usuario (usuario, password, apellido, nombre, dni, telefono, email, rol, provider, provider_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'operador', ?, ?)`,
                [
                    usuario || email.split('@')[0] + Math.floor(Math.random() * 1000),
                    passwordDummy,
                    apellido || 'Externo',
                    nombre || 'Usuario',
                    dni || 'TEMP' + Date.now(),
                    telefono || '000000000' + Math.floor(Math.random() * 100),
                    email,
                    provider,
                    provider_id
                ]
            );

            const [newUserRows] = await pool.query(`SELECT * FROM Usuario WHERE codigo = ?`, [result.insertId]);
            user = newUserRows[0];
        }

        // Generar Token JWT de sesión
        const token = jwt.sign(
            { codigo: user.codigo, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ mensaje: `Autenticación exitosa via ${provider}`, token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

