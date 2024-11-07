import { defineStore } from 'pinia';

export const useDataStore = defineStore('jarvis', {
state: () => ({
    // global variables for all components
    items: [
        {
            "pmid": 36361634,
            "title": "The Role of Telomerase in Breast Cancer's Response to Therapy.",
            "journal": "Int J Mol Sci.",
            "year": 2013,
            "conclusion": "The model also makes several testable predictions, which can be used to validate or falsify the theory in future experiments.",
            "abstract": "Currently, breast cancer appears to be the most widespread cancer in the world and the most common cause of cancer deaths. This specific type of cancer affects women in both developed and developing countries. Prevention and early diagnosis are very important factors for good prognosis. A characteristic feature of cancer cells is the ability of unlimited cell division, which makes them immortal. Telomeres, which are shortened with each cell division in normal cells, are rebuilt in cancer cells by the enzyme telomerase, which is expressed in more than 85% of cancers (up to 100% of adenocarcinomas, including breast cancer). Telomerase may have different functions that are related to telomeres or unrelated. It has been shown that high activity of the enzyme in cancer cells is associated with poor cell sensitivity to therapies. Therefore, telomerase has become a potential target for cancer therapies. The low efficacy of therapies has resulted in the search for new combined and more effective therapeutic methods, including the involvement of telomerase inhibitors and telomerase-targeted immunotherapy.",
        
        
            "decision": "New theory",
            "decision_datetime": "2021-09-01T00:00:00Z",
            "decision_by": "user",
        }
    ],

    // global functions for all components
    working_item_idx: -1,

    // taxonomy
    taxonomy: [
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

    keywords: [
        'cancer',
        'early',
        'testable'
    ],

    flag: {
        enable_highlight: true,
    },

    status: {
        loading: false,
        error: null,
    },
}),
getters: {
    working_item(state) {
        if (this.working_item_idx == -1) {
            return null;
        }
        return this.items[this.working_item_idx];
    },
},  
actions: {
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
    }
}
});