const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const auth = async (req, res, next)=>{
    let token;
    if(req.headers.authorization?.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user= await User.findById(decoded.id).select("-password")
            return next()
        } catch (error) {
            res.status(400).json({message: "Token invalide !"})
        }
    }else {
    return res.status(401).json({ message: "Token manquant ou expiré !" });
  }
}

module.exports=auth;