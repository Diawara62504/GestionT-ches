require("dotenv").config()
const express = require("express")
const app = express()
const connect = require("./config/db")
const helmet = require("helmet")
const routerA = require("./routes/auth.route")
const routerT = require("./routes/task.route")
const cors = require("cors")
const path = require("path")




connect()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({

  origin: ["http://localhost:5173", "https://gestiont-ches.onrender.com"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))

// Exposer le dossier uploads sous /uploads (pour servir les images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use("/auth", routerA)
app.use("/task", routerT)

const { ensureAdminExists } = require('./config/seedAdmin');

const port = process.env.PORT

app.listen(port, async ()=>{
    console.log("Démarrage du serveur sur http://localhost:"+port)
    // Seed admin after DB is connected and server is up
    await ensureAdminExists();
});