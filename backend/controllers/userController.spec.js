const UserCSV = require("../models/user")
const { uploadCSV, getRecords } = require("./userController")
const fs = require("fs")
const csvParser = require("csv-parser")

// Mock fs and csv-parser
jest.mock("fs")
jest.mock("csv-parser", () =>
  jest.fn(() => ({
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn()
  }))
)

describe("uploadCSV", () => {
  let req, res

  beforeEach(() => {
    req = {
      file: {
        path: "/mock/path/to/file.csv"
      }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    jest.spyOn(UserCSV, "create").mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("should return 400 if no file is uploaded", async () => {
    req.file = null

    await uploadCSV(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" })
  })
})

describe("getRecords", () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {
        page: 1,
        limit: 10,
        search: ""
      }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    jest.spyOn(UserCSV, "find").mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        { postid: "1", name: "John Doe", email: "john.doe@example.com", body: "Sample body" },
        { postid: "2", name: "Jane Doe", email: "jane.doe@example.com", body: "Another sample body" }
      ])
    })

    jest.spyOn(UserCSV, "countDocuments").mockResolvedValue(2)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("should fetch and return records with pagination and search", async () => {
    await getRecords(req, res)

    expect(UserCSV.find).toHaveBeenCalledWith({
      $or: [{ postid: { $regex: "", $options: "i" } }, { name: { $regex: "", $options: "i" } }, { email: { $regex: "", $options: "i" } }, { body: { $regex: "", $options: "i" } }]
    })

    expect(UserCSV.find().skip).toHaveBeenCalledWith(0) // (page - 1) * limit
    expect(UserCSV.find().limit).toHaveBeenCalledWith(10)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      data: [
        { postid: "1", name: "John Doe", email: "john.doe@example.com", body: "Sample body" },
        { postid: "2", name: "Jane Doe", email: "jane.doe@example.com", body: "Another sample body" }
      ],
      currentPage: 1,
      totalPages: 1,
      totalRecords: 2
    })
  })

  test("should return 500 if there is an error fetching records", async () => {
    jest.spyOn(UserCSV, "find").mockImplementation(() => {
      throw new Error("Database error")
    })

    await getRecords(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch data" })
  })
})
