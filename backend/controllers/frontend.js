//Zone d'installation des packages
const jwt = require("jsonwebtoken");
const jsdom = require("jsdom");
const fetch = require("node-fetch");
require("dotenv").config();
const Produit = require("../models/Produit");
const { JSDOM } = jsdom;

exports.accueil = async (req, res, next) => {
    //Fonction qui permet de récuépérer tous les éléments de la page
    function requeteGetAll() {
        // return fetch(`http:/[${process.env.IP}]:${process.env.PORT}/api/pepitocoin/ressource/recuperation`, {
        return fetch(`http://eloi-site.alwaysdata.net/api/pepitocoin/ressource/recuperation`, {
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
    //Fonction qui permet de récupérer la navbar
    function requeteNavbarUser(cookie) {
        return fetch(`http://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
    // Création d'un nouvelle objet de jsdom qui est dasn ce cas un fichier html
    const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/accueil/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Accueil</title></head><body></body></html>');

    //Simulation de l'effet de document
    const { document } = dom.window;

    // Zone d'ajout des éléments à body
    //Définition de la navbar
    var navbar = document.createElement("nav");
    navbar.setAttribute("class", "navbar");

    const cookie = req.cookies.auth;
    if (cookie != undefined) {
        var recupNavbar = await requeteNavbarUser(cookie);
    } else {
        var recupNavbar = /*html*/ `
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
    }
    navbar.innerHTML = recupNavbar;
    document.body.appendChild(navbar);
    //Définition de header
    var header = document.createElement("header");
    header.innerHTML = /*html*/ `
        <h1 id="titreIntro">Bienvenue sur PépitoCoin ! 🍪</h1>
        <p id="paraIntro">Sur ce site vous pourrez vendre vos objets !</p>
        <a class="lien" href="/produit/ajout">Mettre en vente</a>    
    `;
    document.body.appendChild(header);
    //Définition des aperçu produit
    var recupGetAll = await requeteGetAll();
    var conteneurProduitsGet = document.createElement("div");
    conteneurProduitsGet.setAttribute("id", "AEproduitGet");
    if (recupGetAll.length == 0) {
        var aucunElement = document.createElement("h2");
        aucunElement.setAttribute("id", "aucunElement");
        aucunElement.textContent = "Il y a aucun élément à vendre !";
        document.body.appendChild(aucunElement);
    } else {
        for (let i = 0; i < recupGetAll.length; i++) {
            var produit = recupGetAll[i];
            var conteneurDiv = document.createElement("div");
            conteneurDiv.setAttribute("class", "AEproduitAff");
            conteneurDiv.setAttribute("id", produit._id);
            conteneurDiv.innerHTML = `
                <p class="AEproduitNom"><span class="gras">Nom du produit : </span>${produit.nom}</p>
                <img src="${produit.image}" alt="imageIllustrationDe${produit.nom}"class="AEimgProduit">
            `;
            //Rattachement du produit à la div Get
            conteneurProduitsGet.appendChild(conteneurDiv);
        }
        document.body.appendChild(conteneurProduitsGet);
    }
    //Définition des scripts JScript src="/fichiers/accueil/script"></script><script src="/fichiers/navbar/script"></script>

    var scriptAccueilJs = document.createElement("script");
    scriptAccueilJs.setAttribute("src", "/fichiers/accueil/script");
    document.body.appendChild(scriptAccueilJs);

    var scriptNavbarJs = document.createElement("script");
    scriptNavbarJs.setAttribute("src", "/fichiers/navbar/script");
    document.body.appendChild(scriptNavbarJs);

    const html = dom.serialize();

    // Envoyez la page HTML en tant que réponse
    res.send(html);
    // res.sendFile(path.join(__dirname,'..','..','frontend','index.html'))
};
exports.affHome = (req, res, next) => {
    //Renvoie vers l'accueil
    res.redirect("/accueil");
};
exports.affProduit = async (req, res, next) => {
    //Fonction qui permet de récupérer la navbar
    function requeteNavbarUser(id) {
        return fetch(`http://eloi-site.alwaysdata.net/fichiers/navbar/html/${id}`, {
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
    function donneesProduit(id, cookie) {
        return fetch(`http://eloi-site.alwaysdata.net/fichiers/produit/html?id=${id}&cookieAuth=${cookie}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((reponse) => reponse.json())
            .then((data) => {
                return data;
            })
            .catch((error) => res.status(500).json({ error }));
    }

    //Création de l'objjet dom
    const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/produit/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Produit</title></head><body></body></html>');

    //Simulation de l'effet de document
    const { document } = dom.window;

    //Définition de la navbar
    var navbar = document.createElement("nav");
    navbar.setAttribute("class", "navbar");

    const cookie = req.cookies.auth;
    if (cookie != undefined) {
        var recupNavbar = await requeteNavbarUser(cookie);
    } else {
        var recupNavbar = /*html*/ `
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
    }
    navbar.innerHTML = recupNavbar;
    document.body.appendChild(navbar);

    //Ajout des éléments à body
    //Récupération de l'id du produit
    const idProduit = req.params.id;

    //Envoie d'une requete pour savoir les infos du produit
    var recupProduit = await donneesProduit(idProduit, cookie);

    //Création de la div qui vas contenir le résultat de la requete
    const produitDiv = document.createElement("div");
    produitDiv.innerHTML = recupProduit;

    document.body.appendChild(produitDiv);

    //Définition des scripts js
    //Script js de la navbar
    var scriptNavbarJs = document.createElement("script");
    scriptNavbarJs.setAttribute("src", "/fichiers/navbar/script");
    document.body.appendChild(scriptNavbarJs);

    //serialize est une fonction qui permet de convertir l'élement qui continet les éléments html en une chaine de caractère utilisable
    html = dom.serialize();
    // console.log(html)
    res.send(html);
    // res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "affichage", `index.html`));
};
exports.affProduitProprietaire = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`http://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
    const produitId = req.params.id;
    const cookie = req.cookies.auth;
    var donnees = await requeteGetOne(produitId);
    const userDonnees = donnees.userID;
    jwt.verify(cookie, process.env.CHAINETOKEN, async (err, decoded) => {
        if (!err) {
            if (userDonnees == decoded.userId) {
                const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/produit/proprietaire/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Produit Propriétaire</title></head><body></body></html>');

                const { document } = dom.window;
                if (cookie != null) {
                    var navbar = await requeteNavbarUser(cookie);
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
                }
                document.body.innerHTML = /*html*/ `
                    <nav class="navbar">${navbar}</nav>
                    <header>
                        <h1>Bienvenue sur la page propriétaire du produit</h1>
                        <p>Sur cette page, vous pouvez :</p>
                    </header>
                    <div id="liensDiv">
                        <a class="lien" href="http://eloi-site.alwaysdata.net/produit/${produitId}">Retourner à la page du produit</a>
                        <a class="lien" id="modifProduit" href="http://eloi-site.alwaysdata.net/produit/${produitId}/modification">Modifier le produit</a>
                        <a class="lien" id="supprProduit">Supprimer le produit</a>
                    </div>
                    <script src="/fichiers/produit/proprietaire/script"></script>
                    <script src="/fichiers/navbar/script"></script>

                `;
                const html = dom.serialize();
                res.send(html);
                // res.status(200).json({ message: "Page en phase de test" });
            } else {
                res.redirect(`http://eloi-site.alwaysdata.net/produit/${produitId}`);
            }
        } else {
            console.error("Erreur de vérification du token :", err);
            res.redirect(`http://eloi-site.alwaysdata.net/produit/${produitId}`);
        }
    });
};
exports.formAjout = (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`http://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
    var cookie = req.cookies.auth;
    jwt.verify(cookie, process.env.CHAINETOKEN, async (err) => {
        if (!err) {
            const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/produit/form/ajout/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Produit Propriétaire</title></head><body></body></html>');

            const { document } = dom.window;
            if (cookie != null) {
                var navbar = await requeteNavbarUser(cookie);
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
                    <script src="/fichiers/navbar/script"></script>
                    <script src="/fichiers/produit/proprietaire/script"></script>
                    `;
            }
            document.body.innerHTML = /*html*/ `
                <nav class="navbar">${navbar}</nav>
                <header>
                    <h1 id="titreIntro">Bienvenue sur PépitoCoin ! 🍪</h1>
                </header>
                <form id="form">
                    <!-- Zone pour le nom du produit -->
                    <div id="nomDiv">
                        <label for="nomForm">Nom du produit :</label>
                        <input id="nomForm" type="text" required>
                    </div>
                    <div id="prixDiv">
                        <!-- Zone pour le prix du produit -->
                        <label for="prixForm">Prix du produit(en €) :</label>
                        <input id="prixForm" type="number" required>
                    </div>
                    <div id="descDiv">
                        <!-- Zone pour la description du produit -->
                        <label for="descForm">Description du produit :</label>
                        <textarea id="descForm" cols="30" rows="4" required></textarea>
                    </div>
                    <div id="imgDiv">
                        <!-- Zone pour l'illustration du produit -->
                        <label for="imgForm">Image du produit :</label>
                        <input type="file" id="imgForm" name="imgForm" accept="image/png, image/jpeg, image/jpg" required/>
                    </div>
                    <button id="envoiBouton" type="submit">Enregistrer</button>
                </form>
                
                <script src="/fichiers/produit/form/ajout/script"></script>
                <script src="/fichiers/navbar/script"></script>
            
            `;
            const html = dom.serialize();
            res.send(html);
        } else {
            res.redirect("/login");
        }
    });
};
exports.modifProduit = (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`http:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
    const produitId = req.params.id;
    const cookie = req.cookies.auth;
    jwt.verify(cookie, process.env.CHAINETOKEN, async (err, decoded) => {
        if (!err) {
            const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/produit/form/modif/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Produit Propriétaire</title></head><body></body></html>');

            const { document } = dom.window;
            if (cookie != null) {
                var navbar = await requeteNavbarUser(cookie);
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
            }
            document.body.innerHTML = /*html*/ `
            <nav class='navbar'>${navbar}</nav>
            <header>
                <h1 id="titreIntro">Bienvenue sur PépitoCoin ! 🍪</h1>
            </header>
            <form id="form">
                <!-- Zone pour le nom du produit -->
                <div id="nomDiv">
                    <label for="nomForm">Nom du produit :</label>
                    <input id="nomForm" type="text" required>
                </div>
                <div id="prixDiv">
                    <!-- Zone pour le prix du produit -->
                    <label for="prixForm">Prix du produit(en €) :</label>
                    <input id="prixForm" type="number" required>
                </div>
                <div id="descDiv">
                    <!-- Zone pour la description du produit -->
                    <label for="descForm">Description du produit :</label>
                    <textarea id="descForm" cols="30" rows="4" required></textarea>
                </div>
                <div id="imgDiv">
                    <!-- Zone pour l'illustration du produit -->
                    <label for="imgForm">Image du produit :</label>
                    <input type="file" id="imgForm" name="imgForm" accept="image/png, image/jpeg, image/jpg" required/>
                </div>
                <button id="envoiBouton" type="submit">Enregistrer</button>
            </form>
            
            <script src="/fichiers/produit/form/modif/script"></script>
            <script src="/fichiers/navbar/script"></script>                    
            `;
            const html = dom.serialize();
            res.send(html);
        } else {
            res.redirect = `http://eloi-site.alwaysdata.net/produit/${produitId}`;
        }
    });
    // res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "formModif", "form.html"));
};
exports.gestionCompte = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`http:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
    //Zone qui permet la récéption de la navbar
    const cookie = req.cookies.auth;
    if (cookie != null) {
        var navbar = await requeteNavbarUser(cookie);
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
    }
    const html = /*html*/ `
        <!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/authentification/gestion/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Gestion Comptes </title></head><body>
        <nav class='navbar'>${navbar}</nav>
        <header><h1>Gestion des comptes</h1></header>
        <div id='resultatDiv'>
        <form id="form">
            <div id="pseudoDiv">
                <label for="pseudo">Pseudo :</label>
                <input id="pseudo" type="text" required>
            </div>
            <div id="passwordDiv">
                <label for="password" >Mot de passe :</label>
                <input id="password" type="password" required>
            </div>
            <button id="connexionButton" type="submit">Connexion</button>
        </form>
        </div>
        <script src="/fichiers/navbar/script"></script>
        <script src="/fichiers/authentification/gestion/script"></script>
        </body></html>
    `;
    res.send(html);
    // res.status(200).json({ message: "En phase de test" });
    // res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "gestion", "index.html"));
};
exports.signup = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`http:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
    const cookie = req.cookies.auth;
    if (cookie != null) {
        var navbar = await requeteNavbarUser(cookie);
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
    }
    const html = /*html*/ `
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8" />
                <link rel="stylesheet" href="/fichiers/authentification/signup/style" />
                <link rel="stylesheet" href="/fichiers/navbar/style" />
                <link rel="icon" href="/fichiers/favicon" type="image/png" />
                <!-- Définition de la police -->
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>PépitoCoin - Création de compte</title>
            </head>
            <body>
                <nav class='navbar'>${navbar}</nav>
                <header><h1 id="titre">Bienvenue sur la page de création de compte</h1></header>                
                <form id="form">
                    <div class="divForm" id="pseudoDiv">
                        <label for="pseudoForm">Nom d'utilisateur :</label>
                        <input id="pseudoForm" type="text" required />
                        <p id="pDispoPseudo"></p>
                    </div>
                    <div class="divForm" id="passwordDiv">
                        <label for="passwordForm">Mot de passe :</label>
                        <input id="passwordForm" type="password" required />
                    </div>
                    <p id="loginPhrase">Vous avez déjà un compte ? <a href="http://eloi-site.alwaysdata.net/login">Connectez-vous</a></p>
                    <button id="loginBouton" type="submit">Création de compte</button>
                </form>
                <script src="/fichiers/authentification/signup/script"></script>
                <script src="/fichiers/navbar/script"></script>
            </body>
        </html>`;
    res.send(html);
    // res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "signup", "index.html"));
};
exports.login = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`http:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
    const cookie = req.cookies.auth;
    if (cookie != null) {
        var navbar = await requeteNavbarUser(cookie);
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
    }
    const html = /*html*/ `<!DOCTYPE html>
    <html lang="fr">
        <head>
            <meta charset="UTF-8" />
            <link rel="stylesheet" href="/fichiers/authentification/login/style" />
            <link rel="stylesheet" href="/fichiers/navbar/style" />
            <link rel="icon" href="/fichiers/favicon" type="image/png" />
            <!-- Définition de la police -->
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>PépitoCoin - Connexion</title>
        </head>
        <body>
        
            <nav class='navbar'>${navbar}</nav>
            <header><h1 id="titre">Bienvenue sur la page de connexion</h1></header>
            <form id="form">
                <div id="pseudoDiv">
                    <label for="pseudoForm">Nom d'utilisateur :</label>
                    <input id="pseudoForm" type="text" required />
                </div>
                <div id="passwordDiv">
                    <label for="passwordForm">Mot de passe :</label>
                    <input id="passwordForm" type="password" required />
                </div>
                <p id="signupPhrase">Vous n'avez pas de compte ? <a href="http://eloi-site.alwaysdata.net/signup">Crée-en-un</a></p>
                <p id="loginErreur"></p>
                <button id="connexionBouton" type="submit">Connexion</button>
            </form>
    
            <script src="/fichiers/authentification/login/script"></script>
            <script src="/fichiers/navbar/script"></script>
        </body>
    </html>
    `;
    res.send(html);
};
exports.mesProduits = (req, res, next) => {
    //Création de la fonction de récupération de la navbar
    function requeteNavbarUser(cookie) {
        return fetch(`http://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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

    const cookie = req.cookies.auth;
    jwt.verify(cookie, process.env.CHAINETOKEN, (err, decoded) => {
        console.log("Décoder: " + decoded);
        const userId = decoded.userId;
        if (!err) {
            Produit.find({ userID: userId })
                .then(async (listesMesProduits) => {
                    const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/produit/mesproduits/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Produit Propriétaire</title></head><body></body></html>');
                    const { document } = dom.window;
                    if (cookie != null) {
                        var navbar = await requeteNavbarUser(cookie);
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
                    }
                    //Création de la div qui vas contenir tous les produits
                    var mesProduitsDiv = document.createElement("div");
                    mesProduitsDiv.setAttribute("id", "mesProduitsDiv");
                    //Boucle qui permet d'ajouter chauqe élément à la div
                    for (let i = 0; i < listesMesProduits.length; i++) {
                        const produit = listesMesProduits[i];
                        const nomProduit = produit.nom;
                        const idProduit = produit._id;
                        //Création de la div qui vas contenir les informatiosn de produit
                        var divProduit = document.createElement("div");
                        divProduit.setAttribute("class", "divProduit");
                        divProduit.setAttribute("id", idProduit);
                        //Création du paragraphe qui vas contenir le nom du produit
                        var paraProduit = document.createElement("p");
                        paraProduit.setAttribute("class", "paraProduit");
                        paraProduit.innerHTML = /*html*/ `<span class="gras">Nom du produit : </span>${nomProduit}`;
                        divProduit.appendChild(paraProduit);
                        //Création du lien qui vas mener à sa page produit
                        var lienProduit = document.createElement("a");
                        lienProduit.setAttribute("class", "lienProduit");
                        lienProduit.setAttribute("href", `http://eloi-site.alwaysdata.net/produit/${idProduit}`);
                        lienProduit.textContent = "Accéder à la page produit ";
                        divProduit.appendChild(lienProduit);

                        mesProduitsDiv.appendChild(divProduit);
                    }
                    document.body.innerHTML = /*html*/ `
                        <nav class="navbar">${navbar}</nav>
                        <header>
                            <h1>Mes produits</h1>
                            <p>Sur cette page, vous pourrez voir les différents produits que vous avez publiés</p>
                        </header>
                    `;
                    //Ajout de la div au différent produit à body
                    document.body.appendChild(mesProduitsDiv);
                    //Ajout des script à body
                    //Script mesProduits
                    const mesProduitsJS = document.createElement("script");
                    mesProduitsJS.setAttribute("src", "/fichiers/produit/mesproduits/script");
                    document.body.appendChild(mesProduitsJS);
                    //Script navbar
                    const navbarJS = document.createElement("script");
                    navbarJS.setAttribute("src", "/fichiers/navbar/script");
                    document.body.appendChild(navbarJS);

                    const html = dom.serialize();
                    res.send(html);

                    // res.status(200).json({ message: mesProduitsDiv });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500);
                });
        } else {
            //Permet de supprimer le cookie
            res.clearCookie("auth");
            res.redirect(`http://eloi-site.alwaysdata.net/accueil`);
        }
    });
};
//Insérer dasn eloi test, mes produits, suppression du compte, modification du compte ?
