
/* =========================================
   EMAIL JS CONFIG
========================================= */

const EMAILJS_SERVICE_ID = 'service_n5f77am';
const EMAILJS_TEMPLATE_ID = 'template_wo1esck';
const EMAILJS_PUBLIC_KEY = 'wlInvQ-cP4mHu3MzT';

/* =========================================
   FUNCION ENVIAR CORREO
========================================= */

const enviarCorreoReserva = async (templateParams) => {

  try {

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Correo enviado correctamente:', response);

    return true;

  } catch (error) {

    console.error('Error enviando correo:', error);

    return false;

  }

};