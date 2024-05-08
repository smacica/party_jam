const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("../main.db", (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log("Connected to the main.db database.🪢");
});

const initializeDb = () => {
    db.run(
        `CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT
    )`,
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Tables created or already exists. 👍");
            }
        }
    );

    // db.close((err) => {
    //     if (err) {
    //         console.error(err.message);
    //     }
    //     console.log("Database connection closed.");
    // });
};

module.exports = { db, initializeDb };
