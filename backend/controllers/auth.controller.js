const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


exports.register = async (req, res)=>{
        const {pseudo, email, password, role} = req.body
        let photopath = null;
        if (req.file) {
            // Normaliser pour servir publiquement depuis /uploads
            // On garde uniquement le segment à partir de "uploads/..."
            const fullPath = req.file.path.replace(/\\/g, '/');
            const idx = fullPath.indexOf('/uploads/');
            photopath = idx >= 0 ? fullPath.substring(idx + 1) : `uploads/${req.file.filename}`;
        }

    try {
        const userExist = await User.findOne({email})
        if(userExist){return res.json({message: "Cet email existe déjà"})}

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const newuser = await User.create({pseudo, email, password: hash, role, photo: photopath})
        res.status(200).json({message: "Utilisateur inscrit !", user: newuser})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: "Echec d'inscription !"})
    }
}



exports.login = async (req,res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Informations incorrectes !"})
        }
        const ismatch = await bcrypt.compare(password, user.password)
        if(!ismatch){
            return res.status(400).json({message: "Informations incorrectes !"})
        }
        const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"})
        // Renvoyer un objet 'user' complet utile côté frontend
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                pseudo: user.pseudo,
                role: user.role,
                photo: user.photo || null
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Echec de connexion"})
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords from the result
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
};



