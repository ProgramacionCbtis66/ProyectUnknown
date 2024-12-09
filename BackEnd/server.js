import { createServer } from 'http';
import app from './app.js';
import env from './enviroment/enviroment.js';

const puerto = env.portServer || 3000;

// Configuración del servidor con maxHeaderSize
const Servidor = createServer({
  maxHeaderSize: 81920, // Aumentar el tamaño máximo de los encabezados (valor en bytes)
}, app);

Servidor.listen(puerto, () => {
  console.log(`Por fin... en el servidor de ADAE  puerto: ${puerto}`);
});
