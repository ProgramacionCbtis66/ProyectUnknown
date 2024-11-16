import nodemailer from 'nodemailer';
import env from '../../enviroment/enviroment.js';

const enviarCorreo = (req, res) => {
    console.log("Datos recibidos:", req.body);
    const emailData = req.body;

    if (!emailData.destinatario || !emailData.tipo) {
        return res.status(400).send({ error: "Destinatario o tipo de correo no definido" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: env.correoKey,
                pass: env.pwdKey,
            },
        });

        const mailOptions = MailOptions(emailData.tipo, emailData);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error al enviar el correo:", error);
                return res.status(500).send({ error: "No se pudo enviar el correo", detalles: error.message });
            }
            console.log("Correo enviado:", info.response);
            res.send({ msg: "Correo enviado satisfactoriamente" });
        });
    } catch (err) {
        console.error("Error en enviarCorreo:", err.message);
        res.status(500).send({ error: "Error interno del servidor" });
    }
};

function MailOptions(tipo, emailData) {
    let mailOptions;

    switch (tipo) {
        case "EmailVerify":
            mailOptions = {
                from: `ADAE <${env.correoKey}>`,
                to: emailData.destinatario,
                subject: "Bienvenido a ADAE",
                text: `Hola ${emailData.nombre}, ¡Gracias por registrarte en ADAE! Estamos felices de darte la bienvenida.`,
                html: `
                   <html>
                        <head>
                            <!-- Importar fuente Poppins desde Google Fonts -->
                            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                        </head>
                        <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 20px; background-color:#f1f2f4;">
                            <div style="width: 450px; min-width: 450px; max-width: 450px; margin: auto; border: none; border-radius: 15px; overflow: hidden;">
                                <!-- Encabezado -->
                                <div style="background-color: #252527; padding: 20px; text-align: center;">
                                    <h2 style="color: #ffffff; margin: 0; font-size: 2rem;">ADAE</h2>
                                </div>
                                
                                <!-- Cuerpo -->
                                <div style="padding:30px 60px; color: #333; background-color: #ffffff;">
                                    <h3 style="margin-top: 0; font-size: 2rem;">¡Registro Exitoso!</h3>
                                    <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                                    <p>Gracias por unirte a <strong>ADAE</strong>. Estamos felices de tenerte con nosotros.</p>
                                    <p>Ahora puedes acceder a nuestra plataforma y comenzar a disfrutar de todos los beneficios y herramientas que ofrecemos.</p>
                                    <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Bienvenido(a) a ADAE!</p>
                                </div>
                                
                                <!-- Pie de página -->
                                <div style="background-color: #FAFAFA; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                                    <p style="margin: 20px;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                                </div>
                            </div>
                        </body>
                    </html>
                `
            };
            break;

        case "PasswordReset":
            mailOptions = {
                from: `ADAE <${env.correoKey}>`,
                to: emailData.destinatario,
                subject: "Solicitud de cambio de contraseña",
                text: `Hola ${emailData.nombre}, hemos recibido una solicitud para cambiar tu contraseña. Si no fuiste tú, ignora este correo. Si deseas continuar, sigue las instrucciones a continuación.`,
                html: `
                       <html>
                            <head>
                                <!-- Importar fuente Poppins desde Google Fonts -->
                                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                            </head>
                            <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 20px; background-color:#f1f2f4;">
                                <div style="width: 400px; min-width: 400px; max-width: 400px; margin: auto; border: none; border-radius: 15px; overflow: hidden;">
                                    <!-- Encabezado -->
                                    <div style="background-color: #252527; padding: 20px; text-align: center;">
                                        <h2 style="color: #ffffff; margin: 0; font-size: 2rem;">ADAE</h2>
                                    </div>
                                    
                                    <!-- Cuerpo -->
                                    <div style="padding:30px 40px; color: #333; background-color: #ffffff;">
                                        <h3 style="margin-top: 0; font-size: 2rem;">Restablece tu contraseña</h3>
                                        <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                                        <p>Hemos recibido una solicitud para cambiar tu contraseña en <strong>ADAE</strong>.</p>
                                        <p>Para completar el proceso, haz clic en el siguiente botón:</p>
                                        <div style="text-align: center; margin: 20px 0;">
                                            <a href="${emailData.resetLink}" target="_blank" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Restablecer contraseña</a>
                                        </div>
                                        <p>Si no solicitaste este cambio, puedes ignorar este correo. Tu cuenta seguirá segura.</p>
                                    </div>
                                    
                                    <!-- Pie de página -->
                                    <div style="background-color: #FAFAFA; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                                        <p style="margin: 20px;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                                    </div>
                                </div>
                            </body>d
                        </html>
                    `
            };
            break;

        case "UserUpdateNotification":
            mailOptions = {
                from: `ADAE <${env.correoKey}>`,
                to: emailData.destinatario,
                subject: "Actualización exitosa de tus datos",
                text: `Hola ${emailData.nombre}, queremos informarte que los datos de tu cuenta han sido actualizados exitosamente. Si no reconoces esta acción, por favor contáctanos de inmediato.`,
                html: `
           <html>
                <head>
                    <!-- Importar fuente Poppins desde Google Fonts -->
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                </head>
                <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 20px; background-color:#f1f2f4;">
                    <div style="width: 400px; min-width: 400px; max-width: 400px; margin: auto; border: none; border-radius: 15px; overflow: hidden;">
                        <!-- Encabezado -->
                        <div style="background-color: #252527; padding: 20px; text-align: center;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 2rem;">ADAE</h2>
                        </div>
                        
                        <!-- Cuerpo -->
                        <div style="padding:30px 40px; color: #333; background-color: #ffffff;">
                            <h3 style="margin-top: 0; font-size: 2rem;">¡Actualización Exitosa!</h3>
                            <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                            <p>Queremos informarte que los datos de tu cuenta en <strong>ADAE</strong> han sido actualizados exitosamente.</p>
                            <p>Si no reconoces esta acción, por favor contáctanos de inmediato para garantizar la seguridad de tu cuenta.</p>
                        </div>
                        
                        <!-- Pie de página -->
                        <div style="background-color: #FAFAFA; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                            <p style="margin: 20px;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                            <p>Si necesitas ayuda, no dudes en escribirnos a <a href="mailto:soporte@adae.com" style="color: #007bff;">soporte@adae.com</a>.</p>
                        </div>
                    </div>
                </body>
            </html>
        `
            };
            break;

        case "NewTaskAssigned":
            mailOptions = {
                from: `ADAE <${env.correoKey}>`,
                to: emailData.destinatario,
                subject: "Nueva tarea asignada en tu materia",
                text: `Hola ${emailData.nombre}, se te ha asignado una nueva tarea en la materia ${emailData.materia} por el profesor ${emailData.profesor}. Ingresa a la plataforma para ver los detalles completos.`,
                html: `
           <html>
                <head>
                    <!-- Importar fuente Poppins desde Google Fonts -->
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                </head>
                <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 20px; background-color:#f1f2f4;">
                    <div style="width: 400px; min-width: 400px; max-width: 400px; margin: auto; border: none; border-radius: 15px; overflow: hidden;">
                        <!-- Encabezado -->
                        <div style="background-color: #252527; padding: 20px; text-align: center;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 2rem;">ADAE</h2>
                        </div>
                        
                        <!-- Cuerpo -->
                        <div style="padding:30px 40px; color: #333; background-color: #ffffff;">
                            <h3 style="margin-top: 0; font-size: 2rem;">¡Nueva tarea asignada!</h3>
                            <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                            <p>Se te ha asignado una nueva tarea en la materia <strong>${emailData.materia}</strong>,</p>
                            <p>Profesor(a): <strong>${emailData.profesor}</strong></p>
                            <p><strong>Tarea:</strong> ${emailData.tarea}</p>
                            <p>Para ver todos los detalles de la tarea y entregarla, por favor ingresa a la plataforma <strong>ADAE</strong>.</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${emailData.appLink}" target="_blank" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Ir a la plataforma</a>
                            </div>
                        </div>
                        
                        <!-- Pie de página -->
                        <div style="background-color: #FAFAFA; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                            <p style="margin: 20px;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                            <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:soporte@adae.com" style="color: #007bff;">soporte@adae.com</a>.</p>
                        </div>
                    </div>
                </body>
            </html>
        `
            };
            break;

            case "PendingTaskNotification":
                mailOptions = {
                    from: `ADAE <${env.correoKey}>`,
                    to: emailData.destinatario,
                    subject: "Tarea pendiente por entregar",
                    text: `Hola ${emailData.nombre}, recuerda que tienes una tarea pendiente en la materia ${emailData.materia}. La fecha de entrega es el ${emailData.fechaEntrega}. Ingresa a la plataforma para completar y entregar la tarea.`,
                    html: `
                       <html>
                            <head>
                                <!-- Importar fuente Poppins desde Google Fonts -->
                                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                            </head>
                            <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 20px; background-color:#f1f2f4;">
                                <div style="width: 400px; min-width: 400px; max-width: 400px; margin: auto; border: none; border-radius: 15px; overflow: hidden;">
                                    <!-- Encabezado -->
                                    <div style="background-color: #252527; padding: 20px; text-align: center;">
                                        <h2 style="color: #ffffff; margin: 0; font-size: 2rem;">ADAE</h2>
                                    </div>
                                    
                                    <!-- Cuerpo -->
                                    <div style="padding:30px 40px; color: #333; background-color: #ffffff;">
                                        <h3 style="margin-top: 0; font-size: 2rem;">¡Tarea pendiente por entregar!</h3>
                                        <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                                        <p>Recuerda que tienes una tarea pendiente en la materia <strong>${emailData.materia}</strong>.</p>
                                        <p><strong>Fecha de entrega:</strong> ${emailData.fechaEntrega}</p>
                                        <p>No dejes todo para el último momento. Ingresa a la plataforma <strong>ADAE</strong> y entrega tu tarea a tiempo.</p>
                                        <div style="text-align: center; margin: 20px 0;">
                                            <a href="${emailData.appLink}" target="_blank" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Ver Tarea</a>
                                        </div>
                                    </div>
                                    
                                    <!-- Pie de página -->
                                    <div style="background-color: #FAFAFA; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                                        <p style="margin: 20px;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                                        <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:soporte@adae.com" style="color: #007bff;">soporte@adae.com</a>.</p>
                                    </div>
                                </div>
                            </body>
                        </html>
                    `
                };
                break;
                case "TaskGradedNotification":
    mailOptions = {
        from: `ADAE <${env.correoKey}>`,
        to: emailData.destinatario,
        subject: "Tu tarea ha sido calificada",
        text: `Hola ${emailData.nombre}, tu tarea en la materia ${emailData.materia} ha sido calificada. Obtuviste una calificación de ${emailData.calificacion}. Ingresa a la plataforma para revisar los comentarios del profesor.`,
        html: `
           <html>
                <head>
                    <!-- Importar fuente Poppins desde Google Fonts -->
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                </head>
                <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 20px; background-color:#f1f2f4;">
                    <div style="width: 400px; min-width: 400px; max-width: 400px; margin: auto; border: none; border-radius: 15px; overflow: hidden;">
                        <!-- Encabezado -->
                        <div style="background-color: #252527; padding: 20px; text-align: center;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 2rem;">ADAE</h2>
                        </div>
                        
                        <!-- Cuerpo -->
                        <div style="padding:30px 40px; color: #333; background-color: #ffffff;">
                            <h3 style="margin-top: 0; font-size: 2rem;">¡Tu tarea ha sido calificada!</h3>
                            <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                            <p>Tu tarea en la materia <strong>${emailData.materia}</strong> ha sido revisada y calificada.</p>
                            <p><strong>Calificación:</strong> ${emailData.calificacion}</p>
                            <p>Ingresa a la plataforma <strong>ADAE</strong> para ver los comentarios del profesor y los detalles de la calificación.</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${emailData.appLink}" target="_blank" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Ver Calificación</a>
                            </div>
                        </div>
                        
                        <!-- Pie de página -->
                        <div style="background-color: #FAFAFA; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                            <p style="margin: 20px;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                            <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:soporte@adae.com" style="color: #007bff;">soporte@adae.com</a>.</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
    break;

    case "ProfessorCommentsNotification":
    mailOptions = {
        from: `ADAE <${env.correoKey}>`,
        to: emailData.destinatario,
        subject: "Comentarios del Profesor sobre tu tarea",
        text: `Hola ${emailData.nombre}, el profesor ha dejado los siguientes comentarios sobre tu tarea en la materia ${emailData.materia}: ${emailData.comentarios}. Ingresa a la plataforma para ver los detalles completos.`,
        html: `
           <html>
                <head>
                    <!-- Importar fuente Poppins desde Google Fonts -->
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                </head>
                <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 20px; background-color:#f1f2f4;">
                    <div style="width: 400px; min-width: 400px; max-width: 400px; margin: auto; border: none; border-radius: 15px; overflow: hidden;">
                        <!-- Encabezado -->
                        <div style="background-color: #252527; padding: 20px; text-align: center;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 2rem;">ADAE</h2>
                        </div>
                        
                        <!-- Cuerpo -->
                        <div style="padding:30px 40px; color: #333; background-color: #ffffff;">
                            <h3 style="margin-top: 0; font-size: 2rem;">¡Tienes comentarios del profesor!</h3>
                            <p>Estimado(a) <strong>${emailData.nombre}</strong>,</p>
                            <p>El profesor ha dejado los siguientes comentarios sobre tu tarea en la materia <strong>${emailData.materia}</strong>:</p>
                            <blockquote style="border-left: 4px solid #007bff; margin-left: 0; padding-left: 20px; color: #333;">
                                "${emailData.comentarios}"
                            </blockquote>
                            <p>Para conocer los detalles y recibir retroalimentación completa, ingresa a la plataforma <strong>ADAE</strong>.</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${emailData.appLink}" target="_blank" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Ver Comentarios</a>
                            </div>
                        </div>
                        
                        <!-- Pie de página -->
                        <div style="background-color: #FAFAFA; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                            <p style="margin: 20px;">&copy; 2024 ADAE. Todos los derechos reservados.</p>
                            <p>Si tienes alguna duda, no dudes en contactarnos en <a href="mailto:soporte@adae.com" style="color: #007bff;">soporte@adae.com</a>.</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };
    break;



            



        default:
            throw new Error(`El tipo de correo '${tipo}' no está definido`);
    }

    return mailOptions;
}

export default { enviarCorreo };
