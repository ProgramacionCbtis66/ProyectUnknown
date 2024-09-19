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
        if (err) return res.sendStatus(403);
        req.tokenUser = user;
        const currentTime = Date.now() / 1000;
        if (env.exp < currentTime) return res.sendStatus(401);
        next();
      });
};

export default vtoken;
