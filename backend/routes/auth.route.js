const router = require("express").Router()
const {register,login, getAllUsers, deleteUser}=require("../controllers/auth.controller")
const upload = require("../middlewares/upload.middleware")
const auth = require("../middlewares/auth.middleware")
const adminOnly = require("../middlewares/admin.middleware")

router.post("/register",upload.single("photo"), register)
router.post("/login", login)
router.get("/users", getAllUsers)
router.delete("/users/:id", auth, adminOnly, deleteUser)

module.exports = router