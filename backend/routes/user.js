const express = require("express");
const userCtrl = require("../controllers/user");

const router = express.Router();
//Route qui permet la création de compte
router.post("/signup", userCtrl.signup);
//Route qui permet la connexion
router.post("/login", userCtrl.login);
//Route qui permet d'avoir tout les compte
router.get("/compte", userCtrl.cmptAll);
//Route qui permet d'obtenir les différents compte
router.get("/verif-pseudo/:id", userCtrl.cmptOne);
//Route qui permet de supprimer un comtpe
router.delete("/suppr/:id", userCtrl.suppr);
//Permet de renvoyer le formulaire de connextion à la gestion de compte
router.get("/compte/html", userCtrl.cmptHTML);
//Permet de vérifier si les identifiants sont correct
router.post("/compte/login", userCtrl.compteLogin);
//Route qui permet d'envoyer le nom du compte pour la navbar
router.get("/compte/info/:id", userCtrl.cmptInfos);
//Route qui permet la deconnexion
router.get('/deconnexion', userCtrl.deconnexion)
// Route qui permet de supprimer un compte
router.get('/suppression', userCtrl.suppressionCompte)
module.exports = router;
