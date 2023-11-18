const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");

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
        return fetch(`http://eloi-site.alwaysdata.net/api/pepitocoin/ressource/recuperation/${id}`, {
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
    //Récupération des informations du produit
    var recupGetAll = await requeteGetOne(produitID);
    if (cookieAuth == null) {
        //Si jamasi il y a pas de cookie d'auth
        contentHTML = /*html*/ `
                <header>
                    <h1>Bienvenue sur la page produit !</h1>
                </header>
                <div id="donneesDiv">
                    <img id='imageProduit' src='${recupGetAll.image}' alt="Image d'illustration de " +recupGetAll.nom>
                    <p id='nomProduit'><span class='gras'>Nom : </span>${recupGetAll.nom}</p>
                    <p id='prixProduit'><span class='gras'>Prix : </span>${recupGetAll.prix}</p>
                    <p id='descProduit'><span class='gras'>Description : </span>${recupGetAll.description}</p>
                </div>
            `;
    } else {
        // Si jamais il y a un cookie d'auth alors on le décode
        jwt.verify(cookieAuth, process.env.CHAINETOKEN, (err, decoded) => {
            if (!err) { //Si jamais il y a pas d'erreur
                //Récuépration du userID depuis la requete à la bdd
                const userIdRequete = recupGetAll.userID;
                console.log("Decoded: "+decoded)
                console.log("useridRequete: "+userIdRequete)

                if (decoded === userIdRequete) {
                    //Mode propriétaire
                    contentHTML = /*html*/ `
                        <header>
                            <h1>Bienvenue sur la page produit !</h1>
                        </header>
                        <div id="donneesDiv">
                            <img id='imageProduit' src='${recupGetAll.image}' alt="Image d'illustration de ${recupGetAll.nom}">
                            <p id='nomProduit'><span class='gras'>Nom : </span>${recupGetAll.nom}</p>
                            <p id='prixProduit'><span class='gras'>Prix : </span>${recupGetAll.prix}</p>
                            <p id='descProduit'><span class='gras'>Description : </span>${recupGetAll.description}</p>
                        </div>
                        <a class='lien' id="proprietaireLien" href='http://eloi-site.alwaysdata.net/produit/${produitID}/proprietaire'>Passez en mode propriétaire</a>
                    `;
                } else {
                    contentHTML = /*html*/ `
                            <header>
                                <h1>Bienvenue sur la page produit !</h1>
                            </header>
                            <div id="donneesDiv">
                                <img id='imageProduit' src='${recupGetAll.image}' alt="Image d'illustration de " +recupGetAll.nom>
                                <p id='nomProduit'><span class='gras'>Nom : </span>${recupGetAll.nom}</p>
                                <p id='prixProduit'><span class='gras'>Prix : </span>${recupGetAll.prix}</p>
                                <p id='descProduit'><span class='gras'>Description : </span>${recupGetAll.description}</p>
                            </div>
                        `;
                }
                //Si jamais il y a une erreur
            } else {
                console.log('Erreur lors de la verification du token')
                res.clearCookie("auth");
                contentHTML = /*html*/ `
                        <header>
                            <h1>Bienvenue sur la page produit !</h1>
                        </header>
                        <div id="donneesDiv">
                            <img id='imageProduit' src='${recupGetAll.image}' alt="Image d'illustration de " +recupGetAll.nom>
                            <p id='nomProduit'><span class='gras'>Nom : </span>${recupGetAll.nom}</p>
                            <p id='prixProduit'><span class='gras'>Prix : </span>${recupGetAll.prix}</p>
                            <p id='descProduit'><span class='gras'>Description : </span>${recupGetAll.description}</p>
                        </div>
                    `;
            }
        });
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
    const cookie = req.params.id;
    jwt.verify(cookie, process.env.CHAINETOKEN, (err, decoded) => {
        if (!err) {
            var navbar = /*html*/ `
                        <a class="logo" href="http://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
                        <div class="navLinks">
                            <ul>
                                <li><a href="http://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                                <li><a href="http://eloi-site.alwaysdata.net/produit/ajout">Vendre un produit</a></li>
                                <li class='conteneurSousListe'>Mon compte &#9660;
                                    <ul class="sousListe">
                                        <li class='itemsSousListe'><a href="http://eloi-site.alwaysdata.net/produit/mesproduits">Mes Produits</a></li>
                                        <li id="lienDeconnexion" class='itemsSousListe'><a style="cursor: pointer;">Déconnexion</a></li>
                                        <li id="lienSuppression" class='itemsSousListe'><a style="cursor: pointer;">Suppression</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <img class="menuHamburger" src="/fichiers/images/menu-hamburger" alt="Menu Hamburger">
                `;
            res.status(200).json(navbar);
        } else {
            var navbar = /*html*/ `
            <a class="logo" href="http://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="http://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="http://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="http://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
                </ul>
            </div>
            <img class="menuHamburger" src="/fichiers/images/menu-hamburger" alt="Menu Hamburger">
            `;
            res.clearCookie("auth");
            res.status(200).json(navbar);
        }
    });
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
