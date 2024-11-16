import { Router } from "express";
import email from "../controladores//EmailController.js";
import vtoken from "./Authorization/Vtoken.js";

const Email = Router();

Email.post('/Email/SendEmail', email.enviarCorreo)

export default Email;