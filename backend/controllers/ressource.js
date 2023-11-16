const jwt = require("jsonwebtoken");
const fs = require("fs");
const Produit = require("../models/Produit");
//Controleur qui est utiliser au chargement de la page
exports.recupAllRes = (req, res, next) => {
    Produit.find()
        .then((produit) => res.status(200).json(produit))
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
    // //Récupération des donées contenue dans la requete
    var produitObjet = req.body;

    //Récupération du userId
    var authCookie = req.cookies.auth;
    const decodToken = jwt.verify(authCookie, process.env.CHAINETOKEN);
    const userId = decodToken.userId;

    //Ajout de userId dans l'objet qui vas aller dans la bdd
    produitObjet.userID = userId;
    console.log("Filename: "+req.file.filename)
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
    //Récupération des données de le requete
    const produitObjet = req.body;
    const produit = new Produit({
        ...produitObjet,
    });
    //La fonction updateOne, prend ddeux éléments, l'id de l'élément et par quoi il faut modifier la ressrouce
    Produit.updateOne({ _id: req.params.id }, produitObjet)
        .then(() => res.status(201).json({ produitObjet }))
        .catch((error) => res.status(401).json({ error }));
};
//Controlleur qui permet de supprimer des ressource
exports.supprRes = (req, res, next) => {
    Produit.findOne({ _id: req.params.id })
        .then((data) => {
            var nomFichier = data.image;
            nomFichier = nomFichier.split("/");
            nomFichier = nomFichier.pop();
            nomFichier = `../../frontend/produit/images/${nomFichier}`;
            fs.unlink(nomFichier, (err) => {
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
