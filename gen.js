const crypto = require("crypto");

function gen(len = 20) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=";
  const bytes = crypto.randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += chars[bytes[i] % chars.length];
  return out;
}

const len = Number(process.argv[2] || 20);
const count = Number(process.argv[3] || 10);

for (let i = 0; i < count; i++) console.log(gen(len));