import express from 'express';
const app = express();

import bodyparse from 'body-parser';
import cors from 'cors';

app.use (bodyparse.urlencoded({extended: false}));
app.use(bodyparse.json());

const cleintesPermitidos = ['http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || clientesPermitidos.indexOf(origin) !== -1) { 
            callback(null, true);
        } else {
            callback(new Error('Este dominio no esta permitido'));
        }));