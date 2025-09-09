const router = require("express").Router()
const {register,login, getAllUsers}=require("../controllers/auth.controller")
const upload = require("../middlewares/upload.middleware")

router.post("/register",upload.single("photo"), register)
router.post("/login", login)
router.get("/users", getAllUsers)

module.exports = router