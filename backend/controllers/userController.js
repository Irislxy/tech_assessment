const UserCSV = require("../models/user")
const fs = require("fs")
const csvParser = require("csv-parser")

// Handle CSV upload
exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  const filePath = req.file.path
  const results = []

  fs.createReadStream(filePath)
    .pipe(csvParser({ mapHeaders: ({ header }) => header.trim() }))
    .on("data", (data) => {
      results.push(data)
    })
    .on("end", async () => {
      try {
        const userPromises = results.map((row) => {
          return UserCSV.create({
            postid: row['"postId"'],
            id: row.id,
            name: row.name,
            email: row.email,
            body: row.body
          })
        })

        await Promise.all(userPromises)
        res.status(200).json({ message: "CSV data uploaded and saved successfully!" })
      } catch (error) {
        console.error("Error saving data:", error)
        res.status(500).json({ error: "Failed to save CSV data" })
      }
    })
}

// Fetch records from the database
exports.getRecords = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.body
  try {
    // Filter to search for users
    const filter = {
      $or: [{ postid: { $regex: search, $options: "i" } }, { name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { body: { $regex: search, $options: "i" } }]
    }

    const data = await UserCSV.find(filter)
      .skip((page - 1) * limit) // Skip records based on current page
      .limit(Number(limit)) // Limit the number of records

    const totalRecords = await UserCSV.countDocuments()
    const totalPages = Math.ceil(totalRecords / limit)

    res.status(200).json({
      data,
      currentPage: Number(page),
      totalPages,
      totalRecords
    })
  } catch (error) {
    console.error("Error fetching data:", error)
    res.status(500).json({ error: "Failed to fetch data" })
  }
}
