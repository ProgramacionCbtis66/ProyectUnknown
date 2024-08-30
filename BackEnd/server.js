import {createServer} from 'http';
import app from './app.js';
import chat from './api/chat.js';

const puerto = process.env.PORT || 3000;
const Servidor = createServer(app);
Servidor.listen(puerto);
console.log("Por fin... en el servidor de ADAE");
