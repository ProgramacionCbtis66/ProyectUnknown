import {config} from 'dotenv';

config();

const env = {
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    portServer: process.env.portServer,
    key: process.env.jwt_key,
    exp: process.env.jwt_expiration

}

export default env;