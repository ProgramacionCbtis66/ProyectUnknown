import nodemailer from 'nodemailer';
import env from '../../enviroment/enviroment.js';

const enviarCorreo = (req, res) => {
    console.log("Datos recibidos:", req.body); // Agrega esto para depurar
    const emailData = req.body;

    if (!emailData.destinatario || !emailData.tipo) {
        return res.status(400).send({ error: "Destinatario o tipo de correo no definido" });
    }

    console.log("email estado: ", emailData.estado);
    // Configuración del correo
    const transporter = nodemailer.createTransport({
        service: "gmail",           // Puedes usar "service" en lugar de "host" para Gmail
        auth: {
            user: env.correoKey,     // Tu correo electrónico completo
            pass: env.pwdKey,        // Tu App Password de Gmail
        },
    });

    const mailOptions = MailOptions(emailData.tipo, emailData); // Corregido para usar `emailData`

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("manejo de error: " + error);
            res.send("error");
        } else {
            console.log("Correo Enviado: " + info.response);
            res.send({ msg: "Correo enviado satisfactoriamente" });
        }
    });
}

function MailOptions(tipo, emailData) {
    let mailOptions;

    switch (tipo) {
        case "EmailVerify":
            mailOptions = {
                from: env.correoKey,
                to: emailData.destinatario,
                subject: "Bienvenido a ADAE",
                text: `Hola ${emailData.nombre}, ¡Gracias por registrarte en ADAE! Estamos felices de darte la bienvenida.`,
                html: `
                    <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                                <!-- Encabezado -->
                                <div style="background-color: #343a40; padding: 20px; text-align: center;">
                                    <h2 style="color: #ffffff; margin: 0;">ADAE</h2>
                                </div>
                                
                                <!-- Cuerpo -->
                                <div style="padding: 20px; color: #333;">
                                    <h3 style="margin-top: 0;">¡Registro Exitoso!</h3>
                                    <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                                    <p>Gracias por unirte a <strong>ADAE</strong>. Estamos felices de tenerte con nosotros.</p>
                                    <p>Ahora puedes acceder a nuestra plataforma y comenzar a disfrutar de todos los beneficios y herramientas que ofrecemos.</p>
                                    <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Bienvenido(a) a ADAE!</p>
                                </div>
                                
                                <!-- Pie de página -->
                                <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                                    <p style="margin: 0;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                                </div>
                            </div>
                        </body>
                    </html>
                `
            };
            break;

        // Otros casos...
    }

    return mailOptions;
}

export default { enviarCorreo };
