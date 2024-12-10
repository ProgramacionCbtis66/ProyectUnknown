import express from 'express';
const app = express();

import bodyparse from 'body-parser';
import cors from 'cors';

app.use(bodyparse.urlencoded({ extended: false }));
app.use(bodyparse.json());

const clientesPermitidos = ['http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || clientesPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Este dominio no está permitido'));
        }
    }
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({ ok: 'ok' }); // Cambié 'rest' por 'res'
    }
    next();
});

import UserApi from './api/rutas/usuario.js';
import EmailApi from './api/rutas/Email.js';
import prueba from './api/rutas/pruebas.js';
import clasesApi from './api/rutas/clases.js';
import file from './api/rutas/archivos.js';

app.use('/apiAdae', [UserApi, prueba, EmailApi, clasesApi, file]);

export default app;
