const { Configuration, OpenAIApi } = require('openai');

class AIGpt {
    constructor() {
        const configuration = new Configuration({
            organization: process.env.OPENAI_ORG,
            apiKey: process.env.OPENAI_KEY,
        });

        this.openai = new OpenAIApi(configuration);
    }

    async ask(discordMessage, messages) {
        const gptResponse = await this.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: parseFloat(process.env.OPENAI_TEMPERATURE),
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS),
            user: `user-${discordMessage.author.id}`
        });
    
        if (!gptResponse.data.choices[0]?.message.content) {
            throw Error('Error: la propiedad "message" no está disponible en la respuesta de OpenAI');
        }
    
        return gptResponse.data.choices[0].message.content.trim();
    }
}

module.exports = AIGpt;