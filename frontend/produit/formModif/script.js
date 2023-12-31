//Récupération du bouton d'envoi du formulaire
var form = document.getElementById("form");
//Zone de récupération de données du formulaire
var nomForm = document.getElementById("nomForm");
var prixForm = document.getElementById("prixForm");
var descForm = document.getElementById("descForm");
var imgForm = document.getElementById("imgForm");

var adresseFichier = window.location.pathname.split("/");
var nomFichier = adresseFichier[adresseFichier.length - 2];

function requeteGetOne(produitId) {
    return fetch(`https://eloi-site.alwaysdata.net/api/pepitocoin/ressource/recuperation/${produitId}`, {
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
async function remplissageForm(produitId) {
    var requete = await requeteGetOne(produitId);
    nomForm.value = requete.nom;
    prixForm.value = requete.prix;
    descForm.value = requete.description;
}
remplissageForm(nomFichier);
//Création de l'événement sur le clique du bouton envoyer
form.addEventListener("submit", (event) => {
    event.preventDefault();
    var objet = new FormData();
    if (imgForm.files[0] != undefined) {
        objet.append("nom", nomForm.value);
        objet.append("prix", prixForm.value);
        objet.append("description", descForm.value);
        objet.append("image", imgForm.files[0]);
    } else {
        objet.append("nom", nomForm.value);
        objet.append("prix", prixForm.value);
        objet.append("description", descForm.value);
    }
    //Envoie de la requete à l'api
    fetch(`https://eloi-site.alwaysdata.net/api/pepitocoin/ressource/modification/${nomFichier}`, {
        method: "PUT",
        body: objet,
    })
        .then((reponse) => reponse.json())
        .then((data) => {
            window.location = `https://eloi-site.alwaysdata.net/produit/${nomFichier}`;
        })
        .catch((error) => console.error(error));
});
