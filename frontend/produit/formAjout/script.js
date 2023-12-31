//Récupération du bouton d'envoi du formulaire
var form = document.getElementById("form");
//Zone de récupération de données du formulaire
var nomForm = document.getElementById("nomForm");
var prixForm = document.getElementById("prixForm");
var descForm = document.getElementById("descForm");
var imgForm = document.getElementById("imgForm");
//Récupération du cookie
var authCookie = document.cookie;
authCookie = authCookie.split("auth=")[1];
//Création de l'événement sur le clique du bouton envoyer
form.addEventListener("submit", (event) => {
    event.preventDefault();
    //Format à utiliser pour multer, il permet facilement d'associer uen paire clé valeur
    const objet = new FormData();
    objet.append("nom", nomForm.value);
    objet.append("prix", prixForm.value);
    objet.append("description", descForm.value);
    objet.append("image", imgForm.files[0]);
    //Envoie de la requete à l'api
    fetch(`https://eloi-site.alwaysdata.net/api/pepitocoin/ressource/publication`, {
        method: "POST",
        body: objet,
    })
        .then((reponse) => {
            return reponse.json();
        })
        .then((data) => {
            window.location = `https://eloi-site.alwaysdata.net/produit/${data.data._id}`;
        })
        .catch((error) => console.error(error));
});
