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

    ask: async function(question, config) {
        if (config.service_type == 'openai') {
            return await this._ask_openai(
                question,
                config
            );
        }
    },

    _ask_openai: async function(question, config) {
        // e.g., "endpoint": "https://api.openai.com/v1/chat/completions",
        let endpoint = config.endpoint;

        // e.g., "model_name": "gpt-4o-mini",
        let model_name = config.model_name;

        // customize header
        let headers = {
            'Content-Type': 'application/json',
        };
        if (config.api_key != null) {
            headers['Authorization'] = `Bearer ${config.api_key}`;
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
                            "content": question
                        }
                    ]
                })
            }
        );

        const data = await rsp.json();

        // maybe format the response here before return
        let ret = {
            raw: data.choices[0].message.content,
            answer: data.choices[0].message.content
        };
        return ret;

    },

    _ask_gemini: async function(question, config) {
    },

    _ask_claude: async function(question, config) {
    },

}