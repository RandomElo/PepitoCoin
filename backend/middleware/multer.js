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
        // const destinationPath = path.join(__dirname, "..", "..", "frontend");
        console.log("Destination du fichier:", destinationPath);
        callback(null, destinationPath);
    },
    filename: (req, file, callback) => {
        console.log("Nom du fichier original:", file.originalname);

        var name = file.originalname.split(".")[0];
        name = name.split(" ").join("_");
        console.log("Nom modifier:", name);

        const extension = MIME_TYPES[file.mimetype];
        console.log("Extension du fichier:", extension);

        const fichier = name + Date.now() + "." + extension;
        console.log("Nom du fichier finale:", fichier);

        callback(null, fichier);
    },
});

module.exports = multer({
    storage: storage,
}).single("image");
