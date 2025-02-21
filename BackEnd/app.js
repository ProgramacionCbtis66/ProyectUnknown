import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware para parsear JSON y formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Lista de orígenes permitidos
const clientesPermitidos = ['http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || clientesPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Este dominio no está permitido'));
        }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true // Permitir cookies o autenticación en las solicitudes CORS
}));

// Rutas de la API
import UserApi from './api/rutas/usuario.js';
import EmailApi from './api/rutas/Email.js';
import Prueba from './api/rutas/pruebas.js';
import ClasesApi from './api/rutas/clases.js';
import File from './api/rutas/archivos.js';

app.use('/apiAdae', [UserApi, Prueba, EmailApi, ClasesApi, File]);

export default app;
