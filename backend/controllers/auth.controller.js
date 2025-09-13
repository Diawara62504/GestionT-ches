const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


exports.register = async (req, res)=>{
        const {pseudo, email, password} = req.body
        // Force role to 'membre' for any self-registration
        const role = 'membre'
        let photopath = null;
        if (req.file) {
            // Stocker uniquement le chemin relatif "uploads/..."
            photopath = `uploads/${req.file.filename}`;
        }

    try {
        const userExist = await User.findOne({email})
        if(userExist){return res.status(400).json({message: "Cet email existe déjà"})}

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

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Interdire la suppression de soi-même pour éviter de perdre le dernier admin
        if (req.user?._id?.toString() === id) {
            return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte." });
        }
        const existing = await User.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        await existing.deleteOne();
        return res.status(200).json({ message: "Utilisateur supprimé avec succès.", id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
    }
};
