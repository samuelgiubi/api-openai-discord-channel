// Importamos las dependencias necesarias
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { setupOpenAI, askOpenAI } = require('./ai.js');

// Configuramos los intents para el cliente de Discord
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

const openai = setupOpenAI();

// Define el ID del canal en el que el bot debe responder, como para un layer extra más allá de privilegios en el canal
const targetChannelId = process.env.DISCORD_CHANNEL_ID;

// Escuchamos el evento 'messageCreate'
client.on('messageCreate', async (discordMessage) => {
    // Ignoramos mensajes de bots y mensajes fuera del canal objetivo
    if (discordMessage.author.bot || discordMessage.channel.id !== targetChannelId) return;

    try {
        // Creamos una conversación inicial
        const message = [
            {
                role: "user",
                content: discordMessage.content
            }
        ];

        // Enviamos la consulta a la API de OpenAI
        const responseMessage = await askOpenAI(openai, discordMessage, message)

        discordMessage.reply(responseMessage);
    } catch (err) {
        // Registramos el error en caso de que ocurra alguno
        console.error('Error al procesar el mensaje:', err);

        // Imprimimos la respuesta de error de la API de OpenAI
        if (err.response && err.response.data) {
            console.error('Error en la respuesta de OpenAI:', err.response.data);
        }
    }
});

// Iniciamos sesión en Discord y mostramos un mensaje cuando el bot esté listo
client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log('El bot ahora ya está Online en Discord');
}).catch((err) => {
    console.error('Error al iniciar sesión en Discord:', err);
});
