const express = require("express");
const frontCtrl = require("../controllers/frontend");

const router = express.Router();

router.get("/", frontCtrl.affHome);
//Route qui permet d'afficher la page d'accueil
router.get("/accueil", frontCtrl.accueil);
//Permet de retourner le fichier HTML du form d'ajout
router.get("/produit/ajout", frontCtrl.formAjout);
//Route qui permet d'affihcer la liste des produits d'un user
router.get("/produit/mesproduits", frontCtrl.mesProduits);
//Permet de retourner le fichier HTML des produits
router.get("/produit/:id", frontCtrl.affProduit);
//Route qui permet d'accéder à la page admin d'un produit
router.get("/produit/:id/proprietaire", frontCtrl.affProduitProprietaire);
//Permet de retourner le fichier HTML du form de  modificaton
router.get("/produit/:id/modification", frontCtrl.modifProduit);
//Route qui permet d'affihcer la liste des produits d'un user
router.get("/produit/mesproduits", frontCtrl.mesProduits);
//Permet de renvoyer la paeg HTML de gesion de compte
router.get("/admin", frontCtrl.affAdmin);
//Permet de retourner le fichier HTML de création de compte
router.get("/signup", frontCtrl.signup);
//Permet de retourner le fichier HTML de connexion
router.get("/login", frontCtrl.login);
//Route qui permet d'accéder à la page projet
router.get("/projet", frontCtrl.projet);
//Route qui permet d'accéder aux mentions légales
router.get("/mentionslegales", frontCtrl.mentionsLegales);

router.use((req, res, next) => {
    res.status(404).send("Page non trouvée");
});

module.exports = router;
