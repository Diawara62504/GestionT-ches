require("dotenv").config()
const express = require("express")
const app = express()
const connect = require("./config/db")
const helmet = require("helmet")
const routerA = require("./routes/auth.route")
const routerT = require("./routes/task.route")
const cors = require("cors")




connect()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: (origin, callback) => {
    const whitelist = ["http://localhost:5174", "https://tonautresite.com"];
    if (whitelist.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Non autorisé par CORS"));
    }
  },
  credentials: true
}));

app.use(helmet())
app.use("/", routerA)
app.use("/", routerT)

const port = process.env.PORT

app.listen(port, ()=>{
    console.log("Démarrage du serveur sur http://localhost:"+port)
});