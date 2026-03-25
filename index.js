import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err))

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import multer from 'multer'
import { v4 as uniqueId } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { fetchStorage, login, signup, uploadProfilePicture } from './controller/user.controller.js'
import verifyToken from './controller/token.controller.js'
import Authorization from './middleware/authorization.middleware.js'
import Download from './middleware/download.middleware.js'
import { createFile, deleteFile, downloadFile, fetchFiles, shareFile } from './controller/file.controller.js'
import dashboard from './controller/dashboard.controller.js'
import { createPlan, fetchPlans } from './controller/plan.controller.js'
import { createOrder, webhook } from './controller/razorpay.controller.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Middleware
app.use(cors({ origin: "*" }))
app.use(express.static(join(__dirname, "view")))
app.use(express.static(join(__dirname, "storage")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "view", "index.html"))
})

// Setup upload destination
const storage = multer.diskStorage({
    destination: (req, file, next) => {
        const path = (file.fieldname === "picture" ? "storage/pictures" : "storage/files")
        next(null, path)
    },
    filename: (req, file, next) => {
        const nameArray = file.originalname.split(".")
        const lastIndex = nameArray.length - 1
        const ext = nameArray[lastIndex]
        const path = (file.fieldname === "picture" ? `${req.user.id}.${ext}` : `${uniqueId()}.${ext}`)
        next(null, path)
    }
})

const upload = multer({ storage: storage })

// Public Apis
app.post('/api/signup', signup)
app.post('/api/login', login)
app.post('/api/verify-token', verifyToken)

// Private Apis
app.post('/api/upload-profile-picture', Authorization, upload.single('picture'), uploadProfilePicture)
app.post("/api/file", Authorization, upload.single('file'), createFile)
app.get("/api/file", Authorization, fetchFiles)
app.delete("/api/file/:id", Authorization, deleteFile)
app.post("/api/file/download", Authorization, downloadFile)
app.get("/api/file/download", Download, downloadFile)
app.post("/api/file/share", Authorization, shareFile)
app.get('/api/dashboard', Authorization, dashboard)
app.get("/api/storage", Authorization, fetchStorage)
app.get("/api/plan", fetchPlans)
app.post("/api/plan", createPlan)
app.post("/api/razorpay/order", createOrder)
app.post("/api/razorpay/webhook", webhook)

// Start server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
