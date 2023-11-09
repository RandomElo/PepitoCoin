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
    const donnneesForm = new FormData();
    donnneesForm.append("nom", nomForm.value);
    donnneesForm.append("prix", prixForm.value);
    donnneesForm.append("description", descForm.value);
    donnneesForm.append("image", imgForm.files[0]);
    //Envoie de la requete à l'api
    fetch(`${process.env.IP}${process.env.PORT}/api/pepitocoin/ressource/publication`, {
        method: "POST",
        body: donnneesForm,
    })
        .then((reponse) => reponse.json())
        .then((data) => {
            console.log(data.data);
            window.location = `${process.env.IP}${process.env.PORT}/produit/${data.data._id}`;
        })
        .catch((error) => console.error(error));
});
