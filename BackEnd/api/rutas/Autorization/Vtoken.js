import { verify } from 'jsonwebtoken'; 
import env from '../../../environment/environment.js';

const vtoken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        console.log("Token vacío...");
        return res.sendStatus(401);
    }

    verify(token, env.key, { ignoreExpiration: true }, (err, user) => {
        if (err) {
            console.log("Error al verificar el token:", err);
            return res.sendStatus(403);
        }

        req.user = user; // Almacena el usuario en el objeto req para usarlo más adelante.
        next(); // Pasa al siguiente middleware o ruta
    });
};

export default vtoken;
