//Imporation de la biblio Express
const express = require("express");
//Importatation de mongoose
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// require("dotenv").config();

console.log("Url de la BDD : " + process.env.bddUrl);

//Création d'une application Express
const app = express();
//Récupération des routes ressources
const resRoutes = require("./routes/ressource");
const fichRoutes = require("./routes/fichiers");
const frontRoutes = require("./routes/frontend");
const userRoutes = require("./routes/user");

//Connexion à la BDD
mongoose
    .connect(process.env.bddUrl)
    .then(() => console.log("Connexion à la base de données de MongoDB réussie !"))
    .catch((error) => console.error("Erreur de connexion à la BDD: ", error));

//Middleware général 'sans route' | Permet d'ajouter des headears
app.use((req, res, next) => {
    //Uniquement les requêtes GET avec la route /api/stuff qui sont intercepté par ce middleware
    res.setHeader("Access-Control-Allow-Origin", "*"); //L'origine qui à le droit d'accéder à notre API c'est tous le monde (*)
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"); //Autorisation d'utiliser certain header
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); //Autorisaton de certaine methodes
    next();
});
//Permet de pouvoir récupérer les informations de req
app.use(express.json());
app.use(cookieParser());

//express.static permet de servir des fichiers statiqeu sans avoir à configurer des roures

//Gére les routes pour le front
//Qui permet l'accès au fichier HTML
app.use("/", frontRoutes);

//Permet la gestion des fichiers statiques (HTML, CSS & JS)
app.use("/fichiers", fichRoutes);

//Géré les routes pour les ressources
//Permet la gestion de l'API
app.use("/api/pepitocoin/ressource", resRoutes);

//Gére les routes d'authentification
app.use("/api/authentification", userRoutes);

// Exporation du serveur pour la rendre disponible auprès du serveur
module.exports = app;
