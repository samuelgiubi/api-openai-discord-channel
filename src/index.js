// Importamos las dependencias necesarias
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const askCommand = require('./commands/ask.js');

// Configuramos los intents para el cliente de Discord
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Define el ID del canal en el que el bot debe responder, como para un layer extra más allá de privilegios en el canal
const targetChannelId = process.env.DISCORD_CHANNEL_ID;

// Escuchamos el evento 'messageCreate'
client.on('messageCreate', async (discordMessage) => {
    // Ignoramos mensajes de bots y mensajes fuera del canal objetivo
    if (discordMessage.author.bot || discordMessage.channel.id !== targetChannelId) return;

    // Comprobamos si el mensaje comienza con el prefijo '!ask' y ejecutamos el comando
    if (discordMessage.content.startsWith('!ask')) await askCommand(discordMessage);
});

// Iniciamos sesión en Discord y mostramos un mensaje cuando el bot esté listo
client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log('El bot ahora ya está Online en Discord');
}).catch((err) => {
    console.error('Error al iniciar sesión en Discord:', err);
});