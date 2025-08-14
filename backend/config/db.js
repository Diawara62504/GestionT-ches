const mongoose = require("mongoose")

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connecté à mongodb !")
    } catch (error) {
        console.log("Erreur de connexion !")
    }
}

module.exports = connect;