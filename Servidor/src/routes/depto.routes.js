// src/routes/depto.routes.js
import { body } from 'express-validator';
import express from 'express';
const router = express.Router();
import {consultarDepartamento, crearDepartamento, eliminarDepartamento, modificarDepartamento} from '../controllers/depto.controller.js';
import { verificarToken, soloAdministrador } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validator.middleware.js';

const validarDepto = [
    body('nombre').matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ.\s]+$/).withMessage('El nombre solo debe contener letras, puntos y espacios.'),
    body('ciudad').matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ.\s]+$/).withMessage('La ciudad solo debe contener letras, puntos y espacios.'),
    validarCampos
];

router.post('/', verificarToken, soloAdministrador, validarDepto, crearDepartamento);
router.get('/:criterio', verificarToken, consultarDepartamento);
router.put('/:criterio', verificarToken, soloAdministrador, validarDepto, modificarDepartamento);
router.delete('/:codigo', verificarToken, soloAdministrador, eliminarDepartamento);

export default router;