import {createConnection} from 'mysql2/promise';

import env from '../../enviroment/enviroment.js';

const cnx = async() => {
    try {
        const conexion = await createConnection({
            host: env.host,
            port: env.port,
            user: env.user,
            password: env.password,
            database: env.database
        });

        return conexion;
    } catch (error) {
        console.error('error al conectar la base de datos: ',error.message);
        throw error;
    }
}

export default cnx;