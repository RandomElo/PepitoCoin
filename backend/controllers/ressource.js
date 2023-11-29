const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const Produit = require("../models/Produit");
//Controleur qui est utiliser au chargement de la page
exports.recupAllRes = (req, res, next) => {
    console.log("recupAllRes")
    //Zone de test
    const userAgent = req.headers['user-agent'];

    // Vérifie si l'en-tête User-Agent est présent et s'il contient "Mozilla" (un navigateur)
    if (userAgent && userAgent.includes('Mozilla')) {
        console.log('La requête est émise depuis un navigateur bdd');
        // Ajoutez ici le comportement que vous souhaitez exécuter pour les requêtes du navigateur
    } else {
        console.log('La requête n\'est pas émise depuis un navigateur bdd');
        // Ajoutez ici le comportement pour les requêtes qui ne sont pas du navigateur
    }
    //Fin de la zone de test
    Produit.find()
        .then((produit) => {
            console.log("test")
            res.status(200).json(produit);
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Controlleur qui est utiliser quand on clique sur une ressource spécifique
exports.recupOneRes = (req, res, next) => {
    console.log("recupOneRes")
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
                        res.status(500).json({ message: "Problème loir de la suppression du fichier" });
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
