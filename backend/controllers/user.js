//Importation du package qui hash le mdp
const bcrypt = require("bcrypt");
//Importation du package qui permet de générer des tokens
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const Produit = require("../models/Produit");

//Gestion de la création de compte
exports.signup = (req, res, next) => {
    //Utilisation de bcrypt pour hash le mdp
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                pseudo: req.body.pseudo,
                password: hash,
            });
            user.save()
                .then(() => {
                    var token = jwt.sign(
                        { userId: user.id },
                        process.env.CHAINETOKEN, //Clé de chiffrement à modifier
                        { expiresIn: "72h" } //Durée de validité
                    );
                    res.cookie("auth", token, {
                        maxAge: 259200000, //en ms
                    });
                    res.status(201).json({ message: "Utilisateur crée !" });
                })
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
//Gestion de la connexion
exports.login = (req, res, next) => {
    User.findOne({ pseudo: req.body.pseudo })
        .then((user) => {
            //Vérifie si il y a un user qui a ce pseudo
            if (user === null) {
                res.status(401).json(false);
            } else {
                //Compare les deux mots de passe hash
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        //Si jamais la méthode nous retourne que cela est faux
                        if (!valid) {
                            //Il est pas valide alors ->
                            res.status(401).json(false);
                        } else {
                            var token = jwt.sign(
                                { userId: user.id },
                                process.env.CHAINETOKEN, //Clé de chiffrement à modifier
                                { expiresIn: "72h" } //Durée de validité
                            );
                            res.cookie("auth", token, {
                                maxAge: 259200000, //en ms
                            });
                            res.status(200).json(true);
                        }
                    })
                    .catch((error) => res.status(500).json({ erreur: error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
//Controlleur pour la gestion des comptes
exports.cmptAll = (req, res, next) => {
    User.find()
        .then((compte) => {
            var comtpesObjet = {};
            for (let i = 0; i < compte.length; i++) {
                var nomBoucle = compte[i].pseudo;
                comtpesObjet[i] = nomBoucle;
            }
            comtpesObjet["length"] = compte.length;

            res.status(200).json(comtpesObjet);
            // res.status(200).json(compte)
        })
        .catch((error) => res.status(404).json({ error }));
};
//Controlleur vérifie si le pseudo est libre
exports.cmptOne = (req, res, next) => {
    User.findOne({ pseudo: req.params.id })
        .then((user) => {
            var dispoPseudo = !user;
            res.status(200).json(dispoPseudo);
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
// Rajouter la vérification de mdp
exports.suppr = (req, res, next) => {
    //Permet de récupérer les infos du compte
    User.findOne({ pseudo: req.params.id })
        .then((data) => {
            //On récupére l'id du user
            var idData = data._id;
            //Permet de transformer la donnée en une chaine de caractère (donnée utilisable)
            var idString = idData.toString();
            //On cherche tous les produits qui on comme userID, celui récéper par user find One
            Produit.find({ userID: idString })
                .then((produit) => {
                    for (let i = 0; i < produit.length; i++) {
                        var element = produit[i];
                        Produit.deleteOne({ _id: element._id })
                            .then(() => console.log(`Le produit ${element.nom} vient d'être supprimé`))
                            .catch((erreur) => res.status(500).json(erreur));
                    }
                    User.deleteOne({ _id: idString })
                        .then(() => res.status(200).json({ message: "Les produits appartenant au compte, ainsi que le compte, ont été supprimés" }))
                        .catch((erreur) => res.status(500).json(erreur));
                })
                .catch((erreur) => res.status(500).json(erreur));
        })
        .catch((error) => res.status(500).json({ error }));
};
//Permet de générer le formulaire
exports.cmptHTML = (req, res, next) => {
    var html = /*html*/ `
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
    </form>`;
    res.status(200).json({ html });
};
//Permet de vérifier si le mdp et le password sont bon et de retourner les deux boutons
exports.compteLogin = (req, res, next) => {
    bcrypt
        .compare(req.body.pseudo, process.env.USERADM)
        .then((validPseudo) => {
            if (validPseudo) {
                bcrypt
                    .compare(req.body.password, process.env.MDPADM)
                    .then((validMdp) => {
                        if (validMdp) {
                            const html = /*html*/ `
                            <div id="optionsDiv">
                                <a class="button" id="produitGestion">Gestion des produits</a>
                                <a class="button" id="compteGestion">Gestion des comptes</a>
                            </div>`;
                            res.status(200).json(html);
                        } else {
                            res.status(401).json({ message: "Identifiants ou mot de passe incorrect" });
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(401).json({ message: "Identifiants ou mot de passe incorrect" });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
exports.cmptInfos = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).json({ error }));
};
exports.deconnexion = (req, res, next) => {
    res.clearCookie("auth");
    res.redirect(`https://eloi-site.alwaysdata.net/accueil`);
};
exports.suppressionCompte = (req, res, next) => {
    const cookie = req.cookies.auth;
    jwt.verify(cookie, process.env.CHAINETOKEN, (err, decoded) => {
        if (!err) {
            const userId = decoded.userId;
            Produit.find({ userID: userId })
                .then((data) => {
                    for (let i = 0; i < data.length; i++) {
                        var element = data[i];
                        console.log(element);
                        //Suppression de l'élément
                        var image = element.image;
                        image = image.split("/");
                        image = image.pop();
                        const imageChemin = path.join(__dirname, "..", "..", "frontend", "produit", "images", `${image}`);
                        fs.unlink(cheminImage, (err) => {
                            if (!err) {
                                Produit.deleteOne({ _id: element._id })
                                    .then(() => console.log("Produit supprimé"))
                                    .catch(() => res.status(500).json({ error: "Erreur lors de la suppresssion d'un produit" }));
                            } else {
                                console.error("Problème lors de la suppresion du fichier : ", err);
                                res.status(500).json({ message: "Problème lors de la suppression du fichier" });
                            }
                        });
                    }
                    User.deleteOne({ _id: userId })
                        .then(() => {
                            res.clearCookie("auth");
                            res.status(204).end();
                        })
                        .catch(() => {
                            console.log("Erreur lors de la suppresssion du compte");
                            res.status(500).json({ error: "Erreur lors de la suppresssion du compte" });
                        });
                })
                .catch(() => {
                    console.log("Erreur lors de la récupération des produits");
                    res.status(500).json({ error: "Erreur lors de la récupération des produits" });
                });
        } else {
            console.log("Erreur dans la résolution du token");
            res.clearCookie("auth");
            res.redirect(`https://eloi-site.alwaysdata.net/accueil`);
        }
    });
};
