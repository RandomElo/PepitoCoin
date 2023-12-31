//Zone d'installation des packages
const jwt = require("jsonwebtoken");
const path = require("path")
const jsdom = require("jsdom");
const fetch = require("node-fetch");
require("dotenv").config();
const Produit = require("../models/Produit");
const { JSDOM } = jsdom;

exports.accueil = async (req, res, next) => {
    //Fonction qui permet de récuépérer tous les éléments de la page
    function requeteGetAll() {
        // return fetch(`https:/[${process.env.IP}]:${process.env.PORT}/api/pepitocoin/ressource/recuperation`, {
        return fetch(`https://eloi-site.alwaysdata.net/api/pepitocoin/ressource/recuperation`, {
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
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
    //Défintion du footer
    var footer = document.createElement("footer");
    var fictifP = document.createElement("p");
    fictifP.innerHTML = 'Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a>';
    footer.appendChild(fictifP);
    document.body.appendChild(footer);

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
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${id}`, {
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
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/produit/html?id=${id}&cookieAuth=${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
    //Défintion du footer
    var footer = document.createElement("footer");
    var fictifP = document.createElement("p");
    fictifP.innerHTML = 'Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a>';
    footer.appendChild(fictifP);
    document.body.appendChild(footer);

    //Définition des scripts js
    //Script js de la navbar
    var scriptNavbarJs = document.createElement("script");
    scriptNavbarJs.setAttribute("src", "/fichiers/navbar/script");
    document.body.appendChild(scriptNavbarJs);

    //serialize est une fonction qui permet de convertir l'élement qui continet les éléments html en une chaine de caractère utilisable
    html = dom.serialize();
    res.send(html);
};
exports.affProduitProprietaire = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
        return fetch(`https://eloi-site.alwaysdata.net/api/pepitocoin/ressource/recuperation/${id}`, {
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
                        <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
                        <div class="navLinks">
                            <ul>
                                <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                                <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                                <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
                        <a class="lien" href="https://eloi-site.alwaysdata.net/produit/${produitId}">Retourner à la page du produit</a>
                        <a class="lien" id="modifProduit" href="https://eloi-site.alwaysdata.net/produit/${produitId}/modification">Modifier le produit</a>
                        <a class="lien" id="supprProduit">Supprimer le produit</a>
                    </div>
                    <footer>
                        <p>Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a></p>
                    </footer>
                    <script src="/fichiers/produit/proprietaire/script"></script>
                    <script src="/fichiers/navbar/script"></script>

                `;
                const html = dom.serialize();
                res.send(html);
            } else {
                res.redirect(`https://eloi-site.alwaysdata.net/produit/${produitId}`);
            }
        } else {
            console.error("Erreur de vérification du token :", err);
            res.redirect(`https://eloi-site.alwaysdata.net/produit/${produitId}`);
        }
    });
};
exports.formAjout = (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
                    <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
                    <div class="navLinks">
                        <ul>
                            <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                            <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                            <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
                <footer>                    
                    <p>Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a></p>
                </footer>
                
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
        return fetch(`https:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
                    <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
                    <div class="navLinks">
                        <ul>
                            <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                            <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                            <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
                    <input type="file" id="imgForm" name="imgForm" accept="image/png, image/jpeg, image/jpg"/>
                </div>
                <button id="envoiBouton" type="submit">Enregistrer</button>
            </form>
            <footer>
                <p>Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a></p>
            </footer>
            
            <script src="/fichiers/produit/form/modif/script"></script>
            <script src="/fichiers/navbar/script"></script>                    
            `;
            const html = dom.serialize();
            res.send(html);
        } else {
            res.redirect = `https://eloi-site.alwaysdata.net/produit/${produitId}`;
        }
    });
    // res.sendFile(path.join(__dirname, "..", "..", "frontend", "produit", "formModif", "form.html"));
};
exports.affAdmin = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`https:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
};
exports.signup = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`https:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
                    <p id="loginPhrase">Vous avez déjà un compte ? <a href="https://eloi-site.alwaysdata.net/login">Connectez-vous</a></p>
                    <button id="loginBouton" type="submit">Création de compte</button>
                </form>
                <footer>
                    <p>Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a></p>
                </footer>
                <script src="/fichiers/authentification/signup/script"></script>
                <script src="/fichiers/navbar/script"></script>
            </body>
        </html>`;
    res.send(html);
    // res.sendFile(path.join(__dirname, "..", "..", "frontend", "gestionCompte", "signup", "index.html"));
};
exports.login = async (req, res, next) => {
    function requeteNavbarUser(cookie) {
        return fetch(`https:/[${process.env.IP}]:${process.env.PORT}/fichiers/navbar/html/${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
                <p id="signupPhrase">Vous n'avez pas de compte ? <a href="https://eloi-site.alwaysdata.net/signup">Crée-en-un</a></p>
                <p id="loginErreur"></p>
                <button id="connexionBouton" type="submit">Connexion</button>
            </form>
            <footer>
                <p>Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a></p>
            </footer>
    
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
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
        if (!err) {
            const userId = decoded.userId;
            Produit.find({ userID: userId })
                .then(async (listesMesProduits) => {
                    const dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/produit/mesproduits/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Produit Propriétaire</title></head><body></body></html>');
                    const { document } = dom.window;
                    if (cookie != null) {
                        var navbar = await requeteNavbarUser(cookie);
                    } else {
                        var navbar = /*html*/ `
                            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
                            <div class="navLinks">
                                <ul>
                                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
                        lienProduit.setAttribute("href", `https://eloi-site.alwaysdata.net/produit/${idProduit}`);
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
                    //Défintion du footer
                    var footer = document.createElement("footer");
                    var fictifP = document.createElement("p");
                    fictifP.innerHTML = 'Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a>';
                    footer.appendChild(fictifP);
                    document.body.appendChild(footer);

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
                    console.error(error);
                    res.status(500);
                });
        } else {
            //Permet de supprimer le cookie
            res.clearCookie("auth");
            res.redirect(`https://eloi-site.alwaysdata.net/accueil`);
        }
    });
};
exports.projet = async (req, res, next) => {
    //Création de la fonction de récupération de la navbar
    function requeteNavbarUser(cookie) {
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
            <link rel="stylesheet" href="/fichiers/projet/style" />
            <link rel="stylesheet" href="/fichiers/navbar/style" />
            <link rel="icon" href="/fichiers/favicon" type="image/png" />
            <!-- Définition de la police -->
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>PépitoCoin - Le Projet</title>
        </head>
        <body>
            <nav class="navbar">${navbar}</nav>
            <header><h1 id="titre">Pourquoi ce site ?</h1></header>
            <main>
                <p>J'ai créé ce site dans le but d'apprendre a lié mon backend et mon frontend avec Express.</p>
                <p>J'avais suivi un cours sur <a href="https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb">OpenClassrooms</a> qui ne t'apprenait uniquement à créer son backend, sans aborder comment faire la liaison entre les deux.</p>
                <p>Voici le code source de mon site : <a href="https://github.com/RandomElo/PepitoCoin">GitHub</a></p>
                <p>Ce site est fictif, n'a pas pour but de publier des produits dans un réel but de vente.</p>
            </main>
            <footer>
                <p>Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a></p>
            </footer>
            <script src="/fichiers/navbar/script"></script>
        </body>
        </html>

    `;

    res.send(html);
};
exports.mentionsLegales = async (req, res, next) => {
    //Création de la fonction de récupération de la navbar
    function requeteNavbarUser(cookie) {
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
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
            <link rel="stylesheet" href="/fichiers/mentionslegales/style" />
            <link rel="stylesheet" href="/fichiers/navbar/style" />
            <link rel="icon" href="/fichiers/favicon" type="image/png" />
            <!-- Définition de la police -->
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>PépitoCoin - Mentions Légales</title>
        </head>
        <body>
            <nav class="navbar">${navbar}</nav>
            <header><h1 id="titre">Les mentions légales</h1></header>
            <div id="mentionsLegalesDiv">
                <div id="infosGeneraleDiv">
                    <h2>Informations légales</h2>
                    <p><span class="gras">Identité de l'éditeur : </span>Éloi B.</p>
                    <p><span class="gras">Adresse mail de contact : </span><a class="mlLien" href="mailto:eloi.random@gmail.com">Mail</a></p>
                </div>
                <div id="hebergeurDiv">
                    <h2 id="titreHebergeur">L'hébergeur</h2>
                    <p><span class="gras">Identité de l'hébergeur : </span>ALWAYSDATA</p>
                    <p><span class="gras">Formulaire de contact : </span>Uniquement à partir d'un ordinateur : cliquer sur "Contact" sur la barre de navigation en haut de la fenêtre, à partir de ce <a class="mlLien" href="https://www.alwaysdata.com">site</a></p>
                    <p><span class="gras">Numéro de téléphone de contact : </span><a class="mlLien" href="tel:+33184162340">Numéro de téléphone</a></p>
                </div>
            <footer>
                <p>Ce site est fictif <a href="/projet">Le projet</a> | <a class="mlLien" href="/mentionslegales">Mentions légales</a></p>
            </footer>
            <script src="/fichiers/navbar/script"></script>
        </body>
        </html>
    `;
    res.send(html);
};
exports.erreur404 = async (req, res, next) => {
    console.log("Erreur 404 : https://eloi-site.alwaysdata.net" + req.url);
    function requeteNavbarUser(cookie) {
        return fetch(`https://eloi-site.alwaysdata.net/fichiers/navbar/html/${cookie}`, {
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
            <a class="logo" href="https://eloi-site.alwaysdata.net/accueil">PépitoCoin</a>
            <div class="navLinks">
                <ul>
                    <li><a href="https://eloi-site.alwaysdata.net/accueil">Accueil</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/login">Se connecter</a></li>
                    <li><a href="https://eloi-site.alwaysdata.net/signup">Crée un compte</a></li>
                </ul>
            </div>
            <img class="menuHamburger" src="/fichiers/images/menu-hamburger" alt="Menu Hamburger">
        `;
    }
    const html = /*html*/ `
    <!DOCTYPE html><html><head><meta charset="UTF-8" /><link rel="stylesheet" href="/fichiers/erreur404/style" /><link rel="stylesheet" href="/fichiers/navbar/style" /><!-- Définition de la favicon --><link rel="icon" href="/fichiers/favicon" type="image/png" /><!-- Définition de la police --><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" rel="stylesheet" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>PépitoCoin - Erreur 404 </title></head><body>
    <nav class="navbar">${navbar}</nav>
    <main>
        <header><h1>Erreur 404</h1></header>
        <p>La page recherchée n'existe pas, veuillez vérifier l'URL.</p>
        <p id="dernierPara">Si le problème est redondant, merci de contacter l'administrateur.</p>
        <a id="accueilLien" href="/accueil">Retournez à l'accueil</a>
    </main>
    <footer>
        <p>Ce site est fictif <a href="/projet">Le projet</a> | <a href="/mentionslegales">Mentions légales</a></p>
    </footer>    
    <script src="/fichiers/navbar/script"></script>
    </body></html>
    `;
    res.status(404).send(html);
};
exports.robotsTXT = (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "robots.txt"));
};
