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