# Chatbot de WhatsApp para Restaurantes

Bot de atención al cliente por WhatsApp con IA generativa. Responde preguntas sobre el menú, horarios, dirección y medios de pago de forma automática 24/7.

## Tecnologías

- Node.js + Express
- Twilio WhatsApp API
- Google Gemini AI
- Prisma ORM + SQLite
- Docker

## Requisitos

- Node.js 20+
- Docker Desktop
- Cuenta en Twilio
- API Key de Google Gemini

## Instalación local

1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/tu-usuario/chatbot-restaurante.git
cd chatbot-restaurante
\`\`\`

2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno
\`\`\`bash
cp .env.example .env
\`\`\`
Completar los valores en `.env` con tus credenciales.

4. Crear la base de datos
\`\`\`bash
npx prisma migrate dev
node prisma/seed.js
\`\`\`

5. Iniciar el servidor
\`\`\`bash
npm run dev
\`\`\`

## Instalación con Docker

\`\`\`bash
cp .env.example .env
# Completar .env con tus credenciales
docker compose up --build
\`\`\`

## Configuración de Twilio

1. Crear cuenta en [twilio.com](https://twilio.com)
2. Activar el sandbox de WhatsApp en Messaging → Try it out
3. Configurar el webhook apuntando a `https://tu-dominio/webhook`

## Estructura del proyecto

\`\`\`
src/
├── config/        # Configuración de clientes externos
├── controllers/   # Lógica de cada ruta
├── routes/        # Definición de endpoints
└── services/      # Lógica de negocio (IA, DB)
prisma/
├── schema.prisma  # Modelos de base de datos
└── seed.js        # Datos de ejemplo
\`\`\`
