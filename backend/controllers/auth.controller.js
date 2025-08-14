const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


exports.register = async (req, res)=>{
        const {pseudo, email, password, role} = req.body

    try {
        const userExist = await User.findOne({email})
        if(userExist){return res.json({message: "Cet email existe déjà"})}

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const newuser = await User.create({pseudo, email, password: hash, role})
        res.status(200).json({message: "Utilisateur inscrit !"}, newuser)
    } catch (error) {
        console.error(error)
        res.status(400).json({message: "Echec d'inscription !"})
    }
}



exports.login = async (req,res)=>{
    try {
        const {email, password} = req.body
        const isvalable = await User.findOne({email})
        const ismatch = await bcrypt.compare(password, isvalable.password)
        if(!isvalable || !ismatch){return res.json("Informations incorrectes !")}
        const token = jwt.sign({id: isvalable._id}, process.env.SECRET_KEY, {expiresIn: "1d"})
        res.status(200).json({token, user: {id: isvalable._id, email: isvalable.email}})
    } catch (error) {
        res.status(400).json({message: "Echec de connexion"})
    }
}



