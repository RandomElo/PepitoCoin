const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "..", "..", "frontend", "produit", "images"));
    },
    filename: (req, file, callback) => {
        console.log(file);
        var name = file.originalname.split(".")[0];
        name = name.split(" ").join("_");
        console.log(name);
        const extension = MIME_TYPES[file.mimetype];
        const fichier = name + Date.now() + "." + extension;
        console.log(fichier);
        callback(null, fichier);
    },
});

module.exports = multer({ storage: storage }).single("image");
