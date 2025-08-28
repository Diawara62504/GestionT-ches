const router = require("express").Router()
const {createTask, getTask, updateTask, deleteTask}=require("../controllers/task.controller")
const auth = require("../middlewares/auth.middleware")





router.post("/createTask",auth, createTask)
router.get("/getTask", getTask)
router.put("/updateTask/:id",auth, updateTask)
router.delete("/deleteTask/:id",auth, deleteTask)

module.exports = router;

