import { defineStore } from 'pinia';
import { useToast } from "primevue/usetoast";

export const useDataStore = defineStore('jarvis', {
state: () => ({
    config: {
        api_server_url: "http://localhost:8123",
        api_server_token: "",

        keywords: [
            {token: "cancer", bgcolor:"#ECDCAC"},
            {token: "data", bgcolor:"#FFA704"},
        ],

        // list of AI models
        // each model has an id, name, enabled flag, and api_key
        ai_models: {

        // OK, the settings of those models should be able to 
        // import from local file, a JSON object
        // and some basic information maybe also can be edit?
        // but I don't want to everytime to load the JSON manually
        // so it can also be saved in to the lcoalstorage for quick access
        // 
        openai: {
            "id": "openai",
            // service_type is the type of the AI service
            // it can be openai, claude, etc.
            // as not all AI services provide the same API interface
            // we need to know which service is used
            // for ollama, vllm, 
            "service_type": "openai",
            "name": "OpenAI 4o mini",
            "model_name": "gpt-4o-mini",
            "endpoint": "https://api.openai.com/v1/chat/completions",
            // "model_name": "llama3.1",
            // "endpoint": "http://localhost:11434/v1/chat/completions",
            "enabled": true,
            "api_key": ""
        },
        claude: {
            "id": "claude",
            "service_type": "claude",
            "name": "Claude 3.5 Haiku",
            "model_name": "claude-3-5-haiku-20241022",
            "endpoint": "https://api.anthropic.com/v1/messages",
            "enabled": true,
            "api_key": ""
        },
        llama: {
            "id": "llama",
            "service_type": "ollama",
            "name": "Llama 3.1 8B",
            "model_name": "llama3.1",
            "endpoint": "http://localhost:11434/api/chat",
            "enabled": true,
            "api_key": ""
        },
        },

    },
    // global variables for all components
    /*
    {
        "pmid": 36361634,
        "title": "The Role of Telomerase in Breast Cancer's Response to Therapy.",
        "journal": "Int J Mol Sci.",
        "year": 2013,
        "conclusion": "The model also makes several testable predictions, which can be used to validate or falsify the theory in future experiments.",
        "abstract": "Currently, breast cancer appears to be the most widespread cancer in the world and the most common cause of cancer deaths. This specific type of cancer affects women in both developed and developing countries. Prevention and early diagnosis are very important factors for good prognosis. A characteristic feature of cancer cells is the ability of unlimited cell division, which makes them immortal. Telomeres, which are shortened with each cell division in normal cells, are rebuilt in cancer cells by the enzyme telomerase, which is expressed in more than 85% of cancers (up to 100% of adenocarcinomas, including breast cancer). Telomerase may have different functions that are related to telomeres or unrelated. It has been shown that high activity of the enzyme in cancer cells is associated with poor cell sensitivity to therapies. Therefore, telomerase has become a potential target for cancer therapies. The low efficacy of therapies has resulted in the search for new combined and more effective therapeutic methods, including the involvement of telomerase inhibitors and telomerase-targeted immunotherapy.",
    
    
        "decision": "New theory",
        "decision_datetime": "2021-09-01T00:00:00Z",
        "decision_by": "human",

        "result_human": "New theory",

        "result_openai": "New theory",
        "result_reason_openai": "New theory",

        "result_claude": "New other",
        "result_reason_claude": "New other info",

        "result_llama": "New tool",
        "result_reason_llama": "New other tool",

    }
     */
    items: [],

    // global functions for all components
    working_item_idx: -1,

    // taxonomy
    taxonomy_file: null,
    
    /*
    taxonomy is a list of objects, each object has two fields:
    [
    {
        "name": "1 New Concept",
        "value": "New concept"
    },
    {
        "name": "   1.1 New Theory",
        "value": "New theory"
    },
    {
        "name": "   1.2 New Hypothesis",
        "value": "New hypothesis"
    },
    {
        "name": "   1.3 New something",
        "value": "New something"
    },
    {
        "name": "2 New Finding",
        "value": "New Finding"
    },
    {
        "name": "3 New Application",
        "value": "New Application"
    },
    ],
     */
    taxonomy: [],

    // translation
    // dictionary of paper and tranlsated texts
    // 
    translation: {},

    // prompt
    prompt_file: null,
    llm_prompt_template: null,

    flag: {
        enable_highlight: true,
        is_fetching_metadata: false,
        is_translating: false,
        is_saving_dataset_file: false,
        has_data_unsaved: false,

        show_setting_panel: false,

        enable_auto_save: false,
    },

    status: {
        error: null,
    },

    toast: useToast(),
}),
getters: {
    working_item(state) {
        if (state.working_item_idx == -1) {
            return null;
        }
        return state.items[state.working_item_idx];
    },

    keywords_list(state) {
        return state.config.keywords.join("\n");
    },

    has_working_item_title(state) {
        if (state.working_item_idx == -1) {
            return false;
        }
        if (!state.items[state.working_item_idx].hasOwnProperty('title')) {
            return false;
        }
        if (state.items[state.working_item_idx].title == null) {
            return false;
        }
        return true;
    },

    has_working_item_abstract(state) {
        if (state.working_item_idx == -1) {
            return false;
        }
        if (!state.items[state.working_item_idx].hasOwnProperty('abstract')) {
            return false;
        }
        if (state.items[state.working_item_idx].abstract == null) {
            return false;
        }
        return true;
    },

    has_working_item_conclusion(state) {
        if (state.working_item_idx == -1) {
            return false;
        }
        if (!state.items[state.working_item_idx].hasOwnProperty('conclusion')) {
            return false;
        }
        if (state.items[state.working_item_idx].conclusion == null) {
            return false;
        }
        return true;
    },

    has_working_item_decision(state) {
        if (state.working_item_idx == -1) {
            return false;
        }
        if (!state.items[state.working_item_idx].hasOwnProperty('decision')) {
            return false;
        }
        if (state.items[state.working_item_idx].decision == null) {
            return false;
        }
        if (state.items[state.working_item_idx].decision == '') {
            return false;
        }
        return true;
    },

    n_results_by_human(state) {
        return state.items.filter(item => item.decision_by == "human").length;
    },

    n_results_by_ai(state) {
        return state.items.filter(item => item.decision_by != "human").length;
    },
},  
actions: {
    setWorkingItemDecision(model_id, result) {
        this.working_item.decision = result;
        this.working_item.decision_by = model_id;
        this.working_item.decision_datetime = new Date().toLocaleString();

        this.flag.has_data_unsaved = true;
    },

    setWorkingItemResult(model_id, result) {
        this.working_item['result_' + model_id] = result.answer;
        this.working_item['result_reason_' + model_id] = result.reason;
        this.flag.has_data_unsaved = true;
    },

    hasMetadata: function(item) {
        if (!item.hasOwnProperty('title')) {
            return false;
        }
        if (item.title == null) {
            return false;
        }
        return true;
    },

    hasWorkingItemTranslation: function(section) {
        if (this.working_item_idx == -1) {
            return false;
        }
        if (!this.translation.hasOwnProperty(this.working_item.pmid)) {
            return false;
        }
        if (!this.translation[this.working_item.pmid].hasOwnProperty(section)) {
            return false;
        }
        return true;
    },

    getWorkingItemTranslation: function(section) {
        return this.translation[this.working_item.pmid][section];
    },

    formatTsvRow: function(row) {
        let attrs = [
            // basic information
            'title',
            'journal',
            'year',
            'conclusion',
            'abstract',

            // decision
            'decision',
            'decision_datetime',
            'decision_by',

            // results from different sources
            'result_human',

            'result_openai',
            'result_reason_openai',

            'result_claude',
            'result_reason_claude',

            'result_llama',
            'result_reason_llama',
        ];

        for (let attr of attrs) {
            if (!row.hasOwnProperty(attr)) {
                row[attr] = null;
            }
        }

        return row;
    },

    increment() {
        this.count++;
    },


    translate: async function(text) {
        
    },

    // highlight keywords in text
    // the given keywords are a list of strings
    highlight: function(text, keywords) {
        // convert keywords to a dictionary
        let kws = [];
        let kwd = {};
        for (let i in keywords) {
            let kw = keywords[i];
            
            // if kw is a string, convert it to an object
            if (typeof kw === 'string') {
                kws.push(kw);
                kwd[kw] = 'yellow';
            } else {
                // put the token to lowercase
                kws.push(kw.token);
                kwd[kw.token.toLowerCase()] = kw.bgcolor;
            }
        }
        let re = new RegExp(kws.join("|"), "gi");
        return text.replace(re, (matched) => {
            let kw = matched.toLowerCase();
            let clr = kwd[kw];
            return `<mark style="background: ${clr};">${matched}</mark>`;
            // return "<mark>" + matched + "</mark>";
        });
    },

    setTaxonomyByText: function(text) {
        // the given text is a string
        // each line is a taxonomy item
        // we need to split the text by line
        // for those lines start with a number, such as 1, 1.1, 1.1.1, etc.
        // we need to remove the number, just keep the text
        // the result is a list of strings
        let lines = text.split("\n");
        let result = [];
        for (let line of lines) {
            // trim the line
            line = line.trim();

            // if line is empty, skip
            if (line == "") {
                continue;
            }

            // split
            let parts = line.split(" ");

            // get the first part
            let num = parts[0];
            if (num.match(/^\d+(\.\d+)*$/)) {
                // this line has number, remove it
                result.push({
                    name: line,
                    value: line.replace(/^\d+(\.\d+)*\s*/, "")
                });
            } else {
                // this line does not have number
                result.push({
                    name: line,
                    value: line
                });
            }
        }

        // update the local taxonomy
        this.taxonomy = result;
    },


    setPrompt: function(text) {
        this.llm_prompt_template = text;
    },

    updateSettingsByJSON: function(json) {
        // copy the items from json to store.config
        for (let key in this.config) {
            if (json.hasOwnProperty(key)) {
                this.config[key] = json[key];
            }
        }
    },

    loadSettingsFromLocalStorage: function() {
        // just load the object from localstorage
        let x = localStorage.getItem('config');

        if (x == null) {
            store.msg('No settings from local');
            return;
        }

        // parse
        let cfg = JSON.parse(x);
        console.log('* local storage config:', cfg);

        this.updateSettingsByJSON(cfg);

        console.log('* loaded settings from local storage');
    },

    clearSettingsFromLocalStorage: function() {
        localStorage.removeItem('config');
    },

    msg: function(text, type='info') {
        this.toast.add({
            severity: type, 
            summary: 'Info', 
            detail: text,
            life: 3000
        });
    },
}
});