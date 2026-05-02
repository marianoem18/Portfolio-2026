const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Aleburger',
      address: 'Velez Sarfield 264, Tafi Viejo, Tucuman',
      phone: '+54 3815866682',
      hours: 'Lunes a Sábado 12:00-00:00, Domingos 12:00-23:00',
      paymentMethods: 'Efectivo, Mercado Pago y flores/cripy',
      welcomeMessage: '¡Hola! Soy el asistente virtual de Aleburger. ¿En qué te puedo ayudar?',
      menuItems: {
        create: [
          { name: 'Milanesa a la napolitana', description: 'lleva salsa de tomate, queso, tomate con ajo y perejil, oregano y aceitunas - 1 persona', price: 11000, category: 'Milanesas' },
          { name: 'Milanesa a la napolitana', description: 'lleva salsa de tomate, queso, tomate con ajo y perejil, oregano y aceitunas - 2 persona', price: 20000, category: 'Milanesas' },
          { name: 'Hamburguesa doble queso', description: 'Pan de zapallo, dos medallones de carne de 100g c/u, aderezo bigmac, extra queso en los medallones', price: 11500, category: 'Hamburguesas' },
          { name: 'Sandwich de Milanesa comun', description: 'Pan sanguchero, como toda buena mila! de carne; nalga la mejor para hacer milanesas - COMUN', price: 11000, category: 'Sandwiches' },
          { name: 'Sandwich de Milanesa especial', description: 'Extras: queso, huevo, jamon y papas fritas - ESPECIAL', price: 13000, category: 'Sandwiches' },
          { name: 'Hamburguesa Oklahoma', description: 'Dos medallones de 100g c/u, smashedos con cebolla cortada finamente, dos fetas de cheddar, dos fetas de panceta, ketchup', price: 12000, category: 'Hamburguesas' },
          { name: 'Hamburguesa Doble ', description: 'Salsa Aleburger, dos medallones de carne de 100g, dos fetas de chedar y dos fetas de panceta ahumada', price: 11500, category: 'Hamburguesas' },
          { name: 'hamburguesa Crispy', description: 'Pan de zapallo, salsa Aleburger, 2 medallones de carne de 100g, 2 fetas de queso cheddar, cebolla crispy', price: 11000, category: 'Hamburguesas' },
          { name: 'Hamburguesa x3', description: 'Pan de zapallo, salsa Aleburger, triple medallon de carnet de 100g c/u, triple bacon', price: 13000, category: 'Hamburguesas' },
          { name: 'Hamburguesa Clasica', description: 'Pan de zapallo, salsa aleburger, dos medallones de 100g, queso cheddar, tomate, lechuga, huevo frito', price: 11000, category: 'Hamburguesas' },
          { name: 'Hamburguesa Rustica', description: 'Pan de zapallo, salsa alioli, cebolla azada, 2 medallones de carne, 2 fetas de queso cheddar, morrones asados', price: 11000, category: 'Hamburguesas' },
        ]
      }
    }
  });

  console.log('Base de datos creada con éxito:', restaurant.name);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());