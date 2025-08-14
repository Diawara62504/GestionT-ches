const router = require("express").Router()
const {register,login}=require("../controllers/auth.controller")
const upload = require("../middlewares/upload.middleware")

router.post("/register",upload.single("photo"), register)
router.post("/login", login)

module.exports = router