/**
 * Format a string with placeholders replaced by values
 * 
 * For example, if the input string is "Hello, {name}!", and the args object is
 * { name: "World" }, the output will be "Hello, World!"
 * 
 * @param {String} str A template string with placeholders
 * @param {Object} args Values to replace the placeholders in the template string
 * @returns String with placeholders replaced by values
 */
export const formatString = function(str, args) {
    for (let key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    }

    return str;
}

/**
 * Get the label from a given string
 * 
 * @param {string} str the label string
 * @returns real label part
 */
export const getLabel = function(str) {
    if (typeof(str) == 'undefined') {
        return "";
    }
    if (str == null) {
        return "";
    }
    let _str = str.trim();
    let parts = _str.split(" ");

    if (parts.length == 1) {
        return _str;
    }

    // get the first part
    let num = parts[0];
    if (num.match(/^\d+(\.\d+)*$/)) {
        // this line has number, remove it
        return _str.replace(/^\d+(\.\d+)*\s*/, "");
    } else {
        // this line does not have number
        return _str;
    }
}

/**
 * Extract a JSON object from a text
 * 
 * @param {string} s a text having json object
 * @returns json object
 */
export const extractJson = function(s) {
    // Find the first occurrence of "{"
    const jsonStart = s.indexOf("{");
    // Find the last occurrence of "}"
    const jsonEnd = s.lastIndexOf("}");
    
    // If valid JSON boundaries are found, slice and parse the JSON
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
        const jsonString = s.slice(jsonStart, jsonEnd + 1);
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            return null;
        }
    }
    
    return null;
}

/**
 * Build a taxonomy tree from a text
 * 
 * @param {string} taxonomy_text 
 */
export const buildTaxonomyTree = function(taxonomy_text, root_name="Taxonomy") {
    function findParent(root, parentParts) {
        let currentNode = root;
        for (const part of parentParts) {
            const index = part - 1; // Convert to zero-based index
            if (!currentNode.children || currentNode.children.length <= index) {
                throw new Error(`Invalid input: Parent node for '${parentParts.join('.')}' not found. Check line order.`);
            }
            currentNode = currentNode.children[index];
        }
        return currentNode;
    }

    const lines = taxonomy_text.split('\n').map(line => line.trim()).filter(line => line);
    const root = { 
        name: root_name, 
        children: [] 
    };

    for (const line of lines) {
        const match = line.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
        if (!match) continue;

        const number = match[1];
        const name = match[2];

        const _t = getTaxonomyItem(line);
        if (!_t) continue;

        const parts = number.split('.').map(part => parseInt(part, 10));
        const parentParts = parts.slice(0, -1);

        let parent = root;
        if (parentParts.length > 0) {
            parent = findParent(root, parentParts);
        }

        if (!parent.children) parent.children = [];

        const _name = _t.name;
        const description = _t.description;

        parent.children.push({ 
            number: number,
            name: _name ,
            description: description,
        });
    }

    return root;
}

export const getTaxonomyItem = function(taxonomy_line) {
    // trim the line
    let _line = taxonomy_line.trim();

    // if line is empty, skip
    if (_line == "") {
        return null;
    }
    // find the index of the first colon
    let index = taxonomy_line.indexOf(":");

    // first, the number and name
    let num_name = taxonomy_line.substring(0, index);
    let description = taxonomy_line.substring(index + 1).trim();

    // then, find the name
    let _num_name = num_name.trim();
    let index2 = _num_name.indexOf(" ");

    let num = _num_name.substring(0, index2);
    let name = _num_name.substring(index2 + 1).trim();

    return {
        num: num,
        name: name,
        description: description
    }
}