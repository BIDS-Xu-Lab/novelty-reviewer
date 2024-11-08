export const ai_helper = {

    /**
     * Ask a single question to the AI
     * 
     * This will call OpenAI standard API to ask a single question
     * 
     * @param {string} text The text to ask
     */
    ask: async function(text, model='openai') {
        const rsp = await fetch(
            'http://localhost:11434/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "llama3.1",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful assistant."
                        },
                        {
                            "role": "user",
                            "content": text
                        }
                    ]
                })
            }
        );

        const data = await rsp.json();

        return data;
    }
}