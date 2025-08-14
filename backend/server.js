require("dotenv").config()
const express = require("express")
const app = express()
const connect = require("./config/db")
const helmet = require("helmet")
const routerA = require("./routes/auth.route")
const routerT = require("./routes/task.route")




connect()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(helmet())
app.use("/", routerA)
app.use("/", routerT)

const port = process.env.PORT

app.listen(port, ()=>{
    console.log("Démarrage du serveur sur http://localhost:"+port)
});