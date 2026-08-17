import bcrypt from "bcryptjs";

const password = "Admin123*";
const hash = bcrypt.hashSync(password, 10);

console.log("PASSWORD:", password);
console.log("HASH NUEVO:", hash);