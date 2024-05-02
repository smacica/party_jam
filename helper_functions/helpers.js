const fs = require("fs");

function generateRandomString(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}

const setCacheParameter = (fields, values) => {
    let cache = require("../data_cache.json");
    fields.map((field, index) => {
        cache[field] = values[index];
    });
    data = JSON.stringify(cache);
    fs.writeFileSync("./data_cache.json", data, "utf8");
};

module.exports = { generateRandomString, setCacheParameter };
