const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.favicon = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "favicon.png"));
};
//Zone des fichiers de la page d'accueil
exports.cssAccueil = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptAccueil = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "script.js"), { "Content-Type": "application/javascript" });
};
//Zone des fichiers des pages produits
exports.htmlProduit = async (req, res, next) => {
    //Récupération de l'ID du produit
    const produitID = req.query.id;
    const cookieAuth = req.query.cookieAuth;
    //Fonction qui permet de faire la requete en await
    function requeteGetOne(id) {
        return fetch(`http://localhost:3000/api/pepitocoin/ressource/recuperation/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((reponse) => reponse.json())
            .then((data) => {
                return data;
            })
            .catch((error) => console.error(error));
    }
    var contentHTML;
    //Utilisation de try/catch pour la gestion des erreurs
    try {
        var recupGetAll = await requeteGetOne(produitID);

        if (cookieAuth == null) {
            console.log("il y a pas de cookie d auth");
        } else {
            var userIdCookie = jwt.verify(cookieAuth, process.env.chaineToken);
            userIdCookie = userIdCookie.userId; //Une fois que le token est décoder je peut récupérer le userid
        }

        //Récuépration du userID depuis la requete à la bdd
        const userIdRequete = recupGetAll.userID;
        if (userIdCookie === userIdRequete) {
            //Mode propriétaire
            //Lien page propriétaire
            const pageProprietaire = `http://loclahost:3000//produit/${produitID}/proprietaire`;
            contentHTML = /*html*/ `
            <a class='lien' id="proprietaireLien" href='http://localhost:3000/produit/${produitID}/proprietaire'>Passez en mode propriétaire</a>
            <div id="donneesDiv">
                <img id='imageProduit' src='${recupGetAll.image}' alt="Image d'illustration de ${recupGetAll.nom}">
                <p id='nomProduit'><span class='gras'>Nom : </span>${recupGetAll.nom}</p>
                <p id='prixProduit'><span class='gras'>Prix : </span>${recupGetAll.prix}</p>
                <p id='descProduit'><span class='gras'>Description : </span>${recupGetAll.description}</p>
            </div>
        `;
        } else {
            contentHTML = /*html*/ `
                <div id="donneesDiv">
                    <img id='imageProduit' src='${recupGetAll.image}' alt="Image d'illustration de " +recupGetAll.nom>
                    <p id='nomProduit'><span class='gras'>Nom : </span>${recupGetAll.nom}</p>
                    <p id='prixProduit'><span class='gras'>Prix : </span>${recupGetAll.prix}</p>
                    <p id='descProduit'><span class='gras'>Description : </span>${recupGetAll.description}</p>
                </div>
            `;
        }
    } catch (error) {
        //Si il y a une erreur alors ->
        console.error(error);
        contentHTML = /*html*/ `
            <div id="donneesDiv">
                <img id='imageProduit' src='${recupGetAll.image}' alt="Image d'illustration de " +recupGetAll.nom>
                <p id='nomProduit'><span class='gras'>Nom : </span>${recupGetAll.nom}</p>
                <p id='prixProduit'><span class='gras'>Prix : </span>${recupGetAll.prix}</p>
                <p id='descProduit'><span class='gras'>Description : </span>${recupGetAll.description}</p>
            </div>
        `;
    }
    res.status(200).json(contentHTML);
};
exports.cssProduit = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "affichage", "style.css"), { "Content-Type": "text/css" });
};
exports.imageProduit = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "images", `${req.params.id}`));
};
//Zone pour les fichiers mesProduit
exports.cssMesProduits = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "mesProduits", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptMesProduits = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "mesProduits", "script.js"), { "Content-Type": "application/javascript" });
};
//Zone des fichiers du form d'ajout
exports.cssFormAjout = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "formAjout", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptFormAjout = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "formAjout", "script.js"), { "Content-Type": "application/javascript" });
};
//Zone des fichiers du form de modfi des produits
exports.cssFormModif = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "formModif", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptFormModif = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "formModif", "script.js"), { "Content-Type": "application/javascript" });
};
//Zone des fichier de la page produit propriétaire
exports.cssProprietaire = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "proprietaire", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptProprietaire = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "proprietaire", "script.js"), { "Content-Type": "application/javascript" });
};
//Zone des fichiers de gestion
exports.cssGestionCompte = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "gestion", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptGestionCompte = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "gestion", "script.js"), { "Content-Type": "application/json" });
};
//Zone des fichiers de signup
exports.cssSignup = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "signup", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptSignup = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "signup", "script.js"), { "Content-Type": "application/json" });
};
//Zone des fichiers de login
exports.cssLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "login", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "login", "script.js"), { "Content-Type": "application/json" });
};
//Zone des fichier de compte
exports.cssCompte = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "gestion", "style.css"), { "Content-Type": "text/css" });
};
exports.scriptCompte = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "gestion", "script.js"), { "Content-Type": "application/json" });
};
//Zone de génération de la navbar avec compte
exports.userNavbar = async (req, res, next) => {
    function noPemNavbar() {
        var html = /*html*/ `
        <a class="logo" href="http://localhost:3000/accueil">PépitoCoin</a>
        <div class="navLinks">
            <ul>
                <li><a href="http://localhost:3000/accueil">Accueil</a></li>
                <li><a href="http://localhost:3000/login">Se connecter</a></li>
                <li><a href="http://localhost:3000/signup">Crée un compte</a></li>
            </ul>
        </div>
        <img class="menuHamburger" src="/fichiers/images/menu-hamburger" alt="Menu Hamburger">
        `;
        return html;
    }
    //Création de la fonction qui permet de récuépérer le nom du compte
    function donneesCompte(id) {
        return fetch(`http://localhost:3000/api/authentification/compte/info/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((reponse) => reponse.json())
            .then((data) => {
                return data;
            });
    }
    try {
        const cookie = req.params.id;
        const cookieVerify = jwt.verify(cookie, process.env.chaineToken);
        const cookieUserId = cookieVerify.userId;
        var donnees = await donneesCompte(cookieUserId);
        if (!donnees.error) {
            const donneesPseudo = donnees.pseudo;
            var navbar = /*html*/ `
                    <a class="logo" href="http://localhost:3000/accueil">PépitoCoin</a>
                    <div class="navLinks">
                        <ul>
                            <li><a href="http://localhost:3000/accueil">Accueil</a></li>
                            <li><a href="http://localhost:3000/produit/ajout">Vendre un produit</a></li>
                            <li class='conteneurSousListe'>Mon compte &#9660;
                                <ul class="sousListe">
                                    <li class='itemsSousListe'><a href="http://localhost:3000/produit/mesproduits">Mes Produits</a></li>
                                    <li id="lienDeconnexion" class='itemsSousListe'><a style="cursor: pointer;">Déconnexion</a></li>
                                    <li id="lienSuppression" class='itemsSousListe'><a style="cursor: pointer;">Suppression</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <img class="menuHamburger" src="/fichiers/images/menu-hamburger" alt="Menu Hamburger">
                `;
        } else {
            var navbar = noPemNavbar();
        }
        res.status(200).json(navbar);
    } catch (error) {
        var navbar = /*html*/ `
            <a class="logo" href="http://localhost:3000/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="http://localhost:3000/accueil">Accueil</a></li>
                    <li><a href="http://localhost:3000/login">Se connecter</a></li>
                    <li><a href="http://localhost:3000/signup">Crée un compte</a></li>
                </ul>
            </div>
            <img class="menuHamburger" src="/fichiers/images/menu-hamburger" alt="Menu Hamburger">
            <script src="/fichiers/navbar/script"></script>
            `;
        //faire en sorte que si il y a une erreur alors renvoyer la navbar classique
        res.status(200).json({ navbar });
    }
};
exports.cssNavbar = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "navbar", "style-navbar.css"), { "Content-Type": "text/css" });
};
exports.jsNavbar = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "navbar", "script-navbar.js"), { "Content-Type": "application/json" });
};
exports.imageMenuHamburger = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "frontend", "images", "Menu_Hamburger_Noir.png"));
};
