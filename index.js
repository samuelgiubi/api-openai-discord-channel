// Importamos las dependencias necesarias
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

// Configuramos los intents para el cliente de Discord
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Configuramos la conexión con la API de OpenAI
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Define el ID del canal en el que el bot debe responder, como para un layer extra más allá de privilegios en el canal
const targetChannelId = 'process.env.DISCORD_CHANNEL_ID';

// Escuchamos el evento 'messageCreate'
client.on('messageCreate', async (message) => {
    // Ignoramos mensajes de bots y mensajes fuera del canal objetivo
    if (message.author.bot || message.channel.id !== targetChannelId) return;

    try {
        // Creamos una conversación inicial
        const messages = [
            {role: "user", content: message.content}
        ];

        // Enviamos la consulta a la API de OpenAI
        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.5,
            max_tokens: 2000,
            user: `user-${message.author.id}`
        });

        // Verificamos si la propiedad text está disponible y, en caso afirmativo, respondemos al mensaje
        if (gptResponse.data.choices[0] && gptResponse.data.choices[0].message.content) {
            message.reply(gptResponse.data.choices[0].message.content.trim());
        } else {
            console.error('Error: la propiedad "message" no está disponible en la respuesta de OpenAI');
        }
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
