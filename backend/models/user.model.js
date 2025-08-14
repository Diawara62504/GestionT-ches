const mongoose = require("mongoose")
const {isEmail}= require("validator")


const userSchema = new mongoose.Schema({
    pseudo: {type: String, required :[true, "Le pseudo est obligatoire"]},
    email: {type: String, required :[true, "L'email est obligatoire"], validate: [isEmail, "l'email est obligatoire"], unique: true },
    password: {type: String, required :[true, "Le mot de passe est requis"], min: [6, "le mot de passe doit avoir au moins six caractères"]},
    role: {type: String, enem:["membre", "admin"], default: "membre"}
})

module.exports = mongoose.model("User", userSchema);