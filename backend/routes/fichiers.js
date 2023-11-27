const express = require("express");
const fichCtrl = require("../controllers/fichiers");

const router = express.Router();

router.get("/favicon", fichCtrl.favicon);
//Zone pour les éléments de la page d'acceuil
router.get("/accueil/style", fichCtrl.cssAccueil);
router.get("/accueil/script", fichCtrl.scriptAccueil);
//Zone pour les éléments des produits
router.get("/produit/html", fichCtrl.htmlProduit);
router.get("/produit/style", fichCtrl.cssProduit);
router.get("/produit/images/:id", fichCtrl.imageProduit);
//Zone pour la page mes produits
router.get("/produit/mesproduits/style", fichCtrl.cssMesProduits);
router.get("/produit/mesproduits/script", fichCtrl.scriptMesProduits);
//Zone pour le formulaire d'ajout des produits
router.get("/produit/form/ajout/style", fichCtrl.cssFormAjout);
router.get("/produit/form/ajout/script", fichCtrl.scriptFormAjout);
//Zone pour le formulaire de modif des produits
router.get("/produit/form/modif/style", fichCtrl.cssFormModif);
router.get("/produit/form/modif/script", fichCtrl.scriptFormModif);
//Zone pour page propriétaire
router.get("/produit/proprietaire/style", fichCtrl.cssProprietaire);
router.get("/produit/proprietaire/script", fichCtrl.scriptProprietaire);
//Zone pour la gestion des comptes
router.get("/authentification/gestion/style", fichCtrl.cssGestionCompte);
router.get("/authentification/gestion/script", fichCtrl.scriptGestionCompte);
//Zone pour les fichiers signup
router.get("/authentification/signup/style", fichCtrl.cssSignup);
router.get("/authentification/signup/script", fichCtrl.scriptSignup);
//Zone pour les fichiers login
router.get("/authentification/login/style", fichCtrl.cssLogin);
router.get("/authentification/login/script", fichCtrl.scriptLogin);
//Zone pour la gestion de compte
router.get("/compte/style", fichCtrl.cssCompte);
router.get("/compte/script", fichCtrl.scriptCompte);
//Zone de génération de la navbar
router.get("/navbar/html/:id", fichCtrl.userNavbar);
router.get("/navbar/style", fichCtrl.cssNavbar);
router.get("/navbar/script", fichCtrl.jsNavbar);
//Route qui permet de renvoyer l'image du menu hamburger
router.get("/images/menu-hamburger", fichCtrl.imageMenuHamburger);
//Route pour le CSS de la page projet
router.get('/projet/style', fichCtrl.cssProjet)
//Route pour le CSS de la page Mentions Légales
router.get('/mentionslegales/style', fichCtrl.cssMentionsLegales)
//Route pour le CSS de l'erreur 404
router.get('/erreur404/style',fichCtrl.cssErreur404)
module.exports = router;
