import multer from "multer"
import fs from "fs"
import path from "path"

// Ensure tmp directory exists
const tmpDir = path.join(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileExtension = file.originalname.split(".").pop()
    const filenameWithExtension = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension
    cb(null, filenameWithExtension)
  }
})

export const upload = multer({ storage })
