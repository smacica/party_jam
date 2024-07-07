const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const key = Buffer.from(process.env.AES_KEY, "hex");

function encrypt(text) {
    const initial_vector = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(key),
        initial_vector
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: initial_vector.toString("hex"),
        encryptedData: encrypted.toString("hex"),
    };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };

// {
//     iv: 'd12cb9d0bdad5b8aa88bcdd04ea63bba',
//     encryptedData: 'a28a0292125c05b3e3a7d1c1129bff51'
//   }
