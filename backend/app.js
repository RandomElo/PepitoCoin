//Zone d'installation des packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//Création d'une application Express
const app = express();

app.use((err, req, res, next) => {
    console.error("Erreur de parsing JSON :", err);
    // Envoyer une réponse d'erreur appropriée
    res.status(400).json({ error: "Erreur de parsing JSON" });
});

app.listen(process.env.PORT, () => {
    console.log(`Serveur en écoute sur le port ${process.env.PORT}`);
});
//Récupération des routes ressources
const resRoutes = require("./routes/ressource");
const fichRoutes = require("./routes/fichiers");
const frontRoutes = require("./routes/frontend");
const userRoutes = require("./routes/user");
//Récupération du controlleur frontend pour l'erreur 404
const frontContrl = require("./controllers/frontend");
//Connexion à la BDD
mongoose
    .connect(process.env.BDDURL)
    .then(() => console.log("Connexion à la base de données de MongoDB réussie !"))
    .catch((error) => console.error("Erreur de connexion à la BDD: ", error));
//Middleware général 'sans route' | Permet d'ajouter des headears
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://eloi-site.alwaysdata.net"); // Autorise l'accès à votre API depuis ce domaine
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"); // Autorise certains en-têtes
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); // Autorise certaines méthodes HTTP
    // Prise en charge de la requête OPTIONS pour les pré-vérifications CORS
    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Répond avec un statut 200 pour les requêtes OPTIONS
    }
    next(); // Passe au middleware suivant
});

//Permet de pouvoir récupérer les informations de req
// app.use(express.json());
app.use(bodyParser.json({ limit: "200mb" })); // Vous pouvez ajuster la limite selon vos besoins
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));
//Permet d'utiliser les cookies dans mon site
app.use(cookieParser());
app.use((req, res, next) => {
    //Zone de test
    const userAgent = req.headers["user-agent"];
    // Vérifie si l'en-tête User-Agent est présent et s'il contient "Mozilla" (un navigateur)
    if (userAgent && userAgent.includes("Mozilla")) {
        console.log("La requête est émise depuis un navigateur ");
        console.log(req.url)
        frontContrl.erreur404(req, res);
    } else {
        console.log("La requete n'est pas émise depuis un navigateur bdd");
    }
    //Fin de la zone de test
    next();
});

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

//Si la requete n'est rentrée dans aucuns
app.use((req, res, next) => {
    frontContrl.erreur404(req, res);
});

// Exporation du serveur pour la rendre disponible auprès du serveur
module.exports = app;
