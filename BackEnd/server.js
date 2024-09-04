import {createServer} from 'http';
import app from './app.js';
import env from './enviroment/enviroment.js';
//import chat from './api/chat.js';


const puerto = env.portServer || 3000;
const Servidor = createServer(app);
Servidor.listen(puerto);
console.log(`Por fin... en el servidor de ADAE  puerto: ${puerto}`);
