const multer = require('multer')

const fileUpload = () => {
    const storage = multer.diskStorage({
    })
    function fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image')) {
            cb(null, false)
        } else {
            cb(null, true)
        }
    }
    const upload = multer({ storage: storage, fileFilter })
    return upload.single("image")
}

module.exports = fileUpload