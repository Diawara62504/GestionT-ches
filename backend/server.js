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
const allowedOrigins = [
  "http://localhost:5173",
  "https://gestion-tache-front.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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