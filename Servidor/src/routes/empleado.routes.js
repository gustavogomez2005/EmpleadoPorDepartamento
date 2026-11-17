// src/routes/empleado.routes.js
import { body } from 'express-validator';
import express from 'express';
const router = express.Router();
import {consultarEmpleado, crearEmpleado, eliminarEmpleado, modificarEmpleado} from  '../controllers/empleado.controller.js';
import { verificarToken, soloAdministrador } from '../middlewares/auth.middleware.js';
import { validarCampos } from '../middlewares/validator.middleware.js';

const validarEmpleado = [
    body('nombre').isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras.'),
    body('apellido').isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo debe contener letras.'),
    body('cargo').isAlpha('es-ES', { ignore: ' ' }).withMessage('El cargo solo debe contener letras.'),
    body('dni').isNumeric().withMessage('El DNI no debe aceptar ningún carácter especial ni letras.'),
    body('sexo').isIn(['Femenino', 'Masculino']).withMessage('El sexo debe ser Femenino o Masculino.'),
    body('sueldo').isNumeric().withMessage('El sueldo debe tener solamente números.'),
    body('comision').optional().isNumeric().withMessage('La comisión debe tener solamente números.'),
    validarCampos
];

router.post('/', verificarToken, soloAdministrador, validarEmpleado, crearEmpleado);
router.get('/:criterio', verificarToken, consultarEmpleado);
router.put('/:criterio', verificarToken, soloAdministrador, validarEmpleado, modificarEmpleado);
router.delete('/:codigo', verificarToken, soloAdministrador, eliminarEmpleado);

export default router;