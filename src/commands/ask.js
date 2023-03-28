const AIGpt = require('../ai.js');

const gpt = new AIGpt();

module.exports = askCommand = async (discordMessage) => {
    try {
        // Creamos una conversación inicial
        const message = [
            {
                role: "user",
                content: discordMessage.content.slice(5)
            }
        ];

        // Enviamos la consulta a la API de OpenAI
        const responseMessage = await gpt.ask(discordMessage, message)

        // Enviamos la respuesta
        await discordMessage.reply(responseMessage);
    } catch (err) {
        // Registramos el error en caso de que ocurra alguno
        console.error('Error al procesar el mensaje:', err);

        // Imprimimos la respuesta de error de la API de OpenAI
        if (err.response && err.response.data) {
            console.error('Error en la respuesta de OpenAI:', err.response.data);
        }
    }
}