export const pubmed = {
    BASE: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",

    count: async function(query) {
        const data = await this.esearch(query);
        const cnt = parseInt(data.esearchresult.count);
        return {
            count: cnt,
            querytranslation: data.esearchresult.querytranslation
        }
    },

    esearch: async function(query, retstart=0, retmax=10) {
        const rsp = await fetch(
            `${this.BASE}/esearch.fcgi?db=pubmed&retmode=json&retstart=${retstart}&retmax=${retmax}&term=${query}`, 
            {
                method: 'GET'
            }
        );
        
        const data = await rsp.json();

        return data;
    },

    esummary: async function(id) {
        const rsp = await fetch(
            `${this.BASE}/esummary.fcgi?db=pubmed&retmode=json&id=${id}`, 
            {
                method: 'GET'
            }
        );
        
        const data = await rsp.json();

        return data;
    },

    efetch: async function(id, rettype='abstract', retmode='xml') {
        const rsp = await fetch(
            `${this.BASE}/efetch.fcgi?db=pubmed&retmode=${retmode}&rettype=${rettype}&id=${id}`, 
            {
                method: 'GET'
            }
        );
        
        let data;
        if (rettype == 'abstract') {
            data = await rsp.text();
        } else {
            data = await rsp.json();
        }

        return data;
    }
};