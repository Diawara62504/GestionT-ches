
const mongoose=require("mongoose")

const taskSchema = new mongoose.Schema({
    titre: {type: String, required : [true, "Le titre de la tâche est obligatoire"]},
    description: {type: String, required : [true, "faire une description de la tâche"]},
    priorite: {type: String, enum : ["faible", "moyenne", "haute"], default: "moyenne" },
    status: {type: String, enum : ["a faire", "en cours", "fait"], default: "a faire"},
    assigne : {type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {timestamps:true})

module.exports = mongoose.model("Tache", taskSchema)