import express from 'express';
const router = express.Router();
import {login, logout, registrar} from '../controllers/auth.controller.js';
import {loginSocialOExterno, restablecerPassword, solicitarRecuperacion} from '../controllers/auth.advanced.controller.js';

// Rutas base existentes
router.post('/registro', registrar);
router.post('/login', login);
router.post('/logout', logout);

// Nuevas rutas de recuperación y acceso alternativo
router.post('/recuperar-password', solicitarRecuperacion);
router.post('/restablecer-password', restablecerPassword);
router.post('/login-externo', loginSocialOExterno); // Soporta Google, GitHub, QR, Biometría, etc.

export default router;