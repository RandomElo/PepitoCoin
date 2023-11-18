const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destinationPath = path.join(__dirname, "..", "..", "frontend", "produit", "images");
        callback(null, destinationPath);
    },
    filename: (req, file, callback) => {
        if (req.body.image) {
            var name = file.originalname.split(".")[0];
            name = name.split(" ").join("_");
            const extension = MIME_TYPES[file.mimetype];
            const fichier = name + Date.now() + "." + extension;
            callback(null, fichier);
        }
    },
});

module.exports = multer({
    storage: storage,
}).single("image");
