const fs = require("fs");
const cache = require("./data_cache.json");

const setCacheParameter = (field, value) => {
    const cache = require("./data_cache.json");
    cache[field] = value;
    data = JSON.stringify(cache);
    fs.writeFileSync("./data_cache.json", data, "utf8");
};

setCacheParameter("access_token", "trololo");
