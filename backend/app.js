const express = require("express")
const dotenv = require("dotenv")
const connectDatabase = require("./config/database")
const cors = require("cors")

const app = express()

// Setting up config.env file variables
dotenv.config({ path: "./.env" })

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)

app.use(express.json())

// Connecting to database
connectDatabase()

// Importing routes
const routes = require("./routes")

app.use(routes)

async function initializeApp() {
  try {
    // Start the server
    const PORT = process.env.PORT
    app.listen(PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.error("Failed to start the server:", err.message)
    process.exit(1) // Exit if DB connection fails
  }
}

initializeApp()
