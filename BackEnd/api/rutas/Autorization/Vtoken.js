        import {verify} from 'jsonwetoken';
        import env from '../../../enviroment/enviroment.js';


        const vtoken = (req,res,next)=>{
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if(token == null)
            {
                console.log("token vacio..."+token);
                return res.sendStatus(401)
            }

            verify(token, env.key,{ignoreExpiration:true}, (err,user)=>{
                if(err) res.sendStatus(403)
            })
        }
