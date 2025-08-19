const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyParser = require("body-parser")
const app = express()
const PORT = 3000
const ADMIN_PASSWORD = "SuperSecretAdminPassword123"

const bansFile = path.join(__dirname, "bans.json")

app.use(bodyParser.json())
app.use(express.static("public"))

function loadBans() {
    if (!fs.existsSync(bansFile)) return []
    return JSON.parse(fs.readFileSync(bansFile))
}

function saveBans(bans) {
    fs.writeFileSync(bansFile, JSON.stringify(bans, null, 2))
}

app.post("/ban", (req,res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) return res.status(403).json({error:"Accesso negato"})
    const bans = loadBans()
    req.body.timestamp = Date.now()
    bans.push(req.body)
    saveBans(bans)
    res.json({success:true})
})

app.post("/unban", (req,res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) return res.status(403).json({error:"Accesso negato"})
    let bans = loadBans()
    bans = bans.filter(b => b.username.toLowerCase() !== req.body.username.toLowerCase())
    saveBans(bans)
    res.json({success:true})
})

app.get("/logs", (req,res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) return res.status(403).json({error:"Accesso negato"})
    const bans = loadBans()
    res.json(bans)
})

app.listen(PORT, () => console.log("Server attivo su porta "+PORT))
