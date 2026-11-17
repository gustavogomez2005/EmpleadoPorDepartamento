import express from 'express';
const router = express.Router();

import reporteController from '../controllers/reporte.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

// Proteger todas las rutas de reportes con autenticación JWT
router.use(verificarToken);

// Registro dinámico de los 45 endpoints de reportes (/api/reportes/1 hasta /api/reportes/45)
for (let i = 1; i <= 45; i++) {
    const controladorReporte = reporteController[`reporte${i}`];
    if (controladorReporte) {
        router.get(`/${i}`, controladorReporte);
    }
}


export default router;

