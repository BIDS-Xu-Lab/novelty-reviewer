import { defineStore } from 'pinia';

export const useDataStore = defineStore('jarvis', {
state: () => ({
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
        "result_raw_openai": "New theory",

        "result_claude": "New other",
        "result_raw_claude": "New other info",

        "result_llama": "New tool",
        "result_raw_llama": "New other tool",

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

    // prompt
    prompt_file: null,
    llm_prompt: null,

    ai_models: [
    {
        "id": "openai",
        "name": "OpenAI",
        "enabled": true
    },
    {
        "id": "claude",
        "name": "Claude",
        "enabled": true
    },
    {
        "id": "llama",
        "name": "LLaMA",
        "enabled": true
    },
    ],

    keywords: [],

    flag: {
        enable_highlight: true,
        is_fetching_metadata: false,
        is_saving_dataset_file: false,
        has_data_unsaved: false,

        show_setting_panel: false,
    },

    status: {
        error: null,
    },
}),
getters: {
    working_item(state) {
        if (state.working_item_idx == -1) {
            return null;
        }
        return state.items[state.working_item_idx];
    },

    keywords_list(state) {
        return state.keywords.join("\n");
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

    n_results_by_human(state) {
        return state.items.filter(item => item.decision_by == "human").length;
    },

    n_results_by_ai(state) {
        return state.items.filter(item => item.decision_by != "human").length;
    },
},  
actions: {
    setWorkingItemDecision(model, result) {
        this.working_item.decision = result;
        this.working_item.decision_by = model;
        this.working_item.decision_datetime = new Date().toLocaleString();

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
            'result_raw_openai',

            'result_claude',
            'result_raw_claude',

            'result_llama',
            'result_raw_llama',
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
        let re = new RegExp(keywords.join("|"), "gi");
        return text.replace(re, function(matched){
            return "<mark>" + matched + "</mark>";
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
        this.llm_prompt = text;
    },

    loadSettingsFromLocalStorage: function() {
        // get keywords from local storage
        try {
            let keywords = JSON.parse(localStorage.getItem("keywords"));
            this.keywords = keywords;
        } catch (e) {
            console.log(e);
        }

        console.log('* loaded settings from local storage');
    },
}
});