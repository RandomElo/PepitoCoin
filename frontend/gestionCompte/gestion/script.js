var resultatDiv = document.getElementById("resultatDiv");
//Création de fonction qui permet d'obtenir la liste de tous les comptes
function requeteProduit() {
    return fetch(`${process.env.ADRESSESERVEUR}/api/pepitocoin/ressource/recuperation`, {
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
function requeteCompte() {
    return fetch(`${process.env.ADRESSESERVEUR}/api/authentification/compte`, {
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
function affProduit() {
    //Clique sur le bouton gestion de comptes
    const produitGestion = document.getElementById("produitGestion");
    produitGestion.addEventListener("click", async () => {
        var recupProduit = await requeteProduit();
        suppression();
        if (recupProduit.length != 0) {
            //Création de la div qui vas contenir toute les div comptes
            var allProduitDiv = document.createElement("div");
            allProduitDiv.setAttribute("id", "allProduitDiv");
            for (let i = 0; i < recupProduit.length; i++) {
                var produitDiv = document.createElement("div");
                produitDiv.setAttribute("class", "produitDiv");
                produitDiv.setAttribute("id", recupProduit[i]._id);
                //Création du paragraphe
                var produitNom = document.createElement("p");
                produitNom.setAttribute("class", "produitNom");
                produitNom.innerHTML = `<span class='gras'>Nom du produit : </span>${recupProduit[i].nom}`;
                //Création du bouton de suppression
                var produitButton = document.createElement("a");
                produitButton.classList.add("button", "buttonProduit");
                produitButton.innerText = "Suppression";

                //Ajout des éléments
                produitDiv.appendChild(produitNom);
                produitDiv.appendChild(produitButton);
                allProduitDiv.appendChild(produitDiv);
            }
            resultatDiv.appendChild(allProduitDiv);
            var supprButton = document.querySelectorAll(".buttonProduit");
            supprButton.forEach((produit) => {
                produit.addEventListener("click", () => {
                    var id = produit.parentNode.id;
                    fetch(`${process.env.ADRESSESERVEUR}/api/pepitocoin/ressource/suppression/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((reponse) => reponse.json())
                        .then((data) => {
                            console.log(data);
                            suppression()
                            // window.location = 'http://localhost:3000/accueil'
                        })
                        .catch((error) => console.error(error));
                });
            });
        } else {
            const aucunProduit = document.createElement("p");
            aucunProduit.setAttribute("id", "videProduit");
            aucunProduit.setAttribute("class", "videElement");
            aucunProduit.innerText = `Pas de produit dans la base de donnée`;
            resultatDiv.appendChild(aucunProduit);
        }
    });
}
//Fonction qui permet de surveiller le clique du bouton compte, de récupérer le résultat de la requete masi aussi d'afficher son résultat
function affCompte() {
    const compteGestion = document.getElementById("compteGestion");
    compteGestion.addEventListener("click", async () => {
        var requete = await requeteCompte();
        suppression();
        if (requete.length != 0) {
            //Création de la div qui vas contenir toute les div comptes
            var allComptDiv = document.createElement("div");
            allComptDiv.setAttribute("id", "allCompteDiv");
            for (let i = 0; i < requete.length; i++) {
                //Création de la div qui va contenir les comptes
                var compteDiv = document.createElement("div");
                compteDiv.setAttribute("class", `compteDiv`);
                compteDiv.setAttribute("id", requete[i]);
                //Création du paragraphe
                var comptePara = document.createElement("p");
                comptePara.setAttribute("class", "comptePara");
                comptePara.innerHTML = `<span class="gras">Pseudo du compte : </span>${requete[i]}`;
                //Création du bouton
                var button = document.createElement("a");
                button.classList.add("button", "buttonCompte");
                button.innerText = "Suppression";
                //Ajout à la div de l'élément
                compteDiv.appendChild(comptePara);
                compteDiv.appendChild(button);
                allComptDiv.appendChild(compteDiv);
            }
            resultatDiv.appendChild(allComptDiv);
            //Récupération des tous boutons de chaque div
            var allDivCompte = document.querySelectorAll(".buttonCompte");
            allDivCompte.forEach((compte) => {
                compte.addEventListener("click", () => {
                    var pseudoCompte = compte.parentNode.id;
                    fetch(`${process.env.ADRESSESERVEUR}/api/authentification/suppr/${pseudoCompte}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((reponse) => reponse.json())
                        .then((data) => {
                            console.log(data);
                            suppression()
                            // window.location = 'http://localhost:3000/accueil'
                        })
                        .catch((error) => console.error(error));
                });
            });
        } else {
            var aucunCompte = document.createElement("p");
            aucunCompte.setAttribute("id", "videCompte");
            aucunCompte.setAttribute("class", "videElement");
            aucunCompte.innerText = `Pas de compte dans la base de donnée`;
            resultatDiv.appendChild(aucunCompte);
        }
    });
}
function suppression() {
    //Zone de suppression
    var s_videCompte = document.getElementById("videCompte");
    if (s_videCompte != null) {
        resultatDiv.removeChild(s_videCompte);
    }
    var s_videProduit = document.getElementById("videProduit");
    if (s_videProduit != null) {
        resultatDiv.removeChild(s_videProduit);
    }
    var s_allProduitDiv = document.getElementById("allProduitDiv");
    if (s_allProduitDiv != null) {
        resultatDiv.removeChild(s_allProduitDiv);
    }
    var s_allCompteDiv = document.getElementById("allCompteDiv");
    if (s_allCompteDiv != null) {
        resultatDiv.removeChild(s_allCompteDiv);
    }
}
var form = document.getElementById("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    //Récupéreration du pseudo
    var pseudo = document.getElementById("pseudo");
    //Récupération du mot de passe
    var password = document.getElementById("password");
    var donnees = {
        pseudo: pseudo.value,
        password: password.value,
    };
    fetch(`${process.env.ADRESSESERVEUR}/api/authentification/compte/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
    })
        .then((reponse) => {
            if (reponse.status === 200) {
                return reponse.json()
            } else {
                window.location = `${process.env.ADRESSESERVEUR}/accueil`
            }
        })
        .then((data) => {
            resultatDiv.innerHTML = data;
            affProduit();
            affCompte();
        });
});
