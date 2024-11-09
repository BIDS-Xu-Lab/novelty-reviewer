export const ai_helper = {
    service: {
        // openai: {
        //     endpoint: "https://api.openai.com/v1/chat/completions",
        //     model_name: "gpt-4o-mini",
        // },
        openai: {
            endpoint: "http://localhost:11434/v1/chat/completions",
            model_name: "llama3.1",
        },
        llama: {
            endpoint: "http://localhost:11434/v1/chat/completions",
            model_name: "llama3.1",
        },
        claude: {
            endpoint: "http://localhost:11434/v1/chat/completions",
            model_name: "llama3.1",
        }
    },

    SAMPLE_TEMPLATE: `I will provide a list of concepts, please randomly select one of them to echo for now. Please exactly use what listed. Don't add any other words in the output.

- Nature
- Science
- Cell
`,

    generateQuestionFromTemplate: function(tpl, item) {
        // TODO, format the text based on tpl
        // and use item as input
        if (tpl == null) {
            return this.SAMPLE_TEMPLATE;
        }
        return tpl;
    },

    /**
     * Ask a single question to the AI
     * 
     * This will call OpenAI standard API to ask a single question
     * 
     * @param {string} text The text to ask
     */
    ask: async function(text, service='llama', model=null, api_key=null) {
        // get config from service
        let endpoint = this.service[service].endpoint;
        let model_name = this.service[service].model_name;
        if (model != null) { model_name = model; }

        // customize header
        let headers = {
            'Content-Type': 'application/json',
        };
        if (api_key != null) {
            headers['Authorization'] = `Bearer ${api_key}`;
        }

        // send request
        const rsp = await fetch(
            endpoint,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    "model": model_name,
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