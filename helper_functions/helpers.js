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

const getOffsetCount = (limit, total) => {
    const division = Math.floor(total / limit);
    if (total % limit == 0) {
        return division;
    }
    if (division > 1) {
        return division + 1;
    }
    if (division < 1) {
        return 1;
    }
};

function splitToNChunks(array, n) {
    let result = [];
    for (let i = n; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
}

module.exports = {
    generateRandomString,
    setCacheParameter,
    getOffsetCount,
    splitToNChunks,
};
