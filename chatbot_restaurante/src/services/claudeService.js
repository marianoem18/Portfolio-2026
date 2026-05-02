const client = require('../config/claude');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function buildSystemPrompt() {
  const restaurant = await prisma.restaurant.findFirst({
    include: { menuItems: { where: { available: true } } }
  });

  if (!restaurant) return 'Sos un asistente de restaurante.';

  const menuByCategory = restaurant.menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(`• ${item.name} — $${item.price} (${item.description})`);
    return acc;
  }, {});

  const menuText = Object.entries(menuByCategory)
    .map(([cat, items]) => `${cat}:\n${items.join('\n')}`)
    .join('\n\n');

  return `Sos el asistente virtual de ${restaurant.name}.
Tu función es atender clientes por WhatsApp de forma amable y concisa y encargarte de tomar el pedido del cliente.

INFORMACIÓN DEL LOCAL:
- Dirección: ${restaurant.address}
- Teléfono: ${restaurant.phone}
- Horarios: ${restaurant.hours}
- Medios de pago: ${restaurant.paymentMethods}

MENÚ ACTUAL:
${menuText}

REGLAS:
-No se puede agregar cosas extras como aderezos o ingredientes que no estén en el menu o la descripcion del plato.
-No se puede cancelar pedido si lo hizo hace mas de 5 minutos, cualquier cosa que derive a un humano.
- La salsa bigmac esta hecha con mayonesa, ketchup y mostaza.
-se puede agregar medallones extras a las hamburguesas, hasta 2 extras, no mas que eso y tiene un costo de $1500 por cada medallon extra, especificarlo en el pedido
-No hay menu vegetariano ni vegano.
-Unicamente pedidos hasta las 12 de la noche, despues de esa hora derivar a un humano.
-Se puede quitar ingredientes.
-Todas las burgers vienen con papas fritas, no preguntes si la desean incluir o no, solo informale.
- Si el cliente pide un plato que no está disponible, ofrecé una alternativa similar del menú.
-Se puede pagar una parte con efectivo y otra parte con transferencia, no tarjeta.
- Respondé siempre en español, tono amable y conciso.
- Las papas vienen sin sal.
- La demora aun no esta definida, deriva
- LLega hasta Tafi viejo, no villa carmela, ni lomas de tafi.
- Si te preguntan por un plato, incluí precio y descripción.
- Si el cliente quiere hablar con una persona real, avisale que lo derivás y terminá el mensaje con la palabra clave: DERIVAR_HUMANO
- No inventes información que no esté en este prompt.
- Si no sabés algo, decí "No tengo esa información, podés consultarnos al ${restaurant.phone}".
- Máximo 3 párrafos por respuesta.`;
}

async function getConversationHistory(phone) {
  const conversation = await prisma.conversation.findFirst({
    where: { phone },
    orderBy: { updatedAt: 'desc' }
  });

  if (!conversation) return [];
  return JSON.parse(conversation.messages || '[]');
}

async function saveConversation(phone, messages, needsHuman = false) {
  const existing = await prisma.conversation.findFirst({ where: { phone } });

  if (existing) {
    await prisma.conversation.update({
      where: { id: existing.id },
      data: { messages: JSON.stringify(messages), needsHuman, updatedAt: new Date() }
    });
  } else {
    await prisma.conversation.create({
      data: { phone, messages: JSON.stringify(messages), needsHuman }
    });
  }
}

async function chat(phone, userMessage) {
  const systemPrompt = await buildSystemPrompt();
  const history = await getConversationHistory(phone);

  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt
  });

  const geminiHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const chatSession = model.startChat({ history: geminiHistory });
  const result = await chatSession.sendMessage(userMessage);
  const assistantMessage = result.response.text();

  const needsHuman = assistantMessage.includes('DERIVAR_HUMANO');
  const cleanMessage = assistantMessage.replace('DERIVAR_HUMANO', '').trim();

  history.push({ role: 'user', content: userMessage });
  history.push({ role: 'assistant', content: cleanMessage });

  const trimmedHistory = history.slice(-10);
  await saveConversation(phone, trimmedHistory, needsHuman);

  return { message: cleanMessage, needsHuman };
}

module.exports = { chat };