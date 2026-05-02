const twilio = require('twilio');
const { chat } = require('../services/claudeService');

async function handleMessage(req, res) {
  const twiml = new twilio.twiml.MessagingResponse();

  try {
    const { Body, From } = req.body;

    if (!Body || !From) {
      twiml.message('No pude procesar tu mensaje. Intentá de nuevo.');
      return res.type('text/xml').send(twiml.toString());
    }

    console.log(`Mensaje de ${From}: ${Body}`);

    const { message, needsHuman } = await chat(From, Body);

    console.log(`Respuesta: ${message}`);
    if (needsHuman) console.log(`⚠️  Cliente ${From} requiere atención humana`);

    twiml.message(message);
    res.type('text/xml').send(twiml.toString());

  } catch (error) {
    console.error('Error en webhook:', error);
    twiml.message('Hubo un problema técnico. Por favor intentá más tarde.');
    res.type('text/xml').send(twiml.toString());
  }
}

module.exports = { handleMessage };