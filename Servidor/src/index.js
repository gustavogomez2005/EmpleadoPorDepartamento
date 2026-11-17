import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';

dotenv.config();


const app = express();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
import authRoutes  from './routes/auth.routes.js';
import deptoRoutes from './routes/depto.routes.js';
import empleadoRoutes from './routes/empleado.routes.js';
import reporteRoutes from './routes/reporte.routes.js';


app.use('/api/auth', authRoutes);
app.use('/api/departamentos', deptoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/reportes', reporteRoutes);

// --- CONFIGURACIÓN SSL / HTTPS ---
let options = {};

try {
    // Rutas a los archivos de certificados (Desarrollo local o Producción)
    options = {
        key: fs.readFileSync(path.join(__dirname, '../ssl/server.key')),
        cert: fs.readFileSync(path.join(__dirname, '../ssl/server.cert'))
    };
} catch (error) {
    console.warn('⚠️ No se encontraron certificados SSL en la carpeta /ssl. Asegúrate de configurarlos para producción.');
}

const PORT = process.env.PORT || 3000;

if (options.key && options.cert) {
    // Levantar servidor seguro con HTTPS
    https.createServer(options, app).listen(PORT, () => {
        console.log(`🔒 Servidor HTTPS seguro corriendo en el puerto ${PORT}`);
    });
} else {
    // Fallback a HTTP si no hay certificados (útil para pruebas iniciales sin SSL)
    app.listen(PORT, () => {
        console.log(`⚠️ Servidor corriendo en HTTP (sin SSL) en el puerto ${PORT}`);
    });
}





