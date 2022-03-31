require("dotenv").config(); 
const CryptoJS = require("crypto-js");

// Encrypt
console.log(process.env.COOKIE_KEY);
var ciphertext = CryptoJS.AES.encrypt('my message', process.env.COOKIE_KEY).toString();
console.log(ciphertext);

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, process.env.COOKIE_KEY);
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message'