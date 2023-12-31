const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const Produit = require("../models/Produit");
const frontContrl = require("../controllers/frontend");
//Controleur qui est utiliser au chargement de la page
exports.recupAllRes = (req, res, next) => {
    // const userAgent = req.headers["user-agent"];
    // if (userAgent && userAgent.includes("Mozilla")) {
    //     console.log("La requête est émise depuis un navigateur bdd");
    //     frontContrl.erreur404(req, res);
    // } else {
    //     console.log("La requete n'est pas émise depuis un navigateur bdd")
    //     Produit.find()
    //         .then((produit) => {
    //             res.status(200).json(produit);
    //         })
    //         .catch((error) => {
    //             res.status(400).json({ error });
    //         });
    // }
    Produit.find()
        .then((produit) => {
            res.status(200).json(produit);
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Controlleur qui est utiliser quand on clique sur une ressource spécifique
exports.recupOneRes = (req, res, next) => {
    Produit.findOne({ _id: req.params.id }) //On cherche dans la BDD l'élément qui à le même id que le produit cliquer
        .then((produit) => res.status(200).json(produit))
        .catch((error) => res.status(404).json({ error }));
};
//Controlleur qui est utiliser pour publier dans le bdd les ressources du formulaires
exports.publiRes = (req, res, next) => {
    // //Récupération des données contenue dans la requete
    var produitObjet = req.body;

    //Récupération du userId
    var authCookie = req.cookies.auth;
    const decodToken = jwt.verify(authCookie, process.env.CHAINETOKEN);
    const userId = decodToken.userId;

    //Ajout de userId dans l'objet qui vas aller dans la bdd
    produitObjet.userID = userId;
    const produit = new Produit({
        ...produitObjet,
        image: `/fichiers/produit/images/${req.file.filename}`,
    });
    //Enreigstrement du produit dans la bdd
    produit
        .save()
        .then((data) => res.status(201).json({ data }))
        .catch((error) => {
            res.status(400).json({ error });
        });
};
//Controleur qui permet de modfiier une ressource de la BDD
exports.modifRes = (req, res, next) => {
    Produit.findOne({ _id: req.params.id })
        .then((data) => {
            //Récupération des données de le requete
            const produitObjet = req.body;
            var produit;
            if (req.file === undefined) {
                produit = new Produit({
                    ...produitObjet,
                    _id: req.params.id,
                });
            } else {
                var image = data.image;
                image = image.split("/");
                image = image.pop();
                const cheminImage = path.join(__dirname, "..", "..", "frontend", "produit", "images", `${image}`);
                fs.unlink(cheminImage, (err) => {
                    if (!err) {
                        produit = new Produit({
                            ...produitObjet,
                            _id: req.params.id,
                            image: `/fichiers/produit/images/${req.file.filename}`,
                        });
                    } else {
                        console.error("Problème lors de la suppresion du fichier : ", err);
                        res.status(500).json({ message: "Problème lors de la suppression du fichier" });
                    }
                });
            }
            //La fonction updateOne, prend ddeux éléments, l'id de l'élément et par quoi il faut modifier la ressrouce
            Produit.updateOne({ _id: req.params.id }, produit)
                .then(() => res.status(201).json({ produit }))
                .catch((error) => res.status(401).json({ message: "Problème dans la mise à jour du fchier" }));
        })
        .catch((error) => res.status(500).json({ message: `Problème de la recherche dans la BDD ${error}` }));
};
//Controlleur qui permet de supprimer des ressource
exports.supprRes = (req, res, next) => {
    Produit.findOne({ _id: req.params.id })
        .then((data) => {
            var nomFichier = data.image;
            nomFichier = nomFichier.split("/");
            nomFichier = nomFichier.pop();
            const cheminImage = path.join(__dirname, "..", "..", "frontend", "produit", "images", `${nomFichier}`);

            fs.unlink(cheminImage, (err) => {
                if (!err) {
                    Produit.deleteOne({ _id: req.params.id })
                        .then(res.status(201).json({ message: "Objet supprimé !" }))
                        .catch((error) => res.status(500).json({ error }));
                } else {
                    console.error("Problème lors de la suppresion du fichier : ", err);
                    res.status(500).json(err);
                }
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
