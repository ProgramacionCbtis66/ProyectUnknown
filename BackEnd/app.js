import express from 'express';
const app = express();

import bodyparse from 'body-parser';
import cors from 'cors';




app.use(bodyparse.urlencoded({ extended: false }));
app.use(bodyparse.json());

const cleintesPermitidos = ['http://localhost:4200'];

/* app.use(cors({
    origin: (origin, callback) => {
        if (!origin || clientesPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Este dominio no esta permitido'));
        })); */

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'),
        res.header('Access-Control-Allow-Headers', 'origin, X-Requestd-with, content-type,accept , authorization');
    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
        return rest.status(200).json({ok: 'ok'});
    }
    next();
});

import UserApi from './api/rutas/usuario.js';

app.use('/apiAdae', [UserApi]);

export default app;