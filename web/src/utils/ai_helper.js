import * as toolbox from "./toolbox";

export const ai_helper = {

    SAMPLE_TEMPLATE: `I will provide a list of concepts, please randomly select one of them to echo for now. Please exactly use what listed. Don't add any other words in the output.

- Nature
- Science
- Cell
`,

    generateQuestionFromTemplate: function(tpl, p, t) {
        // TODO, format the text based on tpl
        // and use item as input
        if (tpl == null) {
            return this.SAMPLE_TEMPLATE;
        }
        let title = '';
        if (p.hasOwnProperty('title')) { title = p.title; }
        
        let abstract = '';
        if (p.hasOwnProperty('abstract')) { abstract = p.abstract; }

        let conclusion = '';
        if (p.hasOwnProperty('conclusion')) { conclusion = p.conclusion; }

        // format question
        let text = toolbox.formatString(
            tpl, 
            {
                title: title,
                abstract: abstract,
                conclusion: conclusion,
                taxonomy: t
            }
        )
        
        return text;
    },

    /**
     * Ask a single question to the AI
     * 
     * This will call OpenAI standard API to ask a single question
     * 
     * @param {string} text The text to ask
     */

    ask: async function(question, config) {
        console.log('* asking question\n', question);

        if (config.service_type == 'openai') {
            return await this._ask_openai(
                question,
                config
            );
        }

        if (config.service_type == 'ollama') {
            return await this._ask_ollama(
                question,
                config
            );
        }

        if (config.service_type == 'claude') {
            return await this._ask_claude(
                question,
                config
            );
        }
    },

    _ask_openai: async function(question, config) {
        console.log(`* asking openai ...`);
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
                    "format": "json",
                    "temperature": config.temperature,
                    "response_format": {
                        "type": "json_object",
                    },
                    "messages": [
                    {
                        "role": "system",
                        "content": config.system_prompt
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

        let s = data.choices[0].message.content;
        let result = JSON.parse(s);
        console.log("* openai result: ", result);

        let answer = toolbox.getLabel(result['category']);

        // maybe format the response here before return
        let ret = {
            reason: result['reason'],
            answer: answer,
            raw: s.replace(/\n/g, " ")
        };
        return ret;

    },

    _ask_gemini: async function(question, config) {
        console.log(`* asking gemini ...`);
    },

    _ask_claude: async function(question, config) {
        console.log(`* asking claude ...`);
        let endpoint = config.endpoint;

        // e.g., "model_name": "gpt-4o-mini",
        let model_name = config.model_name;

        // customize header
        let headers = {
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "anthropic-dangerous-direct-browser-access": "true",
            "x-api-key": config.api_key,
        };

        const rsp = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                model: model_name,
                max_tokens: 4096,
                temperature: config.temperature,
                messages: [
                {
                    role: "user",
                    content: [
                    {
                        type: "text", 
                        text: question
                    },
                    ],
                },
                {
                    role: "assistant", 
                    content: [{
                        type: "text", 
                        text: config.system_prompt
                    }]
                },
                // {
                //     "role": "assistant",
                //     "content": [{
                //         "type": "text",
                //         "text": "Here is the JSON requested:\n{"
                //     }]
                // }
                ],
            }),
        });

        const data = await rsp.json();

        console.log(data)

        let s = data.content[0].text;

        let result = toolbox.extractJson(s);        
        console.log("* claude result: ", result);

        // get answer from the result
        let answer = toolbox.getLabel(result['category']);

        // maybe format the response here before return
        let ret = {
            reason: result['reason'],
            answer: answer,
            raw: s.replace(/\n/g, " ")
        };
        return ret;
    },

    _ask_ollama: async function(question, config) {
        let endpoint = config.endpoint;

        // e.g., "model_name": "gpt-4o-mini",
        let model_name = config.model_name;

        // customize header
        let headers = {
            'Content-Type': 'application/json',
        };
        if (config.api_key != null || config.api_key != '') {
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
                    "format": "json",
                    "stream": false,
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

        console.log(data);

        let s = data.message.content;
        let result = JSON.parse(s);

        // get answer from the result
        let answer = toolbox.getLabel(result['category']);

        // maybe format the response here before return
        let ret = {
            reason: result['reason'],
            answer: answer,
            raw: s.replace(/\n/g, " ")
        };
        return ret;
    },

}